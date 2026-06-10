// note記事フィード自動取得
// RSSフィードをrss2json経由でJSONに変換して表示する
// noteを更新すると次回ページ読み込み時に自動反映される

(function () {
  const NOTE_RSS = 'https://note.com/matsumoto_363565/rss';
  // rss2json: 無料プランで60req/hour。CORS問題を回避するプロキシとして利用
  const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(NOTE_RSS)}&count=3`;

  const grid = document.getElementById('note-feed-grid');
  if (!grid) return;

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    if (isNaN(d)) return '';
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const day = d.getDate();
    return `${y}年${m}月${day}日`;
  }

  function extractImage(item) {
    // サムネイル画像を取得（enclosure > thumbnail > OGP画像の順）
    if (item.enclosure && item.enclosure.link) return item.enclosure.link;
    if (item.thumbnail) return item.thumbnail;
    // descriptionのimg srcを探す
    const match = item.description && item.description.match(/<img[^>]+src="([^"]+)"/);
    if (match) return match[1];
    return null;
  }

  function renderCards(items) {
    grid.innerHTML = items.map((item, i) => {
      const imgUrl = extractImage(item);
      const imgHtml = imgUrl
        ? `<div class="note-card__img"><img src="${imgUrl}" alt="${item.title}" loading="lazy"></div>`
        : '';
      return `
        <a href="${item.link}" target="_blank" rel="noopener" class="note-card fade-in fade-in-delay-${i + 1}">
          ${imgHtml}
          <div class="note-card__inner">
            <div class="note-card__date">${formatDate(item.pubDate)}</div>
            <div class="note-card__title">${item.title}</div>
            <div class="note-card__arrow">読む <span>→</span></div>
          </div>
        </a>`;
    }).join('');
    // アニメーション再トリガー
    setTimeout(() => {
      grid.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
    }, 100);
  }

  function renderFallback() {
    // API失敗時はハードコードされた記事を表示
    const fallback = [
      { title: '樹と生きるという仕事 — 松本造園の自己紹介', pubDate: '2025-01-01', link: 'https://note.com/matsumoto_363565' },
      { title: '特殊伐採の裏側 — 現場における段取りの重要性', pubDate: '2025-01-01', link: 'https://note.com/matsumoto_363565' },
      { title: '木と人の間に立つ仕事 — 松本造園が受け継いできた現場の作法', pubDate: '2025-01-01', link: 'https://note.com/matsumoto_363565' },
    ];
    renderCards(fallback);
  }

  fetch(API_URL)
    .then(r => r.json())
    .then(data => {
      if (data.status === 'ok' && data.items && data.items.length > 0) {
        renderCards(data.items.slice(0, 3));
      } else {
        renderFallback();
      }
    })
    .catch(() => renderFallback());
})();
