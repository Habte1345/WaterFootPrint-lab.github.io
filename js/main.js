/* =========================================================================
   Water Footprint Lab — shared site behavior
   Pages call the render* functions they need after DOM is ready.
   All content lives in /data/*.json — edit those files to update the site.
   ========================================================================= */

/* ---------- Navigation ---------- */
function initNav(){
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links){
    toggle.addEventListener('click', () => links.classList.toggle('open'));
  }
  // Highlight current page in nav
  const here = (location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.nav-links a').forEach(a => {
    const target = a.getAttribute('href');
    if (target === here || (here === '' && target === 'index.html')){
      a.classList.add('active');
    }
  });
}

/* ---------- Scroll reveal ---------- */
function initReveal(){
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || items.length === 0){
    items.forEach(el => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  items.forEach(el => io.observe(el));
}

/* ---------- Data loading ---------- */
async function loadJSON(path){
  try{
    const res = await fetch(path, { cache: 'no-cache' });
    if (!res.ok) throw new Error(res.status);
    return await res.json();
  }catch(err){
    console.error('Could not load', path, err);
    return null;
  }
}

function fmtDate(iso){
  const d = new Date(iso + 'T00:00:00');
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
}

function escapeHTML(str=''){
  return String(str).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

/* ---------- Icons (inline, no external deps) ---------- */
const ICONS = {
  drop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2.5c3.2 4 6.5 8.2 6.5 12a6.5 6.5 0 1 1-13 0c0-3.8 3.3-8 6.5-12Z"/></svg>',
  map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z"/><path d="M9 4v14M15 6v14"/></svg>',
  crop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 21c0-7 3-13 9-16M5 13c4 0 8 2 10 6"/></svg>',
  network: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="5" cy="6" r="2.2"/><circle cx="19" cy="6" r="2.2"/><circle cx="12" cy="18" r="2.2"/><path d="M6.8 7.3 11 16.3M17.2 7.3 13 16.3M7.2 6h9.6"/></svg>',
  scale: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3v18M5 7l-3 6a3 3 0 0 0 6 0l-3-6Zm14 0-3 6a3 3 0 0 0 6 0l-3-6ZM5 7h14M8 21h8"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="m4 6 8 7 8-7"/></svg>',
  scholar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 4 2 9l10 5 10-5-10-5Z"/><path d="M6 11.5V17c0 1 2.7 3 6 3s6-2 6-3v-5.5"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
};
function icon(name){ return ICONS[name] || ''; }

/* =========================================================================
   RENDERERS — each page calls only what it needs
   ========================================================================= */

/* ---- Home: PI strip ---- */
async function renderPISummary(targetSel){
  const el = document.querySelector(targetSel);
  if (!el) return;
  const data = await loadJSON('data/team.json');
  if (!data || !data.pi) return;
  const pi = data.pi;
  el.innerHTML = `
    <div class="pi-photo"><img src="${pi.photo}" alt="${escapeHTML(pi.name)}" loading="lazy"></div>
    <div>
      <span class="eyebrow">Principal Investigator</span>
      <h2 style="margin-bottom:.6rem;">${escapeHTML(pi.name)}</h2>
      <p class="lede" style="margin-bottom:1rem;">${pi.title}</p>
      <p>${pi.bio}</p>
      <ul class="pi-cred">
        ${pi.credentials.map(c => `<li>${escapeHTML(c)}</li>`).join('')}
      </ul>
      <div class="btn-row">
        <a class="btn btn--ghost" href="${pi.links.profile}" target="_blank" rel="noopener">University profile ${icon('arrow')}</a>
        <a class="btn btn--ghost" href="${pi.links.scholar}" target="_blank" rel="noopener">Google Scholar ${icon('arrow')}</a>
      </div>
    </div>`;
}

/* ---- Team preview strip (home) ---- */
async function renderTeamPreview(targetSel){
  const el = document.querySelector(targetSel);
  if (!el) return;
  const data = await loadJSON('data/team.json');
  if (!data) return;
  const people = [{ name:data.pi.name, role:'PI', photo:data.pi.photo }]
    .concat(data.students.map(s => ({ name:s.name, role:s.role, photo:s.photo })));
  el.innerHTML = people.map(p => `
    <div class="mini">
      <img class="avatar" src="${p.photo}" alt="${escapeHTML(p.name)}" loading="lazy">
      <div class="name">${escapeHTML(p.name.split(' ')[0])} ${escapeHTML(p.name.split(' ').slice(1).join(' '))}</div>
      <span class="role">${escapeHTML(p.role)}</span>
    </div>`).join('');
}

/* ---- Full team page ---- */
async function renderTeamFull(){
  const data = await loadJSON('data/team.json');
  if (!data) return;
  const piWrap = document.querySelector('#pi-full');
  if (piWrap){
    const pi = data.pi;
    piWrap.innerHTML = `
      <div class="pi-photo"><img src="${pi.photo}" alt="${escapeHTML(pi.name)}" loading="lazy"></div>
      <div>
        <span class="eyebrow">Principal Investigator</span>
        <h2 style="margin-bottom:.5rem;">${escapeHTML(pi.name)}</h2>
        <p class="lede" style="margin-bottom:1rem;">${pi.title}</p>
        <p>${pi.bio}</p>
        ${pi.bio2 ? `<p>${pi.bio2}</p>` : ''}
        <ul class="pi-cred">${pi.credentials.map(c=>`<li>${escapeHTML(c)}</li>`).join('')}</ul>
        <div class="btn-row">
          <a class="btn btn--ghost" href="${pi.links.profile}" target="_blank" rel="noopener">University profile ${icon('arrow')}</a>
          <a class="btn btn--ghost" href="mailto:${pi.links.email}">${icon('mail')} Email</a>
          <a class="btn btn--ghost" href="${pi.links.scholar}" target="_blank" rel="noopener">${icon('scholar')} Scholar</a>
        </div>
      </div>`;
  }
  const grid = document.querySelector('#student-grid');
  if (grid){
    grid.innerHTML = data.students.map(s => `
      <div class="card team-card reveal">
        <img class="avatar" src="${s.photo}" alt="${escapeHTML(s.name)}" loading="lazy">
        <h3>${escapeHTML(s.name)}</h3>
        <span class="role">${escapeHTML(s.role)}</span>
        <p class="focus">${escapeHTML(s.focus)}</p>
        <div class="links">
          ${s.links?.email ? `<a href="mailto:${s.links.email}" aria-label="Email">${icon('mail')}</a>` : ''}
          ${s.links?.scholar ? `<a href="${s.links.scholar}" target="_blank" rel="noopener" aria-label="Scholar">${icon('scholar')}</a>` : ''}
        </div>
      </div>`).join('');
    initReveal();
  }
}

/* ---- Projects ---- */
function projectCard(p){
  return `
    <a class="card reveal" href="${p.link || '#'}" ${p.link && p.link.startsWith('http') ? 'target="_blank" rel="noopener"' : ''} style="text-decoration:none;">
      <div class="card-icon">${icon(p.icon || 'drop')}</div>
      <h3>${escapeHTML(p.title)}</h3>
      <p>${escapeHTML(p.summary)}</p>
      <div class="tag-row">${(p.tags||[]).map(t=>`<span class="tag">${escapeHTML(t)}</span>`).join('')}</div>
    </a>`;
}
async function renderProjectsPreview(targetSel, count=3){
  const el = document.querySelector(targetSel);
  if (!el) return;
  const data = await loadJSON('data/projects.json');
  if (!data) return;
  el.innerHTML = data.slice(0,count).map(projectCard).join('');
  initReveal();
}
async function renderProjectsFull(){
  const el = document.querySelector('#project-grid');
  if (!el) return;
  const data = await loadJSON('data/projects.json');
  if (!data) { el.innerHTML = '<p class="state-msg">No projects yet — add entries to data/projects.json</p>'; return; }
  el.innerHTML = data.map(projectCard).join('');
  initReveal();
}

/* ---- News ---- */
function newsItem(n){
  return `
    <article class="news-item reveal">
      <div class="news-date mono">${fmtDate(n.date)}</div>
      <div>
        <h3>${n.link ? `<a class="inline-link" href="${n.link}" target="_blank" rel="noopener">${escapeHTML(n.title)}</a>` : escapeHTML(n.title)}</h3>
        <p>${escapeHTML(n.body)}</p>
        ${n.tag ? `<span class="tag">${escapeHTML(n.tag)}</span>` : ''}
      </div>
    </article>`;
}
async function renderNewsPreview(targetSel, count=3){
  const el = document.querySelector(targetSel);
  if (!el) return;
  const data = await loadJSON('data/news.json');
  if (!data) return;
  const sorted = [...data].sort((a,b)=> new Date(b.date) - new Date(a.date));
  el.innerHTML = sorted.slice(0,count).map(newsItem).join('');
  initReveal();
}
async function renderNewsFull(){
  const el = document.querySelector('#news-list');
  if (!el) return;
  const data = await loadJSON('data/news.json');
  if (!data || data.length === 0){ el.innerHTML = '<p class="state-msg">No announcements yet — add entries to data/news.json</p>'; return; }
  const sorted = [...data].sort((a,b)=> new Date(b.date) - new Date(a.date));
  el.innerHTML = sorted.map(newsItem).join('');
  initReveal();
}

/* ---- Publications ---- */
function pubItem(p){
  return `
    <article class="pub-item reveal">
      <div class="pub-year mono">${p.year}</div>
      <div>
        <span class="pub-title">${escapeHTML(p.title)}</span>
        <div class="pub-meta">${escapeHTML(p.authors)} — <em>${escapeHTML(p.venue)}</em></div>
        <div class="pub-links">
          ${p.link ? `<a href="${p.link}" target="_blank" rel="noopener">View paper ${icon('arrow')}</a>` : ''}
        </div>
      </div>
    </article>`;
}
async function renderPublicationsPreview(targetSel, count=3){
  const el = document.querySelector(targetSel);
  if (!el) return;
  const data = await loadJSON('data/publications.json');
  if (!data) return;
  const sorted = [...data].sort((a,b)=> b.year - a.year);
  el.innerHTML = sorted.slice(0,count).map(pubItem).join('');
  initReveal();
}
async function renderPublicationsFull(){
  const el = document.querySelector('#pub-list');
  const filterRow = document.querySelector('#pub-filters');
  if (!el) return;
  const data = await loadJSON('data/publications.json');
  if (!data || data.length === 0){ el.innerHTML = '<p class="state-msg">No publications yet — add entries to data/publications.json</p>'; return; }
  const sorted = [...data].sort((a,b)=> b.year - a.year);

  function draw(list){
    el.innerHTML = list.length ? list.map(pubItem).join('') : '<p class="state-msg">No publications match this filter.</p>';
    initReveal();
  }
  draw(sorted);

  if (filterRow){
    const years = [...new Set(sorted.map(p=>p.year))].sort((a,b)=>b-a);
    filterRow.innerHTML = ['All', ...years].map((y,i) =>
      `<button class="filter-btn ${i===0?'active':''}" data-year="${y}">${y}</button>`).join('');
    filterRow.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      filterRow.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const y = btn.dataset.year;
      draw(y === 'All' ? sorted : sorted.filter(p => String(p.year) === y));
    });
  }
}

