// note記事フィード表示
// data/note-articles.json を読み込んで表示する
// JSONはGitHub Actionsが毎日自動更新する（.github/workflows/update-note.yml）

(function () {
  const grid = document.getElementById('note-feed-grid');
  if (!grid) return;

  fetch('data/note-articles.json?v=' + Date.now())
    .then(r => r.json())
    .then(items => {
      grid.innerHTML = items.map((item, i) => {
        const imgHtml = item.image
          ? `<div class="note-card__img"><img src="${item.image}" alt="${item.title}" loading="lazy"></div>`
          : '';
        return `
          <a href="${item.link}" target="_blank" rel="noopener" class="note-card fade-in fade-in-delay-${i + 1}">
            ${imgHtml}
            <div class="note-card__inner">
              <div class="note-card__date">${item.date}</div>
              <div class="note-card__title">${item.title}</div>
              <div class="note-card__arrow">読む <span>→</span></div>
            </div>
          </a>`;
      }).join('');
      setTimeout(() => {
        grid.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
      }, 100);
    })
    .catch(() => {
      // JSON取得失敗時はnoteへの直リンクを表示
      grid.innerHTML = `
        <a href="https://note.com/matsumoto_363565" target="_blank" rel="noopener" class="note-card">
          <div class="note-card__inner">
            <div class="note-card__title">noteで記事を読む →</div>
          </div>
        </a>`;
    });
})();
