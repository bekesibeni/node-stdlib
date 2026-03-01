import crypto from 'crypto';

const ID_BITS = 88n;
const TAG_BITS = 34n;
const TAG_MASK = (1n << TAG_BITS) - 1n;
const ID_MASK = (1n << ID_BITS) - 1n;

const TYPE_BIT = 1n << 87n;
const MAX_NUMERIC = TYPE_BIT - 1n;
const MAX_NUMERIC_DIGITS = 26;
const MAX_STRING_BYTES = 10;

const HALF_BITS = 44n;
const HALF_MASK = (1n << HALF_BITS) - 1n;

// ---- Key cache ----
let _cachedSecret: string | null = null;
let _cachedKeys: {encKey: Buffer, macKey: Buffer} | null = null;

function hkdfSha256(ikm: Buffer, info: string, length: number): Buffer {
	return Buffer.from(
		crypto.hkdfSync('sha256', ikm, Buffer.alloc(0), Buffer.from(info, 'utf8'), length)
	);
}

function getKeys(secret: string): {encKey: Buffer, macKey: Buffer} {
	if (_cachedSecret === secret && _cachedKeys) return _cachedKeys;
	if (!secret || secret.length < 32) {
		throw new Error('UUID_SECRET too short. Use a strong random base64url string (32+ chars).');
	}
	const ikm = crypto.createHash('sha256').update(secret, 'utf8').digest();
	const encKey = hkdfSha256(ikm, 'uuidv8-u88:enc:v2', 32);
	const macKey = hkdfSha256(ikm, 'uuidv8-u88:mac:v2', 32);
	_cachedSecret = secret;
	_cachedKeys = {encKey, macKey};
	return _cachedKeys;
}

// ---- Input conversion ----

function inputToBigInt88(input: string): bigint {
	if (typeof input !== 'string') throw new Error('Input must be a string');
	if (input.length === 0) throw new Error('Input must not be empty');

	if (/^\d+$/.test(input)) {
		if (input.length > MAX_NUMERIC_DIGITS) {
			throw new Error(`Numeric input exceeds ${MAX_NUMERIC_DIGITS}-digit limit`);
		}
		const n = BigInt(input);
		if (n > MAX_NUMERIC) {
			throw new Error('Numeric input exceeds 87-bit limit');
		}
		return n;
	}

	const buf = Buffer.from(input, 'utf8');
	if (buf.length > MAX_STRING_BYTES) {
		throw new Error(`Input exceeds ${MAX_STRING_BYTES}-byte limit (got ${buf.length} bytes)`);
	}
	let n = TYPE_BIT | (BigInt(buf.length) << 80n);
	for (let i = 0; i < buf.length; i++) {
		n |= BigInt(buf[i]) << BigInt((MAX_STRING_BYTES - 1 - i) * 8);
	}
	return n;
}

function bigInt88ToOutput(n: bigint): string {
	if ((n & TYPE_BIT) === 0n) {
		return n.toString(10);
	}
	const len = Number((n >> 80n) & 0x7fn);
	if (len > MAX_STRING_BYTES) throw new Error('Invalid decoded data');
	const buf = Buffer.alloc(len);
	for (let i = 0; i < len; i++) {
		buf[i] = Number((n >> BigInt((MAX_STRING_BYTES - 1 - i) * 8)) & 0xffn);
	}
	return buf.toString('utf8');
}

// ---- Feistel cipher (AES-256-ECB, hardware-accelerated) ----
const _aesBlock = Buffer.alloc(16);

function feistelF(encKey: Buffer, round: number, r44: bigint): bigint {
	_aesBlock[0] = round;
	let v = r44;
	_aesBlock[6] = Number(v & 0xffn); v >>= 8n;
	_aesBlock[5] = Number(v & 0xffn); v >>= 8n;
	_aesBlock[4] = Number(v & 0xffn); v >>= 8n;
	_aesBlock[3] = Number(v & 0xffn); v >>= 8n;
	_aesBlock[2] = Number(v & 0xffn); v >>= 8n;
	_aesBlock[1] = Number(v & 0xffn);
	_aesBlock[7] = 0; _aesBlock[8] = 0; _aesBlock[9] = 0; _aesBlock[10] = 0;
	_aesBlock[11] = 0; _aesBlock[12] = 0; _aesBlock[13] = 0; _aesBlock[14] = 0;
	_aesBlock[15] = 0;

	const c = crypto.createCipheriv('aes-256-ecb', encKey, null);
	c.setAutoPadding(false);
	const out = c.update(_aesBlock);

	return (
		(BigInt(out[0]) << 36n) |
		(BigInt(out[1]) << 28n) |
		(BigInt(out[2]) << 20n) |
		(BigInt(out[3]) << 12n) |
		(BigInt(out[4]) << 4n) |
		(BigInt(out[5]) >> 4n)
	) & HALF_MASK;
}

function feistelEncrypt88(x: bigint, encKey: Buffer): bigint {
	let L = (x >> HALF_BITS) & HALF_MASK;
	let R = x & HALF_MASK;
	for (let i = 0; i < 10; i++) {
		const f = feistelF(encKey, i, R);
		const tmp = R;
		R = (L ^ f) & HALF_MASK;
		L = tmp;
	}
	return ((L << HALF_BITS) | R) & ID_MASK;
}

function feistelDecrypt88(x: bigint, encKey: Buffer): bigint {
	let L = (x >> HALF_BITS) & HALF_MASK;
	let R = x & HALF_MASK;
	for (let i = 9; i >= 0; i--) {
		const f = feistelF(encKey, i, L);
		const tmp = L;
		L = (R ^ f) & HALF_MASK;
		R = tmp;
	}
	return ((L << HALF_BITS) | R) & ID_MASK;
}

