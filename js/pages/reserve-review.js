(function () {
  const form = document.getElementById('review-form');
  if (!form) return;
  const draftStore = window.ReservationDraft;
  const draft = draftStore?.get() || {};
  const text = (id, value) => { const node = document.getElementById(id); if (node) node.textContent = value || 'Not provided'; };
  const date = draft.date ? new Date(`${draft.date}T12:00:00`) : null;
  const dateLabel = date ? date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : 'Date not selected';
  const timeLabel = (draft.time || '').replace('-', '–');
  text('receipt-pastry', `${draft.pastryName || 'Pastry'} · ${draft.quantity || 1} ${Number(draft.quantity) === 1 ? 'cake' : 'cakes'}`);
  text('receipt-size', `${capitalize(draft.size || 'medium')} · ${draft.servings || '6–8'} servings`);
  text('receipt-when', `${dateLabel} · ${timeLabel}`);
  text('receipt-where', `${capitalize(draft.fulfilment || 'delivery')} · ${draft.city || 'Algiers'}`);
  text('receipt-name', draft.name);
  text('receipt-phone', draft.phone);
  text('receipt-address', draft.fulfilment === 'pickup' ? 'Pickup · address shared after confirmation' : [draft.street, draft.area, draft.city].filter(Boolean).join(', '));
  text('receipt-message', draft.message ? `“${draft.message}”` : 'No cake message added.');
  text('receipt-allergies', draft.allergies || 'No allergies or special requests added.');
  text('receipt-photo', `Inspiration photos: ${draft.inspiration?.length || 0}`);
  text('contact-check', `${draft.name || 'Customer'} · WhatsApp ${draft.phone || ''}${draft.email ? ` · ${draft.email}` : ' · Optional email omitted.'}`);

  function capitalize(value) { return value.charAt(0).toUpperCase() + value.slice(1); }
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!draft.name || !draft.phone || !draft.pastry) {
      location.href = !draft.pastry ? 'reserve-pastry.html' : 'reserve-contact.html';
      return;
    }
    if (!window.ReservationsStore) return;
    const reservation = window.ReservationsStore.create(draft);
    sessionStorage.setItem('sodam:last-reservation', reservation.id);
    location.href = `thank-you.html?ref=${encodeURIComponent(reservation.id)}`;
  });
})();
