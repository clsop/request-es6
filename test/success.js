import sinon from 'sinon';
import should from 'should';

import { HttpRequest } from '../src/HttpRequest';

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
        	req = new HttpRequest('http://fakeRequest');
        });

        teardown(() => {
        	requests = [];
        });
    });
})();