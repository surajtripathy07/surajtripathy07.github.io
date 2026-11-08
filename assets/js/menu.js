(function () {
  'use strict';
  var m = document.getElementById('menu');
  if (!m) return;
  var s = m.querySelector('summary');
  function sync() { s.setAttribute('aria-expanded', m.open ? 'true' : 'false'); }
  m.addEventListener('toggle', sync);
  sync();
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && m.open) { m.open = false; s.focus(); }
  });
  document.addEventListener('click', function (e) {
    if (m.open && !m.contains(e.target)) m.open = false;
  });
  m.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('a')) m.open = false;
  });
})();
