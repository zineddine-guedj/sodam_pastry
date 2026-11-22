(function () {
  const params = new URLSearchParams(location.search);
  const ref = params.get('ref') || sessionStorage.getItem('sodam:last-reservation');
  const record = ref ? window.ReservationsStore?.find(ref) : null;
  if (!record) return;
  const set = (id, value) => { const node = document.getElementById(id); if (node) node.textContent = value; };
  const date = record.date ? new Date(`${record.date}T12:00:00`) : null;
  const dateLabel = date ? date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : '';
  set('thanks-ref', record.id);
  set('thanks-ref-2', record.id);
  set('thanks-name', (record.name || '').split(' ')[0] || 'you');
  set('thanks-summary', `${record.pastryName || 'Pastry'} · ${record.servings || ''} servings · ${dateLabel} · ${record.fulfilment || 'delivery'}.`);
  const link = document.getElementById('whatsapp-link');
  if (link) {
    const message = `Hello Sodam, I sent reservation ${record.id} for ${record.pastryName || 'a pastry'}. Could you help me with the details?`;
    link.href = `https://wa.me/?text=${encodeURIComponent(message)}`;
  }
  window.ReservationDraft?.clear();
})();
