/* =========================================================
   Sodam Pastry · main.js (runs on every page)
   Loaded as a module: <script type="module" src="js/main.js">
   1. Marks the page as "JS ready"
   2. Mobile menu (open, close, Escape, outside click)
   3. Warns when the browser blocks saving
   4. Tells the page to re-draw when the data changed elsewhere
   Page scripts do NOT import this file.
   ========================================================= */

const STORAGE_PREFIX = window.SodamConstants?.storagePrefix || 'sodam:';
const DATA_CHANGED_EVENT = window.SodamConstants?.events.dataChanged || 'sodam:data-changed';


/* ---------- 1. JS ready ---------- */
document.documentElement.classList.add('js');


/* ---------- 2. Mobile menu ---------- */
function initMobileMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;

  const isOpen = () => nav.classList.contains('is-open');

  const setOpen = (open) => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };

  toggle.addEventListener('click', () => setOpen(!isOpen()));

  // Escape closes the menu and gives focus back to the button
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) {
      setOpen(false);
      toggle.focus();
    }
  });

  // A click outside closes it
  document.addEventListener('click', (event) => {
    if (isOpen() && !nav.contains(event.target) && !toggle.contains(event.target)) {
      setOpen(false);
    }
  });

  // Choosing a link closes it
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });

  // Back to the desktop layout: reset the state
  window.matchMedia('(min-width: 1024px)').addEventListener('change', (event) => {
    if (event.matches) setOpen(false);
  });
}


/* ---------- 3. Saving blocked? ---------- */
function isStorageAvailable() {
  if (window.SodamStorage) return window.SodamStorage.available();
  try {
    const probe = `${STORAGE_PREFIX}probe`;
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    return true;
  } catch (error) {
    return false;
  }
}

function warnIfStorageBlocked() {
  if (isStorageAvailable()) return;

  document.documentElement.dataset.storage = 'unavailable';

  const banner = document.createElement('aside');
  banner.className = 'notice';
  banner.setAttribute('role', 'alert');
  banner.innerHTML = `
    <div>
      <p class="notice__title">Saving is turned off in this browser</p>
      <p>Please allow site data (or leave private browsing) so reservations and creations can be saved.</p>
    </div>`;

  const host = document.querySelector('main .container') || document.querySelector('main');
  if (host) host.prepend(banner);
}


/* ---------- 4. Refresh when the data changes ---------- */
// storage.js fires the same event for changes made in THIS tab.
// The browser's "storage" event covers OTHER tabs (the owner adds a
// creation in one tab, the public page in another one updates).
function announceDataChange(key) {
  document.dispatchEvent(new CustomEvent(DATA_CHANGED_EVENT, { detail: { key } }));
}

window.addEventListener('storage', (event) => {
  // event.key is null when the whole storage is cleared
  if (event.key === null || event.key.startsWith(STORAGE_PREFIX)) {
    announceDataChange(event.key);
  }
});

// Back/forward button restores an old copy of the page: refresh it too
window.addEventListener('pageshow', (event) => {
  if (event.persisted) announceDataChange(null);
});


/* ---------- Start ---------- */
initMobileMenu();
warnIfStorageBlocked();
