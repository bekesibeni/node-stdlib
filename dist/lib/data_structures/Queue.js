"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Queue {
    #length;
    #tail;
    #head;
    /**
     * Create a new Queue. A Queue is a FIFO data structure, in which all you can do is append items and remove items from
     * the front. Under the hood, this is implemented with a doubly-linked list (DLL).
     * @constructor
     */
    constructor() {
        this.#length = 0;
        this.#head = null;
        this.#tail = null;
    }
    get length() {
        return this.#length;
    }
    /**
     * Push a new item to the end of the queue.
     * @param {*} item - The item to push into the queue
     * @return {int} The new length of the queue
     */
    enqueue(item) {
        // Create the DLL node. The "next" pointer is empty and the "prev" pointer is the existing tail of the list.
        let entry = { data: item, next: null, prev: this.#tail };
        if (this.#tail) {
            // If we already have a tail, make its next pointer point to this node.
            this.#tail.next = entry;
        }
        if (!this.#head) {
            // If the list was empty, this is also the new head
            this.#head = entry;
        }
        // This node is now our new tail
        this.#tail = entry;
        return ++this.#length;
    }
    push(item) {
        return this.enqueue(item);
    }
    /**
     * Inserts a new item into the front of the queue.
     * @param {*} item - The item to insert into the queue
     * @return {int} The new length of the queue
     */
    insert(item) {
        let entry = { data: item, next: this.#head, prev: null };
        this.#head = entry;
        // If we didn't previously have a tail, make this the tail as well
        if (!this.#tail) {
            this.#tail = entry;
        }
        return ++this.#length;
    }
    /**
     * Remove the first element from the queue and return it.
     * @return {*} The first item in the queue. Null if the queue is empty.
     */
    dequeue() {
        if (!this.#head) {
            return null;
        }
        let entry = this.#head.data;
        // remove it from the list
        this.#head = this.#head.next;
        if (!this.#head) {
            // the list is now empty
            this.#tail = null;
        }
        this.#length--;
        return entry;
    }
    pop() {
        return this.dequeue();
    }
    /**
     * Empty this queue by removing all items in it.
     */
    empty() {
        this.#head = null;
        this.#tail = null;
        this.#length = 0;
    }
}
exports.default = Queue;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUXVldWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL2RhdGFfc3RydWN0dXJlcy9RdWV1ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQU1BLE1BQXFCLEtBQUs7SUFDekIsT0FBTyxDQUFTO0lBQ2hCLEtBQUssQ0FBYTtJQUNsQixLQUFLLENBQWE7SUFFbEI7Ozs7T0FJRztJQUNIO1FBQ0MsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7UUFDakIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7SUFDbkIsQ0FBQztJQUVELElBQUksTUFBTTtRQUNULE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUNyQixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILE9BQU8sQ0FBQyxJQUFTO1FBQ2hCLDRHQUE0RztRQUM1RyxJQUFJLEtBQUssR0FBYSxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBQyxDQUFDO1FBRWpFLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2hCLHVFQUF1RTtZQUN2RSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7UUFDekIsQ0FBQztRQUVELElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDakIsbURBQW1EO1lBQ25ELElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ3BCLENBQUM7UUFFRCxnQ0FBZ0M7UUFDaEMsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDdkIsQ0FBQztJQUVELElBQUksQ0FBQyxJQUFTO1FBQ2IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsTUFBTSxDQUFDLElBQVM7UUFDZixJQUFJLEtBQUssR0FBYSxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBQyxDQUFDO1FBQ2pFLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBRW5CLGtFQUFrRTtRQUNsRSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ3BCLENBQUM7UUFFRCxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN2QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsT0FBTztRQUNOLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDakIsT0FBTyxJQUFJLENBQUM7UUFDYixDQUFDO1FBRUQsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7UUFDNUIsMEJBQTBCO1FBQzFCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7UUFDN0IsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNqQix3QkFBd0I7WUFDeEIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDbkIsQ0FBQztRQUVELElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNmLE9BQU8sS0FBSyxDQUFDO0lBQ2QsQ0FBQztJQUVELEdBQUc7UUFDRixPQUFPLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUN2QixDQUFDO0lBRUQ7O09BRUc7SUFDSCxLQUFLO1FBQ0osSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7SUFDbEIsQ0FBQztDQUNEO0FBbEdELHdCQWtHQyJ9