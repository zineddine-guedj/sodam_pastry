(function () {
  const params = new URLSearchParams(location.search);
  const key = window.SodamConstants?.keys.lastReservation || 'sodam:last-reservation';
  const reference = params.get('ref') || sessionStorage.getItem(key);
  const record = reference ? window.ReservationsStore?.find(reference) : null;
  const set = (id, value) => { const node = document.getElementById(id); if (node) node.textContent = value || ''; };
  if (!record) {
    set('thanks-ref', '—');
    set('thanks-ref-2', '—');
    set('thanks-name', 'you');
    set('thanks-summary', 'Your request details are not available in this browser.');
    return;
  }
  const summary = window.ReservationTemplates?.summary(record) || {};
  set('thanks-ref', record.id);
  set('thanks-ref-2', record.id);
  set('thanks-name', window.SodamFormat?.firstName(record.name) || 'you');
  set('thanks-summary', `${record.pastryName || 'Pastry'} · ${record.servings || 'servings'} · ${summary.date} · ${summary.fulfilment}.`);
  const link = document.getElementById('whatsapp-link');
  const message = `Hello Sodam, I sent reservation ${record.id} for ${record.pastryName || 'a pastry'}. Could you help me with the details?`;
  window.SodamConfig?.load().then(config => {
    if (!link) return;
    link.href = config.whatsappNumber
      ? window.SodamWhatsApp.link(config.whatsappNumber, message)
      : window.SodamWhatsApp.messageLink(message);
  });
  window.ReservationDraft?.clear();
})();
