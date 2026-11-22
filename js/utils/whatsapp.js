(function () {
  function normalize(value) { return String(value || '').replace(/\D/g, ''); }
  function link(number, text = '') {
    const recipient = normalize(number);
    return `https://wa.me/${recipient}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
  }
  function messageLink(text) { return `https://wa.me/?text=${encodeURIComponent(text || '')}`; }
  window.SodamWhatsApp = { normalize, link, messageLink };
})();
