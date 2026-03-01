"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getProxyAgent;
const http_1 = require("http");
const https_1 = require("https");
const tls_1 = require("tls");
/**
 * Get an Agent that connects through a proxy.
 * @param {boolean} secure - Will the connection to the destination server be secure? NOT the connection to the proxy.
 * @param {string|null} proxyUrl - The URL of the proxy, including the protocol, auth (if applicable), host, and port
 * @param {int} [proxyTimeout=5000] - Timeout for connecting to the proxy, in milliseconds
 * @returns {HttpAgent|HttpsAgent|boolean}
 */
function getProxyAgent(secure, proxyUrl, proxyTimeout = 5000) {
    if (!proxyUrl) {
        return false; // no need to use an agent
    }
    let agent = new (secure ? https_1.Agent : http_1.Agent)({ keepAlive: false });
    // @ts-ignore
    agent.createConnection = function (options, callback) {
        let url = new URL(proxyUrl);
        let prox = {
            protocol: url.protocol,
            host: url.hostname,
            port: url.port
        };
        prox.method = 'CONNECT';
        prox.path = options.host + ':' + options.port; // the host where we want the proxy to connect
        prox.localAddress = options.localAddress;
        if (url.username) {
            prox.headers = {
                'Proxy-Authorization': `Basic ${(Buffer.from(`${url.username}:${url.password || ''}`, 'utf8')).toString('base64')}`
            };
        }
        // Make the CONNECT request
        let finished = false;
        let didWeEverConnect = false;
        let req = (prox.protocol == 'https:' ? https_1.request : http_1.request)(prox);
        req.end();
        req.setTimeout(proxyTimeout);
        req.on('connect', (res, socket) => {
            didWeEverConnect = true;
            if (finished) {
                // This has already errored
                socket.end();
                return;
            }
            finished = true;
            req.setTimeout(0);
            if (res.statusCode != 200) {
                callback(new Error(`Proxy CONNECT ${res.statusCode} ${res.statusMessage}`));
                return;
            }
            if (!secure) {
                // The connection to the destination server won't be secure, so we're done here
                callback(null, socket);
                return;
            }
            let tlsOptions = { socket };
            for (let i in options) {
                if (i.match(/^_/) || ['agent', 'headers'].includes(i)) {
                    // Ignore private properties, and "agent" and "headers"
                    continue;
                }
                tlsOptions[i] = options[i];
            }
            // The connection to the destination server needs to be secure, so do the TLS handshake with the destination
            let tlsSocket = (0, tls_1.connect)(tlsOptions, () => {
                tlsSocket.removeListener('error', onTlsError); // we don't want to intercept errors later on
                if (!tlsSocket.authorized && tlsOptions.rejectUnauthorized !== false && process.env.NODE_TLS_REJECT_UNAUTHORIZED !== '0') {
                    // Checking this isn't strictly necessary as all versions of Node since 2013 won't call this callback in this case
                    // (or perhaps all versions of node ever that have TLSSocket?)
                    callback(tlsSocket.authorizationError || new Error('Secure connection failed'));
                    return;
                }
                // All good!
                callback(null, tlsSocket);
            });
            tlsSocket.on('error', onTlsError);
            function onTlsError(err) {
                // TLS handshake error
                socket.end();
                err.proxyConnecting = !didWeEverConnect;
                callback(err);
            }
        });
        req.on('timeout', () => {
            if (finished) {
                return;
            }
            finished = true;
            let err = new Error('Proxy connection timed out');
            err.proxyConnecting = !didWeEverConnect;
            callback(err);
        });
        req.on('error', (err) => {
            if (finished) {
                return;
            }
            finished = true;
            err.proxyConnecting = !didWeEverConnect;
            callback(err);
        });
    };
    return agent;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJveHlhZ2VudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvaHR0cC9wcm94eWFnZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBV0EsZ0NBK0dDO0FBMUhELCtCQUFzRztBQUN0RyxpQ0FBbUU7QUFDbkUsNkJBQWdHO0FBRWhHOzs7Ozs7R0FNRztBQUNILFNBQXdCLGFBQWEsQ0FBQyxNQUFlLEVBQUUsUUFBZ0IsRUFBRSxZQUFZLEdBQUcsSUFBSTtJQUMzRixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDZixPQUFPLEtBQUssQ0FBQyxDQUFDLDBCQUEwQjtJQUN6QyxDQUFDO0lBRUQsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsYUFBVSxDQUFDLENBQUMsQ0FBQyxZQUFTLENBQUMsQ0FBQyxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO0lBQ3RFLGFBQWE7SUFDYixLQUFLLENBQUMsZ0JBQWdCLEdBQUcsVUFBUyxPQUFZLEVBQUUsUUFBYTtRQUM1RCxJQUFJLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM1QixJQUFJLElBQUksR0FBc0I7WUFDN0IsUUFBUSxFQUFFLEdBQUcsQ0FBQyxRQUFRO1lBQ3RCLElBQUksRUFBRSxHQUFHLENBQUMsUUFBUTtZQUNsQixJQUFJLEVBQUUsR0FBRyxDQUFDLElBQUk7U0FDZCxDQUFDO1FBRUYsSUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7UUFDeEIsSUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxHQUFHLEdBQUcsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsOENBQThDO1FBQzdGLElBQUksQ0FBQyxZQUFZLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQztRQUN6QyxJQUFJLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNsQixJQUFJLENBQUMs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