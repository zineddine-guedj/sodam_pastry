(function () {
  const key = window.SodamConstants?.keys.adminSession || 'sodam:admin-session';
  function isAuthenticated() {
    try { return sessionStorage.getItem(key) === 'active'; } catch (error) { return false; }
  }
  function signIn(email, password) {
    if (!window.SodamValidator?.email(email) || !String(password || '').trim()) return false;
    // This is only a demo gate. Replace with server-side authentication before launch.
    try {
      sessionStorage.setItem(key, 'active');
      sessionStorage.setItem('sodam:admin-email', String(email).trim());
      return true;
    } catch (error) { return false; }
  }
  function signOut() {
    try { sessionStorage.removeItem(key); sessionStorage.removeItem('sodam:admin-email'); } catch (error) {}
  }
  function requireLogin(loginPath = 'login.html') {
    if (isAuthenticated()) return true;
    location.replace(loginPath);
    return false;
  }
  window.SodamAuth = { isAuthenticated, signIn, signOut, requireLogin, key };
})();
