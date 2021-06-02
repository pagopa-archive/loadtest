var fiscalCodes = ["AAAAAA00A00A000A"];

export function generateFakeFiscalCode() {
  var items = fiscalCodes;
  var item = items[Math.floor(Math.random() * items.length)];

  return item;
}

export function generateFakeSubject() {
  return "s".repeat(120);
}

export function generateFakeMarkdown() {
  return "m".repeat(10000);
}