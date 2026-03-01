"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.humanReadableBytes = humanReadableBytes;
/**
 * Return a string containing the human-readable representation of the input byte count.
 * @param {int} bytes
 * @param {boolean} [binary=false] - Pass true to use the binary system instead of the decimal system (i.e. MiB instead of MB)
 * @param {boolean} [forceDecimal=false] - Pass true to always append the tenths decimal place, even if it's 0
 * @return {string}
 */
function humanReadableBytes(bytes, binary = false, forceDecimal = false) {
    let units = ['K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
    let suffix = binary ? 'iB' : 'B';
    let base = binary ? 1024 : 1000;
    // handle cases where the input is less than any of the multiples
    if (bytes < base) {
        return bytes + ' B';
    }
    for (let i = 0; i < units.length; i++) {
        // this is the unit we want if it's the last, or dividing by the next highest is < 1
        if (i == units.length - 1 || bytes / Math.pow(base, i + 2) < 1) {
            let bytesVal = bytes / Math.pow(base, i + 1);
            return (forceDecimal ? bytesVal.toFixed(1) : (Math.round(bytesVal * 10) / 10)) + ' ' + units[i] + suffix;
        }
    }
}
const Units = {
    humanReadableBytes
};
exports.default = Units;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5pdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdW5pdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFpQ0MsZ0RBQWtCO0FBL0JuQjs7Ozs7O0dBTUc7QUFDSCxTQUFTLGtCQUFrQixDQUFDLEtBQWEsRUFBRSxNQUFNLEdBQUcsS0FBSyxFQUFFLFlBQVksR0FBRyxLQUFLO0lBQzlFLElBQUksS0FBSyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3JELElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDakMsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUVoQyxpRUFBaUU7SUFDakUsSUFBSSxLQUFLLEdBQUcsSUFBSSxFQUFFLENBQUM7UUFDbEIsT0FBTyxLQUFLLEdBQUcsSUFBSSxDQUFDO0lBQ3JCLENBQUM7SUFFRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQ3ZDLG9GQUFvRjtRQUNwRixJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO1lBQ2hFLElBQUksUUFBUSxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDN0MsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQzFHLENBQUM7SUFDRixDQUFDO0FBQ0YsQ0FBQztBQUVELE1BQU0sS0FBSyxHQUFjO0lBQ3hCLGtCQUFrQjtDQUNsQixDQUFDO0FBTUYsa0JBQWUsS0FBSyxDQUFDIn0=