import crypto from 'crypto';

const ID_DEC_MAX = 10n ** 26n - 1n;
const ID_BITS = 88n;
const TAG_BITS = 34n;

const MAX_ID_BITS = (1n << ID_BITS) - 1n;
const TAG_MASK = (1n << TAG_BITS) - 1n;

const HALF_BITS = 44n;
const HALF_MASK = (1n << HALF_BITS) - 1n;

function assertSecret(secret: string) {
	if (!secret || secret.length < 32) {
		throw new Error('UUID_SECRET too short. Use a strong random base64url string (32+ chars).');
	}
}

function hkdfSha256(ikm: Buffer, info: string, length: number): Buffer {
	return Buffer.from(
		crypto.hkdfSync('sha256', ikm, Buffer.alloc(0), Buffer.from(info, 'utf8'), length)
	);
}

function deriveKeys(secret: string) {
	assertSecret(secret);
	const ikm = crypto.createHash('sha256').update(secret, 'utf8').digest();
	const encKey = hkdfSha256(ikm, 'uuidv8-u88:enc:v1', 32);
	const macKey = hkdfSha256(ikm, 'uuidv8-u88:mac:v1', 32);
	return {encKey, macKey};
}

export function parseDecimalId(idDec: string): bigint {
	if (typeof idDec !== 'string') throw new Error('ID must be a string');
	if (!/^\d{1,26}$/.test(idDec)) throw new Error('ID must be a decimal string with at most 26 digits');
	const n = BigInt(idDec);
	if (n < 0n || n > ID_DEC_MAX) throw new Error('ID exceeds 26-digit max (10^26 - 1)');
	if (n > MAX_ID_BITS) throw new Error('ID too large for 88-bit encoding');
	return n;
}

function feistelF(encKey: Buffer, round: number, r44: bigint): bigint {
	const msg = Buffer.alloc(1 + 6);
	msg[0] = round & 0xff;

	let v = r44 & HALF_MASK;
	for (let i = 5; i >= 0; i--) {
		msg[1 + i] = Number(v & 0xffn);
		v >>= 8n;
	}

	const h = crypto.createHmac('sha256', encKey).update(msg).digest();
	let x = 0n;
	for (let i = 0; i < 8; i++) x = (x << 8n) | BigInt(h[i]);
	return x & HALF_MASK;
}

function feistelEncrypt88(x: bigint, encKey: Buffer, rounds = 10): bigint {
	const v = x & ((1n << ID_BITS) - 1n);
	let L = (v >> HALF_BITS) & HALF_MASK;
	let R = v & HALF_MASK;

	for (let i = 0; i < rounds; i++) {
		const f = feistelF(encKey, i, R);
		const newL = R;
		const newR = (L ^ f) & HALF_MASK;
		L = newL;
		R = newR;
	}

	return ((L << HALF_BITS) | R) & ((1n << ID_BITS) - 1n);
}

function feistelDecrypt88(x: bigint, encKey: Buffer, rounds = 10): bigint {
	const v = x & ((1n << ID_BITS) - 1n);
	let L = (v >> HALF_BITS) & HALF_MASK;
	let R = v & HALF_MASK;

	for (let i = rounds - 1; i >= 0; i--) {
		const prevR = L;
		const f = feistelF(encKey, i, prevR);
		const prevL = (R ^ f) & HALF_MASK;
		L = prevL;
		R = prevR;
	}

	return ((L << HALF_BITS) | R) & ((1n << ID_BITS) - 1n);
}

function mac34(cipher88: bigint, macKey: Buffer): bigint {
	const msg = Buffer.alloc(11);
	let v = cipher88 & ((1n << ID_BITS) - 1n);
	for (let i = 10; i >= 0; i--) {
		msg[i] = Number(v & 0xffn);
		v >>= 8n;
	}

	const h = crypto.createHmac('sha256', macKey).update(msg).digest();
	let x = 0n;
	for (let i = 0; i < 8; i++) x = (x << 8n) | BigInt(h[i]);
	return x & TAG_MASK;
}

