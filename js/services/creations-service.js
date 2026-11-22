/* Browser-only creation storage for the prototype. Replace with an API/database for shared publishing. */
(function () {
  const KEY = window.SodamConstants?.keys.creations || 'sodam:creations';
  const storage = window.SodamStorage;
  function all() {
    const items = storage ? storage.read(KEY, []) : [];
    return Array.isArray(items) ? items : [];
  }
  function save(items) {
    try {
      if (storage) storage.write(KEY, items);
      else { localStorage.setItem(KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('sodam:data-changed', { detail: { key: KEY } })); }
    } catch (error) { throw new Error('Could not save. The browser storage is full; use fewer or smaller photos.'); }
    return items;
  }
  function upsert(creation) {
    const items = all();
    const index = items.findIndex(item => item.id === creation.id);
    if (index === -1) items.unshift(creation); else items[index] = creation;
    save(items);
  }
  function remove(id) { save(all().filter(item => item.id !== id)); }
  function find(id) { return all().find(item => item.id === id) || null; }
  function slugify(value) {
    return String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `creation-${Date.now()}`;
  }
  window.CreationsStore = { all, upsert, remove, find, slugify, key: KEY };
})();