// ---- MAC (AES-256-ECB) ----
const _macBlock = Buffer.alloc(16);

function mac34(cipher88: bigint, macKey: Buffer): bigint {
	let v = cipher88 & ID_MASK;
	_macBlock[10] = Number(v & 0xffn); v >>= 8n;
	_macBlock[9] = Number(v & 0xffn); v >>= 8n;
	_macBlock[8] = Number(v & 0xffn); v >>= 8n;
	_macBlock[7] = Number(v & 0xffn); v >>= 8n;
	_macBlock[6] = Number(v & 0xffn); v >>= 8n;
	_macBlock[5] = Number(v & 0xffn); v >>= 8n;
	_macBlock[4] = Number(v & 0xffn); v >>= 8n;
	_macBlock[3] = Number(v & 0xffn); v >>= 8n;
	_macBlock[2] = Number(v & 0xffn); v >>= 8n;
	_macBlock[1] = Number(v & 0xffn); v >>= 8n;
	_macBlock[0] = Number(v & 0xffn);
	_macBlock[11] = 0; _macBlock[12] = 0; _macBlock[13] = 0;
	_macBlock[14] = 0; _macBlock[15] = 0;

	const c = crypto.createCipheriv('aes-256-ecb', macKey, null);
	c.setAutoPadding(false);
	const out = c.update(_macBlock);

	return (
		(BigInt(out[0]) << 26n) |
		(BigInt(out[1]) << 18n) |
		(BigInt(out[2]) << 10n) |
		(BigInt(out[3]) << 2n) |
		(BigInt(out[4]) >> 6n)
	) & TAG_MASK;
}

// ---- UUIDv8 pack/unpack ----

function packUuidV8(p: bigint): Uint8Array {
	const out = new Uint8Array(16);

	const customC = p & 0x3FFFFFFFFFFFFFFFn;
	const customB = (p >> 62n) & 0xFFFn;
	const customA = (p >> 74n) & 0xFFFFFFFFFFFFn;

	let v = customA;
	out[5] = Number(v & 0xffn); v >>= 8n;
	out[4] = Number(v & 0xffn); v >>= 8n;
	out[3] = Number(v & 0xffn); v >>= 8n;
	out[2] = Number(v & 0xffn); v >>= 8n;
	out[1] = Number(v & 0xffn); v >>= 8n;
	out[0] = Number(v & 0xffn);

	out[6] = 0x80 | Number((customB >> 8n) & 0xfn);
	out[7] = Number(customB & 0xffn);
	out[8] = 0x80 | Number((customC >> 56n) & 0x3fn);

	v = customC;
	out[15] = Number(v & 0xffn); v >>= 8n;
	out[14] = Number(v & 0xffn); v >>= 8n;
	out[13] = Number(v & 0xffn); v >>= 8n;
	out[12] = Number(v & 0xffn); v >>= 8n;
	out[11] = Number(v & 0xffn); v >>= 8n;
	out[10] = Number(v & 0xffn); v >>= 8n;
	out[9] = Number(v & 0xffn);

	return out;
}

function unpackUuidV8(b: Uint8Array): bigint {
	if ((b[6] >> 4) !== 0x8) throw new Error('Not a UUIDv8');
	if ((b[8] >> 6) !== 0b10) throw new Error('Not RFC4122 variant');

	const customA =
		(BigInt(b[0]) << 40n) | (BigInt(b[1]) << 32n) | (BigInt(b[2]) << 24n) |
		(BigInt(b[3]) << 16n) | (BigInt(b[4]) << 8n) | BigInt(b[5]);

	const customB = (BigInt(b[6] & 0x0f) << 8n) | BigInt(b[7]);

	const customC =
		(BigInt(b[8] & 0x3f) << 56n) |
		(BigInt(b[9]) << 48n) | (BigInt(b[10]) << 40n) | (BigInt(b[11]) << 32n) |
		(BigInt(b[12]) << 24n) | (BigInt(b[13]) << 16n) | (BigInt(b[14]) << 8n) | BigInt(b[15]);

	return (customA << 74n) | (customB << 62n) | customC;
}

// ---- UUID string helpers ----

function bytesToUuidString(b: Uint8Array): string {
	const hex = Buffer.from(b).toString('hex');
	return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function uuidStringToBytes(uuid: string): Uint8Array {
	const hex = uuid.replace(/-/g, '');
	if (hex.length !== 32) throw new Error('Invalid UUID string');
	return new Uint8Array(Buffer.from(hex, 'hex'));
}

// ---- Public API ----

export function encodeToUuidV8(input: string, secret: string): string {
	const {encKey, macKey} = getKeys(secret);
	const id = inputToBigInt88(input);

	const cipher88 = feistelEncrypt88(id, encKey);
	const tag34 = mac34(cipher88, macKey);

	const payload122 = (cipher88 << TAG_BITS) | tag34;

	return bytesToUuidString(packUuidV8(payload122));
}

export function decodeFromUuidV8(uuid: string, secret: string): string {
	const {encKey, macKey} = getKeys(secret);

	const payload122 = unpackUuidV8(uuidStringToBytes(uuid));
	const tag34 = payload122 & TAG_MASK;
	const cipher88 = (payload122 >> TAG_BITS) & ID_MASK;

	const expected = mac34(cipher88, macKey);
	if (tag34 !== expected) throw new Error('Invalid token');

	const id = feistelDecrypt88(cipher88, encKey);
	return bigInt88ToOutput(id);
}
