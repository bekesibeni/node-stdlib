"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.intToString = intToString;
exports.stringToInt = stringToInt;
/**
 * Convert an integer IPv4 address into dotted-decimal string format.
 * @param {int} ipInt
 * @returns {string}
 */
function intToString(ipInt) {
    let buf = Buffer.alloc(4);
    buf.writeUInt32BE(ipInt >>> 0, 0);
    return Array.prototype.join.call(buf, '.');
}
/**
 * Convert a dotted-decimal string IPv4 address to integer format.
 * @param {string} ipString
 * @returns {int}
 */
function stringToInt(ipString) {
    let buf = Buffer.alloc(4);
    let octets = ipString.split('.');
    for (let i = 0; i < 4; i++) {
        buf[i] = parseInt(octets[i], 10);
    }
    return buf.readUInt32BE(0);
}
const IPv4 = {
    intToString,
    stringToInt
};
exports.default = IPv4;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXB2NC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9pcHY0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBaUNDLGtDQUFXO0FBQ1gsa0NBQVc7QUFoQ1o7Ozs7R0FJRztBQUNILFNBQVMsV0FBVyxDQUFDLEtBQWE7SUFDakMsSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxQixHQUFHLENBQUMsYUFBYSxDQUFDLEtBQUssS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDbEMsT0FBTyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQzVDLENBQUM7QUFFRDs7OztHQUlHO0FBQ0gsU0FBUyxXQUFXLENBQUMsUUFBZ0I7SUFDcEMsSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxQixJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2pDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUM1QixHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBQ0QsT0FBTyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzVCLENBQUM7QUFFRCxNQUFNLElBQUksR0FBYztJQUN2QixXQUFXO0lBQ1gsV0FBVztDQUNYLENBQUM7QUFPRixrQkFBZSxJQUFJLENBQUMifQ==