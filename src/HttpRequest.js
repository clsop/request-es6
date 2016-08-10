'use strict';

import ResponseHandler from './ResponseHandler';
import SuccessResponse from './Response';
import FailResponse from './FailResponse';
import HttpRequestError from './exceptions/HttpRequestError';
import InvalidFunctionError from './exceptions/InvalidFunctionError';

const eventHook = (promiseType, resolve, reject) => {
    return e => {
        let xhr = e.target;
        let responseHandler = new ResponseHandler(xhr, promiseType);

        switch (promiseType) {
            case 0: resolve(responseHandler.isValidResponse() ? responseHandler.getResponse() : null); break;
            case 0: reject(responseHandler.isValidResponse() ? responseHandler.getResponse() : null); break;
        }
    };
};

export class HttpRequest {
    constructor(url = null, eagerness, useCredentials = false, username = null, password = null) {
        let xhr = new XMLHttpRequest();

        this.url = url;
        this.useCredentials = useCredentials;
        this.username = username;
        this.password = password;
        this.methods = new Set(['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTION']);
        this.promise = new Promise((resolve, reject) => {
            let failed = eventHook(1, resolve, reject);

            xhr.addEventListener('load', eventHook(0, resolve, reject));
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
                this.xhr.timeout = 0;
                break; // whenever
        }
    }

    setUrl(url) {
        this.url = url;
    }

    setHeader(header, value) {
        if (this.headers.has(header)) {
            throw new HttpRequestError('header is already defined');
        }

        this.headers.set(header, value);
    }

    useCreadentials(useThem = true) {
        this.useCreadentials = useThem;
    }

    setProgressHandler(callback = null) {
        if (callback === null || typeof callback !== 'function' || callback.length !== 1) {
            throw new InvalidFunctionError('argument must be a function with one parameter');
        }

        this.xhr.addEventListener('progress', callback);
    }

    then(successCallback = null) {
        if (successCallback === null || typeof successCallback !== 'function') {
            throw new InvalidFunctionError('callback must be a function');
        }

        return this.promise.then(successCallback);
    }

    catch (failCallback = null) {
        if (failCallback === null || typeof failCallback !== 'function') {
            throw new InvalidFunctionError('callback must be a function');
        }

        return this.promise.catch(failCallback);
    }

    cancel() {
        this.xhr.abort();
    }

    send(method = 'GET', data = null) {
        if (this.url === null) {
            throw new HttpRequestError('no url to send request');
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
if (!global && window) {
    let descriptor = Object.create(null);
    Object.defineProperties(descriptor, {
        value: {
            value: HttpRequest
        }
    });
    Object.defineProperty(window, 'HttpRequest', descriptor);
}