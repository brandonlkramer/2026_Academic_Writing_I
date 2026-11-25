// Slide viewer for one class page. Expects DECK = {week, slides:[html,...]}.
(function () {
  const v = document.getElementById('viewer'), n = DECK.slides.length;
  let idx = 0, tick = null;
  const fromHash = () => { const m = location.hash.match(/^#(\d+)/); return m ? Math.min(Math.max(+m[1] - 1, 0), n - 1) : 0; };
  function show(i) {
    clearInterval(tick); idx = i;
    v.innerHTML = `<section class="slide">${DECK.slides[i]}</section>
      <div class="nav"><button id="prev">← Back</button><span class="count">${i + 1} / ${n}</span><button id="next">Next →</button></div>
      <p class="hint">Tip: use the ← → keys, or swipe on a phone.</p>`;
    const p = document.getElementById('prev'), q = document.getElementById('next');
    p.disabled = i === 0; q.disabled = i === n - 1;
    p.onclick = () => go(-1); q.onclick = () => go(1);
    v.querySelectorAll('.timer').forEach(timer);
  }
  function go(step) {
    const j = idx + step; if (j < 0 || j >= n) return;
    history.replaceState(null, '', '#' + (j + 1)); show(j); window.scrollTo(0, 0);
  }
  function timer(b) {
    b.dataset.label = b.textContent;
    b.onclick = () => {
      const was = b.classList.contains('running') || b.classList.contains('done');
      clearInterval(tick);
      v.querySelectorAll('.timer').forEach(x => { x.classList.remove('running', 'done'); x.textContent = x.dataset.label; });
      if (was) return;
      let left = +b.dataset.min * 60; b.classList.add('running');
      const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
      b.textContent = '⏱ ' + fmt(left);
      tick = setInterval(() => {
        left--;
        if (left <= 0) { clearInterval(tick); b.classList.replace('running', 'done'); b.textContent = '⏱ Time!'; }
        else b.textContent = '⏱ ' + fmt(left);
      }, 1000);
    };
  }
  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'SELECT') return;
    if (e.key === 'ArrowRight') go(1); else if (e.key === 'ArrowLeft') go(-1);
  });
  let tx = null;
  document.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  document.addEventListener('touchend', e => { if (tx === null) return; const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1); tx = null; });
  window.addEventListener('hashchange', () => show(fromHash()));
  show(fromHash());
})();
