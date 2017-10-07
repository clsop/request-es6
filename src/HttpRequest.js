'use strict';

import ErrorMessage from './Errors';
import ResponseHandler from './ResponseHandler';
import SuccessResponse from './Response';
import FailResponse from './FailResponse';
import HttpRequestError from './exceptions/HttpRequestError';
import InvalidFunctionError from './exceptions/InvalidFunctionError';

import Config from './Config';

const eventHook = (promiseType, resolver) => {
    return e => {
        let xhr = e.target;
        let responseHandler = new ResponseHandler(xhr);

        resolver(responseHandler.isValidResponse() ? responseHandler.getResponse(promiseType) : null);
    };
};

const validUrl = (url) => {
    return /^(http|https):\/\/(?:w{3}\.)?.+(?:\.).+/.test(url);
};

export class HttpRequest {
    constructor(url = null, eagerness, useCredentials = false, username = null, password = null) {
        let xhr = new XMLHttpRequest();

        Config();

        this.url = url;
        this.useCredentials = useCredentials;
        this.username = username;
        this.password = password;
        this.methods = new Set(['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTION']);
        this.promise = new Promise((resolve, reject) => {
            let failed = eventHook(1, reject);

            xhr.addEventListener('load', eventHook(0, resolve));
            xhr.addEventListener('error', failed);
            xhr.addEventListener('abort', failed);
        });

        this.headers = new Map();
        this.xhr = xhr;
        this.setPatience(eagerness);
    }

    setPatience(eagerness) {
        switch (eagerness) {
            case 'now':
                this.xhr.timeout = 100;
                break;
            case 'hurry':
                this.xhr.timeout = 500;
                break;
            case 'no hurry':
                this.xhr.timeout = 2000;
                break;
            case 'patient':
                this.xhr.timeout = 10000;
                break;
            case 'real patient':
                this.xhr.timeout = 30000;
                break;
            default:
                // whenever
                this.xhr.timeout = 0;
                break;
        }
    }

    setUrl(url) {
        if (!validUrl(url)) {
            throw new HttpRequestError(ErrorMessage.VALID_URL);
        }

        this.url = url;
    }

    setHeader(header, value) {
        if (this.headers.has(header)) {
            throw new HttpRequestError(ErrorMessage.HEADER_DEFINED);
        }

        this.headers.set(header, value);
    }

    useCreadentials(useThem = true) {
        this.useCreadentials = useThem;
    }

    setProgressHandler(callback = null) {
        if (callback === null || typeof callback !== 'function' || callback.length !== 1) {
            throw new InvalidFunctionError(ErrorMessage.FUNCTION_MISSING_PARAM);
        }

        this.xhr.addEventListener('progress', callback);
    }

    then(successCallback = null) {
        if (successCallback === null || typeof successCallback !== 'function') {
            throw new InvalidFunctionError(ErrorMessage.FUNCTION_CALLBACK);
        }

        return this.promise.then(successCallback);
    }

    catch (failCallback = null) {
        if (failCallback === null || typeof failCallback !== 'function') {
            throw new InvalidFunctionError(ErrorMessage.FUNCTION_CALLBACK);
        }

        return this.promise.catch(failCallback);
    }

    cancel() {
        this.xhr.abort();
    }

    send(method = 'GET', data = null) {
        if (!validUrl(this.url)) {
            throw new HttpRequestError(ErrorMessage.VALID_URL);
        }

        // always async
        this.xhr.open(typeof method === 'string' && this.methods.has(method) ? method : 'GET', this.url, true, this.username, this.password);
        this.xhr.withCredentials = this.useCredentials;
        this.headers.forEach((val, key) => {
            this.xhr.setRequestHeader(key, val);
        });

        if (data !== null) this.xhr.send(data);
        else this.xhr.send();
    }
}

// browser env
if (global.window) {
    let descriptor = Object.create(null);
    Object.defineProperties(descriptor, {
        value: {
            value: HttpRequest
        },
        configurable: {
            value: false
        },
        enumerable: {
            value: false
        },
        writable: {
            value: false
        }
    });
    let cfgDescriptor = Object.create(null);
    Object.defineProperties(cfgDescriptor, {
        value: {
            value: Config
        },
        configurable: {
            value: false
        },
        enumerable: {
            value: false
        },
        writable: {
            value: false
        }
    });

    Object.defineProperty(HttpRequest, 'config', cfgDescriptor);
    Object.defineProperty(window, 'Request', descriptor);
}