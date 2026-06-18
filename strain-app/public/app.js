/* ── State ─────────────────────────────────────────────────────── */
const state = {
  strains: [],
  favorites: new Map(),   // strain_id → favorite row
  filters: { type: 'all', sort: 'name' },
  collFilters: { type: 'all', rating: 'all', retry: 'all', query: '' },
  query: '',
  searchDebounce: null,
  collDebounce: null,
  pendingStrainId: null,
};

const ALL_EFFECTS = ['Relaxed','Happy','Euphoric','Uplifted','Energetic','Creative',
  'Focused','Sleepy','Hungry','Tingly','Aroused','Giggly'];

/* ── API helpers ───────────────────────────────────────────────── */
async function api(path, opts = {}) {
  const r = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  if (r.status === 204) return null;
  return r.json();
}

/* ── Toast ─────────────────────────────────────────────────────── */
function toast(msg, type = 'success') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = `toast ${type}`;
  el.classList.remove('hidden');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.add('hidden'), 2800);
}

/* ── Modal helpers ─────────────────────────────────────────────── */
function openModal(id) { document.getElementById(id).classList.remove('hidden'); }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

/* ── Render helpers ────────────────────────────────────────────── */
function typeBadge(type) {
  return `<span class="type-badge badge-${type}">${type}</span>`;
}

function chips(arr, cls, max = 4) {
  return arr.slice(0, max).map(t => `<span class="chip ${cls}">${t}</span>`).join('');
}

function stars(n) {
  if (!n) return '';
  return '★'.repeat(n) + '☆'.repeat(5 - n);
}

function thcLabel(s) {
  if (!s.thc_min && !s.thc_max) return '–';
  if (s.thc_min === s.thc_max) return `${s.thc_max}%`;
  return `${s.thc_min}–${s.thc_max}%`;
}

function cbdLabel(s) {
  if (!s.cbd_max || s.cbd_max < 0.5) return 'Low';
  return `${s.cbd_min}–${s.cbd_max}%`;
}

/* ── Strain Card ───────────────────────────────────────────────── */
function strainCard(s, fromCollection = false) {
  const fav = state.favorites.get(s.strain_id ?? s.id);
  const isSaved = !!fav || fromCollection;
  const div = document.createElement('div');
  div.className = `strain-card${isSaved ? ' is-saved' : ''}`;
  div.dataset.id = fromCollection ? s.strain_id : s.id;

  const thc = thcLabel(s);
  const cbd = cbdLabel(s);

  if (fromCollection) {
    const f = s; // full favorite+strain join
    const retryBadge = f.would_try_again
      ? `<span class="retry-badge retry-yes">👍 Again</span>`
      : `<span class="retry-badge retry-no">👎 Pass</span>`;
    div.innerHTML = `
      <div class="saved-dot"></div>
      <div class="card-header">
        <span class="card-name">${f.name}</span>
        ${typeBadge(f.type)}
      </div>
      <div class="thc-cbd">
        <span>THC <span class="thc-value">${thc}</span></span>
        <span>CBD <span class="cbd-value">${cbd}</span></span>
        ${f.rating ? `<span class="card-rating">${stars(f.rating)}</span>` : ''}
      </div>
      <div class="chip-row">${chips(f.effects, 'chip-effect', 3)}</div>
      <div class="chip-row">${chips(f.flavors, 'chip-flavor', 3)}</div>
      ${f.personal_effects?.length ? `<div class="chip-row">${f.personal_effects.slice(0,3).map(e=>`<span class="chip chip-personal">${e}</span>`).join('')}</div>` : ''}
      ${f.notes ? `<div class="card-note-preview">${escHtml(f.notes)}</div>` : ''}
      <div class="card-footer">
        <div class="card-actions">
          <button class="btn-card" onclick="editFav(${f.id},event)">✏ Edit</button>
          <button class="btn-card del" onclick="deleteFav(${f.id},event)">✕ Remove</button>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:.2rem">
          ${retryBadge}
          ${f.date_tried ? `<span style="font-size:.7rem;color:var(--text-3)">${f.date_tried}</span>` : ''}
        </div>
      </div>`;
  } else {
    div.innerHTML = `
      <div class="saved-dot"></div>
      <div class="card-header">
        <span class="card-name">${s.name}</span>
        ${typeBadge(s.type)}
      </div>
      <div class="thc-cbd">
        <span>THC <span class="thc-value">${thc}</span></span>
        <span>CBD <span class="cbd-value">${cbd}</span></span>
      </div>
      <div class="chip-row">${chips(s.effects, 'chip-effect', 3)}</div>
      <div class="chip-row">${chips(s.flavors, 'chip-flavor', 3)}</div>
      <p class="card-desc truncated">${escHtml(s.description)}</p>
      <div class="card-footer">
        <button class="btn-save-card${isSaved ? ' saved' : ''}"
          onclick="handleSaveClick(${s.id},event)">
          ${isSaved ? '✓ Saved' : '＋ Save'}
        </button>
      </div>`;
  }

  div.addEventListener('click', e => {
    if (e.target.closest('.btn-save-card,.btn-card')) return;
    showDetail(fromCollection ? s.strain_id : s.id);
  });

  return div;
}

