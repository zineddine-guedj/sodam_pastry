(function () {
  const defaults = Object.freeze({
    businessName: 'Sodam Pastry', phone: '+213 555 000 000', whatsappNumber: '',
    email: 'hello@sodam.example', address: 'Algiers, Algeria',
    hours: ['Sunday–Thursday · 10:00–18:00', 'Friday–Saturday · By arrangement'],
    noticeHours: 48
  });
  let current = { ...defaults };
  try { current = { ...current, ...(JSON.parse(localStorage.getItem('sodam:config') || '{}')) }; } catch (error) {}
  async function load(url = 'data/config.json') {
    try {
      const response = await fetch(url);
      if (response.ok) current = { ...current, ...(await response.json()) };
    } catch (error) {}
    return current;
  }
  function get(key) { return key ? current[key] : { ...current }; }
  function set(values) {
    current = { ...current, ...values };
    try { localStorage.setItem('sodam:config', JSON.stringify(current)); } catch (error) { throw new Error('Could not save the business settings in this browser.'); }
    return get();
  }
  window.SodamConfig = { defaults, load, get, set };
})();
