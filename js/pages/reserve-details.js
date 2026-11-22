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
  const minBookingAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
  const minDate = new Date(minBookingAt.getFullYear(), minBookingAt.getMonth(), minBookingAt.getDate());
  let month = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
  let chosen = draft.date ? new Date(`${draft.date}T12:00:00`) : null;
  if (chosen && chosen < minDate) chosen = null;
  if (chosen) month = new Date(chosen.getFullYear(), chosen.getMonth(), 1);

  const pastrySummary = document.getElementById('pastry-summary');
  const reservationSummary = window.ReservationTemplates?.summary(draft);
  if (pastrySummary && draft.pastryName) pastrySummary.textContent = `${reservationSummary.pastry} · ${reservationSummary.size}`;
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
      button.setAttribute('aria-label', date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
      const today = new Date();
      if (toYmd(today) === button.dataset.date) button.classList.add('is-today');
      const latestSlot = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 16);
      button.disabled = latestSlot < minBookingAt;
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
    document.querySelector('.calendar__note').textContent = '48h notice · dates remain subject to availability.';
    paintChosen();
    renderCalendar();
  });
  if (chosen) paintChosen();
  else { selectedDate.value = ''; dateValue.value = ''; }
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
  form.querySelectorAll('[name="time"]').forEach(input => input.addEventListener('change', () => {
    document.querySelector('.calendar__note').textContent = '48h notice · dates remain subject to availability.';
  }));
  updateFulfilment();

  const uploadInput = document.getElementById('inspiration');
  const uploadList = document.getElementById('upload-list');
  const uploadStatus = document.getElementById('upload-status');
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
      remove.setAttribute('aria-label', `Remove inspiration photo ${index + 1}`);
      li.append(img, remove);
      uploadList.append(li);
    });
    uploadStatus.textContent = photos.length
      ? `${photos.length} inspiration photo${photos.length === 1 ? '' : 's'} ready.`
      : 'Photos are optional. Each image is resized before it is saved.';
  }

  uploadInput?.addEventListener('change', async () => {
    const selectedFiles = [...uploadInput.files];
    uploadInput.disabled = true;
    uploadStatus.textContent = `Preparing ${selectedFiles.length} photo${selectedFiles.length === 1 ? '' : 's'}…`;
    try {
      for (const file of selectedFiles) photos.push(await window.SodamImages.read(file, { maxDimension: 1000, quality: 0.72 }));
      renderPhotos();
    } catch (error) {
      uploadStatus.textContent = error.message || 'Could not read the selected photo.';
    } finally {
      uploadInput.disabled = false;
      uploadInput.value = '';
    }
  });
  uploadList?.addEventListener('click', event => {
    const button = event.target.closest('[data-remove-photo]');
    if (!button) return;
    photos.splice(Number(button.dataset.removePhoto), 1); renderPhotos();
  });
  renderPhotos();

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!chosen) {
      const note = document.querySelector('.calendar__note');
      if (note) note.textContent = 'Choose a preferred date to continue.';
      document.getElementById('cal-month').focus();
      return;
    }
    const timeValue = form.querySelector('[name="time"]:checked')?.value;
    const fulfilmentValue = form.querySelector('[name="fulfilment"]:checked')?.value;
    if (!timeValue || !fulfilmentValue) return;
    const startHour = Number(timeValue.slice(0, 2));
    const requestedAt = new Date(chosen.getFullYear(), chosen.getMonth(), chosen.getDate(), startHour);
    if (requestedAt < minBookingAt) {
      const note = document.querySelector('.calendar__note');
      if (note) note.textContent = 'Please choose a time at least 48 hours from now, subject to availability.';
      return;
    }
    try {
      draftStore?.update({ date: toYmd(chosen), dateLabel: formatDate(chosen), time: timeValue, fulfilment: fulfilmentValue, message: message.value.trim(), allergies: allergies.value.trim(), inspiration: photos });
    } catch (error) {
      const note = document.querySelector('.calendar__note');
      if (note) note.textContent = 'This browser could not save your details. Remove some inspiration photos and try again.';
      return;
    }
    location.href = 'reserve-contact.html';
  });
})();
