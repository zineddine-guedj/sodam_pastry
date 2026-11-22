(function () {
  const section = document.getElementById('latest');
  const list = document.getElementById('latest-list');
  if (!section || !list || !window.CreationsStore || !window.CreationTemplate) return;
  function render() {
    const items = window.CreationsStore.all().filter(item => item.status === 'published')
      .sort((a, b) => (b.date || '').localeCompare(a.date || '')).slice(0, 4);
    list.replaceChildren(...items.map(item => window.CreationTemplate.polaroid(item)));
    section.hidden = items.length === 0;
  }
  document.addEventListener('sodam:data-changed', render);
  render();
})();
