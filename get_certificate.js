import http from 'k6/http';
import { sleep } from 'k6';
import { check } from 'k6';
import { generateFakeFiscalCode, generateFakeMarkdown, generateFakeSubject } from './modules/helpers.js';

export let options = {
    scenarios: {
        contacts: {
            executor: 'ramping-arrival-rate',
            startRate: 50,
            timeUnit: '1s',
            preAllocatedVUs: 50,
            maxVUs: 100,
            stages: [
              { duration: '10s', target: 100 },
              { duration: '10s', target: 200 },
              { duration: '10s', target: 100 },
            ]
        }
    },
    thresholds: {
        http_req_duration: ['p(99)<1500'], // 99% of requests must complete below 1.5s
        'http_req_duration{pagoPaMethod:SendMessage}': ['p(95)<1000'], // threshold on API requests only
        'http_req_duration{pagoPaMethod:GetMessageStatus}': ['p(95)<1000'], // threshold on API requests only
    },
};

export function setup() {
    return {
    };
}

export default function (data) {
    // Values from env var.
    var urlBasePath = `${__ENV.BASE_URL}`
    var apimKey = `${__ENV.APIM_KEY}`

    var auth = generateAuth();

    var headersParams = {
    headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': apimKey,
    },
    };

    // Send new message
    var tag = {
        pagoPaMethod: "SendMessage",
    };
    var url = `${urlBasePath}/api/v1/getCertificate`;
    var payload = JSON.stringify({
        "auth": auth
    });
    var r = http.post(url, payload, headersParams, {
        tags: tag,
    });
    console.log("Get certificate Status " + r.status);
    check(r, { 'status is 200': (r) => r.status === 200 }, tag);
 
}