"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AsyncQueue_1 = __importDefault(require("../data_structures/AsyncQueue"));
class Semaphore {
    #queue;
    /**
     * Create a new semaphore.
     * @param [concurrency=1]
     * @constructor
     */
    constructor(concurrency = 1) {
        this.#queue = new AsyncQueue_1.default((item, callback) => this.#next(item, callback), concurrency);
    }
    get free() {
        return this.isFree();
    }
    /**
     * Wait for the semaphore to be available and call the provided function when available.
     * @param {function} callback
     */
    wait(callback) {
        if (typeof callback !== 'function') {
            throw new Error(`Argument to wait must be of type function; ${typeof callback} given`);
        }
        this.#queue.push(callback);
    }
    /**
     * Wait for the semaphore to be available and resolve the returned function when available.
     * The result of the resolved promise is a release() function that you must call when you're done with your work and
     * are ready to release the semaphore.
     * @return Promise<function>
     */
    waitAsync() {
        return new Promise(resolve => this.wait(resolve));
    }
    /**
     * Returns whether the semaphore is currently free. A semaphore is free if a call to wait() would result in immediate
     * invocation.
     * @return {boolean}
     */
    isFree() {
        return this.#queue.running < this.#queue.concurrency && this.#queue.length == 0;
    }
    /**
     * @param {function} item
     * @param {function} callback
     * @private
     */
    #next(item, callback) {
        item(() => callback(null));
    }
}
exports.default = Semaphore;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VtYXBob3JlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9jb25jdXJyZW5jeS9TZW1hcGhvcmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSwrRUFBdUQ7QUFFdkQsTUFBcUIsU0FBUztJQUM3QixNQUFNLENBQWE7SUFFbkI7Ozs7T0FJRztJQUNILFlBQVksV0FBVyxHQUFHLENBQUM7UUFDMUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLG9CQUFVLENBQUMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUMzRixDQUFDO0lBRUQsSUFBSSxJQUFJO1FBQ1AsT0FBTyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUVEOzs7T0FHRztJQUNILElBQUksQ0FBQyxRQUF1QztRQUMzQyxJQUFJLE9BQU8sUUFBUSxLQUFLLFVBQVUsRUFBRSxDQUFDO1lBQ3BDLE1BQU0sSUFBSSxLQUFLLENBQUMsOENBQThDLE9BQU8sUUFBUSxRQUFRLENBQUMsQ0FBQztRQUN4RixDQUFDO1FBRUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsU0FBUztRQUNSLE9BQU8sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxNQUFNO1FBQ0wsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUM7SUFDakYsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxLQUFLLENBQUMsSUFBbUMsRUFBRSxRQUErQjtRQUN6RSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDNUIsQ0FBQztDQUNEO0FBdkRELDRCQXVEQyJ9