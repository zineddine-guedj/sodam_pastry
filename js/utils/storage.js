(function () {
  const eventName = window.SodamConstants?.events.dataChanged || 'sodam:data-changed';
  function read(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : JSON.parse(value);
    } catch (error) { return fallback; }
  }
  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
    document.dispatchEvent(new CustomEvent(eventName, { detail: { key } }));
    return value;
  }
  function remove(key) {
    localStorage.removeItem(key);
    document.dispatchEvent(new CustomEvent(eventName, { detail: { key } }));
  }
  function available() {
    try {
      const key = 'sodam:storage-probe';
      localStorage.setItem(key, 'ok'); localStorage.removeItem(key); return true;
    } catch (error) { return false; }
  }
  window.SodamStorage = { read, write, remove, available };
})();