/* ---- Positions ---- */
function positionCard(p){
  return `
    <div class="position-card reveal">
      <div class="position-head">
        <h3>${escapeHTML(p.title)}</h3>
        <span class="status ${p.status}">${p.status === 'open' ? 'Open' : 'Closed'}</span>
      </div>
      <div class="position-meta">
        <span class="mono">${escapeHTML(p.type)}</span>
        ${p.deadline ? `<span class="mono">Review begins ${escapeHTML(p.deadline)}</span>` : ''}
      </div>
      <p>${escapeHTML(p.description)}</p>
      ${p.status === 'open' && p.apply_link ? `<a class="btn btn--gold" href="${p.apply_link}">Apply / Inquire ${icon('arrow')}</a>` : ''}
    </div>`;
}
async function renderPositions(targetSel='#position-list'){
  const el = document.querySelector(targetSel);
  if (!el) return;
  const data = await loadJSON('data/positions.json');
  if (!data || data.length === 0){ el.innerHTML = '<p class="state-msg">No openings listed right now — check back soon, or edit data/positions.json</p>'; return; }
  el.innerHTML = data.map(positionCard).join('');
  initReveal();
}
async function renderOpenPositionsBadge(targetSel){
  const el = document.querySelector(targetSel);
  if (!el) return;
  const data = await loadJSON('data/positions.json');
  const openCount = (data || []).filter(p=>p.status==='open').length;
  el.textContent = openCount > 0
    ? `${openCount} open position${openCount>1?'s':''} right now`
    : `No openings right now — check back soon`;
}

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initReveal();
});
