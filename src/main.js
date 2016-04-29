var formObj = require('form-obj');
var html = require('./html-escape');
var algoliasearch = require('algoliasearch');
var client = algoliasearch('MO3EP03JWU', 'd7afe3e2ea005d92e76df42a6ba4bd69');
var index = client.initIndex('visitgent');

document.getElementById('search').addEventListener('submit',function(e){
  e.preventDefault();
  var form = formObj(this);
  document.getElementById('results').innerHTML = '';
  index.search(form.search, function searchDone(err, content) {
    if (err) {
      console.warn(err);
    } else {
      for (var hit in content.hits) {
        if (content.hits.hasOwnProperty(hit) && content.hits[hit].language === form.language) {
          console.log(content.hits[hit]);
          document.getElementById('results').innerHTML +=
html`
<article class="result">
  <h1 class="result--title">${content.hits[hit].title}</h1>
  <p class="result--summary">${content.hits[hit].summary}</p>
</article>
`;
        }
      }
    }
  });
});
