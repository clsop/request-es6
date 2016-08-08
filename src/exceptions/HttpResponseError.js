'use strict';

import HttpRequestError from './HttpRequestError';

export default class HttpResponseError extends HttpRequestError {
	constructor(message, responseType) {
		super(message);

		this.name = 'HttpResponseError';
		this.responseType = responseType;
	}

	getResponseType() {
		return this.responseType;
	}
}