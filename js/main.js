/* =========================================================================
   Water Footprint Lab — site behavior & data rendering
   Edit content in /data/*.json — no HTML changes needed for routine updates
   ========================================================================= */

/* ---------- Nav ---------- */
function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
  }
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const t = a.getAttribute('href');
    if (t === here || (here === '' && t === 'index.html')) a.classList.add('active');
  });
}

/* ---------- Helpers ---------- */
async function loadJSON(path) {
  try {
    const res = await fetch(path, { cache: 'no-cache' });
    if (!res.ok) throw new Error(res.status);
    return await res.json();
  } catch(e) {
    console.error('Could not load', path, e);
    return null;
  }
}

function fmtDate(iso) {
  const d = new Date(iso + 'T00:00:00');
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function esc(str = '') {
  return String(str).replace(/[&<>"']/g, m => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]));
}

/* =========================================================================
   RENDERERS
   ========================================================================= */

/* ---- PI block (team page) ---- */
async function renderPI(sel) {
  const el = document.querySelector(sel);
  if (!el) return;
  const data = await loadJSON('data/team.json');
  if (!data) return;
  const pi = data.pi;
  el.innerHTML = `
    <div class="pi-photo">
      <img src="${pi.photo}" alt="${esc(pi.name)}" loading="lazy">
    </div>
    <div>
      <span class="section-label">Principal Investigator</span>
      <h2 style="margin-bottom:0.3rem;">${esc(pi.name)}</h2>
      <p style="color:#1A5FA8;font-weight:bold;margin-bottom:0.8rem;">${esc(pi.title)}</p>
      <p>${pi.bio}</p>
      ${pi.bio2 ? `<p>${pi.bio2}</p>` : ''}
      <ul class="pi-creds">
        ${pi.credentials.map(c => `<li>${esc(c)}</li>`).join('')}
      </ul>
      <div class="pi-links">
        <a href="${pi.links.profile}" target="_blank" rel="noopener">University Profile</a>
        <a href="mailto:${pi.links.email}">Email</a>
        <a href="${pi.links.scholar}" target="_blank" rel="noopener">Google Scholar</a>
      </div>
    </div>`;
}

/* ---- Student list (team page) ---- */
async function renderStudents(sel) {
  const el = document.querySelector(sel);
  if (!el) return;
  const data = await loadJSON('data/team.json');
  if (!data) return;
  el.innerHTML = data.students.map(s => `
    <div class="student-item">
      <div class="student-avatar">
        <img src="${s.photo}" alt="${esc(s.name)}" loading="lazy">
      </div>
      <div>
        <div class="student-name">${esc(s.name)}</div>
        <div class="student-role">${esc(s.role)}</div>
        <p class="student-focus">${esc(s.focus)}</p>
        <div class="student-links">
          ${s.links?.email ? `<a href="mailto:${s.links.email}">Email</a>` : ''}
          ${s.links?.scholar ? `<a href="${s.links.scholar}" target="_blank" rel="noopener">Google Scholar</a>` : ''}
        </div>
      </div>
    </div>`).join('');
}

/* ---- Projects ---- */
async function renderProjects(sel) {
  const el = document.querySelector(sel);
  if (!el) return;
  const data = await loadJSON('data/projects.json');
  if (!data || data.length === 0) { el.innerHTML = '<p class="state-msg">No projects listed yet.</p>'; return; }
  el.innerHTML = data.map(p => `
    <div class="project-item">
      <h3>${p.link && p.link !== '#' ? `<a href="${p.link}" target="_blank" rel="noopener">${esc(p.title)}</a>` : esc(p.title)}</h3>
      <p>${esc(p.summary)}</p>
      <div class="project-tags">${(p.tags || []).map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>
    </div>`).join('');
}

/* ---- News ---- */
async function renderNews(sel) {
  const el = document.querySelector(sel);
  if (!el) return;
  const data = await loadJSON('data/news.json');
  if (!data || data.length === 0) { el.innerHTML = '<p class="state-msg">No announcements yet.</p>'; return; }
  const sorted = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
  el.innerHTML = sorted.map(n => `
    <div class="news-item">
      <div class="news-date">${fmtDate(n.date)}</div>
      <h3>${n.link ? `<a href="${n.link}" target="_blank" rel="noopener">${esc(n.title)}</a>` : esc(n.title)}</h3>
      <p>${esc(n.body)}</p>
      ${n.tag ? `<span class="news-tag">${esc(n.tag)}</span>` : ''}
    </div>`).join('');
}

/* ---- Publications ---- */
async function renderPublications(sel, filterSel) {
  const el = document.querySelector(sel);
  if (!el) return;
  const data = await loadJSON('data/publications.json');
  if (!data || data.length === 0) { el.innerHTML = '<p class="state-msg">No publications yet.</p>'; return; }
  const sorted = [...data].sort((a, b) => b.year - a.year);

  function draw(list) {
    el.innerHTML = list.length
      ? list.map(p => `
          <div class="pub-item">
            <div class="pub-year">${p.year}</div>
            <div>
              <span class="pub-title">${esc(p.title)}</span>
              <div class="pub-meta">${esc(p.authors)} — <em>${esc(p.venue)}</em></div>
              ${p.link && p.link !== '#' ? `<a class="pub-link" href="${p.link}" target="_blank" rel="noopener">View paper →</a>` : ''}
            </div>
          </div>`).join('')
      : '<p class="state-msg">No publications match this filter.</p>';
  }
  draw(sorted);

  const filterEl = filterSel ? document.querySelector(filterSel) : null;
  if (filterEl) {
    const years = [...new Set(sorted.map(p => p.year))].sort((a, b) => b - a);
    filterEl.innerHTML = ['All', ...years].map((y, i) =>
      `<button class="filter-btn ${i === 0 ? 'active' : ''}" data-year="${y}">${y}</button>`).join('');
    filterEl.addEventListener('click', e => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      filterEl.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const y = btn.dataset.year;
      draw(y === 'All' ? sorted : sorted.filter(p => String(p.year) === y));
    });
  }
}

/* ---- Positions ---- */
async function renderPositions(sel) {
  const el = document.querySelector(sel);
  if (!el) return;
  const data = await loadJSON('data/positions.json');
  if (!data || data.length === 0) { el.innerHTML = '<p class="state-msg">No openings listed right now.</p>'; return; }
  el.innerHTML = data.map(p => `
    <div class="position-item">
      <div class="position-head">
        <h3>${esc(p.title)}</h3>
        <span class="status-badge ${p.status}">${p.status === 'open' ? 'Open' : 'Closed'}</span>
      </div>
      <div class="position-meta">${esc(p.type)}${p.deadline ? ' &nbsp;·&nbsp; Review: ' + esc(p.deadline) : ''}</div>
      <p>${esc(p.description)}</p>
      ${p.status === 'open' && p.apply_link ? `<a class="btn-blue btn" href="${p.apply_link}">Apply / Inquire</a>` : ''}
    </div>`).join('');
}

document.addEventListener('DOMContentLoaded', () => { initNav(); });
