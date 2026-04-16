/* ═══════════════════════════════════════
   SecureVault — Dashboard Logic
   dashboard.js
═══════════════════════════════════════ */
 
'use strict';
 
/* ── Guard: redirect guests to login ── */
(function dashGuard() {
  if (!localStorage.getItem('sv_cur')) {
    window.location.href = 'login.html';
  }
})();

/* ── Helpers ── */
const $ = id => document.getElementById(id);
 
function toast(msg, type = 'info', dur = 3000) {
  const t = $('toast');
  t.textContent = msg;
  t.className = 'toast show ' + type;
  clearTimeout(t._t);
  t._t = setTimeout(() => (t.className = 'toast'), dur);
}
 
/* ── Session ── */
function currentUser()  { return localStorage.getItem('sv_cur') || ''; }
function currentName()  { return localStorage.getItem('sv_curname') || ''; }
 
/* ── Vault storage (simple base64) ── */
function vaultKey(email) { return 'sv_vault_' + btoa(email); }

function getVault() {
  const email = currentUser();
  const key = vaultKey(email);
  const data = localStorage.getItem(key);
  
  if (!data) return [];
  
  try {
    return JSON.parse(atob(data));
  } catch (e) {
    return [];
  }
}

function saveVault(vault) {
  const email = currentUser();
  const key = vaultKey(email);
  
  try {
    localStorage.setItem(key, btoa(JSON.stringify(vault)));
    return true;
  } catch (e) {
    toast('Failed to save vault', 'err');
    return false;
  }
}
 
/* ── Eye toggle ── */
function toggleEye(inputId, btn) {
  const el = $(inputId);
  if (!el) return;
  const ico = btn.querySelector('i');
  if (el.type === 'password') {
    el.type = 'text';
    ico.className = 'fas fa-eye-slash';
  } else {
    el.type = 'password';
    ico.className = 'fas fa-eye';
  }
}
 
/* ── Logout ── */
function doLogout() {
  localStorage.removeItem('sv_cur');
  localStorage.removeItem('sv_curname');
  window.location.href = 'login.html';
}
 
/* ── Add Credential ── */
function addCredential() {
  const site = ($('a_site')?.value || '').trim();
  const user = ($('a_user')?.value || '').trim();
  const pw   =  $('a_pw')?.value  || '';
  
  // Allow saving even with empty fields - no restrictions
  const vault = getVault();
  vault.push({
    site: site || 'Untitled',
    user: user || '-',
    pw:   btoa(pw || ''),
    date: new Date().toLocaleDateString('en-GB'),
  });
  saveVault(vault);
 
  $('a_site').value = '';
  $('a_user').value = '';
  $('a_pw').value   = '';
 
  toast('Saved to vault!', 'ok');
  renderCards();
  updateStats();
}
 
/* ── Delete ── */
function deleteCredential(idx) {
  if (!confirm('Remove this credential from your vault?')) return;
  const vault = getVault();
  vault.splice(idx, 1);
  saveVault(vault);
  toast('Credential deleted.', 'info');
  renderCards();
  updateStats();
}
 
/* ── Edit Modal ── */
function openEdit(idx) {
  const vault = getVault();
  const cred  = vault[idx];
  $('edit_idx').value  = idx;
  $('edit_site').value = cred.site;
  $('edit_user').value = cred.user;
  $('edit_pw').value   = atob(cred.pw);
  $('editModal').classList.add('open');
}
 
function closeModal() {
  $('editModal').classList.remove('open');
}

function saveEdit() {
  const idx   = parseInt($('edit_idx').value);
  const site  = ($('edit_site')?.value || '').trim();
  const user  = ($('edit_user')?.value || '').trim();
  const pw    = $('edit_pw')?.value || '';
  
  if (isNaN(idx)) { toast('Invalid credential index', 'err'); return; }
  
  const vault = getVault();
  if (idx < 0 || idx >= vault.length) { toast('Credential not found', 'err'); return; }
  
  // Update the credential
  vault[idx].site = site || 'Untitled';
  vault[idx].user = user || '-';
  vault[idx].pw   = btoa(pw || '');
  
  if (saveVault(vault)) {
    toast('Changes saved!', 'ok');
    closeModal();
    renderCards();
    updateStats();
  } else {
    toast('Failed to save changes', 'err');
  }
}
 
