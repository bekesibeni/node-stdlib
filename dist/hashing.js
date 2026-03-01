"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.crc32 = void 0;
exports.md5 = md5;
exports.sha1 = sha1;
exports.sha256 = sha256;
const basic_hash_1 = __importDefault(require("./lib/hashing/basic_hash"));
const crc32_1 = __importDefault(require("./lib/hashing/crc32"));
exports.crc32 = crc32_1.default;
/**
 * @param {Buffer|string} input
 * @param {string} [outputForm=hex]
 */
function md5(input, outputForm = 'hex') {
    return (0, basic_hash_1.default)('md5', input, outputForm);
}
/**
 * @param {Buffer|string} input
 * @param {string} [outputForm=hex]
 */
function sha1(input, outputForm = 'hex') {
    return (0, basic_hash_1.default)('sha1', input, outputForm);
}
/**
 * @param {Buffer|string} input
 * @param {string} [outputForm=hex]
 */
function sha256(input, outputForm = 'hex') {
    return (0, basic_hash_1.default)('sha256', input, outputForm);
}
const Hashing = {
    md5,
    sha1,
    sha256,
    crc32: crc32_1.default
};
exports.default = Hashing;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFzaGluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9oYXNoaW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQXFDQyxrQkFBRztBQUNILG9CQUFJO0FBQ0osd0JBQU07QUFyQ1AsMEVBQWlEO0FBQ2pELGdFQUF3QztBQXFDdkMsZ0JBckNNLGVBQUssQ0FxQ047QUFuQ047OztHQUdHO0FBQ0gsU0FBUyxHQUFHLENBQUMsS0FBb0IsRUFBRSxhQUFzQyxLQUFLO0lBQzdFLE9BQU8sSUFBQSxvQkFBUyxFQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDNUMsQ0FBQztBQUVEOzs7R0FHRztBQUNILFNBQVMsSUFBSSxDQUFDLEtBQW9CLEVBQUUsYUFBc0MsS0FBSztJQUM5RSxPQUFPLElBQUEsb0JBQVMsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQzdDLENBQUM7QUFFRDs7O0dBR0c7QUFDSCxTQUFTLE1BQU0sQ0FBQyxLQUFvQixFQUFFLGFBQXNDLEtBQUs7SUFDaEYsT0FBTyxJQUFBLG9CQUFTLEVBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztBQUMvQyxDQUFDO0FBRUQsTUFBTSxPQUFPLEdBQWM7SUFDMUIsR0FBRztJQUNILElBQUk7SUFDSixNQUFNO0lBQ04sS0FBSyxFQUFMLGVBQUs7Q0FDTCxDQUFDO0FBU0Ysa0JBQWUsT0FBTyxDQUFDIn0=