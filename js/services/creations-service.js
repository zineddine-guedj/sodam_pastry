/* Browser-only creation storage for the prototype. Replace with an API/database for shared publishing. */
(function () {
  const KEY = 'sodam:creations';
  const EVENT = 'sodam:data-changed';

  function all() {
    try {
      const items = JSON.parse(localStorage.getItem(KEY) || '[]');
      return Array.isArray(items) ? items : [];
    } catch (error) {
      return [];
    }
  }

  function save(items) {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
      document.dispatchEvent(new CustomEvent(EVENT, { detail: { key: KEY } }));
      return true;
    } catch (error) {
      throw new Error('Could not save. The browser storage is full; use fewer or smaller photos.');
    }
  }

  function upsert(creation) {
    const items = all();
    const index = items.findIndex(item => item.id === creation.id);
    if (index === -1) items.unshift(creation);
    else items[index] = creation;
    save(items);
  }

  function remove(id) { save(all().filter(item => item.id !== id)); }
  function find(id) { return all().find(item => item.id === id) || null; }
  function slugify(value) {
    return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `creation-${Date.now()}`;
  }

  window.CreationsStore = { all, upsert, remove, find, slugify, key: KEY };
})();
