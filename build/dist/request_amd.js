(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
define(['exports', './Response'], function (exports, _Response2) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _Response3 = _interopRequireDefault(_Response2);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var _createClass = function () {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}

		return function (Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);
			if (staticProps) defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}();

	function _possibleConstructorReturn(self, call) {
		if (!self) {
			throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		}

		return call && (typeof call === "object" || typeof call === "function") ? call : self;
	}

	function _inherits(subClass, superClass) {
		if (typeof superClass !== "function" && superClass !== null) {
			throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
		}

		subClass.prototype = Object.create(superClass && superClass.prototype, {
			constructor: {
				value: subClass,
				enumerable: false,
				writable: true,
				configurable: true
			}
		});
		if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}

	var FailResponse = function (_Response) {
		_inherits(FailResponse, _Response);

		function FailResponse() {
			var status = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
			var statusText = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];
			var responseType = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];
			var responseText = arguments.length <= 3 || arguments[3] === undefined ? '' : arguments[3];
			var responseData = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];

			_classCallCheck(this, FailResponse);

			return _possibleConstructorReturn(this, Object.getPrototypeOf(FailResponse).call(this, status, statusText, responseType, responseText, responseData));
		}

		_createClass(FailResponse, [{
			key: 'isServerError',
			value: function isServerError() {
				return this.status === 500;
			}
		}, {
			key: 'isNotFound',
			value: function isNotFound() {
				return this.status === 404;
			}
		}]);

		return FailResponse;
	}(_Response3.default);

	exports.default = FailResponse;
});

},{}],2:[function(require,module,exports){
define(['exports', './ResponseHandler', './Response', './FailResponse', './exceptions/HttpRequestError', './exceptions/InvalidFunctionError'], function (exports, _ResponseHandler, _Response, _FailResponse, _HttpRequestError, _InvalidFunctionError) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _ResponseHandler2 = _interopRequireDefault(_ResponseHandler);

    var _Response2 = _interopRequireDefault(_Response);

    var _FailResponse2 = _interopRequireDefault(_FailResponse);

    var _HttpRequestError2 = _interopRequireDefault(_HttpRequestError);

    var _InvalidFunctionError2 = _interopRequireDefault(_InvalidFunctionError);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var HttpRequest = function () {
        function HttpRequest() {
            var url = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
            var eagerness = arguments[1];
            var username = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
            var password = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

            _classCallCheck(this, HttpRequest);

            var xhr = new XMLHttpRequest();

            this.url = url;
            this.username = username;
            this.password = password;
            this.methods = new Set(['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTION']);
            this.promise = new Promise(function (resolve, reject) {
                xhr.addEventListener('load', function (e) {
                    var xhr = e.target;
                    var responseHandler = new _ResponseHandler2.default(xhr, 0);

                    resolve(responseHandler.getResponse());
                });

                var failed = function failed(e) {
                    var xhr = e.target;
                    var responseHandler = new _ResponseHandler2.default(xhr, 1);

                    reject(responseHandler.getResponse());
                };

                xhr.addEventListener('error', failed);
                xhr.addEventListener('abort', failed);
            });

            this.headers = new Map();
            this.xhr = xhr;
            this.setPatience(eagerness);
        }

        _createClass(HttpRequest, [{
            key: 'setPatience',
            value: function setPatience(eagerness) {
                switch (eagerness) {
                    case 'now':
                        this.xhr.timeout = 100;
                        break;
                    case 'hurry':
                        this.xhr.timeout = 500;
                        break;
                    case 'no_hurry':
                        this.xhr.timeout = 2000;
                        break;
                    case 'patient':
                        this.xhr.timeout = 10000;
                        break;
                    case 'real_patient':
                        this.xhr.timeout = 30000;
                        break;
                    default:
                        this.xhr.timeout = 0;
                        break; // whenever
                }
            }
        }, {
            key: 'setUrl',
            value: function setUrl(url) {
                this.url = url;
            }
        }, {
            key: 'setHeader',
            value: function setHeader(header, value) {
                // TODO: check for header in map to throw accurate exception
                this.headers.set(header, value);
            }
        }, {
            key: 'setProgressHandler',
            value: function setProgressHandler() {
                var callback = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

                if (callback === null || typeof callback !== 'function' || callback.length !== 1) {
                    throw new _InvalidFunctionError2.default('argument must be a function with one parameter');
                }

                this.xhr.addEventListener('progress', callback);
            }
        }, {
            key: 'then',
            value: function then() {
                var successCallback = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
                var failCallback = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

                if (successCallback === null || typeof successCallback !== 'function') {
                    throw new _InvalidFunctionError2.default('callback must be a function');
                }

                return this.promise.then(successCallback, failCallback);
            }
        }, {
            key: 'send',
            value: function send() {
                var _this = this;

                var method = arguments.length <= 0 || arguments[0] === undefined ? 'GET' : arguments[0];
                var data = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

                if (this.url === null) {
                    throw new _HttpRequestError2.default('no url to send request');
                }

                // always async
                this.xhr.open(typeof method === 'string' && this.methods.has(method) ? method : 'GET', this.url, true, this.username, this.password);
                this.headers.forEach(function (val, key) {
                    _this.xhr.setRequestHeader(key, val);
                });

                if (data !== null) this.xhr.send(data);else this.xhr.send();
            }
        }]);

        return HttpRequest;
    }();

    exports.default = HttpRequest;
});

},{}],3:[function(require,module,exports){
define(['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var _createClass = function () {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}

		return function (Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);
			if (staticProps) defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}();

	var Reponse = function () {
		function Reponse() {
			var status = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
			var statusText = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];
			var responseType = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];
			var responseText = arguments.length <= 3 || arguments[3] === undefined ? '' : arguments[3];
			var responseData = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];

			_classCallCheck(this, Reponse);

			if (status === null && !(typeof status === 'number')) {
				throw new TypeError('status must be an unsigned short');
			}

			this.status = status;
			this.statusText = statusText;
			this.responseText = responseText;
			this.responseType = responseType;
			this.responseData = responseData;
		}

		_createClass(Reponse, [{
			key: 'setHeaders',
			value: function setHeaders(headers) {
				this.headers = headers;
			}
		}, {
			key: 'getHeaders',
			value: function getHeaders() {
				return this.headers;
			}
		}, {
			key: 'getStatus',
			value: function getStatus() {
				return this.status;
			}
		}, {
			key: 'getStatusText',
			value: function getStatusText() {
				return this.statusText;
			}
		}, {
			key: 'getResponseText',
			value: function getResponseText() {
				return this.responseText;
			}
		}, {
			key: 'getResponseType',
			value: function getResponseType() {
				return this.responseType;
			}
		}, {
			key: 'getResponseData',
			value: function getResponseData() {
				return this.responseData;
			}
		}]);

		return Reponse;
	}();

	exports.default = Reponse;
});

},{}],4:[function(require,module,exports){
define(['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	function _possibleConstructorReturn(self, call) {
		if (!self) {
			throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		}

		return call && (typeof call === "object" || typeof call === "function") ? call : self;
	}

	function _inherits(subClass, superClass) {
		if (typeof superClass !== "function" && superClass !== null) {
			throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
		}

		subClass.prototype = Object.create(superClass && superClass.prototype, {
			constructor: {
				value: subClass,
				enumerable: false,
				writable: true,
				configurable: true
			}
		});
		if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}

	var HttpRequestError = function (_Error) {
		_inherits(HttpRequestError, _Error);

		function HttpRequestError(message) {
			_classCallCheck(this, HttpRequestError);

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(HttpRequestError).call(this, message));

			_this.name = 'HttpRequestError';
			return _this;
		}

		return HttpRequestError;
	}(Error);

	exports.default = HttpRequestError;
});

},{}],5:[function(require,module,exports){
define(['exports', './HttpRequestError'], function (exports, _HttpRequestError2) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _HttpRequestError3 = _interopRequireDefault(_HttpRequestError2);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var _createClass = function () {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}

		return function (Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);
			if (staticProps) defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}();

	function _possibleConstructorReturn(self, call) {
		if (!self) {
			throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		}

		return call && (typeof call === "object" || typeof call === "function") ? call : self;
	}

	function _inherits(subClass, superClass) {
		if (typeof superClass !== "function" && superClass !== null) {
			throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
		}

		subClass.prototype = Object.create(superClass && superClass.prototype, {
			constructor: {
				value: subClass,
				enumerable: false,
				writable: true,
				configurable: true
			}
		});
		if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}

	var HttpResponseError = function (_HttpRequestError) {
		_inherits(HttpResponseError, _HttpRequestError);

		function HttpResponseError(message, responseType) {
			_classCallCheck(this, HttpResponseError);

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(HttpResponseError).call(this, message));

			_this.name = 'HttpResponseError';
			_this.responseType = responseType;
			return _this;
		}

		_createClass(HttpResponseError, [{
			key: 'getResponseType',
			value: function getResponseType() {
				return this.responseType;
			}
		}]);

		return HttpResponseError;
	}(_HttpRequestError3.default);

	exports.default = HttpResponseError;
});

},{}],6:[function(require,module,exports){
define(['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	function _possibleConstructorReturn(self, call) {
		if (!self) {
			throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		}

		return call && (typeof call === "object" || typeof call === "function") ? call : self;
	}

	function _inherits(subClass, superClass) {
		if (typeof superClass !== "function" && superClass !== null) {
			throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
		}

		subClass.prototype = Object.create(superClass && superClass.prototype, {
			constructor: {
				value: subClass,
				enumerable: false,
				writable: true,
				configurable: true
			}
		});
		if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}

	var InvalidFunctionError = function (_TypeError) {
		_inherits(InvalidFunctionError, _TypeError);

		function InvalidFunctionError(message) {
			_classCallCheck(this, InvalidFunctionError);

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(InvalidFunctionError).call(this, message));

			_this.name = 'InvalidFunctionError';
			return _this;
		}

		return InvalidFunctionError;
	}(TypeError);

	exports.default = InvalidFunctionError;
});

},{}]},{},[3,1,2,6,5,4]);
