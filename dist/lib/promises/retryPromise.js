"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = retryPromise;
/**
 * Returns a promise that will call the executor again on error, up to the specified number of attempts.
 * @param {int} attempts
 * @param {int} [delayBetweenAttempts] - Delay in milliseconds between executor failure and subsequent re-attempt
 * @param {function} executor
 * @returns {Promise}
 */
function retryPromise(attempts, delayBetweenAttempts, executor) {
    if (typeof delayBetweenAttempts == 'function') {
        executor = delayBetweenAttempts;
        delayBetweenAttempts = 0;
    }
    return new Promise((resolve, reject) => {
        try {
            let executorReturn = executor((resolveValue) => {
                // resolve() was called inside the executor
                resolve(resolveValue);
            }, handleRejection);
            if (typeof executorReturn == 'object' && executorReturn !== null && typeof executorReturn.catch == 'function') {
                // It's an async function
                // The executor is an async function and it was rejected (e.g. new Promise(async (resolve, reject) => { }))
                executorReturn.catch(handleRejection);
            }
        }
        catch (ex) {
            // The executor is not an async function, and something threw inside of it
            handleRejection(ex);
        }
        function handleRejection(value) {
            console.log('handling rejection');
            if (attempts <= 1) {
                return reject(value); // fatal failure
            }
            setTimeout(() => {
                let innerPromise = retryPromise(attempts - 1, delayBetweenAttempts, executor);
                innerPromise.then(resolve, reject);
            }, delayBetweenAttempts);
        }
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmV0cnlQcm9taXNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9wcm9taXNlcy9yZXRyeVByb21pc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFPQSwrQkEwQ0M7QUFqREQ7Ozs7OztHQU1HO0FBQ0gsU0FBd0IsWUFBWSxDQUNuQyxRQUFnQixFQUNoQixvQkFBNEIsRUFDNUIsUUFHUTtJQUVSLElBQUksT0FBTyxvQkFBb0IsSUFBSSxVQUFVLEVBQUUsQ0FBQztRQUMvQyxRQUFRLEdBQUcsb0JBQW9CLENBQUM7UUFDaEMsb0JBQW9CLEdBQUcsQ0FBQyxDQUFDO0lBQzFCLENBQUM7SUFFRCxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBQ3RDLElBQUksQ0FBQztZQUNKLElBQUksY0FBYyxHQUFHLFFBQVEsQ0FBQyxDQUFDLFlBQVksRUFBRSxFQUFFO2dCQUM5QywyQ0FBMkM7Z0JBQzNDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUN2QixDQUFDLEVBQUUsZUFBZSxDQUFDLENBQUM7WUFFcEIsSUFBSSxPQUFPLGNBQWMsSUFBSSxRQUFRLElBQUksY0FBYyxLQUFLLElBQUksSUFBSSxPQUFPLGNBQWMsQ0FBQyxLQUFLLElBQUksVUFBVSxFQUFFLENBQUM7Z0JBQy9HLHlCQUF5QjtnQkFDekIsMkdBQTJHO2dCQUMzRyxjQUFjLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQ3ZDLENBQUM7UUFDRixDQUFDO1FBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQztZQUNiLDBFQUEwRTtZQUMxRSxlQUFlLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDckIsQ0FBQztRQUVELFNBQVMsZUFBZSxDQUFDLEtBQUs7WUFDN0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1lBQ2xDLElBQUksUUFBUSxJQUFJLENBQUMsRUFBRSxDQUFDO2dCQUNuQixPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLGdCQUFnQjtZQUN2QyxDQUFDO1lBRUQsVUFBVSxDQUFDLEdBQUcsRUFBRTtnQkFDZixJQUFJLFlBQVksR0FBRyxZQUFZLENBQUMsUUFBUSxHQUFHLENBQUMsRUFBRSxvQkFBb0IsRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDOUUsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDcEMsQ0FBQyxFQUFFLG9CQUFvQixDQUFDLENBQUM7UUFDMUIsQ0FBQztJQUNGLENBQUMsQ0FBQyxDQUFDO0FBQ0osQ0FBQyJ9