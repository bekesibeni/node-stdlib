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
	const encKey = hkdfSha256(ikm, 'uuidv8-u88:enc:v1', 32);
	const macKey = hkdfSha256(ikm, 'uuidv8-u88:mac:v1', 32);
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

// ---- Feistel cipher ----
// Reusable buffer for feistelF to avoid allocation per round
const _fMsg = Buffer.alloc(7);

function feistelF(encKey: Buffer, round: number, r44: bigint): bigint {
	_fMsg[0] = round;
	let v = r44 & HALF_MASK;
	for (let i = 5; i >= 0; i--) {
		_fMsg[1 + i] = Number(v & 0xffn);
		v >>= 8n;
	}
	const h = crypto.createHmac('sha256', encKey).update(_fMsg).digest();
	return (
		(BigInt(h[0]) << 36n) |
		(BigInt(h[1]) << 28n) |
		(BigInt(h[2]) << 20n) |
		(BigInt(h[3]) << 12n) |
		(BigInt(h[4]) << 4n) |
		(BigInt(h[5]) >> 4n)
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

// ---- MAC ----
const _macMsg = Buffer.alloc(11);

function mac34(cipher88: bigint, macKey: Buffer): bigint {
	let v = cipher88 & ID_MASK;
	for (let i = 10; i >= 0; i--) {
		_macMsg[i] = Number(v & 0xffn);
		v >>= 8n;
	}
	const h = crypto.createHmac('sha256', macKey).update(_macMsg).digest();
	return (
		(BigInt(h[0]) << 26n) |
		(BigInt(h[1]) << 18n) |
		(BigInt(h[2]) << 10n) |
		(BigInt(h[3]) << 2n) |
		(BigInt(h[4]) >> 6n)
	) & TAG_MASK;
}

// ---- UUIDv8 pack/unpack (byte-level, no bit-by-bit loops) ----
//
// UUID layout (128 bits):
//   bytes 0-5  (bits 0-47):   custom_a  = payload[121:74]  (48 bits)
//   byte  6    (bits 48-55):  version(4) + custom_b high 4  = 0x8_ | payload[73:70]
//   byte  7    (bits 56-63):  custom_b low 8               = payload[69:62]
//   byte  8    (bits 64-71):  variant(2) + custom_c high 6  = 0b10__ | payload[61:56]
//   bytes 9-15 (bits 72-127): custom_c low 56              = payload[55:0]

function packUuidV8(p: bigint): Uint8Array {
	const out = new Uint8Array(16);

	const customC = p & 0x3FFFFFFFFFFFFFFFn;          // bits 0-61 (62 bits)
	const customB = (p >> 62n) & 0xFFFn;               // bits 62-73 (12 bits)
	const customA = (p >> 74n) & 0xFFFFFFFFFFFFn;      // bits 74-121 (48 bits)

	// bytes 0-5: customA (48 bits)
	let v = customA;
	out[5] = Number(v & 0xffn); v >>= 8n;
	out[4] = Number(v & 0xffn); v >>= 8n;
	out[3] = Number(v & 0xffn); v >>= 8n;
	out[2] = Number(v & 0xffn); v >>= 8n;
	out[1] = Number(v & 0xffn); v >>= 8n;
	out[0] = Number(v & 0xffn);

	// byte 6: version 8 (high nibble) + customB high 4 bits (low nibble)
	out[6] = 0x80 | Number((customB >> 8n) & 0xfn);
	// byte 7: customB low 8 bits
	out[7] = Number(customB & 0xffn);

	// byte 8: variant 10 (high 2 bits) + customC high 6 bits
	out[8] = 0x80 | Number((customC >> 56n) & 0x3fn);

	// bytes 9-15: customC low 56 bits
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
