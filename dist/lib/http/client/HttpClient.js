"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.preProcessOptions = preProcessOptions;
const events_1 = require("events");
const http_1 = require("http");
const https_1 = require("https");
const querystring_1 = require("querystring");
const zlib_1 = require("zlib");
const objects_1 = require("../../../objects");
const promises_1 = require("../../../promises");
const CookieJar_1 = __importDefault(require("./CookieJar"));
const crypto_1 = require("crypto");
const BODY_TYPES = ['body', 'urlEncodedForm', 'multipartForm', 'json'];
const METHODS_WITHOUT_BODY = ['GET', 'HEAD', 'OPTIONS', 'TRACE'];
const UTF8_PARSEABLE_CONTENT_TYPES = [
    // text/* is always considered parseable
    'application/json',
    'application/x-www-form-urlencoded',
    'application/xml',
    'application/xhtml+xml',
    'message/http' // for TRACE responses
];
const REDIRECT_STATUS_CODES = [301, 302, 303, 307, 308];
class HttpClient extends events_1.EventEmitter {
    cookieJar;
    userAgent;
    #httpAgent;
    #httpsAgent;
    #localAddress;
    #defaultHeaders;
    #defaultTimeout;
    #gzip;
    constructor(options) {
        super();
        options = options || {};
        this.userAgent = options.userAgent;
        this.#httpAgent = options.httpAgent || new http_1.Agent({ keepAlive: true });
        this.#httpsAgent = options.httpsAgent || new https_1.Agent({ keepAlive: true });
        this.#localAddress = options.localAddress;
        this.#defaultHeaders = normalizeHeadersObject(options.defaultHeaders || {});
        this.#defaultTimeout = options.defaultTimeout || 0;
        this.#gzip = options.gzip !== false;
        if (options.cookieJar) {
            this.cookieJar = options.cookieJar === true ? new CookieJar_1.default() : options.cookieJar;
        }
    }
    request(options) {
        let timeout = options.timeout || this.#defaultTimeout || 0;
        return (0, promises_1.timeoutPromise)(timeout, (resolve, reject) => {
            options = preProcessOptions(options);
            createRequestBody(options);
            let nodeOptions = this.#decodeRequestOptions(options);
            let reqFunc = nodeOptions.protocol == 'http:' ? http_1.request : https_1.request;
            this.emit('debug', 'request', `${nodeOptions.method} ${buildUrl(nodeOptions)}`, nodeOptions.headers);
            let req = reqFunc(nodeOptions, (res) => {
                let bodyChunks = [];
                let responseStream = res;
                if (res.headers['content-encoding'] == 'gzip') {
                    this.emit('debug', 'decompressing gzipped response');
                    let gzipStream = (0, zlib_1.createGunzip)();
                    responseStream.pipe(gzipStream);
                    responseStream = gzipStream;
                }
                responseStream.on('data', chunk => bodyChunks.push(chunk));
                responseStream.on('end', () => {
                    let response = {
                        statusCode: res.statusCode,
                        statusMessage: res.statusMessage,
                        url: buildUrl(nodeOptions),
                        headers: res.headers,
                        rawBody: Buffer.concat(bodyChunks)
                    };
                    this.emit('debug', 'response', `${nodeOptions.method} ${buildUrl(nodeOptions)} ${res.statusCode} ${res.statusMessage} ${res.headers['content-type']}`);
                    if (this.cookieJar) {
                        let setCookieHeader = response.headers['set-cookie'] || [];
                        if (!Array.isArray(setCookieHeader)) {
                            setCookieHeader = [setCookieHeader];
                        }
                        setCookieHeader.forEach((setCookie) => {
                            this.cookieJar.add(setCookie, nodeOptions.host);
                        });
                    }
                    let contentType = (res.headers['content-type'] || '').split(';')[0].trim();
                    if (contentType.startsWith('text/') || UTF8_PARSEABLE_CONTENT_TYPES.includes(contentType)) {
                        response.textBody = response.rawBody.toString('utf8');
                    }
                    if (contentType == 'application/json') {
                        try {
                            response.jsonBody = JSON.parse(response.textBody);
                        }
                        catch (ex) {
                            // don't care
                        }
                    }
                    if (options.followRedirects && REDIRECT_STATUS_CODES.includes(res.statusCode) && res.headers.location) {
                        let newRequest = (0, objects_1.clone)(options);
                        if ([301, 302, 303].includes(res.statusCode)) {
                            // Change the method to GET
                            newRequest.method = 'GET';
                            newRequest.url = res.headers.location;
                            delete newRequest.body;
                            delete newRequest.headers['content-type'];
                            delete newRequest.headers['content-length'];
                            this.request(newRequest).then(resolve).catch(reject);
                            return;
                        }
                    }
                    resolve(response);
                });
                res.on('error', reject);
            });
            req.end(options.body);
            req.on('error', reject);
        });
    }
    #decodeRequestOptions(options) {
        let nodeOptions = {};
        let url = new URL(options.url);
        let queryString = url.search;
        if (options.queryString) {
            if (queryString.length == 0) {
                queryString += '?';
            }
            if (!queryString.endsWith('?')) {
                // If the final character of our query string isn't "?", then we need to append a "&" to separate our new
                // options from existing options.
                queryString += '&';
            }
            queryString += (0, querystring_1.stringify)(options.queryString);
        }
        nodeOptions.protocol = url.protocol;
        nodeOptions.host = url.hostname;
        nodeOptions.port = getPort(url.port, url.protocol);
        nodeOptions.path = url.pathname + queryString;
        nodeOptions.method = options.method;
        nodeOptions.agent = url.protocol == 'http:' ? this.#httpAgent : this.#httpsAgent;
        nodeOptions.localAddress = this.#localAddress;
        nodeOptions.headers = {
            ...({ 'user-agent': this.userAgent }),
            ...this.#defaultHeaders,
            ...(options.headers || {})
        };
        if (this.cookieJar) {
            let cookieHeaderValue = this.cookieJar.getCookieHeaderForUrl(options.url);
            if (cookieHeaderValue.length > 0) {
                let existingCookieHeader = options.headers.cookie;
                nodeOptions.headers.cookie = (existingCookieHeader ? `${existingCookieHeader}; ` : '') + cookieHeaderValue;
            }
        }
        if (this.#gzip) {
            nodeOptions.headers['accept-encoding'] = 'gzip';
        }
        if (typeof options.rejectUnauthorized == 'boolean') {
            nodeOptions.rejectUnauthorized = options.rejectUnauthorized;
        }
        for (let i in nodeOptions.headers) {
            // remove undefined values from headers
            if (typeof nodeOptions.headers[i] == 'undefined') {
                delete nodeOptions.headers[i];
            }
        }
        return nodeOptions;
    }
    static simpleObjectToMultipartForm(obj) {
        let multipartForm = {};
        for (let i in obj) {
            multipartForm[i] = { content: obj[i] };
        }
        return multipartForm;
    }
}
exports.default = HttpClient;
function getPort(portStr, protocol) {
    let port = parseInt(portStr);
    if (isNaN(port) || port == 0) {
        return protocol == 'http:' ? 80 : 443;
    }
    return port;
}
function preProcessOptions(options) {
    // deep-clone the object so we don't cause any problems with implementation code
    options = (0, objects_1.clone)(options);
    options.method = options.method.toUpperCase();
    options.headers = options.headers || {};
    // lowercase all the header names
    options.headers = normalizeHeadersObject(options.headers);
    // Only 1 body type may be specified. If more than 1 is present, that's an error.
    if (BODY_TYPES.filter(bt => typeof options[bt] != 'undefined').length > 1) {
        throw new Error('Multiple body types were specified. Only 1 of body, urlEncodedForm, multipartForm, json may be specified');
    }
    return options;
}
function createRequestBody(options) {
    let bodyBuffer = Buffer.alloc(0);
    if (options.body) {
        bodyBuffer = Buffer.isBuffer(options.body) ? options.body : Buffer.from(options.body, 'utf8');
    }
    if (options.urlEncodedForm) {
        bodyBuffer = Buffer.from((0, querystring_1.stringify)(options.urlEncodedForm), 'utf8');
        options.headers['content-type'] = 'application/x-www-form-urlencoded';
    }
    if (options.json) {
        bodyBuffer = Buffer.from(JSON.stringify(options.json), 'utf8');
        options.headers['content-type'] = 'application/json';
    }
    if (options.multipartForm) {
        let boundary = '-----------------------------' + (0, crypto_1.randomBytes)(20).toString('hex');
        options.headers['content-type'] = `multipart/form-data; boundary=${boundary}`;
        let encodedBodyParts = [];
        for (let i in options.multipartForm) {
            let formObject = options.multipartForm[i];
            let head = `--${boundary}\r\nContent-Disposition: form-data; name="${i}"` +
                (formObject.filename ? `; filename="${formObject.filename}"` : '') +
                (formObject.contentType ? `\r\nContent-Type: ${formObject.contentType}` : '') +
                '\r\n\r\n';
            let tail = '\r\n';
            encodedBodyParts = encodedBodyParts.concat([
                Buffer.from(head, 'utf8'),
                Buffer.isBuffer(formObject.content) ? formObject.content : Buffer.from(formObject.content, 'utf8'),
                Buffer.from(tail, 'utf8')
            ]);
        }
        encodedBodyParts.push(Buffer.from(`--${boundary}--\r\n`, 'utf8'));
        bodyBuffer = Buffer.concat(encodedBodyParts);
    }
    if (METHODS_WITHOUT_BODY.includes(options.method)) {
        if (bodyBuffer.length > 0) {
            throw new Error(`Requests with method "${options.method}" may not have a request body`);
        }
        delete options.headers['content-type'];
        delete options.headers['content-length'];
        return;
    }
    delete options.urlEncodedForm;
    delete options.json;
    delete options.multipartForm;
    options.body = bodyBuffer;
    options.headers['content-length'] = options.body.length;
}
function buildUrl(urlObj) {
    let portAppend = (urlObj.protocol == 'http:' && urlObj.port != 80) ||
        (urlObj.protocol == 'https:' && urlObj.port != 443);
    return `${urlObj.protocol}//${urlObj.host}${portAppend ? `:${urlObj.port}` : ''}${urlObj.path}`;
}
function normalizeHeadersObject(headersObj) {
    headersObj = headersObj || {};
    let normalizedHeaders = {};
    for (let i in headersObj) {
        let nameLower = i.toLowerCase();
        if (normalizedHeaders[nameLower]) {
            throw new Error(`Header "${nameLower}" appears in the headers object multiple times, with different capitalization`);
        }
        normalizedHeaders[nameLower] = headersObj[i];
    }
    return normalizedHeaders;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSHR0cENsaWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvaHR0cC9jbGllbnQvSHR0cENsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQXNOQSw4Q0FlQztBQXJPRCxtQ0FBb0M7QUFDcEMsK0JBQWdFO0FBQ2hFLGlDQUF5RztBQUN6Ryw2Q0FBMkQ7QUFDM0QsK0JBQWtDO0FBR2xDLDhDQUF1QztBQUN2QyxnREFBaUQ7QUFDakQsNERBQW9DO0FBRXBDLG1DQUFtQztBQUVuQyxNQUFNLFVBQVUsR0FBRyxDQUFDLE1BQU0sRUFBRSxnQkFBZ0IsRUFBRSxlQUFlLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDdkUsTUFBTSxvQkFBb0IsR0FBRyxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ2pFLE1BQU0sNEJBQTRCLEdBQUc7SUFDcEMsd0NBQXdDO0lBQ3hDLGtCQUFrQjtJQUNsQixtQ0FBbUM7SUFDbkMsaUJBQWlCO0lBQ2pCLHVCQUF1QjtJQUN2QixjQUFjLENBQUMsc0JBQXNCO0NBQ3JDLENBQUM7QUFDRixNQUFNLHFCQUFxQixHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBRXhELE1BQXFCLFVBQVcsU0FBUSxxQkFBWTtJQUNuRCxTQUFTLENBQWE7SUFDdEIsU0FBUyxDQUFVO0lBRW5CLFVBQVUsQ0FBWTtJQUN0QixXQUFXLENBQWE7SUFDeEIsYUFBYSxDQUFVO0lBQ3ZCLGVBQWUsQ0FBa0M7SUFDakQsZUFBZSxDQUFTO0lBQ3hCLEtBQUssQ0FBVTtJQUVmLFlBQVksT0FBMkI7UUFDdEMsS0FBSyxFQUFFLENBQUM7UUFFUixPQUFPLEdBQUcsT0FBTyxJQUFJLEVBQUUsQ0FBQztRQUV4QixJQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUM7UUFDbkMs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