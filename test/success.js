import sinon from 'sinon';
import should from 'should';

import {
    HttpRequest
} from '../src/HttpRequest';

export default (() => {
    suite('success request tests', () => {
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

        test('should be able to recieve specific response content', (done) => {
            req.then((res) => {
                (() => {
                    JSON.stringify(res.getResponseType()).should.not.be.null();
                }).should.not.throw();
                done();
            });
            req.send();

            requests[0].responseType = 'json';
            requests[0].respond(200, {
                'Content-Type': 'application/json'
            }, '{ "test": "test" }');
        });

        //test('should use Content-Type to determine response type');
    });
})();