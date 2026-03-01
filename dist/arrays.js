"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unique = unique;
/**
 * Returns an array containing only the unique elements in the input array.
 * @param {Array} array
 * @param {boolean} [strict=false] - Use strict comparisons. If false, performance will be *much* better on large arrays.
 * @returns {Array}
 */
function unique(array, strict = false) {
    let out = [];
    let nonStrictCache = {};
    array.forEach((val) => {
        let inOutputArray = strict || typeof val == 'object' ? out.includes(val) : nonStrictCache[val];
        if (!inOutputArray) {
            out.push(val);
            if (!strict) {
                nonStrictCache[val] = true;
            }
        }
    });
    return out;
}
const Arrays = {
    unique
};
exports.default = Arrays;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJyYXlzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2FycmF5cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQTZCQyx3QkFBTTtBQTNCUDs7Ozs7R0FLRztBQUNILFNBQVMsTUFBTSxDQUFDLEtBQVksRUFBRSxNQUFNLEdBQUcsS0FBSztJQUMzQyxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7SUFDYixJQUFJLGNBQWMsR0FBRyxFQUFFLENBQUM7SUFDeEIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO1FBQ3JCLElBQUksYUFBYSxHQUFHLE1BQU0sSUFBSSxPQUFPLEdBQUcsSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMvRixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDcEIsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNkLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDYixjQUFjLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQzVCLENBQUM7UUFDRixDQUFDO0lBQ0YsQ0FBQyxDQUFDLENBQUM7SUFFSCxPQUFPLEdBQUcsQ0FBQztBQUNaLENBQUM7QUFFRCxNQUFNLE1BQU0sR0FBYztJQUN6QixNQUFNO0NBQ04sQ0FBQztBQU1GLGtCQUFlLE1BQU0sQ0FBQyJ9