const VERSION_POS = [48, 49, 50, 51] as const;
const VARIANT_POS = [64, 65] as const;

function setBit(bytes: Uint8Array, pos: number, bit: 0 | 1) {
	const byteIndex = Math.floor(pos / 8);
	const bitInByte = 7 - (pos % 8);
	const mask = 1 << bitInByte;
	bytes[byteIndex] = bit ? (bytes[byteIndex] | mask) : (bytes[byteIndex] & ~mask);
}

function getBit(bytes: Uint8Array, pos: number): 0 | 1 {
	const byteIndex = Math.floor(pos / 8);
	const bitInByte = 7 - (pos % 8);
	return ((bytes[byteIndex] >> bitInByte) & 1) as 0 | 1;
}

function packUuidV8(payload122: bigint): Uint8Array {
	const out = new Uint8Array(16);

	const verBits: (0 | 1)[] = [1, 0, 0, 0];
	for (let i = 0; i < 4; i++) setBit(out, VERSION_POS[i], verBits[i]);

	setBit(out, VARIANT_POS[0], 1);
	setBit(out, VARIANT_POS[1], 0);

	const p = payload122 & ((1n << 122n) - 1n);

	const payloadBits: (0 | 1)[] = new Array(122) as any;
	for (let i = 121; i >= 0; i--) {
		payloadBits[121 - i] = ((p >> BigInt(i)) & 1n) === 1n ? 1 : 0;
	}

	let j = 0;
	for (let pos = 0; pos < 128; pos++) {
		if (VERSION_POS.includes(pos as any) || VARIANT_POS.includes(pos as any)) continue;
		setBit(out, pos, payloadBits[j++]);
	}

	return out;
}

function unpackUuidV8(bytes: Uint8Array): bigint {
	const ver =
		(getBit(bytes, 48) << 3) |
		(getBit(bytes, 49) << 2) |
		(getBit(bytes, 50) << 1) |
		getBit(bytes, 51);
	if (ver !== 0b1000) throw new Error('Not a UUIDv8');

	const v0 = getBit(bytes, 64);
	const v1 = getBit(bytes, 65);
	if (!(v0 === 1 && v1 === 0)) throw new Error('Not RFC4122 variant');

	let payload = 0n;
	for (let pos = 0; pos < 128; pos++) {
		if (VERSION_POS.includes(pos as any) || VARIANT_POS.includes(pos as any)) continue;
		payload = (payload << 1n) | BigInt(getBit(bytes, pos));
	}
	return payload;
}

function bytesToUuidString(b: Uint8Array): string {
	const hex = Buffer.from(b).toString('hex');
	return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function uuidStringToBytes(uuid: string): Uint8Array {
	const hex = uuid.replace(/-/g, '');
	if (!/^[0-9a-fA-F]{32}$/.test(hex)) throw new Error('Invalid UUID string');
	return new Uint8Array(Buffer.from(hex, 'hex'));
}

export function encodeIdToUuidV8(idDec: string, secret: string): string {
	const {encKey, macKey} = deriveKeys(secret);
	const id = parseDecimalId(idDec);

	const cipher88 = feistelEncrypt88(id, encKey);
	const tag34 = mac34(cipher88, macKey);

	const payload122 = (cipher88 << TAG_BITS) | tag34;

	return bytesToUuidString(packUuidV8(payload122));
}

export function decodeUuidV8ToId(uuid: string, secret: string): string {
	const {encKey, macKey} = deriveKeys(secret);

	const payload122 = unpackUuidV8(uuidStringToBytes(uuid));
	const tag34 = payload122 & TAG_MASK;
	const cipher88 = (payload122 >> TAG_BITS) & ((1n << ID_BITS) - 1n);

	const expected = mac34(cipher88, macKey);
	if (tag34 !== expected) throw new Error('Invalid token');

	const id = feistelDecrypt88(cipher88, encKey);
	if (id > ID_DEC_MAX) throw new Error('Decoded ID out of 26-digit range');
	return id.toString(10);
}
