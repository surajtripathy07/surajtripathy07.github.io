(function () {
  'use strict';
  var scene = document.getElementById('scene'), clock = document.getElementById('clock');
  var btns = [].slice.call(document.querySelectorAll('.tod button'));
  var KEY = 'about-light', mode = 'auto', forced = null;
  try { var q = new URLSearchParams(window.location.search).get('t'); if (q === 'day' || q === 'dusk' || q === 'night') forced = q; } catch (e) {}
  try { var saved = window.localStorage.getItem(KEY); if (saved === 'auto' || saved === 'day' || saved === 'night') mode = saved; } catch (e) {}
  var fmt = null;
  try { fmt = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: '2-digit', hourCycle: 'h23' }); } catch (e) {}
  function mumbai() {
    var d = new Date(), h = 0, m = 0;
    if (fmt) { fmt.formatToParts(d).forEach(function (p) { if (p.type === 'hour') h = parseInt(p.value, 10); if (p.type === 'minute') m = parseInt(p.value, 10); }); }
    else { var x = new Date(d.getTime() + d.getTimezoneOffset() * 60000 + 19800000); h = x.getHours(); m = x.getMinutes(); }
    return { h: h % 24, m: m };
  }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function apply() {
    var t = mumbai(), mins = t.h * 60 + t.m, s;
    if (mode === 'day') s = 'day'; else if (mode === 'night') s = 'night';
    else s = (mins >= 1140 || mins < 360) ? 'night' : (mins >= 390 && mins < 1080) ? 'day' : 'dusk';
    if (forced) s = forced;
    scene.setAttribute('data-s', s);
    btns.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-m') === mode ? 'true' : 'false'); });
    clock.hidden = mode !== 'auto';
    clock.textContent = 'Mumbai, ' + ((t.h % 12) || 12) + ':' + pad(t.m) + ' ' + (t.h < 12 ? 'am' : 'pm');
  }
  btns.forEach(function (b) {
    b.addEventListener('click', function () {
      mode = b.getAttribute('data-m'); forced = null;
      try { window.localStorage.setItem(KEY, mode); } catch (e) {}
      apply();
    });
  });
  apply();
  window.setInterval(apply, 60000);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) apply(); });
})();
