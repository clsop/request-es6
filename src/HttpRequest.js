'use strict';

import SuccessResponse from './SuccessResponse';
import FailResponse from './FailResponse';
import HttpRequestError from './exceptions/HttpRequestError';
import InvalidFunctionError from './exceptions/InvalidFunctionError';

export default class HttpRequest {
	constructor(url = null, eagerness, username = null, password = null) {
		let xhr = new XMLHttpRequest();

		this.url = url;
		this.username = username;
		this.password = password;
		this.methods = new Set(['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTION']);

		this.promise = new Promise((resolve, reject) => {
			xhr.addEventListener('load', e => {
				let xhr = e.target;
				let response = new Success(xhr.status, xhr.statusText, xhr.responseType, xhr.responseText, xhr.response);
				response.setHeaders(xhr.getAllResponseHeaders());
				
				resolve(response);
			});
			let failed = e => {
				let xhr = e.target;
				let response = new Fail(xhr.status, xhr.statusText, xhr.responseText);
				response.setHeaders(xhr.getAllResponseHeaders());
				
				reject(response);
			};

			xhr.addEventListener('error', failed);
			xhr.addEventListener('abort', failed);
		});

		this.headers = new Map();
		this.xhr = xhr;
		this.setPatience(eagerness);
	}

	setPatience(eagerness) {
		switch (eagerness) {
			case 'now': this.xhr.timeout = 100; break;
			case 'hurry': this.xhr.timeout = 500; break;
			case 'no_hurry': this.xhr.timeout = 2000; break;
			case 'patient': this.xhr.timeout = 10000; break;
			case 'real_patient': this.xhr.timeout = 30000; break;
			default: this.xhr.timeout = 0; break; // whenever
		}
	}

	setUrl(url) {
		this.url = url;
	}

	setHeader(header, value) {
		this.headers.set(header, value);
	}

	setProgressHandler(callback = null) {
		if (callback === null || typeof callback !== 'function') {
			throw new InvalidFunctionError('callback must be a function');
		}

		this.xhr.addEventListener('progress', callback);
	}

	then(callback = null) {
		if (callback === null || typeof callback !== 'function') {
			throw new InvalidFunctionError('callback must be a function');
		}

		return this.promise.then(callback);
	}

	send(method = 'GET', data = null) {
		if (this.url === null) {
			throw new HttpRequestError('no url to send request');
		}

		// always async
		this.xhr.open(typeof method === 'string' && this.methods.has(method) ? method : 'GET', this.url, true, this.username, this.password);

		this.headers.forEach((val, key) => {
			this.xhr.setRequestHeader(key, val);
		});

		if (data !== null)
			this.xhr.send(data);
		else
			this.xhr.send();
	}
}