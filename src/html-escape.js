const escapeHtml = require('escape-html')

// Tagged template function
const html = function(pieces) {
  var result = pieces[0];
  const substitutions = [].slice.call(arguments, 1);
  for (var i = 0; i < substitutions.length; ++i) {
    result += escapeHtml(substitutions[i]) + pieces[i + 1];
  }
  return result;
};

module.exports = html;
