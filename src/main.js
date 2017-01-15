const formObj = require('form-obj');
const html = require('./html-escape');
const algoliasearch = require('algoliasearch');
const client = algoliasearch('MO3EP03JWU', 'd7afe3e2ea005d92e76df42a6ba4bd69');
const index = client.initIndex('visitgent');

document.getElementById('search').addEventListener('submit', function(e){
  e.preventDefault();
});

let form = {
  language: 'en',
  search: ''
};

function createResult(hit) {
  const res = document.createElement('article');
  res.classList.add('result');
  res.innerHTML = html`
  <img src="${hit.images[0]}" alt="${hit.title}" class="result--image"/>
  <div class="result--bottom">
    <h1 class="result--title">${hit.title}</h1>
    <p class="result--summary">${hit.summary}</p>
  </div>`;
  res.datalist = hit;
  return res;
}

function addWarning(node) {
  const warning = document.createElement('div');
  warning.className = 'middle';
  warning.textContent = 'Sorry 😢, no such thing was found';
  node.appendChild(warning);
}

function showDetails() {
  const overlay = document.createElement('div');
  overlay.classList.add('overlay');
  overlay.innerHTML = `
<section class="overlay--content">
  <h2 class="overlay--title overlay--item">${this.datalist.title}</h2>
  <div class="overlay--item">${this.datalist.description}</div>
  <details class="overlay--item">
  <pre>
  ${JSON.stringify(this.datalist, null, ' ')}
  </pre>
  </details>
</section>`;
  document.body.insertBefore(overlay,document.querySelector('.header'));
  overlay.addEventListener('click',(e) => {
    if (e.target.classList.contains('overlay')) {
      e.target.parentNode.removeChild(e.target);
    };
  });
}

function flexfix(node) {
  const flexfix = document.createElement('div');
  flexfix.classList.add('👻');
  node.appendChild(flexfix);
}

document.querySelector('[name=search]').addEventListener('input', () => {
  form = formObj(document.getElementById('search'));
  index.search(form.search, searchDone);
});

function searchDone(err, content) {
  if (err) {
    console.warn(err);
  } else {
    var results = document.querySelector('.results');
    results.textContent = '';

    const filteredHits = content.hits.filter((item) => item.language === form.language);

    if (filteredHits.length === 0) {
      addWarning(results);
    } else {
      filteredHits.forEach(function eachHit(hit) {
        const res = createResult(hit);
        results.appendChild(res);
        res.addEventListener('click', showDetails);
        flexfix(results);
      })
    }
  }
}

index.search('', searchDone);
