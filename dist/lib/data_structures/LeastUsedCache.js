"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LeastUsedCache {
    #entries;
    #lastAccess;
    #maxItems;
    #gcInterval;
    #lastGc;
    /**
     * Construct a new LeastUsedCache.
     * @param {int} maxItems - Maximum number of items allowed in the cache before stuff will start being pruned
     * @param {int} gcInterval - Time in milliseconds between garbage collections
     * @constructor
     */
    constructor(maxItems, gcInterval) {
        this.#entries = {};
        this.#lastAccess = {};
        this.#maxItems = maxItems;
        this.#gcInterval = gcInterval;
        this.#lastGc = Date.now();
    }
    /**
     * Add an entry to the cache.
     * @param {string} key - The key under which this entry should be stored
     * @param {*} val - The value to store in this entry
     */
    add(key, val) {
        this.#entries[key] = val;
        this.#lastAccess[key] = Date.now();
        this.checkGC();
    }
    /**
     * Get the entry stored in the cache under a particular key.
     * @param {string} key - The key to retrieve
     * @return {null|*} value if present, null if not
     */
    get(key) {
        if (typeof this.#entries[key] != 'undefined') {
            this.#lastAccess[key] = Date.now();
            this.checkGC();
            return this.#entries[key];
        }
        else {
            return null;
        }
    }
    /**
     * Delete an entry from the cache.
     * @param {string} key
     */
    delete(key) {
        delete this.#entries[key];
        delete this.#lastAccess[key];
        this.checkGC();
    }
    /**
     * Get a list of all keys in the cache.
     * @returns {string[]}
     */
    getKeys() {
        this.checkGC();
        return Object.keys(this.#entries);
    }
    /**
     * Check if a garbage collection is necessary and if so, do it.
     */
    checkGC() {
        if (Date.now() - this.#lastGc >= this.#gcInterval) {
            this.gc();
        }
    }
    /**
     * Collect garbage and delete anything over the limit that hasn't been accessed in a while.
     */
    gc() {
        this.#lastGc = Date.now();
        let keys = this.getKeys();
        if (keys.length <= this.#maxItems) {
            return; // we aren't over the limit, so nothing to do
        }
        // sort the keys so that the least-frequently-accessed ones are at the end
        keys.sort((a, b) => this.#lastAccess[a] > this.#lastAccess[b] ? -1 : 1);
        keys.slice(keys.length - (keys.length - this.#maxItems)).forEach((key) => {
            this.delete(key);
        });
    }
}
exports.default = LeastUsedCache;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGVhc3RVc2VkQ2FjaGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL2RhdGFfc3RydWN0dXJlcy9MZWFzdFVzZWRDYWNoZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLE1BQXFCLGNBQWM7SUFDbEMsUUFBUSxDQUF3QjtJQUNoQyxXQUFXLENBQTJCO0lBQ3RDLFNBQVMsQ0FBUztJQUNsQixXQUFXLENBQVM7SUFDcEIsT0FBTyxDQUFTO0lBRWhCOzs7OztPQUtHO0lBQ0gsWUFBWSxRQUFnQixFQUFFLFVBQWtCO1FBQy9DLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO1FBQ25CLElBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO1FBQzFCLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO1FBQzlCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsR0FBRyxDQUFDLEdBQVcsRUFBRSxHQUFRO1FBQ3hCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ25DLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNoQixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILEdBQUcsQ0FBQyxHQUFXO1FBQ2QsSUFBSSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksV0FBVyxFQUFFLENBQUM7WUFDOUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDbkMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ2YsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzNCLENBQUM7YUFBTSxDQUFDO1lBQ1AsT0FBTyxJQUFJLENBQUM7UUFDYixDQUFDO0lBQ0YsQ0FBQztJQUVEOzs7T0FHRztJQUNILE1BQU0sQ0FBQyxHQUFXO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMxQixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDN0IsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ2hCLENBQUM7SUFFRDs7O09BR0c7SUFDSCxPQUFPO1FBQ04sSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ2YsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRUQ7O09BRUc7SUFDSCxPQUFPO1FBQ04sSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDbkQsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQ1gsQ0FBQztJQUNGLENBQUM7SUFFRDs7T0FFRztJQUNILEVBQUU7UUFDRCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUUxQixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDMUIsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNuQyxPQUFPLENBQUMsNkNBQTZDO1FBQ3RELENBQUM7UUFFRCwwRUFBMEU7UUFDMUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7WUFDeEUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNsQixDQUFDLENBQUMsQ0FBQztJQUNKLENBQUM7Q0FDRDtBQTVGRCxpQ0E0RkMifQ==