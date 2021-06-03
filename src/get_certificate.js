import http from 'k6/http';
import { check } from 'k6';
import { generateFakeSessionToken } from './modules/helpers.js';

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
    },
};

export function setup() {
    return {
    };
}

export default function (data) {
    // Values from env var.
    var urlBasePath = `${__ENV.BASE_URL}`;
    var sessionToken = generateFakeSessionToken(`${__ENV.SESSION_TOKENS}`);

    var headersParams = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer : ${sessionToken}`
        },
    };

    // Send new message
    var tag = {
        pagoPaMethod: "SendMessage",
    };
    var url = `${urlBasePath}/api/v1/getCertificate`;
    var r = http.post(url, payload, headersParams, {
        tags: tag,
    });
    console.log("Get certificate Status " + r.status);
    check(r, { 'status is 200': (r) => r.status === 200 }, tag);
 
}
