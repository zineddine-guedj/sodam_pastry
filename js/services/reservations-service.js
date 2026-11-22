/* Browser-only reservation storage for the prototype. */
(function () {
  const KEY = 'sodam:reservations';
  function all() {
    try {
      const value = JSON.parse(localStorage.getItem(KEY) || '[]');
      return Array.isArray(value) ? value : [];
    } catch (error) { return []; }
  }
  function save(items) {
    localStorage.setItem(KEY, JSON.stringify(items));
    document.dispatchEvent(new CustomEvent('sodam:data-changed', { detail: { key: KEY } }));
  }
  function saveAll(items) { save(items); }
  function create(record) {
    const items = all();
    const reference = `SD-${String(Date.now()).slice(-6)}`;
    const item = { ...record, id: reference, status: 'new', createdAt: new Date().toISOString() };
    items.unshift(item);
    save(items);
    return item;
  }
  function update(id, changes) {
    const items = all();
    const index = items.findIndex(item => item.id === id);
    if (index < 0) return null;
    items[index] = { ...items[index], ...changes, updatedAt: new Date().toISOString() };
    save(items);
    return items[index];
  }
  function find(id) { return all().find(item => item.id === id) || null; }
  window.ReservationsStore = { all, create, update, find, saveAll, key: KEY };
})();
