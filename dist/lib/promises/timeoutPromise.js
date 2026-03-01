"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = timeoutPromise;
/**
 * Return a new promise that will automatically be rejected with 'Error: Request timed out' after a specified timeout period
 * @param {number} timeout - Timeout in milliseconds. If this value is <= 0, then the timeout functionality is disabled.
 * @param {function} executor
 * @returns {Promise}
 */
function timeoutPromise(timeout, executor) {
    // We have to create the Error here in order to have a useful stack trace.
    // If we create it inside of the timer callback, we don't get anything helpful.
    let err = new Error('Request timed out');
    return new Promise((resolve, reject) => {
        let timedOut = false;
        let timer = null;
        if (timeout > 0) {
            timer = setTimeout(() => {
                timedOut = true;
                reject(err);
            }, timeout);
        }
        try {
            let executorReturn = executor((resolveValue) => {
                // resolve() was called inside the executor
                if (!timedOut) {
                    clearTimeout(timer);
                    resolve(resolveValue);
                }
            }, (rejectValue) => {
                // reject() was called inside the executor
                if (!timedOut) {
                    clearTimeout(timer);
                    reject(rejectValue);
                }
            });
            if (typeof executorReturn == 'object' && executorReturn !== null && typeof executorReturn.catch == 'function') {
                // It's an async function
                executorReturn.catch((ex) => {
                    // The executor is an async function and it was rejected (e.g. new Promise(async (resolve, reject) => { }))
                    if (!timedOut) {
                        clearTimeout(timer);
                        reject(ex);
                    }
                });
            }
        }
        catch (ex) {
            if (!timedOut) {
                // The executor is not an async function, and something threw inside of it
                clearTimeout(timer);
                reject(ex);
            }
        }
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZW91dFByb21pc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3Byb21pc2VzL3RpbWVvdXRQcm9taXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBTUEsaUNBdURDO0FBN0REOzs7OztHQUtHO0FBQ0gsU0FBd0IsY0FBYyxDQUNyQyxPQUFlLEVBQ2YsUUFHUTtJQUVSLDBFQUEwRTtJQUMxRSwrRUFBK0U7SUFDL0UsSUFBSSxHQUFHLEdBQUcsSUFBSSxLQUFLLENBQUMsbUJBQW1CLENBQUMsQ0FBQztJQUV6QyxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBQ3RDLElBQUksUUFBUSxHQUFHLEtBQUssQ0FBQztRQUNyQixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7UUFFakIsSUFBSSxPQUFPLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDakIsS0FBSyxHQUFHLFVBQVUsQ0FBQyxHQUFHLEVBQUU7Z0JBQ3ZCLFFBQVEsR0FBRyxJQUFJLENBQUM7Z0JBQ2hCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNiLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNiLENBQUM7UUFFRCxJQUFJLENBQUM7WUFDSixJQUFJLGNBQWMsR0FBRyxRQUFRLENBQUMsQ0FBQyxZQUFZLEVBQUUsRUFBRTtnQkFDOUMsMkNBQTJDO2dCQUMzQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7b0JBQ2YsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUNwQixPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQ3ZCLENBQUM7WUFDRixDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUUsRUFBRTtnQkFDbEIsMENBQTBDO2dCQUMxQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7b0JBQ2YsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUNwQixNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBQ3JCLENBQUM7WUFDRixDQUFDLENBQUMsQ0FBQztZQUVILElBQUksT0FBTyxjQUFjLElBQUksUUFBUSxJQUFJLGNBQWMsS0FBSyxJQUFJLElBQUksT0FBTyxjQUFjLENBQUMsS0FBSyxJQUFJLFVBQVUsRUFBRSxDQUFDO2dCQUMvRyx5QkFBeUI7Z0JBQ3pCLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRTtvQkFDM0IsMkdBQTJHO29CQUMzRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7d0JBQ2YsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUNwQixNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQ1osQ0FBQztnQkFDRixDQUFDLENBQUMsQ0FBQztZQUNKLENBQUM7UUFDRixDQUFDO1FBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQztZQUNiLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDZiwwRUFBMEU7Z0JBQzFFLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDcEIsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ1osQ0FBQztRQUNGLENBQUM7SUFDRixDQUFDLENBQUMsQ0FBQztBQUNKLENBQUMifQ==