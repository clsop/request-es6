'use strict';

import ErrorMessage from './Errors';
import SuccessResponse from './Response';
import FailResponse from './FailResponse';
import HttpResponseError from './exceptions/HttpResponseError';

const formHeaders = (xhr) => {
    let allHeaders = xhr.getAllResponseHeaders();

    if (allHeaders !== null) {
        let headers = new Map();
        let rawHeaders = allHeaders.split('\r\n');
        rawHeaders.pop(); // remove last empty entry

        rawHeaders.forEach((rawHeader) => {
            let header = rawHeader.split(':', 2);
            headers.set(header[0], header[1].trimLeft());
        });

        return headers;
    }
};

/**
 * Handling data that goes onto a response
 */
export default class ResponseHandler {
    /**
     * Prepares data for Response class
     * @param  {XmlHttpRequest} xhr the XmlHttpRequest in DONE state
     * @return {void}
     */
    constructor(xhr) {
        this.xhr = xhr;
    }

    isValidResponse() {
        return this.xhr.status !== 0 && this.xhr.readyState === 4;
    }

    getResponse(promiseType) {
        //let contentType = this.xhr.getResponseHeader('Content-Type');
        let response = null;
        
        // switch (contentType) {
        //     case 'text/plain':
        //         this.xhr.responseType = 'text';
        //         break;
        //     case 'text/html':
        //     case 'text/xml':
        //     case 'application/xml':
        //         this.xhr.responseType = 'document';
        //         break;
        //     case 'application/json':
        //         this.xhr.responseType = 'json';
        //         break;
        // }

        switch (promiseType) {
        	case 0: response = new SuccessResponse(this.xhr.status, this.xhr.statusText, this.xhr.responseType, this.xhr.responseText,
                    this.xhr.responseType === 'document' ? this.xhr.responseXML : this.xhr.response); break;
        	case 1: response = new FailResponse(this.xhr.status, this.xhr.statusText, this.xhr.responseType, this.xhr.responseText,
                    this.xhr.responseType === 'document' ? this.xhr.responseXML : this.xhr.response); break;
        }

        response.setHeaders(formHeaders(this.xhr));
        return response;
    }
}