/* Browser-only reservation storage for the prototype. */
(function () {
  const KEY = window.SodamConstants?.keys.reservations || 'sodam:reservations';
  const storage = window.SodamStorage;
  function all() {
    const value = storage ? storage.read(KEY, []) : [];
    return Array.isArray(value) ? value : [];
  }
  function save(items) {
    if (storage) storage.write(KEY, items);
    else { localStorage.setItem(KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('sodam:data-changed', { detail: { key: KEY } })); }
    return items;
  }
  function saveAll(items) { return save(items); }
  function create(record) {
    const items = all();
    let id;
    do { id = window.SodamFormat?.reference() || `SD-${String(Date.now()).slice(-6)}`; }
    while (items.some(item => item.id === id));
    const item = { ...record, id, status: 'new', createdAt: new Date().toISOString() };
    items.unshift(item); save(items); return item;
  }
  function update(id, changes) {
    const items = all();
    const index = items.findIndex(item => item.id === id);
    if (index < 0) return null;
    items[index] = { ...items[index], ...changes, updatedAt: new Date().toISOString() };
    save(items); return items[index];
  }
  function find(id) { return all().find(item => item.id === id) || null; }
  window.ReservationsStore = { all, create, update, find, saveAll, key: KEY };
})();
