(function () {
  const grid = document.getElementById('gallery-grid');
  if (!grid || !window.CreationsStore) return;

  const filters = [...document.querySelectorAll('[data-filter]')];
  const count = document.getElementById('results-count');
  const empty = document.getElementById('gallery-empty');
  const labels = {
    pavlova: 'Pavlova', 'dome-cakes': 'Dome cakes', 'custom-cakes': 'Custom cakes',
    'fruit-cakes': 'Fruit cakes', seasonal: 'Seasonal'
  };
  let activeFilter = 'all';

  function make(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function render() {
    const items = window.CreationsStore.all()
      .filter(item => item.status === 'published')
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    const shown = items.filter(item => activeFilter === 'all' || item.category === activeFilter);
    grid.replaceChildren();

    shown.forEach(item => {
      const href = `creation-detail.html?id=${encodeURIComponent(item.id)}`;
      const cardItem = make('li', 'gallery__item');
      cardItem.dataset.category = item.category;
      const article = make('article', 'gallery-card');
      const media = make('a', 'gallery-card__media');
      media.href = href;
      const image = make('img');
      image.src = item.photos?.[0] || 'assets/logo/sodam-logo.png';
      image.alt = item.title;
      image.width = 640;
      image.height = 480;
      image.loading = 'lazy';
      media.append(image);
      article.append(media);
      article.append(make('p', 'gallery-card__category', labels[item.category] || item.category));
      const heading = make('h2', 'gallery-card__title');
      const title = make('a', '', item.title);
      title.href = href;
      heading.append(title);
      article.append(heading);
      article.append(make('p', 'gallery-card__text', item.description));
      if (item.date) {
        const date = make('time', 'gallery-card__date');
        date.dateTime = item.date;
        date.textContent = new Date(`${item.date}T12:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        article.append(date);
      }
      const reserve = make('a', 'gallery-card__link', 'Reserve this');
      reserve.href = `reserve-pastry.html?creation=${encodeURIComponent(item.id)}`;
      article.append(reserve);
      cardItem.append(article);
      grid.append(cardItem);
    });

    const categoryName = activeFilter === 'all' ? 'All creations' : (labels[activeFilter] || activeFilter);
    count.textContent = `${shown.length} ${shown.length === 1 ? 'little joy' : 'little joys'} · ${categoryName}`;
    empty.hidden = shown.length > 0;
    empty.innerHTML = items.length && activeFilter !== 'all'
      ? 'No creations in this category yet. <a href="reserve-pastry.html">Dream up something of your own</a>.'
      : 'No creations here yet. Check back soon, or <a href="reserve-pastry.html">dream up something of your own</a>.';
  }

  filters.forEach(button => button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    filters.forEach(filter => {
      const selected = filter === button;
      filter.classList.toggle('is-active', selected);
      filter.setAttribute('aria-pressed', String(selected));
    });
    render();
  }));
  document.addEventListener('sodam:data-changed', render);
  window.addEventListener('storage', event => {
    if (!event.key || event.key === window.CreationsStore.key) render();
  });
  render();
})();
