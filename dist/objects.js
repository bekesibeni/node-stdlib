"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clone = clone;
exports.deepEqual = deepEqual;
/**
 * Clone an object/array/any other type.
 * @param {*} obj
 * @returns {*}
 */
function clone(obj) {
    if (typeof obj != 'object' || obj === null) {
        return obj;
    }
    let outObj = Array.isArray(obj) ? obj.slice(0) : {};
    for (let i in obj) {
        outObj[i] = Objects.clone(obj[i]);
    }
    return outObj;
}
/**
 * Check whether two objects or values and all their subobjects are equal (same keys with same values, but not necessarily in the same order (except for arrays))
 * @param {*} obj1
 * @param {*} obj2
 * @param {boolean} [strict=false] - Use strict equality checks?
 * @returns {boolean}
 */
function deepEqual(obj1, obj2, strict = false) {
    if (typeof obj1 != 'object') {
        return checkEq(obj1, obj2);
    }
    if (obj1 === null) {
        return obj1 === obj2;
    }
    // Catch cases where obj2 has extra keys
    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
        return false;
    }
    for (let i in obj1) {
        if (!Objects.deepEqual(obj1[i], obj2[i], strict)) {
            return false;
        }
    }
    return true;
    function checkEq(val1, val2) {
        return strict ? val1 === val2 : val1 == val2;
    }
}
const Objects = {
    clone,
    deepEqual
};
exports.default = Objects;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2JqZWN0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9vYmplY3RzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBNERDLHNCQUFLO0FBQ0wsOEJBQVM7QUEzRFY7Ozs7R0FJRztBQUNILFNBQVMsS0FBSyxDQUFDLEdBQVE7SUFDdEIsSUFBSSxPQUFPLEdBQUcsSUFBSSxRQUFRLElBQUksR0FBRyxLQUFLLElBQUksRUFBRSxDQUFDO1FBQzVDLE9BQU8sR0FBRyxDQUFDO0lBQ1osQ0FBQztJQUVELElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUNwRCxLQUFLLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ25CLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFFRCxPQUFPLE1BQU0sQ0FBQztBQUNmLENBQUM7QUFFRDs7Ozs7O0dBTUc7QUFDSCxTQUFTLFNBQVMsQ0FBQyxJQUFTLEVBQUUsSUFBUyxFQUFFLE1BQU0sR0FBRyxLQUFLO0lBQ3RELElBQUksT0FBTyxJQUFJLElBQUksUUFBUSxFQUFFLENBQUM7UUFDN0IsT0FBTyxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRCxJQUFJLElBQUksS0FBSyxJQUFJLEVBQUUsQ0FBQztRQUNuQixPQUFPLElBQUksS0FBSyxJQUFJLENBQUM7SUFDdEIsQ0FBQztJQUVELHdDQUF3QztJQUN4QyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxLQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDM0QsT0FBTyxLQUFLLENBQUM7SUFDZCxDQUFDO0lBRUQsS0FBSyxJQUFJLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUNwQixJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUM7WUFDbEQsT0FBTyxLQUFLLENBQUM7UUFDZCxDQUFDO0lBQ0YsQ0FBQztJQUVELE9BQU8sSUFBSSxDQUFDO0lBRVosU0FBUyxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUk7UUFDMUIsT0FBTyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUM7SUFDOUMsQ0FBQztBQUNGLENBQUM7QUFFRCxNQUFNLE9BQU8sR0FBYztJQUMxQixLQUFLO0lBQ0wsU0FBUztDQUNULENBQUM7QUFPRixrQkFBZSxPQUFPLENBQUMifQ==