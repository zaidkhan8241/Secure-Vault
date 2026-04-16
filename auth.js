/* ═══════════════════════════════════════
   SecureVault — Auth Logic
   auth.js  (used by login.html & signup.html)
═══════════════════════════════════════ */
 
'use strict';

/* ── Helpers ── */
const $ = id => document.getElementById(id);
 
function toast(msg, type = 'info', dur = 3200) {
  const t = $('toast');
  t.textContent = msg;
  t.className = 'toast show ' + type;
  clearTimeout(t._t);
  t._t = setTimeout(() => (t.className = 'toast'), dur);
}
 
function getUsers() {
  try {
    const data = localStorage.getItem('sv_users');
    if (!data) return [];
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}
function saveUsers(users) {
  try {
    localStorage.setItem('sv_users', JSON.stringify(users));
  } catch (e) {
    toast('Failed to save data. Storage may be full.', 'err');
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
 
/* ═══════════════════════════════════════
   LOGIN
═══════════════════════════════════════ */
function handleLogin(e) {
  if (e) e.preventDefault();
 
  const email = ($('li_email')?.value || '').trim().toLowerCase();
  const pw    = $('li_pw')?.value || '';
 
  if (!email || !pw) { toast('Please fill in both fields.', 'err'); return; }
 
  const users = getUsers();
  const user  = users.find(u => u.email === email);
  
  if (!user) { 
    toast('Incorrect email or password.', 'err'); 
    return; 
  }
  
  // Simple base64 password check
  try {
    if (!user.pw) {
      toast('Account error. Please recreate account.', 'err'); 
      return;
    }
    const storedPw = atob(user.pw);
    if (storedPw !== pw) {
      toast('Incorrect email or password.', 'err'); return;
    }
  } catch (e) {
    toast('Authentication failed.', 'err'); return;
  }
 
  /* Store session */
  localStorage.setItem('sv_cur',     email);
  localStorage.setItem('sv_curname', user.name);
 
  toast('Welcome back, ' + user.name.split(' ')[0] + '!', 'ok', 1400);
  setTimeout(() => { window.location.href = 'dashboard.html'; }, 900);
}
 
/* ═══════════════════════════════════════
   SIGNUP
═══════════════════════════════════════ */
function handleSignup(e) {
  if (e) e.preventDefault();
  
  const name  = ($('su_name')?.value  || '').trim();
  const email = ($('su_email')?.value || '').trim().toLowerCase();
  const pw    = $('su_pw')?.value  || '';
  const pw2   = $('su_pw2')?.value || '';
  
  if (!name || !email || !pw || !pw2) {
    toast('Please fill in all fields.', 'err'); return;
  }
  
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    toast('Enter a valid email address.', 'err'); return;
  }
  
  // Only check if passwords match - no strength requirements
  if (pw !== pw2) {
    toast('Passwords do not match.', 'err'); return;
  }
 
  const users = getUsers();
  
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    toast('That email is already registered.', 'err'); 
    return;
  }
 
  try {
    // Store password with base64 encoding
    const encodedPw = btoa(pw);
    users.push({ name, email, pw: encodedPw });
    saveUsers(users);
    
    toast('Account created! Redirecting to login…', 'ok', 2000);
    setTimeout(() => { window.location.href = 'login.html'; }, 1600);
  } catch (e) {
    toast('Failed to create account. Please try again.', 'err');
  }
}
 
/* ── Guard: redirect logged-in users away from auth pages ── */
(function authGuard() {
  if (localStorage.getItem('sv_cur')) {
    window.location.href = 'dashboard.html';
  }
})();
