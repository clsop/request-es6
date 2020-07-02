import _config from './vars/config';

export default (options) => {
	if (options === undefined || typeof options !== 'object') {
        return;
	}

	let optionNames = Object.getOwnPropertyNames(options);

	if (optionNames.length === 0) {
		return;
    }

    for (var index in optionNames) {
    	let optionName = optionNames[index];
    	_config[optionName] = options[optionName];
    }
};