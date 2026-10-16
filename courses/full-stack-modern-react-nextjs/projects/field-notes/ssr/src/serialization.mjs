export function serializeData(value) {
 return JSON.stringify(value).replaceAll('<', String.raw`\u003c`).replaceAll(String.fromCharCode(8232), String.raw`\u2028`).replaceAll(String.fromCharCode(8233), String.raw`\u2029`);
}
