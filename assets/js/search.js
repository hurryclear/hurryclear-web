(function() {
  const searchParams = new URLSearchParams(window.location.search);
  const keywords = (searchParams.get('search') || '').trim();
  const searchInput = document.getElementById('search-input');
  const resultContainer = document.getElementById('search-result');
  const emptyResult = document.getElementById('search-result-empty');

  if (keywords) {
    searchInput.value = keywords;
    search(keywords);
  } else {
    return;
  }

  const fuseOptions = {
    ignoreLocation: true,
    includeScore: true,
    includeMatches: true,
    minMatchCharLength: searchOptions.minMatchCharLength,
    threshold: searchOptions.threshold,
    // refer layouts/search/search.json
    keys: [
      {name: "title", weight: 0.8},
      {name: "content", weight: 0.5},
      {name: "tags", weight: 0.2},
      {name: "categories", weight: 0.2},
    ],
  };

  function search(keywords) {
    fetch('./index.json').then(response => response.json()).then(data => {
      const fuse = new Fuse(data, fuseOptions);
      const result = fuse.search(keywords);
      if (result.length > 0) {
        showResult(keywords, result);
        emptyResult.classList.add('hidden');
      } else {
        resultContainer.innerHTML = '';
        emptyResult.classList.remove('hidden');
      }
    });
  }

  const resultTemplate = `
  <article class="py-6" id="result-{{= it.index }}">
    <h2 class="text-xl font-medium text-slate-900 dark:text-slate-100">
      <a href="{{= it.permalink }}" class="hover:text-emerald-600">{{! it.title }}</a>
    </h2>
    <p class="mt-2 text-slate-600 dark:text-slate-300">
      {{! it.snippet }}
    </p>
    <ul class="mt-2 flex flex-row flex-wrap gap-x-3 text-sm text-slate-500 dark:text-slate-400">
      {{~ it.categories :v }}
      <li><a href="{{! v.RelPermalink }}" class="hover:text-emerald-600">{{! v.LinkTitle }}</a></li>
      {{~}}
      {{~ it.tags :v }}
      <li><a href="{{! v.RelPermalink }}" class="hover:text-emerald-600">#{{! v.LinkTitle }}</a></li>
      {{~}}
    </ul>
  </article>
  `;

  function showResult(keywords, result) {
    const templateFn = doT.template(resultTemplate);
    const tagIcon = document.getElementById('tag-icon').innerHTML;
    resultContainer.innerHTML = '';
    for (const [index, entry] of result.entries()) {
      const item = entry.item;
      const content = entry.item.content;
      item.snippet = content.substring(0, searchOptions.summaryInclude * 2) + '&hellip;';
      item.tagIcon = tagIcon;
      item.index = index;
      resultContainer.innerHTML += templateFn(item);
    }
    const instance = new Mark(resultContainer);
    instance.mark(keywords);
  }
})()
