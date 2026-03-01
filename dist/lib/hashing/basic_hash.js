"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = hash;
const crypto_1 = require("crypto");
function hash(hashType, input, outputForm = 'hex') {
    if (!Buffer.isBuffer(input)) {
        input = Buffer.from(input.toString(), 'utf8');
    }
    let hash = (0, crypto_1.createHash)(hashType);
    hash.update(input);
    let digest = hash.digest();
    return outputForm == 'buffer' ? digest : digest.toString(outputForm);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWNfaGFzaC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvaGFzaGluZy9iYXNpY19oYXNoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsdUJBU0M7QUFYRCxtQ0FBa0M7QUFFbEMsU0FBd0IsSUFBSSxDQUFDLFFBQWdCLEVBQUUsS0FBb0IsRUFBRSxhQUFzQyxLQUFLO0lBQy9HLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFDN0IsS0FBSyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRCxJQUFJLElBQUksR0FBRyxJQUFBLG1CQUFVLEVBQUMsUUFBUSxDQUFDLENBQUM7SUFDaEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNuQixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDM0IsT0FBTyxVQUFVLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsVUFBNEIsQ0FBQyxDQUFDO0FBQ3hGLENBQUMifQ==