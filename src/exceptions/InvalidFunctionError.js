'use strict';

export default class InvalidFunctionError extends TypeError {
	constructor(message) {
		super(message);

		this.name = 'InvalidFunctionError';
	}
}