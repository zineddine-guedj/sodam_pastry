(function () {
  const form = document.getElementById('details-form');
  if (!form) return;
  const draftStore = window.ReservationDraft;
  const draft = draftStore?.get() || {};
  if (!draft.pastry) { location.replace('reserve-pastry.html'); return; }
  const monthLabel = document.getElementById('cal-month');
  const calendarBody = document.getElementById('cal-body');
  const selectedDate = document.getElementById('selected-date');
  const dateValue = document.getElementById('date-value');
  const minDate = new Date();
  minDate.setHours(0, 0, 0, 0);
  minDate.setDate(minDate.getDate() + 2);
  let month = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
  let chosen = draft.date ? new Date(`${draft.date}T12:00:00`) : null;
  if (chosen && chosen < minDate) chosen = null;
  if (chosen) month = new Date(chosen.getFullYear(), chosen.getMonth(), 1);

  const pastrySummary = document.getElementById('pastry-summary');
  if (pastrySummary && draft.pastryName) pastrySummary.textContent = `${draft.pastryName} · ${capitalize(draft.size || 'medium')}, ${draft.servings || '6–8'} servings · ${draft.quantity || 1} ${Number(draft.quantity) === 1 ? 'cake' : 'cakes'}`;
  function capitalize(text) { return text.charAt(0).toUpperCase() + text.slice(1); }
  function toYmd(date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; }
  function formatDate(date) { return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); }
  function paintChosen() {
    if (!chosen) return;
    selectedDate.value = formatDate(chosen);
    dateValue.value = toYmd(chosen);
  }
  function renderCalendar() {
    monthLabel.textContent = month.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    calendarBody.replaceChildren();
    const firstDay = (new Date(month.getFullYear(), month.getMonth(), 1).getDay() + 6) % 7;
    const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    let row = document.createElement('tr');
    for (let i = 0; i < firstDay; i++) row.append(document.createElement('td'));
    for (let day = 1; day <= days; day++) {
      if (row.children.length === 7) { calendarBody.append(row); row = document.createElement('tr'); }
      const cell = document.createElement('td');
      const date = new Date(month.getFullYear(), month.getMonth(), day, 12);
      const button = document.createElement('button');
      button.className = 'calendar__day';
      button.type = 'button';
      button.dataset.date = toYmd(date);
      button.textContent = String(day);
      button.disabled = date < minDate;
      if (chosen && toYmd(chosen) === button.dataset.date) {
        button.classList.add('is-selected');
        button.setAttribute('aria-pressed', 'true');
      } else button.setAttribute('aria-pressed', 'false');
      cell.append(button);
      row.append(cell);
    }
    while (row.children.length && row.children.length < 7) row.append(document.createElement('td'));
    if (row.children.length) calendarBody.append(row);
  }
  document.getElementById('cal-prev')?.addEventListener('click', () => {
    const previous = new Date(month.getFullYear(), month.getMonth() - 1, 1);
    const firstAllowedMonth = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
    if (previous >= firstAllowedMonth) { month = previous; renderCalendar(); }
  });
  document.getElementById('cal-next')?.addEventListener('click', () => { month = new Date(month.getFullYear(), month.getMonth() + 1, 1); renderCalendar(); });
  calendarBody.addEventListener('click', event => {
    const button = event.target.closest('[data-date]');
    if (!button || button.disabled) return;
    chosen = new Date(`${button.dataset.date}T12:00:00`);
    paintChosen();
    renderCalendar();
  });
  if (chosen) paintChosen();
  renderCalendar();

  const time = form.querySelector(`[name="time"][value="${CSS.escape(draft.time || '14:00-16:00')}"]`);
  if (time) time.checked = true;
  const fulfilment = form.querySelector(`[name="fulfilment"][value="${CSS.escape(draft.fulfilment || 'delivery')}"]`);
  if (fulfilment) fulfilment.checked = true;
  const message = document.getElementById('cake-message');
  const allergies = document.getElementById('allergies');
  if (message) message.value = draft.message || '';
  if (allergies) allergies.value = draft.allergies || '';
  const fulfilmentNote = document.getElementById('fulfilment-note');
  const updateFulfilment = () => {
    const mode = form.querySelector('[name="fulfilment"]:checked')?.value || 'delivery';
    fulfilmentNote.textContent = fulfilmentNote.dataset[mode];
  };
  form.querySelectorAll('[name="fulfilment"]').forEach(input => input.addEventListener('change', updateFulfilment));
  updateFulfilment();

  const uploadInput = document.getElementById('inspiration');
  const uploadList = document.getElementById('upload-list');
  let photos = Array.isArray(draft.inspiration) ? [...draft.inspiration] : [];
  function renderPhotos() {
    uploadList.replaceChildren();
    photos.forEach((src, index) => {
      const li = document.createElement('li');
      const img = document.createElement('img');
      img.src = src;
      img.alt = `Inspiration photo ${index + 1}`;
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.dataset.removePhoto = String(index);
      remove.textContent = 'Remove';
      li.append(img, remove);
      uploadList.append(li);
    });
  }
  async function compress(file) {
    if (!/^image\/(jpeg|png)$/.test(file.type) || file.size > 10 * 1024 * 1024) throw new Error('Choose a JPG or PNG under 10 MB.');
    const src = await new Promise((resolve, reject) => {
      const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(file);
    });
    const image = await new Promise((resolve, reject) => { const img = new Image(); img.onload = () => resolve(img); img.onerror = reject; img.src = src; });
    const scale = Math.min(1, 1000 / Math.max(image.width, image.height));
    const canvas = document.createElement('canvas'); canvas.width = Math.round(image.width * scale); canvas.height = Math.round(image.height * scale);
    canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.72);
  }
  uploadInput?.addEventListener('change', async () => {
    try { for (const file of uploadInput.files) photos.push(await compress(file)); renderPhotos(); }
    catch (error) { window.alert(error.message || 'Could not read the selected photo.'); }
    uploadInput.value = '';
  });
  uploadList?.addEventListener('click', event => {
    const button = event.target.closest('[data-remove-photo]');
    if (!button) return;
    photos.splice(Number(button.dataset.removePhoto), 1); renderPhotos();
  });
  renderPhotos();

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!chosen) { document.getElementById('cal-next').focus(); return; }
    const timeValue = form.querySelector('[name="time"]:checked')?.value;
    const fulfilmentValue = form.querySelector('[name="fulfilment"]:checked')?.value;
    if (!timeValue || !fulfilmentValue) return;
    draftStore?.update({ date: toYmd(chosen), dateLabel: formatDate(chosen), time: timeValue, fulfilment: fulfilmentValue, message: message.value.trim(), allergies: allergies.value.trim(), inspiration: photos });
    location.href = 'reserve-contact.html';
  });
})();
