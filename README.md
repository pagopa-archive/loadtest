# Load tests for Green Pass Integration

This is a set of [k6](https://k6.io) load tests related to the integration of the Green Pass.


## 01. Submits a message to a user.

This test represents the submit of a message to a user.
It uses fiscal code selected randomly from an array of pre approved test fiscal code which is populated in config.json.

You need to set an environment variable `APIM_KEY` with the azure API Management Subscription key.

```
$ docker run -i --rm -v $(pwd)/src:/src -e APIM_KEY=${APIM_KEY} loadimpact/k6 run /src/submit_message.js
```
