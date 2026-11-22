(function () {
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.addEventListener('click', event => {
      if (event.target === dialog) dialog.close('cancel');
    });
    dialog.addEventListener('close', () => {
      const opener = document.querySelector(`[data-modal-open="${dialog.id}"]`);
      opener?.focus();
    });
  });
  document.addEventListener('click', event => {
    const opener = event.target.closest('[data-modal-open]');
    if (!opener) return;
    const dialog = document.getElementById(opener.dataset.modalOpen);
    if (dialog?.showModal) dialog.showModal();
  });
})();