/* ── Render strain grid ────────────────────────────────────────── */
function renderGrid(strains) {
  const grid = document.getElementById('strain-grid');
  const empty = document.getElementById('empty-search');
  const meta  = document.getElementById('results-meta');
  grid.innerHTML = '';
  if (!strains.length) {
    empty.classList.remove('hidden');
    meta.textContent = 'No results';
    return;
  }
  empty.classList.add('hidden');
  meta.textContent = `${strains.length} strain${strains.length !== 1 ? 's' : ''} found`;
  strains.forEach(s => grid.appendChild(strainCard(s, false)));
}

/* ── Render collection ─────────────────────────────────────────── */
function renderCollection() {
  const grid  = document.getElementById('collection-grid');
  const empty = document.getElementById('empty-collection');
  const meta  = document.getElementById('coll-meta');
  grid.innerHTML = '';

  const { type, rating, retry, query } = state.collFilters;
  let favs = [...state.favorites.values()];

  if (!favs.length) {
    empty.classList.remove('hidden');
    meta.classList.add('hidden');
    return;
  }

  // Apply filters
  if (query) {
    const q = query.toLowerCase();
    favs = favs.filter(f =>
      f.name.toLowerCase().includes(q) ||
      f.notes?.toLowerCase().includes(q) ||
      f.effects?.some(e => e.toLowerCase().includes(q)) ||
      f.flavors?.some(fl => fl.toLowerCase().includes(q))
    );
  }
  if (type !== 'all') favs = favs.filter(f => f.type === type);
  if (rating !== 'all') favs = favs.filter(f => f.rating >= +rating);
  if (retry === 'yes') favs = favs.filter(f => f.would_try_again);
  if (retry === 'no')  favs = favs.filter(f => !f.would_try_again);

  empty.classList.toggle('hidden', favs.length > 0);
  meta.classList.toggle('hidden', favs.length === state.favorites.size);
  if (favs.length !== state.favorites.size) {
    meta.textContent = `${favs.length} of ${state.favorites.size} strains`;
  }

  favs.forEach(f => grid.appendChild(strainCard(f, true)));
  renderStats();
}

/* ── Suggest a strain ──────────────────────────────────────────── */
function openSuggest() {
  document.getElementById('suggest-results').innerHTML = '';
  document.getElementById('suggest-type').value = 'all';
  document.getElementById('suggest-thc').value = 30;
  document.getElementById('suggest-thc-val').textContent = 'up to 30%';
  const picker = document.getElementById('suggest-picker');
  picker.innerHTML = ALL_EFFECTS.map(e =>
    `<span class="effect-pill" data-effect="${e}">${e}</span>`
  ).join('');
  openModal('suggest-modal');
}

