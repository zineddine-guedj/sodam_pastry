(function () {
  function capitalize(value) { return window.SodamFormat?.capitalize(value) || String(value || ''); }
  function summary(draft = {}) {
    const quantity = Number(draft.quantity) || 1;
    return {
      pastry: `${draft.pastryName || 'Pastry'} · ${quantity} ${quantity === 1 ? 'item' : 'items'}`,
      size: `${capitalize(draft.size || 'medium')} · ${draft.servings || '6–8'} servings`,
      date: draft.date ? (window.SodamFormat?.date(draft.date, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) || draft.date) : '',
      time: window.SodamFormat?.timeRange(draft.time) || '',
      fulfilment: capitalize(draft.fulfilment || 'delivery'),
      address: draft.fulfilment === 'pickup' ? 'Pickup · details shared after confirmation' : [draft.street, draft.area, draft.city].filter(Boolean).join(', ')
    };
  }
  function setText(id, value, fallback = 'Not provided') {
    const node = document.getElementById(id);
    if (node) node.textContent = value || fallback;
  }
  window.ReservationTemplates = { summary, setText };
})();
