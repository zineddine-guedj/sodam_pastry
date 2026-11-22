(function () {
  const grid = document.getElementById('gallery-grid');
  if (!grid || !window.CreationsStore || !window.CreationTemplate) return;
  const filters = [...document.querySelectorAll('[data-filter]')];
  const count = document.getElementById('results-count');
  const empty = document.getElementById('gallery-empty');
  const labels = window.SodamConstants?.categories || {};
  let activeFilter = 'all';

  function render() {
    const published = window.CreationsStore.all().filter(item => item.status === 'published')
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    const shown = published.filter(item => activeFilter === 'all' || item.category === activeFilter);
    grid.replaceChildren(...shown.map(item => window.CreationTemplate.galleryCard(item)));
    const categoryName = activeFilter === 'all' ? 'All creations' : labels[activeFilter] || activeFilter;
    count.textContent = `${shown.length} ${shown.length === 1 ? 'little joy' : 'little joys'} · ${categoryName}`;
    empty.hidden = shown.length > 0;
    empty.innerHTML = published.length && activeFilter !== 'all'
      ? 'No creations in this category yet. <a href="reserve-pastry.html">Dream up something of your own</a>.'
      : 'No creations here yet. Check back soon, or <a href="reserve-pastry.html">dream up something of your own</a>.';
  }
  filters.forEach(button => button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    filters.forEach(item => {
      const selected = item === button;
      item.classList.toggle('is-active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    render();
  }));
  document.addEventListener('sodam:data-changed', event => {
    if (!event.detail?.key || event.detail.key === window.CreationsStore.key) render();
  });
  render();
})();
