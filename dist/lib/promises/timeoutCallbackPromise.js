"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = timeoutCallbackPromise;
const timeoutPromise_1 = __importDefault(require("./timeoutPromise"));
/**
 * Return a new promise that will also invoke the callback, if provided. Also has timeout functionality as in timeoutPromise.
 * @param {number} timeout - Timeout in milliseconds. If this value is <= 0, then the timeout functionality is disabled.
 * @param {string[]|null} callbackArgs - If null, the entire result object is just passed to the callback as the 2nd arg (1 is err)
 * @param {function|null} callback
 * @param {boolean} [isOptional=false] - If true, then the app won't crash if the user neither provides a callback nor adds a `catch` listener
 * @param {function} executor
 * @returns {Promise}
 */
function timeoutCallbackPromise(timeout, callbackArgs, callback, isOptional, executor) {
    if (typeof isOptional === 'function') {
        executor = isOptional;
        isOptional = false;
    }
    let promise = (0, timeoutPromise_1.default)(timeout, executor);
    if (typeof callback === 'function' || isOptional) {
        promise.then((result) => {
            if (typeof callback === 'function') {
                setImmediate(() => {
                    let args = callbackArgs ? callbackArgs.map(argName => typeof result[argName] === 'undefined' ? null : result[argName]) : [result];
                    callback(null, ...args);
                });
            }
        }).catch((err) => {
            if (typeof callback === 'function') {
                callback(err);
            }
        });
    }
    return promise;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZW91dENhbGxiYWNrUHJvbWlzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvcHJvbWlzZXMvdGltZW91dENhbGxiYWNrUHJvbWlzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQVdBLHlDQWlDQztBQTVDRCxzRUFBOEM7QUFFOUM7Ozs7Ozs7O0dBUUc7QUFDSCxTQUF3QixzQkFBc0IsQ0FDN0MsT0FBZSxFQUNmLFlBQTJCLEVBQzNCLFFBQTZDLEVBQzdDLFVBQW1CLEVBQ25CLFFBR1E7SUFFUixJQUFJLE9BQU8sVUFBVSxLQUFLLFVBQVUsRUFBRSxDQUFDO1FBQ3RDLFFBQVEsR0FBRyxVQUFVLENBQUM7UUFDdEIsVUFBVSxHQUFHLEtBQUssQ0FBQztJQUNwQixDQUFDO0lBRUQsSUFBSSxPQUFPLEdBQUcsSUFBQSx3QkFBYyxFQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztJQUVoRCxJQUFJLE9BQU8sUUFBUSxLQUFLLFVBQVUsSUFBSSxVQUFVLEVBQUUsQ0FBQztRQUNsRCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7WUFDdkIsSUFBSSxPQUFPLFFBQVEsS0FBSyxVQUFVLEVBQUUsQ0FBQztnQkFDcEMsWUFBWSxDQUFDLEdBQUcsRUFBRTtvQkFDakIsSUFBSSxJQUFJLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUNsSSxRQUFRLENBQUMsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7Z0JBQ3pCLENBQUMsQ0FBQyxDQUFDO1lBQ0osQ0FBQztRQUNGLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQ2hCLElBQUksT0FBTyxRQUFRLEtBQUssVUFBVSxFQUFFLENBQUM7Z0JBQ3BDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNmLENBQUM7UUFDRixDQUFDLENBQUMsQ0FBQztJQUNKLENBQUM7SUFFRCxPQUFPLE9BQU8sQ0FBQztBQUNoQixDQUFDIn0=