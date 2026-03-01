"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Stack {
    #length;
    #tail;
    /**
     * Create a new Stack. A Stack is a FILO data structure, in which all you can do is append items and remove items from
     * the back. Under the hood, this is implemented with a linked list (LL).
     * @constructor
     */
    constructor() {
        this.#length = 0;
        this.#tail = null;
    }
    get length() {
        return this.#length;
    }
    /**
     * Push a new item to the top of the stack.
     * @param {*} item - The item to push into the stack
     * @return {int} The new length of the stack
     */
    push(item) {
        // Create the LL node. The "prev" pointer is the existing tail of the list.
        this.#tail = { data: item, prev: this.#tail };
        return ++this.#length;
    }
    /**
     * Remove the top element from the stack and return it.
     * @return {*} The top item in the stack. Null if the stack is empty.
     */
    pop() {
        if (!this.#tail) {
            return null;
        }
        let entry = this.#tail.data;
        this.#tail = this.#tail.prev;
        this.#length--;
        return entry;
    }
    /**
     * Empty this stack by removing all items in it.
     */
    empty() {
        this.#tail = null;
        this.#length = 0;
    }
}
exports.default = Stack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL2RhdGFfc3RydWN0dXJlcy9TdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUtBLE1BQXFCLEtBQUs7SUFDekIsT0FBTyxDQUFTO0lBQ2hCLEtBQUssQ0FBYTtJQUVsQjs7OztPQUlHO0lBQ0g7UUFDQyxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztRQUNqQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztJQUNuQixDQUFDO0lBRUQsSUFBSSxNQUFNO1FBQ1QsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3JCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsSUFBSSxDQUFDLElBQVM7UUFDYiwyRUFBMkU7UUFDM0UsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUMsQ0FBQztRQUM1QyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN2QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsR0FBRztRQUNGLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDakIsT0FBTyxJQUFJLENBQUM7UUFDYixDQUFDO1FBRUQsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7UUFDNUIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztRQUM3QixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDZixPQUFPLEtBQUssQ0FBQztJQUNkLENBQUM7SUFFRDs7T0FFRztJQUNILEtBQUs7UUFDSixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUNsQixJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztJQUNsQixDQUFDO0NBQ0Q7QUFuREQsd0JBbURDIn0=