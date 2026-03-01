"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const psl_1 = require("psl");
class Cookie {
    name;
    content;
    domain;
    expires;
    path;
    secure;
    constructor(options) {
        this.name = options.name;
        this.content = options.content;
        this.domain = options.domain;
        this.expires = options.expires;
        this.path = options.path;
        this.secure = options.secure;
    }
    static parse(setCookie, domain) {
        let parts = setCookie.split(';').map(p => p.trim());
        let nameAndValue = parseEqSeparated(parts.splice(0, 1)[0]);
        if (!nameAndValue) {
            return null;
        }
        let [name, content] = nameAndValue;
        let expires = null;
        let path = '/';
        let secure = false;
        if (content.startsWith('"') && content.endsWith('"')) {
            content = content.replace(/(^"|"$)/g, '');
        }
        domain = domain.toLowerCase();
        parts.forEach((attr) => {
            let splitAttr = parseEqSeparated(attr);
            if (!splitAttr) {
                if (attr.trim().toLowerCase() == 'secure') {
                    secure = true;
                }
                return;
            }
            let [attrName, attrValue] = splitAttr;
            switch (attrName.toLowerCase()) {
                case 'domain':
                    if (domain == '__jarimport__') {
                        // we're importing a saved jar, always trust this domain
                        domain = attrValue;
                        break;
                    }
                    attrValue = trimDots(attrValue).toLowerCase();
                    // Cookies can only be set to a specific domain if they aren't a public suffix (checked by isValid),
                    // and if the domain attribute is a subdomain of the request domain.
                    if ((0, psl_1.isValid)(attrValue) && domain.includes(attrValue)) {
                        // Leading dot indicates internally that we send this to subdomains. If no Domain attribute is
                        // provided, then the cookie is not sent to subdomains
                        domain = `.${attrValue}`;
                    }
                    break;
                case 'expires':
                    let date = new Date(attrValue);
                    if (date.toString() != 'Invalid Date') {
                        expires = date;
                    }
                    break;
                case 'path':
                    path = attrValue;
                    break;
            }
        });
        return new Cookie({
            name,
            content,
            domain,
            expires,
            path,
            secure
        });
    }
    stringify() {
        let output = `${this.name}=${this.content}`;
        let attributes = {
            Domain: this.domain,
            Path: this.path
        };
        if (this.expires) {
            attributes.Expires = this.expires.toUTCString();
        }
        attributes = Object.keys(attributes).map(attrName => `${attrName}=${attributes[attrName]}`).join('; ');
        if (this.secure) {
            attributes += '; Secure';
        }
        return `${output}; ${attributes}`;
    }
    shouldSendForRequest(domain, path, secure) {
        if (this.expires && this.expires.getTime() < Date.now()) {
            return false;
        }
        if (this.secure && !secure) {
            return false;
        }
        if (!path.startsWith(this.path)) {
            return false;
        }
        if (this.domain[0] != '.' && domain.toLowerCase() != this.domain) {
            // must be exact domain match
            return false;
        }
        // subdomain match
        if (!domain.toLowerCase().endsWith(this.domain.substring(1))) {
            return false;
        }
        return true;
    }
}
exports.default = Cookie;
function parseEqSeparated(value) {
    let eqIdx = value.trim().indexOf('=');
    if (eqIdx == -1) {
        return null;
    }
    let name = value.slice(0, eqIdx).trim();
    let content = value.slice(eqIdx + 1).trim();
    return [name, content];
}
function trimDots(value) {
    return value.replace(/(^\.|\.$)/g, '');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29va2llLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9odHRwL2NsaWVudC9Db29raWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNEI7QUFXNUIsTUFBcUIsTUFBTTtJQUMxQixJQUFJLENBQVM7SUFDYixPQUFPLENBQVM7SUFDaEIsTUFBTSxDQUFTO0lBQ2YsT0FBTyxDQUFZO0lBQ25CLElBQUksQ0FBUztJQUNiLE1BQU0sQ0FBVTtJQUVoQixZQUFZLE9BQXNCO1FBQ2pDLElBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztRQUN6QixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUM7UUFDL0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO1FBQzdCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQztRQUMvQixJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFDekIsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO0lBQzlCLENBQUM7SUFFRCxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQWlCLEVBQUUsTUFBYztRQUM3QyxJQUFJLEtBQUssR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ3BELElBQUksWUFBWSxHQUFHLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0QsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ25CLE9BQU8sSUFBSSxDQUFDO1FBQ2IsQ0FBQztRQUVELElBQUksQ0FBQyxJQUFJLEVBQUUsT0FB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