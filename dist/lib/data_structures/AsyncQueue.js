"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Queue_1 = __importDefault(require("./Queue"));
class AsyncQueue {
    concurrency;
    worker;
    drain;
    empty;
    start;
    error;
    #running;
    #paused;
    #killed;
    #queue;
    /**
     * Construct a new AsyncQueue. An AsyncQueue is a traditional FIFO queue, but it's designed for asynchronous tasks.
     * @param {function} worker - A worker function that takes two arguments, (element, callback) to be invoked when processing an item
     * @param {int} [concurrency=1] - The maximum number of workers that may be working at once
     * @constructor
     */
    constructor(worker, concurrency = 1) {
        this.concurrency = concurrency;
        this.worker = worker;
        this.#running = 0;
        this.#paused = false;
        this.#killed = false;
        this.#queue = new Queue_1.default();
    }
    get running() {
        return this.#running;
    }
    get paused() {
        return this.#paused;
    }
    get killed() {
        return this.#killed;
    }
    get length() {
        return this.#queue.length;
    }
    /**
     * Pause execution and stop handing items to workers.
     */
    pause() {
        this.#paused = true;
    }
    /**
     * Unpause execution and start workers on items in the queue again.
     */
    resume() {
        this.#paused = false;
        this.#process();
    }
    /**
     * Destroy this queue and stop processing items. Anything currently processing will finish and emit callbacks.
     */
    kill() {
        this.drain = null;
        this.empty = null;
        this.#killed = true;
        this.#queue.empty();
    }
    /**
     * Push a new item to the end of the queue.
     * @param {*} item - The item to push into the queue
     * @param {function} [callback] - A callback to be invoked after this item is finished processing, which takes arguments (err, result)
     * @return {int} The new length of the queue
     */
    enqueue(item, callback) {
        if (this.killed) {
            throw new Error('Cannot push items into a killed AsyncQueue');
        }
        let workItem = { data: item, callback };
        this.#queue.push(workItem);
        process.nextTick(() => this.#process());
        return this.length;
    }
    /**
     * Push a new item to the end of the queue.
     * @param {*} item - The item to push into the queue
     * @param {function} [callback] - A callback to be invoked after this item is finished processing, which takes arguments (err, result)
     * @return {int} The new length of the queue
     */
    push(item, callback) {
        return this.enqueue(item, callback);
    }
    /**
     * Insert a new item into the front of the queue.
     * @param {*} item - The item to push into the queue
     * @param {function} [callback] - A callback to be invoked after this item is finished processing, which takes arguments (err, result)
     * @return {int} The new length of the queue
     */
    insert(item, callback) {
        if (this.killed) {
            throw new Error('Cannot insert items into a killed AsyncQueue');
        }
        this.#queue.insert({ data: item, callback });
        process.nextTick(() => this.#process());
        return this.length;
    }
    /**
     * Try to process an item in the queue.
     * @private
     */
    #process() {
        if (this.killed || this.paused || this.length == 0 || this.running >= this.concurrency) {
            // execution is killed/paused, there's nothing in the queue, or we already have too many running workers
            return;
        }
        // we don't have too many running workers
        let item = this.#queue.pop();
        if (this.#queue.length == 0 && this.empty) {
            // there is now nothing left in the queue (but we're still processing stuff)
            this.empty();
        }
        this.start && this.start(item);
        this.#running++;
        this.worker(item.data, (err, ...args) => {
            if (err) {
                this.error && this.error(err, item.data);
                item.callback && item.callback.apply(this, [err, ...args]);
            }
            else {
                item.callback && item.callback.apply(this, [null, ...args]);
            }
            if (--this.#running == 0 && this.length == 0) {
                this.drain && this.drain();
            }
            this.#process();
        });
        this.#process();
    }
}
exports.default = AsyncQueue;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXN5bmNRdWV1ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvZGF0YV9zdHJ1Y3R1cmVzL0FzeW5jUXVldWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvREFBNEI7QUFPNUIsTUFBcUIsVUFBVTtJQUM5QixXQUFXLENBQVM7SUFDcEIsTUFBTSxDQUFtRTtJQUN6RSxLQUFLLENBQWM7SUFDbkIsS0FBSyxDQUFjO0lBQ25CLEtBQUssQ0FBMkI7SUFDaEMsS0FBSyxDQUF1QztJQUU1QyxRQUFRLENBQVM7SUFDakIsT0FBTyxDQUFVO0lBQ2pCLE9BQU8sQ0FBVTtJQUNqQixNQUFNLENBQVE7SUFFZDs7Ozs7T0FLRztJQUNILFlBQVksTUFBTSxFQUFFLFdBQVcsR0FBRyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1FBQy9CLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1FBQ2xCLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxlQUFLLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBRUQsSUFBSSxPQUFPO1FBQ1YsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3RCLENBQUM7SUFFRCxJQUFJLE1BQU07UUFDVCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDckIsQ0FBQztJQUVELElBQUksTUFBTTtRQUNULE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUNyQixDQUFDO0lBRUQsSUFBSSxNQUFNO1FBQ1QsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUMzQixDQUFDO0lBRUQ7O09BRUc7SUFDSCxLQUFLO1FBQ0osSUFBSSxDQUFDLE9BQU8sR0FBRyxJ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