(function () {
  const KEY = window.SodamConstants?.keys.reservationDraft || 'sodam:reservation-draft';
  function get() {
    if (window.SodamStorage) {
      const value = window.SodamStorage.read(KEY, {});
      return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    }
    try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; }
    catch (error) { return {}; }
  }
  function update(values) {
    const value = { ...get(), ...values, updatedAt: new Date().toISOString() };
    if (window.SodamStorage) window.SodamStorage.write(KEY, value);
    else localStorage.setItem(KEY, JSON.stringify(value));
    return value;
  }
  function clear() {
    if (window.SodamStorage) window.SodamStorage.remove(KEY);
    else localStorage.removeItem(KEY);
  }
  window.ReservationDraft = { get, update, clear, key: KEY };
})();
