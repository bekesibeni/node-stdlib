"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeoutPromise = exports.timeoutCallbackPromise = exports.retryPromise = void 0;
exports.betterPromise = betterPromise;
exports.callbackPromise = callbackPromise;
exports.sleepAsync = sleepAsync;
const retryPromise_1 = __importDefault(require("./lib/promises/retryPromise"));
exports.retryPromise = retryPromise_1.default;
const timeoutCallbackPromise_1 = __importDefault(require("./lib/promises/timeoutCallbackPromise"));
exports.timeoutCallbackPromise = timeoutCallbackPromise_1.default;
const timeoutPromise_1 = __importDefault(require("./lib/promises/timeoutPromise"));
exports.timeoutPromise = timeoutPromise_1.default;
function callbackPromise(callbackArgs, callback, isOptional, executor) {
    return (0, timeoutCallbackPromise_1.default)(0, callbackArgs, callback, isOptional, executor);
}
/**
 * A "better promise" is just a promise that behaves normally, except if the executor is an async function which rejects,
 * that bubbles up to reject this promise too.
 * @param {function} executor
 */
function betterPromise(executor) {
    return (0, timeoutPromise_1.default)(0, executor);
}
/**
 * Resolves the promise after some specific delay.
 * @param {int} sleepMilliseconds
 * @returns {Promise}
 */
function sleepAsync(sleepMilliseconds) {
    return new Promise((resolve) => {
        setTimeout(resolve, sleepMilliseconds);
    });
}
const Promises = {
    betterPromise,
    retryPromise: retryPromise_1.default,
    timeoutCallbackPromise: timeoutCallbackPromise_1.default,
    timeoutPromise: timeoutPromise_1.default,
    callbackPromise,
    sleepAsync
};
exports.default = Promises;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvbWlzZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvcHJvbWlzZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBa0RDLHNDQUFhO0FBSWIsMENBQWU7QUFDZixnQ0FBVTtBQXJEWCwrRUFBdUQ7QUFpRHRELHVCQWpETSxzQkFBWSxDQWlETjtBQWhEYixtR0FBMkU7QUFpRDFFLGlDQWpETSxnQ0FBc0IsQ0FpRE47QUFoRHZCLG1GQUEyRDtBQWlEMUQseUJBakRNLHdCQUFjLENBaUROO0FBL0NmLFNBQVMsZUFBZSxDQUN2QixZQUFzQixFQUN0QixRQUFrQyxFQUNsQyxVQUFtQixFQUNuQixRQUdRO0lBRVIsT0FBTyxJQUFBLGdDQUFzQixFQUFDLENBQUMsRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUNoRixDQUFDO0FBRUQ7Ozs7R0FJRztBQUNILFNBQVMsYUFBYSxDQUNyQixRQUErRTtJQUUvRSxPQUFPLElBQUEsd0JBQWMsRUFBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDcEMsQ0FBQztBQUVEOzs7O0dBSUc7QUFDSCxTQUFTLFVBQVUsQ0FBQyxpQkFBeUI7SUFDNUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFO1FBQzlCLFVBQVUsQ0FBQyxPQUFPLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztJQUN4QyxDQUFDLENBQUMsQ0FBQztBQUNKLENBQUM7QUFFRCxNQUFNLFFBQVEsR0FBYztJQUMzQixhQUFhO0lBQ2IsWUFBWSxFQUFaLHNCQUFZO0lBQ1osc0JBQXNCLEVBQXRCLGdDQUFzQjtJQUN0QixjQUFjLEVBQWQsd0JBQWM7SUFDZCxlQUFlO0lBQ2YsVUFBVTtDQUNWLENBQUM7QUFXRixrQkFBZSxRQUFRLENBQUMifQ==