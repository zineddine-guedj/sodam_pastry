(function () {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  function email(value) { return !value || emailPattern.test(String(value).trim()); }
  function phone(value) { const text = String(value || '').trim(); return /^\+?[\d\s().-]+$/.test(text) && text.replace(/\D/g, '').length >= 8; }
  function required(value) { return String(value || '').trim().length > 0; }
  function length(value, min = 0, max = Infinity) { const size = String(value || '').trim().length; return size >= min && size <= max; }
  function message(input, errorText, successText = '') {
    const field = input.closest('.field');
    const output = document.getElementById(`${input.id}-message`);
    if (!field || !output) return !errorText;
    field.classList.toggle('is-invalid', Boolean(errorText));
    field.classList.toggle('is-valid', !errorText && Boolean(input.value.trim()));
    output.textContent = errorText || successText;
    output.hidden = !errorText && !successText;
    field.querySelector('.field__status--valid')?.toggleAttribute('hidden', Boolean(errorText) || !input.value.trim());
    field.querySelector('.field__status--error')?.toggleAttribute('hidden', !errorText);
    return !errorText;
  }
  window.SodamValidator = { email, phone, required, length, message };
})();
