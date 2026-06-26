// ============================================================
// MATH HUB - Main Script
// ============================================================

// ---- Auth / User State ----
const AUTH_KEY = 'mathhub_user';

function getUser() {
  try { return JSON.parse(localStorage.getItem(AUTH_KEY)); } catch { return null; }
}

function saveUser(user) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

function isLoggedIn() {
  return !!getUser();
}

function updateNavAuth() {
  const user = getUser();
  document.querySelectorAll('.signup-btn').forEach(btn => {
    if (user) {
      btn.textContent = user.name.split(' ')[0];
      btn.classList.add('logged-in');
      btn.onclick = showProfileModal;
    } else {
      btn.textContent = 'Sign Up';
      btn.onclick = showAuthModal;
    }
  });
  // Update level badges visibility
  updateLevelAccess();
}

function updateLevelAccess() {
  const user = getUser();
  const loggedIn = !!user;
  // Show/hide locked badges on practice tabs
  document.querySelectorAll('.level-tab[data-requires-auth]').forEach(tab => {
    const lock = tab.querySelector('.lock-icon');
    if (lock) lock.style.display = loggedIn ? 'none' : 'inline';
  });
}

// ---- Auth Modal ----
function showAuthModal(mode = 'signup') {
  let modal = document.getElementById('auth-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'auth-modal';
    modal.innerHTML = `
      <div class="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4" id="auth-backdrop">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
          <button onclick="closeAuthModal()" class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold">&times;</button>
          <div class="text-center mb-6">
            <span class="material-symbols-outlined fill text-4xl text-blue-600">calculate</span>
            <h2 class="text-2xl font-bold text-gray-800 mt-2" id="auth-title">Create Account</h2>
            <p class="text-gray-500 text-sm mt-1" id="auth-subtitle">Sign up to unlock Medium & Hard challenges!</p>
          </div>
          <div id="auth-form">
            <div id="signup-fields">
              <div class="mb-4">
                <label class="block text-sm font-semibold text-gray-700 mb-1">Your Name</label>
                <input id="auth-name" type="text" placeholder="e.g. Sam" class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 outline-none text-gray-800 font-medium transition-colors"/>
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input id="auth-email" type="email" placeholder="your@email.com" class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 outline-none text-gray-800 font-medium transition-colors"/>
            </div>
            <div class="mb-6">
              <label class="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <input id="auth-password" type="password" placeholder="••••••••" class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 outline-none text-gray-800 font-medium transition-colors"/>
            </div>
            <p id="auth-error" class="text-red-500 text-sm mb-3 hidden"></p>
            <button onclick="handleAuthSubmit()" id="auth-submit-btn" class="w-full bg-blue-600 text-white py-3 rounded-full font-bold text-lg hover:bg-blue-700 transition-colors shadow-md">Create Account</button>
            <p class="text-center text-sm text-gray-500 mt-4">
              <span id="auth-switch-text">Already have an account?</span>
              <button onclick="toggleAuthMode()" id="auth-switch-btn" class="text-blue-600 font-semibold ml-1 hover:underline">Log In</button>
            </p>
          </div>
        </div>
      </div>`;
    document.body.appendChild(modal);
    document.getElementById('auth-backdrop').addEventListener('click', (e) => {
      if (e.target.id === 'auth-backdrop') closeAuthModal();
    });
  }
  modal.style.display = 'block';
  modal._mode = mode || 'signup';
  applyAuthMode(modal._mode);
}

function applyAuthMode(mode) {
  const isSignup = mode === 'signup';
  document.getElementById('auth-title').textContent = isSignup ? 'Create Account' : 'Welcome Back!';
  document.getElementById('auth-subtitle').textContent = isSignup ? 'Sign up to unlock Medium & Hard challenges!' : 'Log in to continue your journey!';
  document.getElementById('signup-fields').style.display = isSignup ? '' : 'none';
  document.getElementById('auth-submit-btn').textContent = isSignup ? 'Create Account' : 'Log In';
  document.getElementById('auth-switch-text').textContent = isSignup ? 'Already have an account?' : "Don't have an account?";
  document.getElementById('auth-switch-btn').textContent = isSignup ? 'Log In' : 'Sign Up';
  const modal = document.getElementById('auth-modal');
  if (modal) modal._mode = mode;
}

function toggleAuthMode() {
  const modal = document.getElementById('auth-modal');
  const newMode = modal._mode === 'signup' ? 'login' : 'signup';
  applyAuthMode(newMode);
}

function closeAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (modal) modal.style.display = 'none';
}

function showError(msg) {
  const el = document.getElementById('auth-error');
  if (el) { el.textContent = msg; el.classList.remove('hidden'); }
}

