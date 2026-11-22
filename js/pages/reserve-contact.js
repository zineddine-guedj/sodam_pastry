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

  const when = document.getElementById('when-summary');
  if (when && draft.dateLabel) when.textContent = `${draft.fulfilment === 'pickup' ? 'Pickup' : 'Delivery'} · ${draft.dateLabel} · ${draft.time || ''}`;
  const pastry = document.getElementById('pastry-summary');
  if (pastry && draft.pastryName) pastry.textContent = `${draft.pastryName} · ${draft.size || 'medium'}, ${draft.servings || '6–8'} servings · ${draft.quantity || 1} ${Number(draft.quantity) === 1 ? 'cake' : 'cakes'}. Your preferred details are saved for this request.`;

  function validate(input) {
    const message = document.getElementById(`${input.id}-message`);
    if (!message) return true;
    const field = input.closest('.field');
    const value = input.value.trim();
    let error = '';
    if (input.required && !value) error = message.dataset.empty || 'Please complete this field.';
    else if (input.id === 'name' && value.length < 2) error = 'Please enter your name.';
    else if (input.id === 'phone' && value && (/[a-z]/i.test(value) || value.replace(/\D/g, '').length < 8)) error = message.dataset.invalid;
    else if (input.id === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = message.dataset.invalid;
    if (message.dataset.valid && input.id !== 'email') {
      message.textContent = error || message.dataset.valid;
      message.hidden = false;
    } else {
      message.textContent = error;
      message.hidden = !error;
    }
    field?.classList.toggle('is-invalid', Boolean(error));
    field?.classList.toggle('is-valid', !error && Boolean(value));
    field?.querySelector('.field__status--valid')?.toggleAttribute('hidden', Boolean(error) || !value);
    field?.querySelector('.field__status--error')?.toggleAttribute('hidden', !error);
    return !error;
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
    draftStore?.update(Object.fromEntries(fieldIds.map(id => [id, document.getElementById(id)?.value.trim() || ''])));
    location.href = 'reserve-review.html';
  });
})();
