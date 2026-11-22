(function () {
  const form = document.getElementById('login-form');
  if (!form) return;
  if (window.SodamAuth?.isAuthenticated()) { location.replace('creations.html'); return; }
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
    const emailValid = show(email);
    const passwordValid = show(password);
    if (!emailValid || !passwordValid) { (emailValid ? password : email).focus(); return; }
    // Demo-only access: any valid email and non-empty password is accepted.
    if (!window.SodamAuth?.signIn(email.value, password.value)) { error.hidden = false; return; }
    location.href = 'creations.html';
  });
})();
