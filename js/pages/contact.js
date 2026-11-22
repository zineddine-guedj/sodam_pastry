(function () {
  const form = document.getElementById('message-form');
  if (!form) return;
  const status = document.getElementById('form-status');
  const fields = [document.getElementById('msg-name'), document.getElementById('msg-email'), document.getElementById('msg-text')];
  function validate(input) {
    const message = document.getElementById(`${input.id}-message`);
    const value = input.value.trim();
    let error = '';
    if (input.required && !value) error = message.dataset.empty;
    else if (input.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = message.dataset.invalid;
    message.textContent = error;
    message.hidden = !error;
    input.closest('.field').classList.toggle('is-invalid', Boolean(error));
    return !error;
  }
  fields.forEach(input => {
    input.addEventListener('blur', () => validate(input));
    input.addEventListener('input', () => { const message = document.getElementById(`${input.id}-message`); if (!message.hidden) validate(input); });
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    status.hidden = true;
    if (!fields.map(validate).every(Boolean)) { form.querySelector('.is-invalid input, .is-invalid textarea')?.focus(); return; }
    try {
      let messages = [];
      try { messages = JSON.parse(localStorage.getItem('sodam:messages') || '[]'); } catch (error) { messages = []; }
      messages.unshift({ id: `MSG-${Date.now()}`, name: fields[0].value.trim(), email: fields[1].value.trim(), message: fields[2].value.trim(), createdAt: new Date().toISOString() });
      localStorage.setItem('sodam:messages', JSON.stringify(messages));
      form.reset();
      status.textContent = 'Thank you for your note. It has been saved in this browser.';
      status.hidden = false;
    } catch (error) {
      status.textContent = 'This browser could not save your note. Please contact us through Instagram.';
      status.hidden = false;
    }
  });
})();
