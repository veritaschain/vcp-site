/* Progressive enhancement: all dated records and links exist without JavaScript. */
(() => {
  const hashId = () => { try { return decodeURIComponent(location.hash.slice(1)); } catch { return ''; } };
  const legacy = document.getElementById('news-legacy-map');
  if (legacy) {
    const map = JSON.parse(legacy.textContent);
    const follow = () => { const key = hashId(); if (Object.hasOwn(map, key)) location.replace(map[key]); };
    follow(); window.addEventListener('hashchange', follow);
  }
  const form = document.querySelector('.archive-controls');
  if (!form) return;
  const rows = Array.from(document.querySelectorAll('[data-news-record]'));
  const months = Array.from(document.querySelectorAll('.archive-month'));
  const count = document.getElementById('archive-count');
  const empty = document.getElementById('archive-empty');
  const fields = ['month', 'category', 'search'];
  const apply = () => {
    const month = form.elements.month.value;
    const category = form.elements.category.value;
    const search = form.elements.search.value.trim().normalize('NFKC').toLocaleLowerCase();
    let visible = 0;
    rows.forEach(row => {
      const matches = (!month || row.dataset.month === month) && (!category || row.dataset.category === category) && (!search || row.textContent.normalize('NFKC').toLocaleLowerCase().includes(search));
      row.hidden = !matches; if (matches) visible++;
    });
    months.forEach(section => { section.hidden = !Array.from(section.querySelectorAll('[data-news-record]')).some(row => !row.hidden); });
    count.textContent = count.dataset.template.replace('{shown}', visible).replace('{total}', rows.length);
    empty.hidden = visible !== 0;
  };
  form.hidden = false;
  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('input', apply);
  form.addEventListener('change', apply);
  form.addEventListener('reset', () => { fields.forEach(name => { form.elements[name].value = ''; }); apply(); });
  const revealHash = () => {
    const id = hashId();
    const target = document.getElementById(id);
    if (!target) return;
    const row = target.closest('[data-news-record]');
    if (!row) return;
    form.reset();
    if (target.tagName === 'DETAILS') target.open = true;
    row.scrollIntoView({block:'start'});
  };
  apply(); revealHash(); window.addEventListener('hashchange', revealHash);
})();