async function runSuggest() {
  const wantedEffects = [...document.querySelectorAll('#suggest-picker .effect-pill.selected')]
    .map(p => p.dataset.effect);
  const type  = document.getElementById('suggest-type').value;
  const maxThc = +document.getElementById('suggest-thc').value;

  const params = new URLSearchParams({ type, sort: 'thc_high', q: wantedEffects[0] || '' });
  const strains = await api(`/api/strains/search?${params}`);

  let scored = strains
    .filter(s => s.thc_max <= maxThc)
    .map(s => {
      const matches = wantedEffects.filter(e => s.effects.includes(e)).length;
      return { ...s, _score: matches };
    })
    .sort((a, b) => b._score - a._score || b.thc_max - a.thc_max)
    .slice(0, 6);

  const res = document.getElementById('suggest-results');
  if (!scored.length) {
    res.innerHTML = `<p style="color:var(--text-3);text-align:center;padding:1rem">No strains matched your criteria. Try broadening your filters.</p>`;
    return;
  }

  res.innerHTML = `<h4 style="font-size:.8rem;color:var(--text-3);margin-bottom:.75rem;text-transform:uppercase;letter-spacing:.6px">Top Matches</h4>
    ${scored.map(s => `
      <div style="display:flex;align-items:center;justify-content:space-between;padding:.5rem 0;border-bottom:1px solid var(--border);cursor:pointer"
           onclick="closeModal('suggest-modal');showDetail(${s.id})">
        <div>
          <span style="font-weight:600">${s.name}</span>
          ${typeBadge(s.type)}
          <span style="font-size:.72rem;color:var(--text-3);margin-left:.3rem">THC ${thcLabel(s)}</span>
        </div>
        <div style="display:flex;gap:.3rem;flex-wrap:wrap;justify-content:flex-end;max-width:160px">
          ${s.effects.filter(e => wantedEffects.includes(e)).map(e =>
            `<span class="chip chip-effect" style="font-size:.65rem">${e}</span>`).join('')}
        </div>
      </div>`).join('')}`;
}

/* ── Stats bar ─────────────────────────────────────────────────── */
async function renderStats() {
  const data = await api('/api/stats');
  const by = {};
  (data.by_type || []).forEach(r => (by[r.type] = r.count));
  document.getElementById('stats-bar').innerHTML = `
    <span class="stat">Total <span class="stat-value">${data.total_favorites}</span></span>
    ${by.sativa  ? `<span class="stat" style="color:var(--sativa)">Sativa <span class="stat-value">${by.sativa}</span></span>` : ''}
    ${by.indica  ? `<span class="stat" style="color:var(--indica)">Indica <span class="stat-value">${by.indica}</span></span>` : ''}
    ${by.hybrid  ? `<span class="stat" style="color:var(--hybrid)">Hybrid <span class="stat-value">${by.hybrid}</span></span>` : ''}
    ${data.avg_rating ? `<span class="stat">Avg Rating <span class="stat-value">${data.avg_rating} ★</span></span>` : ''}`;
}

/* ── Detail Modal ──────────────────────────────────────────────── */
async function showDetail(id) {
  const s = await api(`/api/strains/${id}`);
  if (!s) return;
  const fav = state.favorites.get(id);

  const thcPct = s.thc_max || 0;
  const cbdPct = s.cbd_max || 0;
  const thcBar = Math.min((thcPct / 35) * 100, 100).toFixed(1);
  const cbdBar = Math.min((cbdPct / 25) * 100, 100).toFixed(1);

  document.getElementById('detail-content').innerHTML = `
    <div class="detail-name">${s.name}</div>
    <div class="detail-meta">
      ${typeBadge(s.type)}
      ${fav && fav.rating ? `<span style="color:var(--yellow);font-size:.9rem">${stars(fav.rating)}</span>` : ''}
    </div>

    <div class="detail-section">
      <h4>Potency</h4>
      <div class="thc-bar-wrap">
        <span class="thc-bar-label">THC</span>
        <div class="thc-bar-track"><div class="thc-bar-fill" style="width:${thcBar}%"></div></div>
        <span class="thc-bar-val">${thcLabel(s)}</span>
      </div>
      <div class="thc-bar-wrap">
        <span class="thc-bar-label">CBD</span>
        <div class="thc-bar-track"><div class="thc-bar-fill cbd-bar-fill" style="width:${cbdBar}%"></div></div>
        <span class="thc-bar-val">${cbdLabel(s)}</span>
      </div>
    </div>

    ${s.effects.length ? `<div class="detail-section">
      <h4>Effects</h4>
      <div class="chip-row">${chips(s.effects, 'chip-effect', 8)}</div>
    </div>` : ''}

    ${s.flavors.length ? `<div class="detail-section">
      <h4>Flavors</h4>
      <div class="chip-row">${chips(s.flavors, 'chip-flavor', 8)}</div>
    </div>` : ''}

    ${s.terpenes.length ? `<div class="detail-section">
      <h4>Terpenes</h4>
      <div class="chip-row">${chips(s.terpenes, 'chip-terpene', 6)}</div>
    </div>` : ''}

    ${s.description ? `<div class="detail-section">
      <h4>About</h4>
      <p class="detail-desc">${escHtml(s.description)}</p>
    </div>` : ''}

    ${fav && fav.notes ? `<div class="detail-section">
      <h4>My Notes</h4>
      <p class="detail-desc" style="font-style:italic">${escHtml(fav.notes)}</p>
    </div>` : ''}`;

  const saveBtn = document.getElementById('btn-save-strain');
  if (fav) {
    saveBtn.textContent = '✏ Edit Notes';
    saveBtn.onclick = () => { closeModal('detail-modal'); editFav(fav.id); };
  } else {
    saveBtn.textContent = '＋ Save to Collection';
    saveBtn.onclick = () => { closeModal('detail-modal'); openSaveFav(id); };
  }

  const leaflySlug = s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  document.getElementById('leafly-link').href = `https://www.leafly.com/strains/${leaflySlug}`;

  openModal('detail-modal');
}

