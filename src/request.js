'use strict';

class Reponse {
	constructor(status, statusText, reponseText) {
		this.status = status;
		this.statusText = statusText;
		this.responseText = responseText;
	}

	setHeaders(headers) {
		this.headers = headers;
	}

	getResponseText() {
		return this.responseText;
	}
}

//class SuccessResponse extends Response {
class SuccessResponse {
	constructor(status, statusText, responseText, responseType, responseData) {
		//super(status, statusText, responseText);

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

// class FailResponse extends Response {
class FailResponse {
	constructor(status, statusText, responseText) {
		// super(status, statusText, reponseText);
		
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

	getResponseText() {
		return this.responseText;
	}

	getStatus() {
		return this.status;
	}

	getStatusText() {
		return this.statusText;
	}

	isServerError() {
		return this.status === 500;
	}
}

export default class Request {
	constructor(url, eagerness, username = null, password = null) {
		let xhr = new XMLHttpRequest();

		this.url = url;
		this.username = username;
		this.password = password;
		this.methods = new Set(['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTION']);

		this.promise = new Promise((resolve, reject) => {
			xhr.addEventListener('load', e => {
				let xhr = e.target;
				let response = new SuccessResponse(xhr.status, xhr.statusText, xhr.responseText, xhr.responseType, xhr.response);
				response.setHeaders(xhr.getAllResponseHeaders());
				
				resolve(response);
			});
			let failed = e => {
				let xhr = e.target;
				let response = new FailResponse(xhr.status, xhr.statusText, xhr.responseText);
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

	setHeader(header, value) {
		this.headers.set(header, value);
	}

	setProgressHandler(callback) {
		if (typeof callback !== 'function') {
			throw new 'callback must be a function';
		}

		this.xhr.addEventListener('progress', callback);
	}

	then(callback) {
		if (typeof callback !== 'function') {
			throw new 'callback must be a function';
		}

		return this.promise.then(callback);
	}

	sendRequest(method = 'GET', data) {
		// always async
		this.xhr.open(typeof method === 'string' && this.methods.has(method) ? method : 'GET', this.url, true, this.username, this.password);

		this.headers.forEach((val, key) => {
			this.xhr.setRequestHeader(key, val);
		});

		if (data !== undefined && data !== null)
			this.xhr.send(data);
		else
			this.xhr.send();
	}
}