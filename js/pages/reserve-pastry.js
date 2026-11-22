(function () {
  const form = document.getElementById('pastry-form');
  if (!form) return;
  const draft = window.ReservationDraft;
  const saved = draft?.get() || {};
  const params = new URLSearchParams(location.search);
  const options = form.querySelector('.pastry-options');
  const title = document.getElementById('selection-title');
  const qty = document.getElementById('qty-input');
  const qtyOutput = document.getElementById('qty-value');
  const notice = document.getElementById('preselect-notice');
  const noticeText = notice?.querySelector('div > p:last-child');

  function addCreation(item) {
    const label = document.createElement('label');
    label.className = 'pastry-option';
    const input = document.createElement('input');
    input.className = 'pastry-option__input';
    input.type = 'radio';
    input.name = 'pastry';
    input.value = item.id;
    input.dataset.name = item.title;
    input.dataset.creationId = item.id;
    const card = document.createElement('span');
    card.className = 'pastry-option__card';
    const image = document.createElement('img');
    image.src = item.photos?.[0] || 'assets/logo/sodam-logo.png';
    image.alt = item.title;
    image.width = 640;
    image.height = 360;
    const name = document.createElement('span');
    name.className = 'pastry-option__title';
    name.textContent = item.title;
    const cta = document.createElement('span');
    cta.className = 'pastry-option__cta';
    cta.textContent = 'Choose this';
    const selected = document.createElement('span');
    selected.className = 'pastry-option__selected';
    selected.textContent = 'Selected for your reservation';
    card.append(image, name, cta, selected);
    label.append(input, card);
    options.append(label);
  }

  const creationId = params.get('creation');
  const linkedId = creationId || saved.creationId;
  const linked = linkedId ? window.CreationsStore?.find(linkedId) : null;
  if (linked && linked.status === 'published' && ![...options.querySelectorAll('[name="pastry"]')].some(radio => radio.value === linked.id)) addCreation(linked);

  const choice = params.get('pastry') || linked?.id || saved.pastry;
  const radios = [...options.querySelectorAll('[name="pastry"]')];
  const match = radios.find(radio => radio.value === choice) || radios.find(radio => radio.value === 'fruit-cream-cake') || radios[0];
  if (match) match.checked = true;
  if (notice) {
    notice.hidden = !creationId && !params.has('pastry');
    if (linked && noticeText) noticeText.textContent = `${linked.title} is preselected. Keep it or choose another creation below.`;
  }

  function updateSelection() {
    const selected = radios.find(radio => radio.checked);
    if (selected) title.textContent = selected.dataset.name || selected.value;
  }
  function updateQuantity(value) {
    const number = Math.min(20, Math.max(1, Number(value) || 1));
    qty.value = String(number);
    qtyOutput.textContent = `${number} ${number === 1 ? 'item' : 'items'}`;
  }
  radios.forEach(radio => radio.addEventListener('change', updateSelection));
  document.getElementById('qty-minus')?.addEventListener('click', () => updateQuantity(Number(qty.value) - 1));
  document.getElementById('qty-plus')?.addEventListener('click', () => updateQuantity(Number(qty.value) + 1));
  updateSelection();
  updateQuantity(saved.quantity || 1);
  if (saved.size) {
    const size = form.querySelector(`[name="size"][value="${CSS.escape(saved.size)}"]`);
    if (size) size.checked = true;
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    const selected = radios.find(radio => radio.checked);
    const size = form.querySelector('[name="size"]:checked');
    if (!selected || !size) return;
    draft?.update({
      pastry: selected.value,
      pastryName: selected.dataset.name || selected.value,
      pastryPhoto: selected.closest('.pastry-option')?.querySelector('img')?.src || '',
      creationId: selected.dataset.creationId || (window.CreationsStore?.find(selected.value) ? selected.value : ''),
      size: size.value,
      servings: size.dataset.servings,
      quantity: Number(qty.value) || 1
    });
    location.href = 'reserve-details.html';
  });
})();