/* ── Save / Edit Favorite ──────────────────────────────────────── */
function openSaveFav(strainId, favData = null) {
  state.pendingStrainId = strainId;
  document.getElementById('fav-modal-title').textContent = favData ? 'Edit Entry' : 'Save to Collection';
  document.getElementById('fav-id').value      = favData ? favData.id : '';
  document.getElementById('fav-strain-id').value = strainId;
  document.getElementById('fav-notes').value   = favData?.notes || '';
  document.getElementById('fav-date').value    = favData?.date_tried || '';
  document.getElementById('fav-try-again').checked = favData ? !!favData.would_try_again : true;

  // Stars
  const r = favData?.rating || 0;
  document.getElementById('fav-rating').value = r;
  document.querySelectorAll('#star-rating span').forEach(el => {
    el.classList.toggle('lit', +el.dataset.v <= r);
  });

  // Effects picker
  const picked = new Set(favData?.personal_effects || []);
  document.getElementById('effects-picker').innerHTML = ALL_EFFECTS.map(e =>
    `<span class="effect-pill${picked.has(e) ? ' selected' : ''}" data-effect="${e}">${e}</span>`
  ).join('');

  openModal('fav-modal');
}

function editFav(favId, e) {
  if (e) e.stopPropagation();
  const fav = [...state.favorites.values()].find(f => f.id === favId);
  if (!fav) return;
  openSaveFav(fav.strain_id, fav);
}

async function deleteFav(favId, e) {
  if (e) e.stopPropagation();
  if (!confirm('Remove from collection?')) return;
  await api(`/api/favorites/${favId}`, { method: 'DELETE' });
  await loadFavorites();
  renderCollection();
  renderGrid(state.strains);
  updateCollectionBadge();
  toast('Removed from collection');
}

/* ── Handle save card button ───────────────────────────────────── */
function handleSaveClick(strainId, e) {
  e.stopPropagation();
  const fav = state.favorites.get(strainId);
  if (fav) { editFav(fav.id); return; }
  openSaveFav(strainId);
}

/* ── Load data ─────────────────────────────────────────────────── */
async function loadFavorites() {
  const favs = await api('/api/favorites');
  state.favorites.clear();
  favs.forEach(f => state.favorites.set(f.strain_id, f));
}

async function loadAndSearch() {
  const { type, sort } = state.filters;
  const q = state.query;
  const params = new URLSearchParams({ q, type, sort });
  state.strains = await api(`/api/strains/search?${params}`);
  renderGrid(state.strains);
}

/* ── Collection badge ──────────────────────────────────────────── */
function updateCollectionBadge() {
  document.getElementById('collection-count').textContent = state.favorites.size;
}

