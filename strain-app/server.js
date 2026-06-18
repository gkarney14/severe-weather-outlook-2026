const express = require('express');
const path = require('path');
const db = require('./db/database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function parseStrain(s) {
  return {
    ...s,
    effects: JSON.parse(s.effects || '[]'),
    flavors: JSON.parse(s.flavors || '[]'),
    terpenes: JSON.parse(s.terpenes || '[]'),
  };
}

// ── Strain search ──────────────────────────────────────────────
app.get('/api/strains/search', (req, res) => {
  const { q = '', type = 'all', effect = '', flavor = '', sort = 'name' } = req.query;
  let sql = 'SELECT * FROM strains WHERE 1=1';
  const params = [];

  if (q.trim()) {
    sql += ' AND (name LIKE ? OR description LIKE ? OR effects LIKE ? OR flavors LIKE ?)';
    const t = `%${q.trim()}%`;
    params.push(t, t, t, t);
  }
  if (type !== 'all') { sql += ' AND type = ?'; params.push(type); }
  if (effect.trim()) { sql += ' AND effects LIKE ?'; params.push(`%${effect.trim()}%`); }
  if (flavor.trim()) { sql += ' AND flavors LIKE ?'; params.push(`%${flavor.trim()}%`); }

  const orderMap = { thc_high: 'thc_max DESC', thc_low: 'thc_min ASC', name: 'name ASC' };
  sql += ` ORDER BY ${orderMap[sort] || 'name ASC'} LIMIT 100`;

  try {
    res.json(db.prepare(sql).all(...params).map(parseStrain));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── All strains ────────────────────────────────────────────────
app.get('/api/strains', (req, res) => {
  res.json(db.prepare('SELECT * FROM strains ORDER BY name ASC').all().map(parseStrain));
});

// ── Single strain ──────────────────────────────────────────────
app.get('/api/strains/:id', (req, res) => {
  const s = db.prepare('SELECT * FROM strains WHERE id = ?').get(req.params.id);
  if (!s) return res.status(404).json({ error: 'Strain not found' });
  res.json(parseStrain(s));
});

// ── Web search via DuckDuckGo Instant Answer ───────────────────
app.get('/api/web-search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'q required' });

  try {
    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(q + ' cannabis strain')}&format=json&no_html=1&skip_disambig=1`;
    const r = await fetch(url, { timeout: 6000 });
    const data = await r.json();

    const result = {
      abstract: data.Abstract || '',
      abstractUrl: data.AbstractURL || '',
      abstractSource: data.AbstractSource || '',
      heading: data.Heading || '',
      related: (data.RelatedTopics || [])
        .filter(t => t.Text)
        .slice(0, 5)
        .map(t => ({ text: t.Text, url: t.FirstURL || '' })),
    };

    // Also search locally for partial matches
    const localMatches = db.prepare(
      'SELECT * FROM strains WHERE name LIKE ? ORDER BY name ASC LIMIT 5'
    ).all(`%${q}%`).map(parseStrain);

    res.json({ ddg: result, local: localMatches });
  } catch (err) {
    // Fallback to local-only on network error
    const localMatches = db.prepare(
      'SELECT * FROM strains WHERE name LIKE ? OR description LIKE ? ORDER BY name ASC LIMIT 5'
    ).all(`%${q}%`, `%${q}%`).map(parseStrain);
    res.json({ ddg: null, local: localMatches, error: 'Web search unavailable' });
  }
});

// ── Add custom strain ──────────────────────────────────────────
app.post('/api/strains', (req, res) => {
  const { name, type, thc_min = 0, thc_max = 0, cbd_min = 0, cbd_max = 1,
          effects = [], flavors = [], terpenes = [], description = '' } = req.body;
  if (!name || !type) return res.status(400).json({ error: 'name and type required' });
  const r = db.prepare(`
    INSERT INTO strains (name,type,thc_min,thc_max,cbd_min,cbd_max,effects,flavors,terpenes,description)
    VALUES (?,?,?,?,?,?,?,?,?,?)
  `).run(name, type, thc_min, thc_max, cbd_min, cbd_max,
         JSON.stringify(effects), JSON.stringify(flavors),
         JSON.stringify(terpenes), description);
  res.status(201).json(parseStrain(db.prepare('SELECT * FROM strains WHERE id=?').get(r.lastInsertRowid)));
});

// ── Favorites: list ────────────────────────────────────────────
app.get('/api/favorites', (req, res) => {
  const rows = db.prepare(`
    SELECT f.*, s.name, s.type, s.thc_min, s.thc_max, s.cbd_min, s.cbd_max,
           s.effects, s.flavors, s.terpenes, s.description
    FROM favorites f JOIN strains s ON f.strain_id = s.id
    ORDER BY f.created_at DESC
  `).all();
  res.json(rows.map(f => ({
    ...parseStrain(f),
    personal_effects: JSON.parse(f.personal_effects || '[]'),
  })));
});

// ── Favorites: add ─────────────────────────────────────────────
app.post('/api/favorites', (req, res) => {
  const { strain_id, rating, notes = '', personal_effects = [], date_tried, would_try_again = 1 } = req.body;
  if (!strain_id) return res.status(400).json({ error: 'strain_id required' });
  const existing = db.prepare('SELECT id FROM favorites WHERE strain_id=?').get(strain_id);
  if (existing) return res.status(409).json({ error: 'Already in collection', id: existing.id });

  const r = db.prepare(`
    INSERT INTO favorites (strain_id,rating,notes,personal_effects,date_tried,would_try_again)
    VALUES (?,?,?,?,?,?)
  `).run(strain_id, rating ?? null, notes,
         JSON.stringify(personal_effects), date_tried ?? null, would_try_again ? 1 : 0);

  const fav = db.prepare(`
    SELECT f.*, s.name, s.type, s.thc_min, s.thc_max, s.cbd_min, s.cbd_max,
           s.effects, s.flavors, s.terpenes, s.description
    FROM favorites f JOIN strains s ON f.strain_id = s.id WHERE f.id=?
  `).get(r.lastInsertRowid);
  res.status(201).json({ ...parseStrain(fav), personal_effects: JSON.parse(fav.personal_effects || '[]') });
});

// ── Favorites: update ──────────────────────────────────────────
app.put('/api/favorites/:id', (req, res) => {
  const { rating, notes = '', personal_effects = [], date_tried, would_try_again = 1 } = req.body;
  db.prepare(`
    UPDATE favorites SET rating=?,notes=?,personal_effects=?,date_tried=?,
    would_try_again=?,updated_at=datetime('now') WHERE id=?
  `).run(rating ?? null, notes, JSON.stringify(personal_effects),
         date_tried ?? null, would_try_again ? 1 : 0, req.params.id);

  const fav = db.prepare(`
    SELECT f.*, s.name, s.type, s.thc_min, s.thc_max, s.cbd_min, s.cbd_max,
           s.effects, s.flavors, s.terpenes, s.description
    FROM favorites f JOIN strains s ON f.strain_id = s.id WHERE f.id=?
  `).get(req.params.id);
  if (!fav) return res.status(404).json({ error: 'Not found' });
  res.json({ ...parseStrain(fav), personal_effects: JSON.parse(fav.personal_effects || '[]') });
});

// ── Favorites: delete ──────────────────────────────────────────
app.delete('/api/favorites/:id', (req, res) => {
  db.prepare('DELETE FROM favorites WHERE id=?').run(req.params.id);
  res.status(204).send();
});

// ── Stats ──────────────────────────────────────────────────────
app.get('/api/stats', (req, res) => {
  res.json({
    total_strains: db.prepare('SELECT COUNT(*) as c FROM strains').get().c,
    total_favorites: db.prepare('SELECT COUNT(*) as c FROM favorites').get().c,
    avg_rating: db.prepare('SELECT ROUND(AVG(rating),1) as a FROM favorites WHERE rating IS NOT NULL').get().a,
    by_type: db.prepare(`
      SELECT s.type, COUNT(*) as count FROM favorites f
      JOIN strains s ON f.strain_id=s.id GROUP BY s.type
    `).all(),
  });
});

app.listen(PORT, () =>
  console.log(`\n  Strain Vault  →  http://localhost:${PORT}\n`)
);
