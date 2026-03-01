"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Cookie_1 = __importDefault(require("./Cookie"));
class CookieJar {
    #cookies;
    constructor() {
        this.#cookies = [];
    }
    get cookies() {
        return this.#cookies.slice(0);
    }
    add(cookie, domain) {
        if (typeof cookie == 'string') {
            cookie = Cookie_1.default.parse(cookie, domain);
        }
        let cookieObj = cookie;
        // If this matches an existing cookie by name and domain, delete that old one
        let matchingCookie = this.#cookies.findIndex(c => c.name == cookieObj.name && c.domain == cookieObj.domain);
        if (matchingCookie != -1) {
            this.#cookies.splice(matchingCookie, 1);
        }
        this.#cookies.push(cookie);
    }
    remove(cookieName, domain) {
        let matchingCookie = this.#cookies.findIndex(c => c.name == cookieName && c.domain == domain);
        if (matchingCookie != -1) {
            this.#cookies.splice(matchingCookie, 1);
            return true;
        }
        return false;
    }
    getCookieHeaderForUrl(url) {
        let parsedUrl = new URL(url);
        return this.#cookies.filter(cookie => cookie.shouldSendForRequest(parsedUrl.hostname, parsedUrl.pathname, parsedUrl.protocol == 'https:')).map(c => [c.name, c.content].join('=')).join('; ');
    }
    stringify() {
        return JSON.stringify(this.#cookies.map(c => c.stringify()));
    }
    static parse(stringifiedJar) {
        let jar = new CookieJar();
        JSON.parse(stringifiedJar)
            .map(cookieString => Cookie_1.default.parse(cookieString, '__jarimport__'))
            .filter(v => v)
            .forEach(cookie => jar.add(cookie, cookie.domain));
        return jar;
    }
}
exports.default = CookieJar;
Object.defineProperty(CookieJar.prototype, 'cookies', { enumerable: true });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29va2llSmFyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9odHRwL2NsaWVudC9Db29raWVKYXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxzREFBOEI7QUFFOUIsTUFBcUIsU0FBUztJQUM3QixRQUFRLENBQVc7SUFFbkI7UUFDQyxJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztJQUNwQixDQUFDO0lBRUQsSUFBSSxPQUFPO1FBQ1YsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBRUQsR0FBRyxDQUFDLE1BQXFCLEVBQUUsTUFBYztRQUN4QyxJQUFJLE9BQU8sTUFBTSxJQUFJLFFBQVEsRUFBRSxDQUFDO1lBQy9CLE1BQU0sR0FBRyxnQkFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDdkMsQ0FBQztRQUVELElBQUksU0FBUyxHQUFVLE1BQU0sQ0FBQztRQUU5Qiw2RUFBNkU7UUFDN0UsSUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLFNBQVMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLE1BQU0sSUFBSSxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDNUcsSUFBSSxjQUFjLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUMxQixJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDekMsQ0FBQztRQUVELElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRCxNQUFNLENBQUMsVUFBa0IsRUFBRSxNQUFjO1FBQ3hDLElBQUksY0FBYyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxVQUFVLElBQUksQ0FBQyxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsQ0FBQztRQUM5RixJQUFJLGNBQWMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQzFCLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN4QyxPQUFPLElBQUksQ0FBQztRQUNiLENBQUM7UUFFRCxPQUFPLEtBQUssQ0FBQztJQUNkLENBQUM7SUFFRCxxQkFBcUIsQ0FBQyxHQUFXO1FBQ2hDLElBQUksU0FBUyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzdCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQzFCLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLG9CQUFvQixDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsUUFBUSxJQUFJLFFBQVEsQ0FBQyxDQUM3RyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFRCxTQUFTO1FBQ1IsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBRUQsTUFBTSxDQUFDLEtBQUssQ0FBQyxjQUFzQjtRQUNsQyxJQUFJLEdBQUcsR0FBRyxJQUFJLFNBQVMsRUFBRSxDQUFDO1FBQzFCLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDO2FBQ3hCLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLGdCQUFNLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRSxlQUFlLENBQUMsQ0FBQzthQUNoRSxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7YUFDZCxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUVwRCxPQUFPLEdBQUcsQ0FBQztJQUNaLENBQUM7Q0FDRDtBQXpERCw0QkF5REM7QUFFRCxNQUFNLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLEVBQUMsVUFBVSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUMifQ==