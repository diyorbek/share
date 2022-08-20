const pasteLanguages = require("./pasteLanguages");
const languageSet = new Set(pasteLanguages);

function isValidPasteLanguage(value) {
  return !!value && languageSet.has(value);
}

function isValidPaste(requestBody) {
  const { title = "", content = "", language, expiresAfter } = requestBody;

  return !!(title.trim() && content.trim() && language && expiresAfter);
}

module.exports = {
  isValidPasteLanguage,
  isValidPaste,
};
