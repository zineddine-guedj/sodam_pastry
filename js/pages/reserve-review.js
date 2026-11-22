(function () {
  const form = document.getElementById('review-form');
  if (!form) return;
  const draftStore = window.ReservationDraft;
  const draft = draftStore?.get() || {};
  const summary = window.ReservationTemplates?.summary(draft) || {};
  const set = window.ReservationTemplates?.setText || ((id, value) => { const node = document.getElementById(id); if (node) node.textContent = value || 'Not provided'; });
  set('receipt-pastry', summary.pastry);
  set('receipt-size', summary.size);
  set('receipt-when', `${summary.date || 'Date not selected'} · ${summary.time || ''}`);
  set('receipt-where', `${summary.fulfilment || 'Delivery'} · ${draft.city || 'Algiers'}`);
  set('receipt-name', draft.name);
  set('receipt-phone', draft.phone);
  set('receipt-address', summary.address, 'Address not provided');
  set('receipt-message', draft.message ? `“${draft.message}”` : 'No cake message added.');
  set('receipt-allergies', draft.allergies || 'No allergies or special requests added.');
  set('receipt-photo', `Inspiration photos: ${draft.inspiration?.length || 0}`);
  set('contact-check', `${draft.name || 'Customer'} · WhatsApp ${draft.phone || ''}${draft.email ? ` · ${draft.email}` : ' · Optional email omitted.'}`);

  const problem = document.createElement('p');
  problem.className = 'form-error';
  problem.setAttribute('role', 'alert');
  problem.hidden = true;
  form.prepend(problem);
  form.addEventListener('submit', event => {
    event.preventDefault();
    const missingPastry = !draft.pastry || !draft.pastryName;
    const missingDetails = !draft.date || !draft.time || !draft.fulfilment;
    const missingContact = !draft.name || !draft.phone || (draft.fulfilment === 'delivery' && (!draft.street || !draft.area || !draft.city));
    if (missingPastry || missingDetails || missingContact) {
      location.href = missingPastry ? 'reserve-pastry.html' : missingDetails ? 'reserve-details.html' : 'reserve-contact.html';
      return;
    }
    try {
      const reservation = window.ReservationsStore.create(draft);
      sessionStorage.setItem(window.SodamConstants?.keys.lastReservation || 'sodam:last-reservation', reservation.id);
      location.href = `thank-you.html?ref=${encodeURIComponent(reservation.id)}`;
    } catch (error) {
      problem.textContent = 'We could not save this request in your browser. Please try again or contact us on Instagram.';
      problem.hidden = false;
    }
  });
})();
