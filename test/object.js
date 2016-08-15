import sinon from 'sinon';
import should from 'should';

import ErrorMessage from '../src/Errors';
import {
    HttpRequest
} from '../src/HttpRequest';

export default (() => {
    suite('object tests', () => {
        let requests = [];
        let req;

        suiteSetup(() => {
            global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
            global.XMLHttpRequest.onCreate = req => {
                requests.push(req);
            };
        });

        suiteTeardown(() => {
            global.XMLHttpRequest.restore();
        });

        setup(() => {
            req = new HttpRequest();
            req.setPatience('now');
        });

        suite('setPatience method', () => {
            test('should use whenever eagerness when no argument', () => {
                req.setPatience();
                req.xhr.timeout.should.equal(0).and.be.a.Number();
            });

            test('should be able to set eagerness', () => {
                req.setPatience('no hurry');
                req.xhr.timeout.should.equal(2000).and.be.a.Number();
            });
        });

        suite('setProgressHandler method', () => {
            test('should not throw exception when callback argument is a valid function', () => {
                (() => req.setProgressHandler((progress) => {})).should.not.throw(ErrorMessage.FUNCTION_MISSING_PARAM);
            });

            test('should throw exception when callback argument is not a function', () => {
                (() => req.setProgressHandler(42)).should.throw(ErrorMessage.FUNCTION_MISSING_PARAM);
                (() => req.setProgressHandler(null)).should.throw(ErrorMessage.FUNCTION_MISSING_PARAM);
                (() => req.setProgressHandler()).should.throw(ErrorMessage.FUNCTION_MISSING_PARAM);
            });

            test('should throw exception when callback argument does not have exactly one parameter', () => {
                (() => req.setProgressHandler(() => {})).should.throw(ErrorMessage.FUNCTION_MISSING_PARAM);
            });
        });

        suite('setHeader method', () => {
            test('should add one internal entry', () => {
                req.setHeader('Accept', '*');
                req.headers.should.have.property('size').equal(1);
            });

            test('should throw exception when header is already present', () => {
                req.setHeader('Accept', '*');
                (() => req.setHeader('Accept', 'application/json')).should.throw(ErrorMessage.HEADER_DEFINED);
            });
        });

        suite('then method', () => {
            test('should throw exception when callback argument is not a function', () => {
                (() => req.then(42)).should.throw(ErrorMessage.FUNCTION_CALLBACK);
            });

            test('should not throw exception when callback is a valid function', () => {
                (() => req.then(() => {})).should.not.throw(ErrorMessage.FUNCTION_CALLBACK);
            });
        });

        suite('catch method', () => {
            test('should throw exception when callback argument is not a function', () => {
                (() => req.catch(42)).should.throw(ErrorMessage.FUNCTION_CALLBACK);
            });

            test('should not throw exception when callback argument is a valid function', () => {
                (() => req.catch(() => {})).should.not.throw(ErrorMessage.FUNCTION_CALLBACK);
            });
        });

        suite('setUrl method', () => {
        	test('should throw exception when non url', () => {
        		(() => req.setUrl()).should.throw(ErrorMessage.VALID_URL);
        		(() => req.setUrl(null)).should.throw(ErrorMessage.VALID_URL);
        		(() => req.setUrl(undefined)).should.throw(ErrorMessage.VALID_URL);
        		(() => req.setUrl('')).should.throw(ErrorMessage.VALID_URL);
        		(() => req.setUrl('file://fakeRequest')).should.throw(ErrorMessage.VALID_URL);
        		(() => req.setUrl('http://fakeRequest')).should.throw(ErrorMessage.VALID_URL);
        	});

        	test('should not throw exception when valid url', () => {
        		(() => req.setUrl('http://fakeRequest.local')).should.not.throw(ErrorMessage.VALID_URL);
        	});
        });

        suite('send method', () => {
        	test('should not throw exception when valid url', () => {
                (() => {
                	req.setUrl('http://fakeRequest.local');
                	req.send();
                }).should.not.throw(ErrorMessage.VALID_URL);
                (() => {
                	req.setUrl('http://www.fakeRequest.com');
                	req.send();
                }).should.not.throw(ErrorMessage.VALID_URL);
                (() => {
                	req.setUrl('https://www.fakeRequest.org');
                	req.send();
                }).should.not.throw(ErrorMessage.VALID_URL);
            });

            test('should throw exception when no url', () => {
            	(() => {
            		req.setUrl();
            		req.send();
            	}).should.throw(ErrorMessage.VALID_URL);
            	(() => {
            		req.setUrl(null);
            		req.send();
            	}).should.throw(ErrorMessage.VALID_URL);
            	(() => {
            		req.setUrl(undefined);
            		req.send();
            	}).should.throw(ErrorMessage.VALID_URL);
            	(() => {
            		req.setUrl('');
            		req.send();
            	}).should.throw(ErrorMessage.VALID_URL);
            });

            test('should throw exception when url is not valid (non url)', () => {
            	(() => {
            		req.setUrl('file://fakeRequest');
            		req.send();
            	}).should.throw(ErrorMessage.VALID_URL);
            	(() => {
            		req.setUrl('http://fakeRequest');
            		req.send();
            	}).should.throw(ErrorMessage.VALID_URL);
            });
        });
    });
})();