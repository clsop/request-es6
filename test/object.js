import sinon from 'sinon';
import should from 'should';

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
            req = new HttpRequest(null, 'now');
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
            const error = 'argument must be a function with one parameter';

            test('should not throw exception when callback argument is a valid function', () => {
                (() => req.setProgressHandler((progress) => {})).should.not.throw(error);
            });

            test('should throw exception when callback argument is not a function', () => {
                (() => req.setProgressHandler(42)).should.throw(error);
                (() => req.setProgressHandler(null)).should.throw(error);
                (() => req.setProgressHandler()).should.throw(error);
            });

            test('should throw exception when callback argument does not have exactly one parameter', () => {
                (() => req.setProgressHandler(() => {})).should.throw(error);
            });
        });

        suite('setHeader method', () => {
            test('should add one internal entry', () => {
                req.setHeader('Accept', '*');
                req.headers.should.have.property('size').equal(1);
            });

            test('should throw exception when header is already present', () => {
                req.setHeader('Accept', '*');
                (() => req.setHeader('Accept', 'application/json')).should.throw('header is already defined');
            });
        });

        suite('then method', () => {
            const error = 'callback must be a function';

            test('should throw exception when callback argument is not a function', () => {
                (() => req.then(42)).should.throw(error);
            });

            test('should not throw exception when callback is a valid function', () => {
                (() => req.then(() => {})).should.not.throw(error);
            });
        });

        suite('catch method', () => {
            const error = 'callback must be a function';

            test('should throw exception when callback argument is not a function', () => {
                (() => req.catch(42)).should.throw(error);
            });

            test('should not throw exception when callback argument is a valid function', () => {
                (() => req.catch(() => {})).should.not.throw(error);
            });
        });

        suite('send method', () => {
        	suiteSetup(() => {
        		req = new HttpRequest();
        	});

            test('should throw exception when no url', () => {
                (() => req.send()).should.throw('no url to send request');
            });
        });
    });
})();