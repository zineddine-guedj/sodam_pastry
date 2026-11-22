(function () {
  function date(value, options = { day: 'numeric', month: 'short', year: 'numeric' }) {
    if (!value) return '';
    const parsed = value instanceof Date ? value : new Date(`${String(value).slice(0, 10)}T12:00:00`);
    return Number.isNaN(parsed.getTime()) ? '' : parsed.toLocaleDateString('en-GB', options);
  }
  function timeRange(value) { return String(value || '').replace('-', '–'); }
  function capitalize(value) { const text = String(value || ''); return text ? text[0].toUpperCase() + text.slice(1) : ''; }
  function digits(value) { return String(value || '').replace(/\D/g, ''); }
  function firstName(value) { return String(value || '').trim().split(/\s+/)[0] || ''; }
  function reference() { return `SD-${String(Date.now()).slice(-6)}`; }
  window.SodamFormat = { date, timeRange, capitalize, digits, firstName, reference };
})();
