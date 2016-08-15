import sinon from 'sinon';
import should from 'should';

import {
    HttpRequest
} from '../src/HttpRequest';
import Response from '../src/Response';

export default (() => {
    suite('common request tests', () => {
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
            req = new HttpRequest('http://fakeRequest.local');
        });

        teardown(() => {
            requests = [];
        });

        test('should be able to send a GET request', () => {
            req.send();
            requests[0].method.should.equal('GET');
        });

        test('should be able to recieve a response', (done) => {
            let callback = sinon.spy();

            req.then(callback);
            req.send();

            requests[0].respond();

            setTimeout(() => {
                callback.calledOnce.should.be.true();
                done();
            }, 0);
        });

        test('should be able to recieve a specific status code', (done) => {
            req.then((res) => {
                res.getStatus().should.equal(302);
                done();
            });
            req.send();

            requests[0].respond(302);
        });

        test('should form response headers into map collection', (done) => {
            req.then((res) => {
            	res.getHeaders().should.be.an.instanceof(Map)
            		.and.have.property('size').and.equal(2)
            	done();
            });
            req.send();

            requests[0].respond(200, {
                'Content-Type': 'text/plain',
                'Content-Length': 10
            }, 'hello test');
        });

        test('should recieve null in callback response parameter if request fails before sending', (done) => {
        	let callback = sinon.spy();

        	// emulate error before sending
        	req.xhr.addEventListener('loadstart', (e) => e.target.error());

        	req.catch(callback);
        	req.send();

        	setTimeout(() => {
        		callback.calledWith(null).should.be.true();
        		done();
        	}, 0);
        });
    });
})();