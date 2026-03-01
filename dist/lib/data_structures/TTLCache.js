"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// This import isn't necessary for Node.js, but it is for Electron.
// Ref: https://dev.doctormckay.com/topic/4606-typeerror-setintervalunref-is-not-a-function/
const timers_1 = require("timers");
class TTLCache {
    #container;
    #ttl;
    /**
     * Construct a new TTLCache.
     * @param {int} ttlMilliseconds - Default time to live in milliseconds for each entry
     * @param {int} [gcIntervalMilliseconds=300000] - Time between garbage collections (default 1 minute)
     * @constructor
     */
    constructor(ttlMilliseconds, gcIntervalMilliseconds = 60000) {
        this.#container = new Map();
        this.#ttl = ttlMilliseconds;
        // Force a GC every minute
        (0, timers_1.setInterval)(() => this.#gc(), gcIntervalMilliseconds).unref();
    }
    /**
     * Add an entry to the cache.
     * @param {string} key - The key under which this entry should be stored
     * @param {any} value - The value to store in this entry
     * @param {int} ttlMilliseconds - Optionally set a TTL for this specific entry, rather than using the default global TTL
     */
    add(key, value, ttlMilliseconds) {
        let ttl = ttlMilliseconds || this.#ttl;
        this.#container.set(key, {
            value,
            expire: Date.now() + ttl
        });
    }
    /**
     * Get the entry stored in the cache under a particular key.
     * @param {string} key - The key to retrieve
     * @return {null|*} value if present, null if not
     */
    get(key) {
        // Collect garbage on just this key if applicable, to ensure that we don't return an expired value
        this.#gcKey(key);
        if (!this.#container.has(key)) {
            return null;
        }
        let { value } = this.#container.get(key);
        return value;
    }
    /**
     * Delete an entry from the cache.
     * @param {string} key
     * @returns {void}
     */
    delete(key) {
        this.#container.delete(key);
    }
    /**
     * Get a list of all keys in the cache.
     * @returns {string[]}
     */
    getKeys() {
        this.#gc();
        return [...this.#container.keys()];
    }
    /**
     * Clear the cache.
     * @returns {void}
     */
    clear() {
        this.#container.clear();
    }
    /**
     * Collect garabge and delete expired entries.
     * @private
     */
    #gc() {
        // We cannot use getKeys() since that calls #gc() and would cause recursion
        let keys = [...this.#container.keys()];
        keys.forEach(key => this.#gcKey(key));
    }
    #gcKey(key) {
        let val = this.#container.get(key);
        if (!val) {
            return;
        }
        if (val.expire < Date.now()) {
            this.#container.delete(key);
        }
    }
}
exports.default = TTLCache;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVFRMQ2FjaGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL2RhdGFfc3RydWN0dXJlcy9UVExDYWNoZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1FQUFtRTtBQUNuRSw0RkFBNEY7QUFDNUYsbUNBQW1DO0FBRW5DLE1BQXFCLFFBQVE7SUFDbkIsVUFBVSxDQUEwQztJQUNwRCxJQUFJLENBQVM7SUFFdEI7Ozs7O09BS0c7SUFDSCxZQUFZLGVBQXVCLEVBQUUseUJBQWlDLEtBQUs7UUFDMUUsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLEdBQUcsRUFBc0MsQ0FBQztRQUNoRSxJQUFJLENBQUMsSUFBSSxHQUFHLGVBQWUsQ0FBQztRQUU1QiwwQkFBMEI7UUFDMUIsSUFBQSxvQkFBVyxFQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQy9ELENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILEdBQUcsQ0FBQyxHQUFXLEVBQUUsS0FBUSxFQUFFLGVBQXdCO1FBQ2xELElBQUksR0FBRyxHQUFHLGVBQWUsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDO1FBRXZDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRTtZQUN4QixLQUFLO1lBQ0wsTUFBTSxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFHO1NBQ3hCLENBQUMsQ0FBQztJQUNKLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsR0FBRyxDQUFDLEdBQVc7UUFDZCxrR0FBa0c7UUFDbEcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVqQixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztZQUMvQixPQUFPLElBQUksQ0FBQztRQUNiLENBQUM7UUFFRCxJQUFJLEVBQUMsS0FBSyxFQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdkMsT0FBTyxLQUFLLENBQUM7SUFDZCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILE1BQU0sQ0FBQyxHQUFXO1FBQ2pCLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFRDs7O09BR0c7SUFDSCxPQUFPO1FBQ04sSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ1gsT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFFRDs7O09BR0c7SUFDSCxLQUFLO1FBQ0osSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsR0FBRztRQUNGLDJFQUEyRTtRQUMzRSxJQUFJLElBQUksR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVELE1BQU0sQ0FBQyxHQUFXO1FBQ2pCLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ25DLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUNWLE9BQU87UUFDUixDQUFDO1FBRUQsSUFBSSxHQUFHLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDO1lBQzdCLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzdCLENBQUM7SUFDRixDQUFDO0NBQ0Q7QUFoR0QsMkJBZ0dDIn0=