# Load tests for Green Pass Integration

This is a set of [k6](https://k6.io) load tests related to the integration of the Green Pass.


## 01. Submits a message to a user.

This test represents the submit of a message to a user.
It uses **fiscal code** selected randomly from an array of pre approved test fiscal code which is populated in **config.json**.
The **Message Status** is sampled, with a percentage defined in the **config.json** file.

You need to set an environment variable `APIM_KEY` with the azure API Management Subscription key.

```
k6 run -e APIM_KEY=${APIM_KEY} -e BASE_URL=${BASE_URL} src/submit_message.js
```