/* ── Web Search ────────────────────────────────────────────────── */
async function doWebSearch(q) {
  const results = document.getElementById('web-results');
  results.innerHTML = '<div class="loader"></div>';
  const data = await api(`/api/web-search?q=${encodeURIComponent(q)}`);

  let html = '';

  if (data.local?.length) {
    html += `<div class="web-section">
      <h4>In Your Database</h4>
      ${data.local.map(s => `
        <div style="padding:.5rem 0;border-bottom:1px solid var(--border);cursor:pointer"
             onclick="closeModal('web-modal');showDetail(${s.id})">
          <span style="font-weight:600">${s.name}</span>
          ${typeBadge(s.type)}
          <span style="font-size:.75rem;color:var(--text-3);margin-left:.4rem">THC ${thcLabel(s)}</span>
        </div>`).join('')}
    </div>`;
  }

  if (data.ddg?.abstract) {
    html += `<div class="web-section">
      <h4>Web Info (DuckDuckGo)</h4>
      <div class="web-abstract">
        ${escHtml(data.ddg.abstract)}
        ${data.ddg.abstractUrl ? `<a href="${data.ddg.abstractUrl}" target="_blank" rel="noopener">→ ${data.ddg.abstractSource || 'Source'}</a>` : ''}
      </div>
    </div>`;
  }

  if (data.ddg?.related?.length) {
    html += `<div class="web-section">
      <h4>Related Topics</h4>
      ${data.ddg.related.map(r =>
        `<div class="web-related-item">${escHtml(r.text)}${r.url ? ` <a href="${r.url}" target="_blank" rel="noopener">→</a>` : ''}</div>`
      ).join('')}
    </div>`;
  }

  if (!data.ddg?.abstract && !data.local?.length) {
    html = `<p style="color:var(--text-3);text-align:center;padding:2rem">
      No results found. Try a different strain name or check your spelling.</p>`;
  }

  const leaflySlug = q.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  html += `<div style="margin-top:1rem;text-align:center">
    <a class="btn btn-ghost" href="https://www.leafly.com/strains/${leaflySlug}" target="_blank" rel="noopener" style="font-size:.82rem">
      🔗 Search "${q}" on Leafly
    </a>
  </div>`;

  results.innerHTML = html || '<p style="color:var(--text-3)">No results.</p>';
}

/* ── Safety: escape HTML ───────────────────────────────────────── */
function escHtml(str) {
  if (!str) return '';
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
            .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

/* ── Init ──────────────────────────────────────────────────────── */
async function init() {
  await loadFavorites();
  await loadAndSearch();
  updateCollectionBadge();
  renderCollection();
}

/* ── Event Listeners ───────────────────────────────────────────── */

// Tab navigation
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.tab').forEach(t => t.classList.add('hidden'));
    document.getElementById(`tab-${tab}`).classList.remove('hidden');
    if (tab === 'collection') { renderCollection(); }
  });
});

// Search input with debounce
document.getElementById('search-input').addEventListener('input', e => {
  state.query = e.target.value;
  clearTimeout(state.searchDebounce);
  state.searchDebounce = setTimeout(loadAndSearch, 280);
});

// Type filters
document.querySelectorAll('[data-filter="type"]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-filter="type"]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.filters.type = btn.dataset.value;
    loadAndSearch();
  });
});

// Sort select
document.getElementById('sort-select').addEventListener('change', e => {
  state.filters.sort = e.target.value;
  loadAndSearch();
});

// Web search modal open
document.getElementById('btn-web-search').addEventListener('click', () => {
  document.getElementById('web-query').value = state.query;
  document.getElementById('web-results').innerHTML = '';
  openModal('web-modal');
  if (state.query) doWebSearch(state.query);
});

document.getElementById('btn-do-web-search').addEventListener('click', () => {
  const q = document.getElementById('web-query').value.trim();
  if (q) doWebSearch(q);
});
document.getElementById('web-query').addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const q = e.target.value.trim();
    if (q) doWebSearch(q);
  }
});

// Custom strain modal
document.getElementById('btn-add-custom').addEventListener('click', () => {
  document.getElementById('custom-form').reset();
  openModal('custom-modal');
});

