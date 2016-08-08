'use strict';

import Response from './Response';

export default class FailResponse extends Response {
	constructor(status = null, statusText = '', responseType = '', responseText = '', responseData = null) {
		 super(status, statusText, responseType, responseText, responseData);
	}

	isServerError() {
		return this.status === 500;
	}

	isNotFound() {
		return this.status === 404;
	}
}