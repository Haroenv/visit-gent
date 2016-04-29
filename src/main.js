var formObj = require('form-obj');
var algoliasearch = require('algoliasearch');
var client = algoliasearch('MO3EP03JWU', 'd7afe3e2ea005d92e76df42a6ba4bd69');
var index = client.initIndex('visitgent');

document.getElementById('search').addEventListener('submit',function(e){
  e.preventDefault();
  console.log(formObj(this));
  index.search('Blaarmeersen', function searchDone(err, content) {
    console.log(err, content);
  });
});
