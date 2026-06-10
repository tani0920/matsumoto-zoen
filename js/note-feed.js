// note記事フィード表示
// data/note-articles.js が window.noteArticles を定義している前提で動作
// （file://でもhttps://でも動作する方式）

(function () {
  const grid = document.getElementById('note-feed-grid');
  if (!grid) return;

  function render(items) {
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
  }

  if (window.noteArticles && window.noteArticles.length > 0) {
    render(window.noteArticles);
  }
})();