// Custom strain form submit
document.getElementById('custom-form').addEventListener('submit', async e => {
  e.preventDefault();
  const split = s => s.split(',').map(x => x.trim()).filter(Boolean);
  const body = {
    name: document.getElementById('c-name').value.trim(),
    type: document.getElementById('c-type').value,
    thc_min: +document.getElementById('c-thc-min').value || 0,
    thc_max: +document.getElementById('c-thc-max').value || 0,
    cbd_min: 0,
    cbd_max: +document.getElementById('c-cbd-max').value || 1,
    effects: split(document.getElementById('c-effects').value),
    flavors: split(document.getElementById('c-flavors').value),
    terpenes: split(document.getElementById('c-terpenes').value),
    description: document.getElementById('c-desc').value.trim(),
  };
  const s = await api('/api/strains', { method: 'POST', body });
  if (s.error) { toast(s.error, 'error'); return; }
  closeModal('custom-modal');
  toast(`"${s.name}" added to database`);
  await loadAndSearch();
});

// Star rating interaction
document.getElementById('star-rating').addEventListener('click', e => {
  const star = e.target.closest('[data-v]');
  if (!star) return;
  const val = +star.dataset.v;
  document.getElementById('fav-rating').value = val;
  document.querySelectorAll('#star-rating span').forEach(s => {
    s.classList.toggle('lit', +s.dataset.v <= val);
  });
});

// Effects picker
document.getElementById('effects-picker').addEventListener('click', e => {
  const pill = e.target.closest('.effect-pill');
  if (!pill) return;
  pill.classList.toggle('selected');
});

// Favorite form submit
document.getElementById('fav-form').addEventListener('submit', async e => {
  e.preventDefault();
  const id       = document.getElementById('fav-id').value;
  const strainId = +document.getElementById('fav-strain-id').value;
  const body = {
    strain_id:      strainId,
    rating:         +document.getElementById('fav-rating').value || null,
    notes:          document.getElementById('fav-notes').value.trim(),
    personal_effects: [...document.querySelectorAll('.effect-pill.selected')].map(p => p.dataset.effect),
    date_tried:     document.getElementById('fav-date').value || null,
    would_try_again: document.getElementById('fav-try-again').checked ? 1 : 0,
  };

  let result;
  if (id) {
    result = await api(`/api/favorites/${id}`, { method: 'PUT', body });
  } else {
    result = await api('/api/favorites', { method: 'POST', body });
    if (result?.error === 'Already in collection') {
      // Update existing instead
      const existingFav = state.favorites.get(strainId);
      if (existingFav) result = await api(`/api/favorites/${existingFav.id}`, { method: 'PUT', body });
    }
  }

  if (result?.error) { toast(result.error, 'error'); return; }
  closeModal('fav-modal');
  await loadFavorites();
  renderGrid(state.strains);
  renderCollection();
  updateCollectionBadge();
  toast(id ? 'Collection updated' : 'Saved to collection ✓');
});

// Collection search/filter
document.getElementById('coll-search').addEventListener('input', e => {
  state.collFilters.query = e.target.value;
  clearTimeout(state.collDebounce);
  state.collDebounce = setTimeout(renderCollection, 200);
});

document.querySelectorAll('[data-cfilter]').forEach(btn => {
  btn.addEventListener('click', () => {
    const group = btn.dataset.cfilter;
    document.querySelectorAll(`[data-cfilter="${group}"]`).forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.collFilters[group] = btn.dataset.value;
    renderCollection();
  });
});

// Suggest button
document.getElementById('btn-suggest').addEventListener('click', openSuggest);

// Suggest effects picker
document.getElementById('suggest-picker').addEventListener('click', e => {
  const pill = e.target.closest('.effect-pill');
  if (!pill) return;
  pill.classList.toggle('selected');
});

// Suggest THC slider
document.getElementById('suggest-thc').addEventListener('input', e => {
  document.getElementById('suggest-thc-val').textContent = `up to ${e.target.value}%`;
});

// Close modals on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.add('hidden');
  });
});

// Close on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay:not(.hidden)').forEach(m => m.classList.add('hidden'));
  }
});

/* ── Kick off ──────────────────────────────────────────────────── */
init();
