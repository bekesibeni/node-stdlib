"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.progressBar = progressBar;
/**
 * Render an ASCII progress bar.
 * @param {number} value - The current value of this progress bar
 * @param {number} maxValue - The value at which the task is considered complete
 * @param {int} barWidth - How wide should the bar be, in characters
 * @param {boolean} [showPercentage=false]
 */
function progressBar(value, maxValue, barWidth, showPercentage = false) {
    barWidth -= 2; // subtract 2 from the width because the enclosing square brackets count toward the total width
    let filledChars = Math.round((value / maxValue) * barWidth);
    let pct = showPercentage ? ' ' + Math.round((value / maxValue) * 100) + '% ' : '';
    let pctPosition = Math.round((barWidth / 2) - (pct.length / 2)) + 1;
    let bar = '';
    for (let i = 1; i <= barWidth; i++) {
        if (pct && i == pctPosition) {
            bar += pct;
            i += pct.length - 1;
            continue;
        }
        if (i == filledChars && value < maxValue) {
            bar += '>';
        }
        else {
            bar += i <= filledChars ? '=' : ' ';
        }
    }
    return `[${bar}]`;
}
const Rendering = {
    progressBar
};
exports.default = Rendering;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVuZGVyaW5nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3JlbmRlcmluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQXVDQyxrQ0FBVztBQXJDWjs7Ozs7O0dBTUc7QUFDSCxTQUFTLFdBQVcsQ0FBQyxLQUFhLEVBQUUsUUFBZ0IsRUFBRSxRQUFnQixFQUFFLGNBQWMsR0FBRyxLQUFLO0lBQzdGLFFBQVEsSUFBSSxDQUFDLENBQUMsQ0FBQywrRkFBK0Y7SUFFOUcsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQztJQUM1RCxJQUFJLEdBQUcsR0FBRyxjQUFjLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQ2xGLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBRXBFLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztJQUNiLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxRQUFRLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUNwQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksV0FBVyxFQUFFLENBQUM7WUFDN0IsR0FBRyxJQUFJLEdBQUcsQ0FBQztZQUNYLENBQUMsSUFBSSxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztZQUNwQixTQUFTO1FBQ1YsQ0FBQztRQUVELElBQUksQ0FBQyxJQUFJLFdBQVcsSUFBSSxLQUFLLEdBQUcsUUFBUSxFQUFFLENBQUM7WUFDMUMsR0FBRyxJQUFJLEdBQUcsQ0FBQztRQUNaLENBQUM7YUFBTSxDQUFDO1lBQ1AsR0FBRyxJQUFJLENBQUMsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO1FBQ3JDLENBQUM7SUFDRixDQUFDO0lBRUQsT0FBTyxJQUFJLEdBQUcsR0FBRyxDQUFDO0FBQ25CLENBQUM7QUFFRCxNQUFNLFNBQVMsR0FBYztJQUM1QixXQUFXO0NBQ1gsQ0FBQztBQU1GLGtCQUFlLFNBQVMsQ0FBQyJ9