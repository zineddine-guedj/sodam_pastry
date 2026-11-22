(function () {
  const body = document.body;
  if (!body.classList.contains('page-admin') || body.classList.contains('page-admin-login')) return;
  const loginPath = location.pathname.includes('/admin/') ? 'login.html' : 'admin/login.html';
  if (window.SodamAuth && !window.SodamAuth.requireLogin(loginPath)) return;
  document.getElementById('sign-out')?.addEventListener('click', () => {
    window.SodamAuth?.signOut();
    location.href = loginPath;
  });
})();
