// Dark-mode toggle + mobile menu. The initial .dark class is set by the inline
// anti-FOUC script in <head>; this only wires up the controls.
(function () {
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');

  function setTheme(mode) {
    if (mode === 'dark') {
      root.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      root.classList.remove('dark');
      localStorage.theme = 'light';
    }
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      setTheme(root.classList.contains('dark') ? 'light' : 'dark');
    });
  }

  // Dropdowns: a toggle button shows/hides its panel; any outside click closes both.
  function wireDropdown(toggleId, panelId) {
    const toggle = document.getElementById(toggleId);
    const panel = document.getElementById(panelId);
    if (!toggle || !panel) return null;
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      panel.classList.toggle('hidden');
    });
    return panel;
  }

  const panels = [
    wireDropdown('menu-toggle', 'menu'),
    wireDropdown('lang-toggle', 'lang-menu'),
  ].filter(Boolean);

  if (panels.length) {
    document.addEventListener('click', function () {
      panels.forEach(function (p) { p.classList.add('hidden'); });
    });
  }
})();
