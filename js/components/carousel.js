(function () {
  function init({ track, thumbs, dots, previous, next }) {
    if (!track) return { show: () => {} };
    const slides = [...track.children];
    let current = 0;
    function show(index, smooth = true) {
      if (!slides.length) return;
      current = (index + slides.length) % slides.length;
      track.scrollTo({ left: current * track.clientWidth, behavior: smooth ? 'smooth' : 'auto' });
      thumbs?.querySelectorAll('[data-slide]').forEach((button, i) => {
        button.classList.toggle('is-active', i === current);
        button.setAttribute('aria-current', i === current ? 'true' : 'false');
      });
      dots?.querySelectorAll('.carousel__dot').forEach((dot, i) => dot.classList.toggle('is-active', i === current));
      if (previous) previous.disabled = slides.length < 2;
      if (next) next.disabled = slides.length < 2;
    }
    thumbs?.addEventListener('click', event => {
      const button = event.target.closest('[data-slide]');
      if (button) show(Number(button.dataset.slide));
    });
    previous?.addEventListener('click', () => show(current - 1));
    next?.addEventListener('click', () => show(current + 1));
    track.addEventListener('scroll', () => {
      const index = Math.round(track.scrollLeft / Math.max(1, track.clientWidth));
      if (index !== current) { current = index; show(index, false); }
    }, { passive: true });
    show(0, false);
    return { show };
  }
  window.SodamCarousel = { init };
})();
