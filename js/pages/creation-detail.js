(function () {
  const params = new URLSearchParams(window.location.search);
  const item = window.CreationsStore?.find(params.get('id'));
  const article = document.querySelector('.detail__layout');
  if (!article) return;

  if (!item || item.status !== 'published') {
    article.replaceChildren();
    const message = document.createElement('p');
    message.className = 'gallery__empty';
    message.textContent = 'This creation is no longer available. Please browse the current collection.';
    article.append(message);
    return;
  }

  const labels = window.SodamConstants?.categories || {};
  const title = document.getElementById('creation-title');
  title.textContent = item.title;
  document.title = `${item.title} · Sodam Pastry`;
  document.getElementById('creation-category').textContent = `${labels[item.category] || item.category} · Made to order`;
  document.getElementById('creation-tagline').textContent = item.description;
  const description = document.getElementById('creation-description');
  description.replaceChildren();
  const paragraph = document.createElement('p');
  paragraph.textContent = item.description;
  description.append(paragraph);

  const date = document.getElementById('creation-date');
  if (item.date) {
    date.dateTime = item.date;
    date.textContent = window.SodamFormat?.date(item.date, { day: 'numeric', month: 'long', year: 'numeric' }) || item.date;
  }
  const reserveLink = document.getElementById('reserve-link');
  reserveLink.href = `reserve-pastry.html?creation=${encodeURIComponent(item.id)}`;
  const preselect = document.getElementById('preselect-text');
  preselect.textContent = `${item.title}. You can change your selection at step 1. Please reserve at least 48 hours ahead.`;

  const track = document.getElementById('carousel-track');
  const thumbs = document.querySelector('.carousel__thumbs');
  const dots = document.querySelector('.carousel__dots');
  const photos = item.photos?.length ? item.photos : ['assets/logo/sodam-logo.png'];
  track.replaceChildren();
  thumbs.replaceChildren();
  dots.replaceChildren();
  photos.forEach((src, index) => {
    const slide = document.createElement('li');
    slide.className = 'carousel__slide';
    slide.id = `slide-${index + 1}`;
    const image = document.createElement('img');
    image.src = src;
    image.alt = `${item.title} · photo ${index + 1}`;
    image.width = 800;
    image.height = 800;
    slide.append(image);
    track.append(slide);

    const thumbItem = document.createElement('li');
    const button = document.createElement('button');
    button.className = `carousel__thumb${index === 0 ? ' is-active' : ''}`;
    button.type = 'button';
    button.setAttribute('aria-label', `Show photo ${index + 1}`);
    button.setAttribute('aria-current', index === 0 ? 'true' : 'false');
    button.dataset.slide = String(index);
    const thumb = document.createElement('img');
    thumb.src = src;
    thumb.alt = '';
    thumb.width = 96;
    thumb.height = 96;
    button.append(thumb);
    thumbItem.append(button);
    thumbs.append(thumbItem);

    const dot = document.createElement('span');
    dot.className = `carousel__dot${index === 0 ? ' is-active' : ''}`;
    dots.append(dot);
  });

  const hint = document.querySelector('.carousel__hint');
  if (hint) hint.hidden = photos.length < 2;
  window.SodamCarousel?.init({
    track, thumbs, dots,
    previous: document.getElementById('carousel-prev'),
    next: document.getElementById('carousel-next')
  });
})();
