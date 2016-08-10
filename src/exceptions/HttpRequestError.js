'use strict';

export default class HttpRequestError extends Error {
	constructor(message, info) {
		super(message);

		this.info = info;
		this.name = 'HttpRequestError';
	}

	toString() {
		return `${this.name}: ${this.message}\r\ninfo: ${this.info}`;
	}
}