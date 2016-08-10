import sinon from 'sinon';
import should from 'should';

import { HttpRequest } from '../src/HttpRequest';
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
        	req = new HttpRequest('http://fakeRequest');
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
    });
})();