function handleAuthSubmit() {
  const modal = document.getElementById('auth-modal');
  const mode = modal._mode;
  const email = document.getElementById('auth-email').value.trim();
  const password = document.getElementById('auth-password').value.trim();

  if (!email || !password) { showError('Please fill in all fields.'); return; }
  if (password.length < 4) { showError('Password must be at least 4 characters.'); return; }

  if (mode === 'signup') {
    const name = document.getElementById('auth-name').value.trim();
    if (!name) { showError('Please enter your name.'); return; }
    // Store user (simple local storage simulation)
    const users = JSON.parse(localStorage.getItem('mathhub_users') || '[]');
    if (users.find(u => u.email === email)) { showError('Email already registered. Please log in.'); return; }
    const newUser = { name, email, password, joined: new Date().toISOString() };
    users.push(newUser);
    localStorage.setItem('mathhub_users', JSON.stringify(users));
    saveUser(newUser);
  } else {
    const users = JSON.parse(localStorage.getItem('mathhub_users') || '[]');
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) { showError('Invalid email or password.'); return; }
    saveUser(found);
  }

  closeAuthModal();
  updateNavAuth();
  showToast(mode === 'signup' ? '🎉 Welcome to Math Hub! Medium & Hard unlocked!' : '👋 Welcome back!');
  // Refresh level tabs if they exist
  initLevelTabs();
}

function showProfileModal() {
  const user = getUser();
  if (!user) return;
  if (confirm(`Logged in as ${user.name}\n\nClick OK to log out.`)) {
    localStorage.removeItem(AUTH_KEY);
    updateNavAuth();
    showToast('Logged out successfully.');
    initLevelTabs();
  }
}

// ---- Toast Notification ----
function showToast(msg) {
  let toast = document.getElementById('mh-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'mh-toast';
    toast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#1e3a5f;color:#fff;padding:14px 28px;border-radius:50px;font-weight:700;font-size:15px;z-index:9999;box-shadow:0 8px 32px rgba(0,0,0,0.2);transition:opacity 0.3s;';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => { toast.style.opacity = '0'; }, 3000);
}

// ---- Level Tabs (Practice Difficulty) ----
function initLevelTabs() {
  const loggedIn = isLoggedIn();
  document.querySelectorAll('.level-tabs-container').forEach(container => {
    const tabs = container.querySelectorAll('.level-tab');
    const panels = container.querySelectorAll('.level-panel');

    tabs.forEach(tab => {
      const level = tab.dataset.level;
      const requiresAuth = tab.dataset.requiresAuth === 'true';
      const lock = tab.querySelector('.lock-icon');
      if (lock) lock.style.display = (requiresAuth && !loggedIn) ? 'inline' : 'none';

      tab.onclick = () => {
        if (requiresAuth && !loggedIn) {
          showAuthModal('signup');
          return;
        }
        tabs.forEach(t => t.classList.remove('active-level-tab'));
        panels.forEach(p => p.classList.add('hidden'));
        tab.classList.add('active-level-tab');
        const panel = container.querySelector(`.level-panel[data-level="${level}"]`);
        if (panel) panel.classList.remove('hidden');
      };
    });
  });
}

// ---- Accordion Toggle ----
function toggleAccordion(button) {
  const isExpanded = button.getAttribute('aria-expanded') === 'true';
  document.querySelectorAll('.accordion-btn').forEach(btn => {
    btn.setAttribute('aria-expanded', 'false');
    btn.nextElementSibling.classList.remove('active');
  });
  if (!isExpanded) {
    button.setAttribute('aria-expanded', 'true');
    button.nextElementSibling.classList.add('active');
  }
}

// ---- Answer Checking ----
function gcd(a, b) {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { const t = b; b = a % b; a = t; }
  return a;
}

function parseRational(value) {
  if (typeof value !== 'string') value = String(value);
  value = value.trim().replace(/–|—/g, '-');
  if (!value) return null;
  const mix = value.match(/^(-?\d+)\s+([0-9]+)\s*\/\s*([0-9]+)$/);
  if (mix) {
    const w = parseInt(mix[1], 10), n = parseInt(mix[2], 10), d = parseInt(mix[3], 10);
    if (!d) return null;
    const sign = w < 0 ? -1 : 1;
    return normalizeFraction(sign * (Math.abs(w) * d + n), d);
  }
  const frac = value.match(/^(-?\d+)\s*\/\s*(\d+)$/);
  if (frac) {
    const n = parseInt(frac[1], 10), d = parseInt(frac[2], 10);
    if (!d) return null;
    return normalizeFraction(n, d);
  }
  const num = Number(value);
  if (!isNaN(num)) return normalizeFraction(num, 1);
  return null;
}

function normalizeFraction(n, d) {
  if (d === 0) return null;
  if (typeof n === 'number' && !Number.isInteger(n)) return { num: n, den: d };
  const sign = d < 0 ? -1 : 1;
  n = n * sign; d = Math.abs(d);
  const div = gcd(n, d);
  return { num: n / div, den: d / div };
}

function areRationalsEqual(v1, v2) {
  const a = parseRational(v1), b = parseRational(v2);
  if (!a || !b) return false;
  if (a.den === 1 && b.den === 1) return a.num === b.num;
  return a.num * b.den === b.num * a.den;
}

function setInputFeedback(input, isCorrect) {
  input.style.borderColor = isCorrect ? '#16a34a' : '#dc2626';
  input.style.backgroundColor = isCorrect ? 'rgba(22,163,74,0.08)' : 'rgba(220,38,38,0.08)';
}

function resetInputFeedback(input) {
  input.style.borderColor = '';
  input.style.backgroundColor = '';
}

function checkAnswers(button) {
  const answerData = button.dataset.answers || '';
  const expected = answerData.split(',').map(a => a.trim()).filter(Boolean);
  const section = button.closest('section, .level-panel');
  if (!section || !expected.length) return;

  const inputs = Array.from(section.querySelectorAll('input[type="number"], input[type="text"].answer-input'));
  let correct = 0;
  inputs.forEach((input, i) => {
    resetInputFeedback(input);
    const isOk = expected[i] ? areRationalsEqual(input.value.trim(), expected[i]) : false;
    setInputFeedback(input, isOk);
    if (isOk) correct++;
  });

  // Show score
  let scoreEl = section.querySelector('.score-display');
  if (!scoreEl) {
    scoreEl = document.createElement('p');
    scoreEl.className = 'score-display text-center font-bold text-lg mt-4';
    button.parentNode.insertBefore(scoreEl, button.nextSibling);
  }
  const pct = Math.round((correct / expected.length) * 100);
  const emoji = pct === 100 ? '🏆' : pct >= 60 ? '⭐' : '💪';
  scoreEl.textContent = `${emoji} You got ${correct} out of ${expected.length} correct! (${pct}%)`;
  scoreEl.style.color = pct === 100 ? '#16a34a' : pct >= 60 ? '#825100' : '#dc2626';
}

// ---- Mobile Menu ----
function initMobileMenu() {
  const toggleBtn = document.querySelector('[aria-label="Menu"], [aria-label="Open menu"]');
  if (!toggleBtn) return;

  let mobileMenu = document.getElementById('mobile-nav-menu');
  if (!mobileMenu) {
    mobileMenu = document.createElement('div');
    mobileMenu.id = 'mobile-nav-menu';
    mobileMenu.className = 'md:hidden hidden fixed top-16 left-0 right-0 bg-white shadow-xl z-40 flex flex-col p-6 gap-4 border-t border-gray-100';
    mobileMenu.innerHTML = `
      <a href="index.html" class="text-gray-700 font-semibold text-lg hover:text-blue-600 py-2 border-b border-gray-100">🏠 Home</a>
      <a href="multiplication.html" class="text-gray-700 font-semibold text-lg hover:text-blue-600 py-2 border-b border-gray-100">✖️ Multiplication</a>
      <a href="division.html" class="text-gray-700 font-semibold text-lg hover:text-blue-600 py-2 border-b border-gray-100">➗ Division</a>
      <a href="fractions.html" class="text-gray-700 font-semibold text-lg hover:text-blue-600 py-2 border-b border-gray-100">🍕 Fractions</a>
      <a href="about_me.html" class="text-gray-700 font-semibold text-lg hover:text-blue-600 py-2 border-b border-gray-100">👤 About Me</a>
      <a href="contact_us.html" class="text-gray-700 font-semibold text-lg hover:text-blue-600 py-2">✉️ Contact Us</a>`;
    document.body.appendChild(mobileMenu);
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    mobileMenu.classList.toggle('hidden');
  });
  document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && e.target !== toggleBtn) {
      mobileMenu.classList.add('hidden');
    }
  });
}

