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

const samplingRate=JSON.parse(open("./config.json")).getMessageSamplingRate;
export function setup() {
    return {
        subject: generateFakeSubject(),
        markdown:  generateFakeMarkdown(),
    };
}

export default function (data) {
    // Values from env var.
    var urlBasePath = `${__ENV.BASE_URL}`
    var apimKey = `${__ENV.APIM_KEY}`

    var fiscalCode = generateFakeFiscalCode();
    console.log('Fiscal code: ' + fiscalCode)

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
    var url = `${urlBasePath}/api/v1/messages`;
    var payload = JSON.stringify({
        "content": {
            "subject": data.subject,
            "markdown": data.markdown,
            "eu_covid_cert": 
            { 
                "auth_code": "nk34nidwew9o4nro3noionwow" 
            }
        },
        "fiscal_code": fiscalCode
    });
    var r = http.post(url, payload, headersParams, {
        tags: tag,
    });
    console.log("Send message with fiscal code " + fiscalCode + " Status " + r.status);
    check(r, { 'status is 201': (r) => r.status === 201 }, tag);

    var jsonBody = JSON.parse(r.body);
    var messageId = jsonBody.id;

    // Sample Message Status
    var r = Math.floor(Math.random() * 100) + 1;
    if (r <= samplingRate) {
        // Polling message status
        sleep(5);
        var maxRetries = 20;
        var retryCount = 0;
        var messageSubmitted = false;
        do {
            sleep(1)
            console.log('Polling Message Status: ' + r.status + ' retry: ' + (retryCount + 1));
    
            // Get Message Status
            tag = {
                pagoPaMethod: "GetMessageStatus",
            };
            url = `${urlBasePath}/api/v1/messages/${fiscalCode}/${messageId}`;
            r = http.get(url, headersParams, {
                tags: tag,
            });
            check(r, { 'Get Message Status is 200': (r) => (r.status === 200) },
                tag
            );
    
            // If status is "PROCESSED" then the message was correctly submitted
            var jsonBody = JSON.parse(r.body);
            if (r.body && jsonBody.status === 'PROCESSED') {
                messageSubmitted = true;
                break;
            }
            console.log('Get Message Status: ' + r.status);
    
            retryCount++;
        }
        while ((retryCount < maxRetries) && !messageSubmitted);
    
        if (messageSubmitted) {
            console.log('Message ' + messageId + ' processed.')
        }
        else {
            console.log('Message ' + messageId + ' NOT processed. Exit test.')
            return;
        }
    }


    sleep(0.5);


    console.log('Test completed for: ' + fiscalCode);


}
