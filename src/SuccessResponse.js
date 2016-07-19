'use strict';

import Response from './Response';

export default class SuccessResponse extends Response {
	constructor(status, statusText, responseType, responseText = null, responseData = null) {
		super(status, statusText, responseText);

		this.responseType = responseType;
		this.responseData = responseData;
	}

	getResponseType() {
		return this.responseType;
	}

	getResponseData() {
		return this.responseData;
	}
}