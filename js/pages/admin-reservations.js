(function () {
  const list = document.getElementById('reservation-list');
  if (!list) return;
  if (!window.SodamAuth?.requireLogin('login.html')) return;
  const store = window.ReservationsStore;
  if (!store) return;
  const labels = { new: 'New', confirmed: 'Confirmed', completed: 'Completed', cancelled: 'Cancelled' };
  let filter = 'all';
  let selectedId = null;
  const actionStatus = document.createElement('p');
  actionStatus.className = 'field__help';
  actionStatus.setAttribute('role', 'status');
  actionStatus.setAttribute('aria-live', 'polite');
  document.getElementById('closer-look').querySelector('.closer-look__actions').before(actionStatus);

  function seedDemoRows() {
    if (store.all().length) return;
    const records = [...list.querySelectorAll('.reservation-card')].map(card => {
      const date = card.querySelector('time')?.dateTime || '';
      return {
        id: card.dataset.id,
        status: card.dataset.status || 'new',
        name: card.querySelector('.reservation-card__name')?.textContent || 'Customer',
        pastryName: card.querySelector('.reservation-card__title')?.textContent || 'Pastry',
        size: card.querySelector('.reservation-card__size')?.textContent || '',
        date,
        time: card.querySelector('.reservation-card__time')?.textContent.replace('–', '-') || '',
        fulfilment: 'delivery', city: 'Algiers', phone: '', quantity: 1,
        ...(card.dataset.id === 'SD-0107' ? {
          phone: document.getElementById('look-phone').textContent,
          street: '12 Rue des Jasmins', area: 'Hydra', city: 'Algiers',
          message: 'Happy birthday, Lina', allergies: 'No nuts, please. Blush flowers.'
        } : {})
      };
    });
    if (records.length) store.saveAll(records);
  }

  function fmtDate(value) {
    if (!value) return 'Date not set';
    return new Date(`${value}T12:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }
  function renderPanel(record) {
    const panel = document.getElementById('closer-look');
    actionStatus.textContent = '';
    if (!record) { panel.hidden = true; return; }
    panel.hidden = false;
    panel.dataset.id = record.id;
    const set = (id, value) => { const node = document.getElementById(id); if (node) node.textContent = value || 'Not provided'; };
    set('look-ref', record.id);
    set('look-name', record.name);
    set('look-first-name', (record.name || '').split(' ')[0]);
    set('look-phone', record.phone);
    set('look-where', `${(record.fulfilment || 'delivery') === 'pickup' ? 'Pickup' : 'Delivery'} · ${record.street || 'Address to confirm'}`);
    set('look-area', [record.area, record.city].filter(Boolean).join(', '));
    set('look-when', `${fmtDate(record.date)} · ${(record.time || '').replace('-', '–')}`);
    set('look-pastry', `${record.pastryName || 'Pastry'} · ${record.size || ''}`);
    set('look-servings', `${record.servings || record.size || ''} · ${record.quantity || 1} ${Number(record.quantity) === 1 ? 'item' : 'items'}`);
    set('look-message', record.message ? `Message: “${record.message}”` : 'No cake message.');
    set('look-allergies', record.allergies || 'No allergies or special requests.');
    set('look-photo', `Inspiration photos: ${record.inspiration?.length || 0}`);
    const badge = document.getElementById('look-status');
    badge.textContent = labels[record.status] || 'New';
    badge.className = `chip chip--status chip--${record.status}`;
    const digits = (record.phone || '').replace(/\D/g, '');
    const whatsapp = document.getElementById('look-whatsapp');
    const message = `Hello ${record.name || 'there'}, I’m contacting you from Sodam Pastry about your reservation ${record.id}.`;
    whatsapp.href = digits ? window.SodamWhatsApp.link(digits, message) : window.SodamWhatsApp.messageLink(message);
  }
  function render() {
    const records = store.all().sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    const counts = { all: records.length, new: 0, confirmed: 0, completed: 0, cancelled: 0 };
    records.forEach(record => { counts[record.status] = (counts[record.status] || 0) + 1; });
    Object.entries(counts).forEach(([key, value]) => {
      const node = document.querySelector(`[data-count="${key}"]`);
      if (node) node.textContent = String(value);
      const stat = document.getElementById(`count-${key}`);
      if (stat) stat.textContent = String(value).padStart(2, '0');
    });
    const visible = records.filter(record => filter === 'all' || record.status === filter);
    list.replaceChildren();
    visible.forEach(record => {
      const card = document.createElement('li');
      card.className = `reservation-card${record.status === 'new' ? ' is-new' : ''}`;
      card.dataset.id = record.id;
      card.dataset.status = record.status;
      const ref = document.createElement('p'); ref.className = 'reservation-card__ref'; ref.textContent = record.id;
      const name = document.createElement('h2'); name.className = 'reservation-card__name'; name.textContent = record.name || 'Customer';
      const pastry = document.createElement('div'); pastry.className = 'reservation-card__pastry';
      const creation = record.creationId ? window.CreationsStore?.find(record.creationId) : null;
      const img = document.createElement('img'); img.className = 'reservation-card__img'; img.src = record.pastryPhoto || creation?.photos?.[0] || '../assets/logo/sodam-logo.png'; img.alt = '';
      const pastryInfo = document.createElement('div');
      const pastryName = document.createElement('p'); pastryName.className = 'reservation-card__title'; pastryName.textContent = record.pastryName || 'Pastry';
      const size = document.createElement('p'); size.className = 'reservation-card__size'; size.textContent = record.size || '';
      pastryInfo.append(pastryName, size); pastry.append(img, pastryInfo);
      const when = document.createElement('p'); when.className = 'reservation-card__date'; const timeNode = document.createElement('time'); timeNode.dateTime = record.date || ''; timeNode.textContent = fmtDate(record.date); when.append(timeNode);
      const time = document.createElement('p'); time.className = 'reservation-card__time'; time.textContent = (record.time || '').replace('-', '–');
      const foot = document.createElement('div'); foot.className = 'reservation-card__foot';
      const badge = document.createElement('span'); badge.className = `chip chip--status chip--${record.status}`; badge.textContent = labels[record.status] || 'New';
      const review = document.createElement('button'); review.className = 'link-button'; review.type = 'button'; review.dataset.action = 'review'; review.setAttribute('aria-controls', 'closer-look'); review.textContent = 'Review';
      foot.append(badge, review); card.append(ref, name, pastry, when, time, foot); list.append(card);
    });
    const empty = document.getElementById('empty-state');
    empty.hidden = visible.length > 0;
    document.getElementById('list-label').textContent = `${filter === 'all' ? 'All reservations' : `${labels[filter]} reservations`} · Newest first`;
    const selected = store.find(selectedId) || records[0];
    selectedId = selected?.id || null;
    renderPanel(selected);
  }

  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    filter = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(item => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    render();
  }));
  list.addEventListener('click', event => {
    const button = event.target.closest('[data-action="review"]');
    if (!button) return;
    selectedId = button.closest('[data-id]').dataset.id;
    renderPanel(store.find(selectedId));
    document.getElementById('closer-look').focus();
  });
  document.getElementById('closer-look').addEventListener('click', event => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (!['confirm', 'complete', 'cancel'].includes(action)) return;
    const next = { confirm: 'confirmed', complete: 'completed', cancel: 'cancelled' }[action];
    try {
      store.update(selectedId, { status: next });
      render();
      actionStatus.textContent = `Reservation ${selectedId} marked ${labels[next].toLowerCase()}.`;
    } catch (error) {
      actionStatus.textContent = 'Could not update this reservation in the browser. Please try again.';
    }
  });
  document.getElementById('view-all')?.addEventListener('click', () => {
    filter = 'all';
    const all = document.querySelector('[data-filter="all"]');
    all?.click();
  });
  document.addEventListener('sodam:data-changed', event => { if (event.detail?.key === store.key) render(); });
  seedDemoRows();
  render();
})();
