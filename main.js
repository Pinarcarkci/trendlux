(function(){
  const $ = id => document.getElementById(id);
  const menu = $('menu'), burger = $('burger'), dd = $('dd'), ddBtn = $('ddBtn');

  // hoofdmenu (mobiel)
  burger.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });

  // producten-menu
  ddBtn.addEventListener('click', e => {
    e.stopPropagation();
    const open = dd.classList.toggle('open');
    ddBtn.setAttribute('aria-expanded', open);
  });
  document.addEventListener('click', e => {
    if (!dd.contains(e.target)) { dd.classList.remove('open'); ddBtn.setAttribute('aria-expanded', false); }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { dd.classList.remove('open'); menu.classList.remove('open'); }
  });

  $('yr').textContent = new Date().getFullYear();

  // contactformulier
  const cf = $('contactForm');
  if (cf) {
    cf.addEventListener('submit', () => {
      if (location.protocol.startsWith('http')) $('cNext').value = location.origin + location.pathname + '?verzonden=1';
    });
    if (new URLSearchParams(location.search).get('verzonden') === '1') {
      $('cBody').style.display = 'none'; $('cDone').style.display = 'block';
    }
  }
})();
