(function () {
  const one = (selector, root = document) => root.querySelector(selector);
  const all = (selector, root = document) => [...root.querySelectorAll(selector)];
  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = String(text);
    return node;
  }
  function setText(target, value, fallback = '') {
    const node = typeof target === 'string' ? document.getElementById(target) : target;
    if (node) node.textContent = value == null || value === '' ? fallback : String(value);
    return node;
  }
  function on(target, event, selector, handler) {
    const node = typeof target === 'string' ? one(target) : target;
    if (!node) return () => {};
    const listener = selector ? e => { const match = e.target.closest(selector); if (match && node.contains(match)) handler(e, match); } : handler;
    node.addEventListener(event, listener);
    return () => node.removeEventListener(event, listener);
  }
  window.SodamDOM = { one, all, element, setText, on };
})();
