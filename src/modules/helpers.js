const configData=JSON.parse(open("../config.json"));

export function generateFakeFiscalCode(inputFiscalCodes) {
  var fiscalCodes = [];
  if (inputFiscalCodes === "undefined") {
    fiscalCodes = configData.fiscalCodes;
    console.log("inputFiscalCodes undefined: " + fiscalCodes);
  } else {
    fiscalCodes = inputFiscalCodes.split(",");
    console.log("inputFiscalCodes not undefined: " + fiscalCodes);
  }

  var fiscalCode = fiscalCodes[Math.floor(Math.random() * fiscalCodes.length)];

  return fiscalCode;
}

export function generateFakAuthCode() {
  var authCodes = configData.authCodes;
  var authCode = authCodes[Math.floor(Math.random() * authCodes.length)];

  return authCode;
}

export function generateFakeSessionToken(inputSessionTokens) {
  var sessionTokens = [];
  if (inputSessionTokens === "undefined") {
    sessionTokens = configData.sessionTokens;
    // console.log("inputSessionTokens undefined: " + sessionTokens);
  } else {
    sessionTokens = inputSessionTokens.split(",");
    // console.log("inputSessionTokens not undefined: " + sessionTokens);
  }

  var sessionToken = sessionTokens[Math.floor(Math.random() * sessionTokens.length)];

  return sessionToken;
}

export function getMessageSamplingRate(inputMessageSamplingRate) {
  if (inputMessageSamplingRate === "undefined") {
    console.log("inputMessageSamplingRate undefined: " + configData.getMessageSamplingRate);
    return  configData.getMessageSamplingRate;
  } else {
    console.log("inputMessageSamplingRate not undefined: " + inputMessageSamplingRate);
    return inputMessageSamplingRate;
  }
}

export function generateFakeSubject() {
  return "s".repeat(120);
}

export function generateFakeMarkdown() {
  return "m".repeat(10000);
}