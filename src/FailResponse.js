'use strict';

import Response from './Response';

export default class FailResponse extends Response {
	constructor(status, statusText, responseText) {
		 super(status, statusText, reponseText);
	}

	isServerError() {
		return this.status === 500;
	}
}