// ---- DOMContentLoaded ----
document.addEventListener('DOMContentLoaded', () => {
  // Auth
  updateNavAuth();

  // Wire signup buttons
  document.querySelectorAll('.signup-btn').forEach(btn => {
    if (!isLoggedIn()) btn.addEventListener('click', () => showAuthModal('signup'));
    else btn.addEventListener('click', showProfileModal);
  });

  // Answer check buttons
  document.querySelectorAll('.check-answers-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      checkAnswers(button);
    });
  });

  // Level tabs
  initLevelTabs();

  // Mobile menu
  initMobileMenu();

  // Practice card on homepage
  const practiceCard = document.getElementById('practice-card');
  const videoCard = document.getElementById('video-card');
  if (practiceCard) {
    practiceCard.addEventListener('click', () => {
      const choice = window.prompt('Choose a practice page: multiplication, division, or fractions');
      if (!choice) return;
      const n = choice.trim().toLowerCase();
      if (n.includes('multi')) window.location.href = 'multiplication.html';
      else if (n.includes('div')) window.location.href = 'division.html';
      else if (n.includes('frac')) window.location.href = 'fractions.html';
      else window.alert('Please type multiplication, division, or fractions.');
    });
  }
  if (videoCard) {
    videoCard.addEventListener('click', () => {
      const choice = window.prompt('Which video? multiplication, division, or fractions');
      if (!choice) return;
      const n = choice.trim().toLowerCase();
      if (n.includes('multi')) window.location.href = 'multiplication.html';
      else if (n.includes('div')) window.location.href = 'division.html';
      else if (n.includes('frac')) window.location.href = 'fractions.html';
      else window.alert('Please type multiplication, division, or fractions.');
    });
  }
});
