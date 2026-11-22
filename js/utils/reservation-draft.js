/* Keeps a reservation draft between the four pages of the booking flow. */
(function () {
  const KEY = 'sodam:reservation-draft';
  function get() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; }
    catch (error) { return {}; }
  }
  function update(values) {
    const draft = { ...get(), ...values, updatedAt: new Date().toISOString() };
    localStorage.setItem(KEY, JSON.stringify(draft));
    return draft;
  }
  function clear() { localStorage.removeItem(KEY); }
  window.ReservationDraft = { get, update, clear, key: KEY };
})();
