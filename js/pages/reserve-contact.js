(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const draftStore = window.ReservationDraft;
  const draft = draftStore?.get() || {};
  const fieldIds = ['name', 'phone', 'email', 'street', 'area', 'city'];
  fieldIds.forEach(id => { const input = document.getElementById(id); if (input) input.value = draft[id] || ''; });
  const address = document.getElementById('address-fieldset');
  const fulfilment = draft.fulfilment || 'delivery';
  function updateAddress() {
    const isDelivery = fulfilment === 'delivery';
    address.hidden = !isDelivery;
    address.querySelectorAll('input').forEach(input => { input.required = isDelivery; input.disabled = !isDelivery; });
  }
  updateAddress();

  const summary = window.ReservationTemplates?.summary(draft);
  const when = document.getElementById('when-summary');
  if (when && draft.dateLabel) when.textContent = `${summary?.fulfilment || 'Delivery'} · ${draft.dateLabel} · ${summary?.time || ''}`;
  const pastry = document.getElementById('pastry-summary');
  if (pastry && draft.pastryName) pastry.textContent = `${summary?.pastry || draft.pastryName} · ${summary?.size || 'Medium · 6–8 servings'}. Your preferred details are saved for this request.`;

  function validate(input) {
    const message = document.getElementById(`${input.id}-message`);
    if (!message) return true;
    const field = input.closest('.field');
    const value = input.value.trim();
    let error = '';
    const validator = window.SodamValidator;
    if (input.required && !validator.required(value)) error = message.dataset.empty || 'Please complete this field.';
    else if (input.id === 'name' && !validator.length(value, 2)) error = 'Please enter your name.';
    else if (input.id === 'phone' && value && !validator.phone(value)) error = message.dataset.invalid;
    else if (input.id === 'email' && !validator.email(value)) error = message.dataset.invalid;
    return validator.message(input, error, !error && value && input.id !== 'email' ? message.dataset.valid || '' : '');
  }

  fieldIds.forEach(id => {
    const input = document.getElementById(id);
    if (!input) return;
    input.addEventListener('blur', () => validate(input));
    input.addEventListener('input', () => { if (!document.getElementById(`${id}-message`).hidden) validate(input); });
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const valid = fieldIds.map(id => document.getElementById(id)).filter(input => input && !input.disabled).map(validate).every(Boolean);
    document.getElementById('form-error').hidden = valid;
    if (!valid) {
      form.querySelector('.is-invalid .field__input')?.focus();
      return;
    }
    try {
      draftStore?.update(Object.fromEntries(fieldIds.map(id => [id, document.getElementById(id)?.value.trim() || ''])));
    } catch (error) {
      const formError = document.getElementById('form-error');
      formError.textContent = 'This browser could not save your details. Please try again.';
      formError.hidden = false;
      return;
    }
    location.href = 'reserve-review.html';
  });
})();