/* ── Copy password ── */
async function copyPassword(encoded, btn) {
  try {
    await navigator.clipboard.writeText(atob(encoded));
    btn.classList.add('ok');
    btn.innerHTML = '<i class="fas fa-check"></i> Copied';
    setTimeout(() => {
      btn.classList.remove('ok');
      btn.innerHTML = '<i class="fas fa-copy"></i> Copy';
    }, 1800);
  } catch {
    toast('Could not copy to clipboard.', 'err');
  }
}
 
/* ── Reveal password per card ── */
const _revealed = {};
function revealPassword(idx, encoded, btn) {
  const span = $('cpw_' + idx);
  if (!span) return;
  _revealed[idx] = !_revealed[idx];
  if (_revealed[idx]) {
    span.textContent = atob(encoded);
    span.style.fontFamily = 'var(--sans)';
    span.style.letterSpacing = '0';
    btn.innerHTML = '<i class="fas fa-eye-slash"></i>';
  } else {
    span.textContent = '••••••••';
    span.style.fontFamily = 'var(--mono)';
    span.style.letterSpacing = '2px';
    btn.innerHTML = '<i class="fas fa-eye"></i>';
  }
}
 
/* ── Render Cards ── */
const AVATAR_COLORS = ['av0','av1','av2','av3','av4','av5'];
 
function avatarColor(site) {
  let h = 0;
  for (const c of site) h = (h + c.charCodeAt(0)) % 6;
  return AVATAR_COLORS[h];
}
 
function escHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
 
function renderCards() {
  const vault  = getVault();
  const query  = ($('searchQ')?.value || '').toLowerCase().trim();
  const filtered = vault
    .map((c, i) => ({ ...c, _i: i }))
    .filter(c =>
      c.site.toLowerCase().includes(query) ||
      c.user.toLowerCase().includes(query)
    );
 
  const grid = $('cardsGrid');
  if (!grid) return;
 
  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-vault"></i>
        <h3>${query ? 'No results found' : 'Your vault is empty'}</h3>
        <p>${query ? 'Try a different search term.' : 'Use the panel on the left to add your first credential.'}</p>
      </div>`;
    return;
  }
 
  grid.innerHTML = filtered.map(c => {
    const av   = avatarColor(c.site);
    const init = c.site.slice(0, 2).toUpperCase();
    return `
      <div class="cred-card">
        <div class="card-head">
          <div class="card-avatar ${av}">${init}</div>
          <div>
            <div class="card-site">${escHtml(c.site)}</div>
            <div class="card-date">${c.date || ''}</div>
          </div>
        </div>
        <div class="card-field">
          <div class="cf-label">Username</div>
          <div class="cf-val">${escHtml(c.user)}</div>
        </div>
        <div class="card-field">
          <div class="cf-label">Password</div>
          <div class="cf-pw-row">
            <span class="cf-dots" id="cpw_${c._i}" style="font-family:var(--mono);letter-spacing:2px">••••••••</span>
            <button class="reveal-btn" onclick="revealPassword(${c._i},'${c.pw}',this)" title="Reveal">
              <i class="fas fa-eye"></i>
            </button>
          </div>
        </div>
        <div class="card-actions">
          <button class="ca" onclick="copyPassword('${c.pw}',this)">
            <i class="fas fa-copy"></i> Copy
          </button>
          <button class="ca" onclick="openEdit(${c._i})">
            <i class="fas fa-pen"></i> Edit
          </button>
          <button class="ca del" onclick="deleteCredential(${c._i})">
            <i class="fas fa-trash"></i> Delete
          </button>
        </div>
      </div>`;
  }).join('');
}

/* ── Stats ── */
function updateStats() {
  const vault = getVault();
  const total = $('stat_total');
  const sites = $('stat_sites');
  const last  = $('stat_last');
  if (total) total.textContent = vault.length;
  if (sites) sites.textContent = new Set(vault.map(c => c.site.toLowerCase())).size;
  if (last)  last.textContent  = vault.length ? vault[vault.length - 1].site : '—';
}
 
/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  /* Set user info in topbar */
  const name = currentName() || currentUser();
  const first = name.split(' ')[0];
  const initials = name.split(' ').map(w => w[0] || '').join('').toUpperCase().slice(0, 2) || '??';
 
  const topName   = $('topName');
  const topAvatar = $('topAvatar');
  if (topName)   topName.textContent   = first;
  if (topAvatar) topAvatar.textContent = initials;
 
  renderCards();
  updateStats();
 
  /* Close modal on backdrop click */
  const modal = $('editModal');
  if (modal) modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
 
  /* Enter key on Add form */
  const apw = $('a_pw');
  if (apw) apw.addEventListener('keydown', e => { if (e.key === 'Enter') addCredential(); });
});
