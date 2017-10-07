'use strict';

export default class Reponse {
	constructor(status = null, statusText = '', responseType = '', responseText = '', responseData = null) {
		if (status === null && !(typeof status === 'number')) {
			throw new TypeError('status must be a number');
		}

		this.status = status;
		this.statusText = statusText;
		this.responseText = responseText;
		this.responseType = responseType;
		this.responseData = responseData;
	}

	setHeaders(headers) {
		this.headers = headers;
	}

	getHeaders() {
		return this.headers;
	}

	getStatus() {
		return this.status;
	}

	getStatusText() {
		return this.statusText;
	}

	getResponseText() {
		return this.responseText;
	}

	getResponseType() {
		return this.responseType;
	}

	getResponseData() {
		return this.responseData;
	}
}