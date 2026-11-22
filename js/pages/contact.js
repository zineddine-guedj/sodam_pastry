(function () {
  const form = document.getElementById('message-form');
  if (!form) return;
  const status = document.getElementById('form-status');
  const fields = [document.getElementById('msg-name'), document.getElementById('msg-email'), document.getElementById('msg-text')];
  const validator = window.SodamValidator;

  function validate(input) {
    const output = document.getElementById(`${input.id}-message`);
    const value = input.value.trim();
    const error = !validator.required(value) ? output.dataset.empty : input.type === 'email' && !validator.email(value) ? output.dataset.invalid : '';
    return validator.message(input, error);
  }
  fields.forEach(input => {
    input.addEventListener('blur', () => validate(input));
    input.addEventListener('input', () => { const output = document.getElementById(`${input.id}-message`); if (!output.hidden) validate(input); });
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    status.hidden = true;
    if (!fields.map(validate).every(Boolean)) { form.querySelector('.is-invalid input, .is-invalid textarea')?.focus(); return; }
    try {
      window.MessagesStore.create({ name: fields[0].value.trim(), email: fields[1].value.trim(), message: fields[2].value.trim() });
      form.reset();
      status.textContent = 'Thank you for your note. It has been saved in this browser.';
    } catch (error) {
      status.textContent = 'This browser could not save your note. Please contact us through Instagram.';
    }
    status.hidden = false;
  });

  window.SodamConfig?.load().then(config => {
    const phone = document.getElementById('contact-phone');
    const email = document.getElementById('contact-email');
    if (phone && config.phone) { phone.textContent = config.phone; phone.href = `tel:${config.phone.replace(/[^+\d]/g, '')}`; }
    if (email && config.email) { email.textContent = config.email; email.href = `mailto:${config.email}`; }
    const hours = document.getElementById('contact-hours');
    if (hours && Array.isArray(config.hours)) {
      hours.replaceChildren(...config.hours.map(line => { const li = document.createElement('li'); li.textContent = line; return li; }));
    }
  });
})();
