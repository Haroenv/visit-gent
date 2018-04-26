const formObj = require('form-obj');
const html = require('./html-escape');
const algoliasearch = require('algoliasearch');
const client = algoliasearch('MO3EP03JWU', 'd7afe3e2ea005d92e76df42a6ba4bd69');
const index = client.initIndex('visitgent');

document
  .getElementById('search')
  .addEventListener('submit', e => e.preventDefault());

let form = {
  language: 'en',
  search: ''
};

const fallback =
  'data:image/svg+xml;utf8,' +
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 154 39">' +
  '<path d="M10.36 30.12L17.6 9.2h-2.48l-6.2 18.88L2.56 9.2H0l7.48 20.92h2.88zM23.56 0c-1.04 0-1.72.76-1.72 1.68 0 .92.68 1.68 1.72 1.68 1.08 0 1.76-.76 1.76-1.68 0-.92-.68-1.68-1.76-1.68zm1.2 30.12V9.2h-2.32v20.92h2.32zm13.6-21.36c-3.96 0-6.96 2.28-6.96 5.44 0 2.96 1.8 4.6 6.24 5.76 4.36 1.2 5.52 2.12 5.52 4.68 0 2.52-2.12 3.96-5.16 3.96-2.56 0-4.4-.8-6.12-2.24l-1.32 1.52c1.8 1.52 4.08 2.68 7.48 2.68 4.16 0 7.56-2.2 7.56-6.08 0-3.56-2.16-5.12-6.72-6.32-3.76-1-5.08-1.88-5.08-3.96 0-2.16 1.88-3.52 4.64-3.52 2.12 0 3.68.64 5.48 1.96l1.12-1.56c-1.96-1.52-4-2.32-6.68-2.32zM52.92 0c-1.04 0-1.72.76-1.72 1.68 0 .92.68 1.68 1.72 1.68 1.08 0 1.76-.76 1.76-1.68C54.68.76 54 0 52.92 0zm1.2 30.12V9.2H51.8v20.92h2.32zm18-.88l-.92-1.64c-1.04.64-2.04.96-3.2.96-2.12 0-3.08-1.2-3.08-3.64V11.08h5.12l.28-1.88h-5.4V3.92l-2.32.28v5h-3.52v1.88h3.52v13.96c0 3.64 1.96 5.52 5.12 5.52 1.68 0 3.12-.48 4.4-1.32zm21.64-19.16c-1.56.6-3.56.8-6.12.8 2.6 1.16 3.92 2.76 3.92 5.44 0 4.12-3.32 7.12-8.72 7.12-.92 0-1.72-.08-2.48-.28-.48.32-.8.84-.8 1.4 0 .72.36 1.4 2.44 1.4h3.24c4.8 0 7.88 2.56 7.88 6.08 0 4.28-3.72 6.88-10.8 6.88-7.76 0-9.88-2.52-9.88-6.76h5.08c0 2 .88 2.88 4.92 2.88 3.92 0 4.96-1.08 4.96-2.6 0-1.44-1.08-2.32-3.32-2.32h-3.12c-4.44 0-6.28-1.92-6.28-4.16 0-1.52.96-3 2.48-3.96-2.64-1.44-3.76-3.32-3.76-6.04 0-4.68 3.72-7.68 9.04-7.68 4.88.12 7.36-1.12 9.92-2.56l1.4 4.36zm-11.2 2c-2.16 0-3.48 1.48-3.48 3.8 0 2.44 1.36 3.88 3.52 3.88 2.28 0 3.48-1.36 3.48-3.96 0-2.52-1.16-3.72-3.52-3.72zm31.32 6.96c0 .72-.08 1.6-.12 2.2h-13.24c.4 4.08 2.32 5.28 5.04 5.28 1.8 0 3.32-.56 5.16-1.84l2.36 3.2c-2.08 1.68-4.72 2.88-8.04 2.88-6.8 0-10.36-4.48-10.36-11.12 0-6.4 3.44-11.36 9.64-11.36 6 0 9.56 4 9.56 10.76zm-5.64-1.36v-.24c0-3.2-1.08-5.28-3.8-5.28-2.24 0-3.64 1.52-3.92 5.52h7.72zm21.68-9.4c-2.72 0-4.76 1.2-6.48 3.32L123 8.92h-4.92v21.2h5.68V15.48c1.16-1.88 2.44-2.96 4.08-2.96 1.44 0 2.32.68 2.32 3.12v14.48h5.68V14.68c0-4-2.2-6.4-5.92-6.4zm24 20.84l-1.96-3.64c-.88.52-1.64.76-2.4.76-1.44 0-2.12-.8-2.12-2.88V12.92h4.32l.56-4h-4.88V3.6l-5.68.68v4.64h-3.16v4h3.16v10.56c0 4.72 2.24 7.24 6.64 7.28 1.88 0 3.96-.56 5.52-1.64z" fill="white"/>' +
  '</svg>';

function createResult(hit) {
  const needsFallback = !Boolean(hit.images[0]);
  const fallbackClass = needsFallback ? ' result--image__fallback' : '';
  const fallbackImage = needsFallback ? fallback : hit.images[0];

  const res = document.createElement('article');
  res.classList.add('result');
  res.innerHTML = html`
  <img
    src="${fallbackImage}"
    alt="${hit.title}"
    class="${`result--image ${fallbackClass}`}"
  />
  <div class="result--bottom">
    <h1 class="result--title">${hit.title}</h1>
    <p class="result--summary">${hit.summary}</p>
  </div>`;
  delete hit._highlightResult;
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
  <div class="overlay--images">
    ${this.datalist.images.map(image => `<img src="${image}"/>`).join('')}
  </div>
  <details class="overlay--item">
  <summary>all data</summary>
  <pre>${JSON.stringify(this.datalist, null, 2)}</pre>
  </details>
</section>`;
  document.body.insertBefore(overlay, document.querySelector('.header'));
  overlay.addEventListener('click', e => {
    if (e.target.classList.contains('overlay')) {
      e.target.parentNode.removeChild(e.target);
    }
  });
}

function flexfix(node) {
  const flexfix = document.createElement('div');
  flexfix.classList.add('👻');
  node.appendChild(flexfix);
}

function searchDone(err, content) {
  if (err) {
    console.warn(err);
  } else {
    var results = document.querySelector('.results');
    results.textContent = '';

    const filteredHits = content.hits;

    if (filteredHits.length === 0) {
      addWarning(results);
    } else {
      filteredHits.forEach(function eachHit(hit) {
        const res = createResult(hit);
        results.appendChild(res);
        res.addEventListener('click', showDetails);
        flexfix(results);
      });
    }
  }
}

document.querySelector('[name=search]').addEventListener('input', search);

document.querySelector('[name=language]').addEventListener('input', search);

function search() {
  form = formObj(document.getElementById('search'));
  index.search(
    { query: form.search, filters: `language:${form.language}` },
    searchDone
  );
}

search();
