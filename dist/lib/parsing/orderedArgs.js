"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = orderedArgs;
/**
 * Parse an ordered args string. For example, this string:
 * one two "three three" four\ four five
 * is parsed into: ["one", "two", "three three", "four four", "five"]
 * Double spaces between args are removed. But empty args in quotes are preserved.
 * @param {string} input
 * @return {string[]}
 */
function orderedArgs(input) {
    let buf = '', args = [], quoted = false, argWasQuoted = false, escaped = false, c;
    for (let i = 0; i < input.length; i++) {
        c = input.charAt(i);
        if (c == ' ' && !quoted && !escaped) {
            // end of current arg
            if (buf.length > 0 || argWasQuoted) {
                // ignore empty ones e.g. "one  two" should be ["one", "two"] and not ["one", "", "two"]
                args.push(buf);
            }
            buf = '';
            argWasQuoted = false;
        }
        else if (c == '"' && !escaped) {
            // beginning or end of a quoted arg
            quoted = !quoted;
            argWasQuoted = quoted ? true : argWasQuoted;
        }
        else if (c == '\\' && !escaped) {
            // next character is escaped
            escaped = true;
        }
        else {
            // middle of an arg, push its character onto the buffer
            escaped = false;
            buf += c;
        }
    }
    // if there's anything left over, push it as an arg
    if (buf.length > 0) {
        args.push(buf);
    }
    return args;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JkZXJlZEFyZ3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3BhcnNpbmcvb3JkZXJlZEFyZ3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFRQSw4QkF1Q0M7QUEvQ0Q7Ozs7Ozs7R0FPRztBQUNILFNBQXdCLFdBQVcsQ0FBQyxLQUFhO0lBQ2hELElBQUksR0FBRyxHQUFHLEVBQUUsRUFDWCxJQUFJLEdBQVksRUFBRSxFQUNsQixNQUFNLEdBQUcsS0FBSyxFQUNkLFlBQVksR0FBRyxLQUFLLEVBQ3BCLE9BQU8sR0FBRyxLQUFLLEVBQ2YsQ0FBUSxDQUFDO0lBRVYsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUN2QyxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVwQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNyQyxxQkFBcUI7WUFDckIsSUFBSSxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxZQUFZLEVBQUUsQ0FBQztnQkFDcEMsd0ZBQXdGO2dCQUN4RixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2hCLENBQUM7WUFDRCxHQUFHLEdBQUcsRUFBRSxDQUFDO1lBQ1QsWUFBWSxHQUFHLEtBQUssQ0FBQztRQUN0QixDQUFDO2FBQU0sSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDakMsbUNBQW1DO1lBQ25DLE1BQU0sR0FBRyxDQUFDLE1BQU0sQ0FBQztZQUNqQixZQUFZLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQztRQUM3QyxDQUFDO2FBQU0sSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDbEMsNEJBQTRCO1lBQzVCLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDaEIsQ0FBQzthQUFNLENBQUM7WUFDUCx1REFBdUQ7WUFDdkQsT0FBTyxHQUFHLEtBQUssQ0FBQztZQUNoQixHQUFHLElBQUksQ0FBQyxDQUFDO1FBQ1YsQ0FBQztJQUNGLENBQUM7SUFFRCxtREFBbUQ7SUFDbkQsSUFBSSxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDaEIsQ0FBQztJQUVELE9BQU8sSUFBSSxDQUFDO0FBQ2IsQ0FBQyJ9