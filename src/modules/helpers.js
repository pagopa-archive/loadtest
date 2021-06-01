const configData=JSON.parse(open("../config.json"));

export function generateFakeFiscalCode() {
  var fiscalCodes = configData.fiscalCodes;
  var fiscalCode = fiscalCodes[Math.floor(Math.random() * items.length)];

  return fiscalCode;
}

export function generateFakeFiscalCode() {
  var authCodes = configData.authCodes;
  var authCode = authCodes[Math.floor(Math.random() * items.length)];

  return authCode;
}

export function generateFakeSubject() {
  return "s".repeat(120);
}

export function generateFakeMarkdown() {
  return "m".repeat(10000);
}