(function () {
  const form = document.getElementById('login-form');
  if (!form) return;
  const SESSION_KEY = 'sodam:admin-session';
  if (sessionStorage.getItem(SESSION_KEY) === 'active') { location.replace('creations.html'); return; }
  const email = document.getElementById('owner-email');
  const password = document.getElementById('owner-password');
  const error = document.getElementById('login-error');
  const show = (input, message) => {
    const field = input.closest('.field');
    const node = document.getElementById(`${input.id}-message`);
    const invalid = !input.value.trim() || (input === email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value));
    field.classList.toggle('is-invalid', invalid);
    node.textContent = invalid ? (input.value.trim() ? node.dataset.invalid : node.dataset.empty) : '';
    node.hidden = !invalid;
    return !invalid;
  };
  form.addEventListener('submit', event => {
    event.preventDefault();
    error.hidden = true;
    if (!show(email) || !show(password)) { (email.value ? password : email).focus(); return; }
    // Demo-only access: any non-empty password is accepted. Use server authentication before launch.
    sessionStorage.setItem(SESSION_KEY, 'active');
    location.href = 'creations.html';
  });
})();
