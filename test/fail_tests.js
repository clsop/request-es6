import sinon from 'sinon';
import should from 'should';

import {
    HttpRequest
} from '../src/HttpRequest';

export default (() => {
    suite('fail request tests', () => {
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

        test('should be able to cancel a pending request', (done) => {
            let callback = sinon.spy();

            req.catch(callback);
            req.send();
            req.cancel();

            setTimeout(() => {
                callback.calledWith(null).should.be.true();
                done();
            }, 0);
        });
    });
})();