const slugify = require("slugify");

function createSlug(text) {
  return slugify(text, {
    replacement: "-",
    remove: undefined,
    lower: true,
    strict: false,
    locale: "vi",
    trim: true,
  });
}

module.exports = createSlug;