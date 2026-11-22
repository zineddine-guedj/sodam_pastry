(function () {
  const key = window.SodamConstants?.keys.messages || 'sodam:messages';
  const storage = window.SodamStorage;
  function all() { const items = storage ? storage.read(key, []) : []; return Array.isArray(items) ? items : []; }
  function create(message) {
    const record = { ...message, id: `MSG-${Date.now()}`, createdAt: new Date().toISOString() };
    const messages = all(); messages.unshift(record);
    if (storage) storage.write(key, messages); else localStorage.setItem(key, JSON.stringify(messages));
    return record;
  }
  function remove(id) {
    const messages = all().filter(item => item.id !== id);
    if (storage) storage.write(key, messages); else localStorage.setItem(key, JSON.stringify(messages));
  }
  window.MessagesStore = { all, create, remove, key };
})();
