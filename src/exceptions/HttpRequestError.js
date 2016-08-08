'use strict';

export default class HttpRequestError extends Error {
	constructor(message) {
		super(message);

		this.name = 'HttpRequestError';
	}
}