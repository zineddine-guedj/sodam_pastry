(function () {
  const section = document.getElementById('latest');
  const list = document.getElementById('latest-list');
  const signatures = document.getElementById('signature-list');
  const signaturesEmpty = document.getElementById('signatures-empty');
  const hero = document.getElementById('hero-creation-visual');
  const heroImage = document.getElementById('hero-creation-image');
  const heroCaption = document.getElementById('hero-creation-caption');
  if (!window.CreationsStore || !window.CreationTemplate) return;
  function render() {
    const items = window.CreationsStore.all().filter(item => item.status === 'published')
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    if (hero) hero.hidden = items.length === 0;
    if (items.length && heroImage) {
      heroImage.src = items[0].photos?.[0] || 'assets/logo/sodam-logo.png';
      heroImage.alt = items[0].title || 'Latest Sodam Pastry creation';
      if (heroCaption) heroCaption.textContent = items[0].title || 'Fresh from our little kitchen';
    }
    if (list && section) {
      const latest = items.slice(0, 4);
      list.replaceChildren(...latest.map(item => window.CreationTemplate.polaroid(item)));
      section.hidden = latest.length === 0;
    }
    if (signatures) {
      const featured = items.slice(0, 3);
      signatures.replaceChildren(...featured.map(item => window.CreationTemplate.signatureCard(item)));
      if (signaturesEmpty) signaturesEmpty.hidden = featured.length > 0;
    }
  }
  document.addEventListener('sodam:data-changed', render);
  render();
})();
