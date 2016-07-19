'use strict';

export default class Reponse {
	constructor(status, statusText, responseText = null) {
		if ((!status || !statusText) && !(status instanceof Number)) {
			throw new TypeError('status must be an unsigned short');
		}

		this.status = status;
		this.statusText = statusText;
		this.responseText = responseText;
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
}