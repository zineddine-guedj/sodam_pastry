(function () {
  const stepByPage = {
    'page-reserve-pastry': 1, 'page-reserve-details': 2,
    'page-reserve-contact': 3, 'page-reserve-review': 4
  };
  const pageClass = [...document.body.classList].find(name => stepByPage[name]);
  if (!pageClass) return;
  const current = stepByPage[pageClass];
  document.querySelectorAll('.stepper__step').forEach((step, index) => {
    const number = index + 1;
    step.classList.toggle('is-current', number === current);
    step.classList.toggle('is-done', number < current);
    if (number === current) step.setAttribute('aria-current', 'step');
    else step.removeAttribute('aria-current');
  });
})();
