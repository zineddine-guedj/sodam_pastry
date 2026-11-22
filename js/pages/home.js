(function () {
  const section = document.getElementById('latest');
  const list = document.getElementById('latest-list');
  if (!section || !list || !window.CreationsStore) return;

  function render() {
    const items = window.CreationsStore.all()
      .filter(item => item.status === 'published')
      .sort((a, b) => (b.date || '').localeCompare(a.date || '')).slice(0, 4);
    list.replaceChildren();
    items.forEach(item => {
      const li = document.createElement('li');
      li.className = 'polaroid polaroid--small';
      const link = document.createElement('a');
      link.href = `creation-detail.html?id=${encodeURIComponent(item.id)}`;
      const image = document.createElement('img');
      image.src = item.photos?.[0] || 'assets/logo/sodam-logo.png';
      image.alt = item.title;
      image.loading = 'lazy';
      const caption = document.createElement('span');
      caption.className = 'polaroid__caption';
      caption.textContent = item.title;
      link.append(image, caption);
      li.append(link);
      list.append(li);
    });
    section.hidden = items.length === 0;
  }
  document.addEventListener('sodam:data-changed', render);
  render();
})();
