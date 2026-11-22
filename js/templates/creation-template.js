(function () {
  const labels = window.SodamConstants?.categories || {
    pavlova: 'Pavlova', 'dome-cakes': 'Dome cakes', 'custom-cakes': 'Custom cakes', 'fruit-cakes': 'Fruit cakes', seasonal: 'Seasonal'
  };
  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = String(text);
    return node;
  }
  function galleryCard(item) {
    const li = el('li', 'gallery__item'); li.dataset.category = item.category || '';
    const article = el('article', 'gallery-card');
    const detailHref = `creation-detail.html?id=${encodeURIComponent(item.id)}`;
    const media = el('a', 'gallery-card__media'); media.href = detailHref;
    const img = el('img'); img.src = item.photos?.[0] || 'assets/logo/sodam-logo.png'; img.alt = item.title || 'Pastry'; img.width = 640; img.height = 480; img.loading = 'lazy';
    media.append(img);
    const category = el('p', 'gallery-card__category', labels[item.category] || item.category || 'Creation');
    const heading = el('h2', 'gallery-card__title'); const title = el('a', '', item.title); title.href = detailHref; heading.append(title);
    const description = el('p', 'gallery-card__text', item.description || '');
    article.append(media, category, heading, description);
    if (item.date) { const time = el('time', 'gallery-card__date', window.SodamFormat?.date(item.date) || item.date); time.dateTime = item.date; article.append(time); }
    const reserve = el('a', 'gallery-card__link', 'Reserve this'); reserve.href = `reserve-pastry.html?creation=${encodeURIComponent(item.id)}`; article.append(reserve);
    li.append(article); return li;
  }
  function polaroid(item) {
    const li = el('li', 'polaroid polaroid--small');
    const link = el('a'); link.href = `creation-detail.html?id=${encodeURIComponent(item.id)}`;
    const image = el('img'); image.src = item.photos?.[0] || 'assets/logo/sodam-logo.png'; image.alt = item.title || 'Pastry'; image.loading = 'lazy';
    const caption = el('span', 'polaroid__caption', item.title || 'Creation');
    link.append(image, caption); li.append(link); return li;
  }
  window.CreationTemplate = { galleryCard, polaroid };
})();
