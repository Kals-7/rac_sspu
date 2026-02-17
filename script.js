// Ripple Effect for Buttons
function addRippleEffect() {
  const buttons = document.querySelectorAll('.btn');

  buttons.forEach(button => {
    button.addEventListener('click', function (e) {
      // Create ripple element
      const ripple = document.createElement('span');
      ripple.classList.add('btn-ripple');

      // Get position of click
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);

      // Set ripple size and position
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

      // Add ripple to button
      button.appendChild(ripple);

      // Remove ripple after animation
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

// Tab functionality
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn, .subtab');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const container = btn.closest('.block, section');
      const targetId = btn.getAttribute('data-tab') || btn.getAttribute('data-target');
      const targetContent = container.querySelector(`[id="${targetId}"], [data-subsection="${targetId}"]`);

      if (!targetContent) return;

      // Remove active classes
      const parentNav = btn.closest('.tabs, .subnav');
      parentNav.querySelectorAll('.tab-btn, .subtab').forEach(b => {
        b.classList.remove('active', 'selected');
        b.setAttribute('aria-selected', 'false');
      });

      const contentsContainer = container.querySelector('.subsections, .tab-contents') || container;
      contentsContainer.querySelectorAll('.tab-content, .subsection').forEach(c => {
        c.classList.remove('active');
        c.style.opacity = '0';
        c.style.transform = 'translateY(10px)';
      });

      // Add active classes
      btn.classList.add(btn.classList.contains('subtab') ? 'selected' : 'active');
      btn.setAttribute('aria-selected', 'true');

      targetContent.classList.add('active');

      // Trigger animation
      setTimeout(() => {
        targetContent.style.opacity = '1';
        targetContent.style.transform = 'translateY(0)';
      }, 50);
    });
  });
}

// Initialize flip card interactions
function initFlipCards() {
  const cards = document.querySelectorAll('.flip-card');
  cards.forEach(card => {
    const front = card.querySelector('.card-front');
    const back = card.querySelector('.card-back');

    function setFlipped(flipped) {
      card.classList.toggle('is-flipped', !!flipped);
      card.setAttribute('aria-pressed', String(!!flipped));
      if (front) front.setAttribute('aria-hidden', !!flipped ? 'true' : 'false');
      if (back) back.setAttribute('aria-hidden', !!flipped ? 'false' : 'true');
    }

    card.addEventListener('click', (e) => {
      if (e.target.closest('a, button')) return; // don't intercept interactive elements
      setFlipped(!card.classList.contains('is-flipped'));
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setFlipped(!card.classList.contains('is-flipped'));
      } else if (e.key === 'Escape' && card.classList.contains('is-flipped')) {
        setFlipped(false);
        card.focus();
      }
    });

    // Initial aria-hidden states
    if (front) front.setAttribute('aria-hidden', 'false');
    if (back) back.setAttribute('aria-hidden', 'true');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Initialize ripple effect
  addRippleEffect();
  initTabs();
  initFlipCards();

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('.nav-list');
  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      const isOpen = navList.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    navList.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
      navList.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }));
  }

  // Smooth scroll offset for sticky header
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#' || href === '#top') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const header = document.querySelector('.site-header');
      const offset = header ? header.getBoundingClientRect().height + 12 : 12;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // Back to top button
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    const header = document.querySelector('.site-header');
    window.addEventListener('scroll', () => {
      // Back to top visibility
      if (window.scrollY > 300) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }

      // Header scroll effect
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Scroll Reveal
  const reveals = document.querySelectorAll('.reveal');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-list a');

  const revealOnScroll = () => {
    const scrollPos = window.scrollY + 100;

    reveals.forEach(reveal => {
      const windowHeight = window.innerHeight;
      const revealTop = reveal.getBoundingClientRect().top;
      const revealPoint = 150;

      if (revealTop < windowHeight - revealPoint) {
        reveal.classList.add('active');
      }
    });

    // Nav active state
    sections.forEach(section => {
      if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
        const id = section.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });

    // Parallax hero
    const heroLogo = document.querySelector('.hero-logo');
    if (heroLogo) {
      heroLogo.style.transform = `translateY(${window.scrollY * 0.1}px) rotate(${window.scrollY * 0.05}deg)`;
    }
  };

  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // Run once on load

  // Footer year (re-added here as per instruction, though it was already present above)
  const footerYearEl = document.getElementById('year');
  if (footerYearEl) {
    footerYearEl.textContent = new Date().getFullYear();
  }

  /* BOD login entry gate removed */

  // Member modal functionality
  const memberModal = document.getElementById('member-modal');
  const memberLoginForm = document.getElementById('member-login-form');
  const memberRegisterForm = document.getElementById('member-register-form');
  const showRegisterLink = document.getElementById('show-register');
  const showLoginLink = document.getElementById('show-login');

  function showMemberModal() {
    if (!memberModal) return;
    memberModal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function hideMemberModal() {
    if (!memberModal) return;
    memberModal.classList.remove('show');
    document.body.style.overflow = '';
  }

  // Member login button
  const memberLoginBtn = document.getElementById('member-login-btn');
  if (memberLoginBtn) {
    memberLoginBtn.addEventListener('click', () => {
      showMemberModal();
      memberLoginForm.style.display = 'block';
      memberRegisterForm.style.display = 'none';
    });
  }

  // Toggle between login and register forms
  if (showRegisterLink) {
    showRegisterLink.addEventListener('click', (e) => {
      e.preventDefault();
      memberLoginForm.style.display = 'none';
      memberRegisterForm.style.display = 'block';
    });
  }

  if (showLoginLink) {
    showLoginLink.addEventListener('click', (e) => {
      e.preventDefault();
      memberRegisterForm.style.display = 'none';
      memberLoginForm.style.display = 'block';
    });
  }

  // Close member modal
  const memberCloseBtn = memberModal?.querySelector('.close');
  if (memberCloseBtn) {
    memberCloseBtn.addEventListener('click', hideMemberModal);
  }

  // Member modal backdrop click
  if (memberModal) {
    memberModal.addEventListener('click', (e) => {
      if (e.target === memberModal) hideMemberModal();
    });
  }

  // Member Registration Form Handler
  const memberRegisterFormEl = document.getElementById('member-register');
  if (memberRegisterFormEl) {
    memberRegisterFormEl.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = memberRegisterFormEl.querySelector('#reg-name').value.trim();
      const email = memberRegisterFormEl.querySelector('#reg-email').value.trim();
      const password = memberRegisterFormEl.querySelector('#reg-password').value;
      const confirmPassword = memberRegisterFormEl.querySelector('#reg-confirm').value;
      const interest = memberRegisterFormEl.querySelector('#reg-interest').value;

      if (!name || !email || !password) {
        showToast('Please fill all required fields', true);
        return;
      }

      if (password !== confirmPassword) {
        showToast('Passwords do not match', true);
        return;
      }

      if (password.length < 6) {
        showToast('Password must be at least 6 characters', true);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/api/members/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, interest })
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || 'Registration failed');
        }

        const data = await res.json();

        // Store member session
        sessionStorage.setItem('memberToken', data.token);
        sessionStorage.setItem('memberAuthenticated', 'true');
        sessionStorage.setItem('memberData', JSON.stringify(data.member));

        showToast(`Welcome, ${data.member.name}! Registration successful.`);
        hideMemberModal();
        updateMemberUI(data.member);

      } catch (err) {
        showToast(err.message, true);
      }
    });
  }

  // Member Login Form Handler
  const memberLoginFormEl = document.getElementById('member-login');
  if (memberLoginFormEl) {
    memberLoginFormEl.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = memberLoginFormEl.querySelector('#member-email').value.trim();
      const password = memberLoginFormEl.querySelector('#member-password').value;

      if (!email || !password) {
        showToast('Please enter email and password', true);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/api/members/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || 'Login failed');
        }

        const data = await res.json();

        // Store member session
        sessionStorage.setItem('memberToken', data.token);
        sessionStorage.setItem('memberAuthenticated', 'true');
        sessionStorage.setItem('memberData', JSON.stringify(data.member));

        showToast(`Welcome back, ${data.member.name}!`);
        hideMemberModal();
        updateMemberUI(data.member);

      } catch (err) {
        showToast(err.message, true);
      }
    });
  }

  // Update member UI
  function updateMemberUI(member) {
    const memberDisplay = document.getElementById('member-display');
    const loggedMember = document.getElementById('logged-member');
    const memberLoginBtn = document.getElementById('member-login-btn');
    const logoutBtn = document.getElementById('logout-btn');

    if (memberDisplay) memberDisplay.style.display = '';
    if (loggedMember) loggedMember.textContent = member.name;
    if (memberLoginBtn) memberLoginBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = '';
  }

  // Check for existing member session on load
  if (sessionStorage.getItem('memberAuthenticated') === 'true') {
    const memberData = JSON.parse(sessionStorage.getItem('memberData') || '{}');
    if (memberData.name) {
      updateMemberUI(memberData);
    }
  }

  // Update logout function to handle both BOD and member logout
  const originalBodLogout = window.bodLogout;
  window.bodLogout = function () {
    // Clear member session too
    sessionStorage.removeItem('memberAuthenticated');
    sessionStorage.removeItem('memberToken');
    sessionStorage.removeItem('memberData');

    // Hide member display
    const memberDisplay = document.getElementById('member-display');
    const memberLoginBtn = document.getElementById('member-login-btn');
    if (memberDisplay) memberDisplay.style.display = 'none';
    if (memberLoginBtn) memberLoginBtn.style.display = '';

    // Call original BOD logout
    if (originalBodLogout) originalBodLogout();
  };

  // Debug logging
  console.log('BOD Login functions exposed:', {
    openLoginModal: typeof window.openLoginModal,
    closeLoginModal: typeof window.closeLoginModal,
    showModalRequired: typeof showModalRequired
  });

  // Debug member modal elements
  console.log('Member modal elements:', {
    memberModal: !!memberModal,
    memberLoginForm: !!memberLoginForm,
    memberRegisterForm: !!memberRegisterForm,
    showRegisterLink: !!showRegisterLink,
    showLoginLink: !!showLoginLink,
    memberLoginBtn: !!document.getElementById('member-login-btn')
  });

  // Test function for member registration
  window.testMemberRegistration = async function () {
    try {
      const res = await fetch(`${API_BASE}/api/members/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          interest: 'Community'
        })
      });
      const data = await res.json();
      console.log('Registration test result:', data);
      return data;
    } catch (err) {
      console.error('Registration test error:', err);
      return err;
    }
  };

  /* BOD modal registration/login UI removed */

  /* BOD-related event handlers removed */


  // API base: if opened from file:// use backend localhost; otherwise use same origin
  const API_BASE = (location.origin.startsWith('file')) ? 'http://localhost:3000' : '';

  /* BOD login form submit handler removed */

  // Logout helper
  window.bodLogout = function () {
    console.log('bodLogout function called');

    // Clear all session storage
    sessionStorage.removeItem('bodAuthenticated');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('bodUsername');

    console.log('Session storage cleared');

    // Hide logout button and username display
    const logoutBtn = document.getElementById('logout-btn');
    const usernameDisplay = document.getElementById('username-display');
    if (logoutBtn) logoutBtn.style.display = 'none';
    if (usernameDisplay) usernameDisplay.style.display = 'none';

    // Show BOD login button again
    const bodLoginBtn = document.getElementById('bod-login-btn');
    if (bodLoginBtn) bodLoginBtn.style.display = '';

    console.log('UI elements updated');
    showToast('Logged out successfully');
    showModalRequired();
  };

  // Show or hide logout button on load depending on session
  const logoutBtnInit = document.getElementById('logout-btn');
  const usernameDisplayInit = document.getElementById('username-display');
  const loggedUsernameInit = document.getElementById('logged-username');
  const bodLoginBtnInit = document.getElementById('bod-login-btn');

  if (sessionStorage.getItem('bodAuthenticated') === 'true') {
    // User is logged in
    if (logoutBtnInit) logoutBtnInit.style.display = '';
    if (usernameDisplayInit) usernameDisplayInit.style.display = '';
    if (loggedUsernameInit) {
      const username = sessionStorage.getItem('bodUsername') || 'User';
      loggedUsernameInit.textContent = username;
    }
    if (bodLoginBtnInit) bodLoginBtnInit.style.display = 'none';
  } else {
    // User is not logged in
    if (logoutBtnInit) logoutBtnInit.style.display = 'none';
    if (usernameDisplayInit) usernameDisplayInit.style.display = 'none';
    if (bodLoginBtnInit) bodLoginBtnInit.style.display = '';
  }

  // Subsection tabs
  document.querySelectorAll('.block').forEach((block) => {
    const tabs = block.querySelectorAll('.subtab');
    const panels = block.querySelectorAll('.subsection');

    // Auto-select first tab in each section
    if (tabs.length > 0) {
      // Remove active class from all tabs and panels first
      tabs.forEach(t => t.classList.remove('selected'));
      panels.forEach(p => p.classList.remove('active'));

      // Activate first tab and its corresponding panel
      const firstTab = tabs[0];
      const firstPanel = block.querySelector(`.subsection[data-subsection="${firstTab.getAttribute('data-target')}"]`);

      if (firstTab && firstPanel) {
        firstTab.classList.add('selected');
        firstPanel.classList.add('active');
      }
    }

    // Add click handlers for tab switching
    tabs.forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');
        if (!target) return;

        tabs.forEach((t) => t.classList.remove('selected'));
        btn.classList.add('selected');

        panels.forEach((p) => {
          p.classList.toggle('active', p.getAttribute('data-subsection') === target);
        });
      });
    });
  });

  // Gallery: fetch and render images
  const galleryGrid = document.querySelector('.grid.gallery');
  if (galleryGrid) {
    console.log('Gallery grid found, fetching images...');

    // Show loading state
    galleryGrid.innerHTML = '<div style="text-align: center; color: var(--muted); padding: 40px;"><i class="fas fa-spinner fa-spin"></i> Loading gallery...</div>';

    console.log('API Base:', API_BASE);

    fetch(`${API_BASE}/api/gallery`)
      .then(r => {
        console.log('Gallery response status:', r.status);
        return r.json();
      })
      .then((items = []) => {
        console.log('Gallery items received:', items);
        if (!Array.isArray(items) || items.length === 0) {
          console.log('No items or empty array, showing message');
          galleryGrid.innerHTML = '<div style="text-align: center; color: var(--muted); padding: 40px;"><i class="fas fa-images"></i> No images found in gallery</div>';
          return;
        }

        galleryGrid.innerHTML = '';
        items.forEach(({ src, alt, type }, index) => {
          console.log(`Processing item ${index}:`, { src, alt, type });

          const fig = document.createElement('figure');
          fig.className = 'photo';

          if (type === 'heic') {
            // HEIC files - show as image with fallback
            const img = document.createElement('img');
            img.src = src;
            img.alt = alt || 'Gallery photo';
            img.style.cursor = 'pointer';
            img.onload = () => console.log(`HEIC image loaded: ${src}`);
            img.onerror = function () {
              console.log(`HEIC failed to load, showing placeholder: ${src}`);
              this.style.display = 'none';
              fig.innerHTML = `
                <div class="heic-placeholder">
                  <i class="fas fa-image"></i>
                  <p>${alt}</p>
                  <small>HEIC format</small>
                  <div class="photo-actions">
                    <button class="btn small" onclick="downloadImage('${src}', '${alt}')">
                      <i class="fas fa-download"></i> Download
                    </button>
                  </div>
                </div>
              `;
            };
            fig.appendChild(img);
          } else {
            // Web-compatible images
            const img = document.createElement('img');
            img.loading = 'lazy';
            img.src = src;
            img.alt = alt || 'Gallery photo';
            img.style.cursor = 'pointer';
            img.onload = () => console.log(`Image loaded: ${src}`);
            img.onerror = () => console.error(`Image failed to load: ${src}`);
            img.onclick = () => openLightbox(src, alt);
            fig.appendChild(img);
          }

          // Add overlay with actions for all images
          const overlay = document.createElement('div');
          overlay.className = 'photo-overlay';
          overlay.innerHTML = `
            <div class="photo-actions">
              <button class="btn small" onclick="openLightbox('${src}', '${alt}')">
                <i class="fas fa-expand"></i> View
              </button>
              <button class="btn small" onclick="downloadImage('${src}', '${alt}')">
                <i class="fas fa-download"></i> Download
              </button>
            </div>
          `;
          fig.appendChild(overlay);

          galleryGrid.appendChild(fig);
          console.log(`Added figure ${index} to gallery`);
        });

        console.log(`Gallery populated with ${items.length} items`);
      })
      .catch((err) => {
        console.error('Gallery error:', err);
        galleryGrid.innerHTML = '<div style="text-align: center; color: var(--muted); padding: 40px;"><i class="fas fa-exclamation-triangle"></i> Failed to load gallery: ' + err.message + '</div>';
      });
  } else {
    console.error('Gallery grid not found!');
  }

  // Lightbox functionality
  window.openLightbox = function (src, alt) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <div class="lightbox-content">
        <span class="lightbox-close">&times;</span>
        <img src="${src}" alt="${alt}" />
        <div class="lightbox-caption">${alt}</div>
      </div>
    `;

    lightbox.onclick = (e) => {
      if (e.target === lightbox) lightbox.remove();
    };

    lightbox.querySelector('.lightbox-close').onclick = () => lightbox.remove();

    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';

    // Close on escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        lightbox.remove();
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);

    // Restore scroll when lightbox closes
    lightbox.addEventListener('remove', () => {
      document.body.style.overflow = '';
    });
  };

  // Download functionality
  window.downloadImage = function (src, filename) {
    const link = document.createElement('a');
    link.href = src;
    link.download = filename || 'image';
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Toast utility
  const toastEl = document.getElementById('toast');
  function showToast(message, isError = false) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.toggle('error', Boolean(isError));
    toastEl.classList.add('show');
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => toastEl.classList.remove('show'), 2500);
  }

  // Membership form: try backend, fall back to local save
  const membershipForm = document.getElementById('membership-form');
  if (membershipForm) {
    membershipForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = membershipForm.querySelector('#name');
      const email = membershipForm.querySelector('#email');
      const interest = membershipForm.querySelector('#interest');
      const nameVal = (name && name.value || '').trim();
      const emailVal = (email && email.value || '').trim();
      const interestVal = (interest && interest.value) || '';
      if (!nameVal || !emailVal) { showToast('Please fill all required fields', true); return; }

      // Try backend first
      try {
        const res = await fetch(`${API_BASE}/api/memberships`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: nameVal, email: emailVal, interest: interestVal })
        });
        if (!res.ok) throw new Error('Server rejected');
        membershipForm.reset();
        showToast('Request submitted!');
        return;
      } catch (err) {
        console.warn('Backend not available, falling back to local save');
      }

      // Fallback to local storage
      try {
        const key = 'membershipRequests';
        const list = JSON.parse(localStorage.getItem(key) || '[]');
        list.push({ name: nameVal, email: emailVal, interest: interestVal, submittedAt: new Date().toISOString() });
        localStorage.setItem(key, JSON.stringify(list));
        membershipForm.reset();
        showToast('Request saved locally');
      } catch (err) {
        console.error(err);
        showToast('Could not save your request', true);
      }
    });
  }

  // Add-to-calendar buttons
  function toICSDate(d) {
    const pad = (n) => String(n).padStart(2, '0');
    const y = d.getUTCFullYear();
    const m = pad(d.getUTCMonth() + 1);
    const day = pad(d.getUTCDate());
    const h = pad(d.getUTCHours());
    const min = pad(d.getUTCMinutes());
    const s = pad(d.getUTCSeconds());
    return `${y}${m}${day}T${h}${min}${s}Z`;
  }
  document.querySelectorAll('.add-to-calendar').forEach((btn) => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-title') || 'Event';
      const start = new Date(btn.getAttribute('data-start'));
      const end = new Date(btn.getAttribute('data-end'));
      const location = btn.getAttribute('data-location') || '';
      const uid = `${Date.now()}-${Math.random().toString(36).slice(2)}@racclub`;
      const ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//RAC Club//Events//EN',
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${toICSDate(new Date())}`,
        `DTSTART:${toICSDate(start)}`,
        `DTEND:${toICSDate(end)}`,
        `SUMMARY:${title}`,
        location ? `LOCATION:${location}` : '',
        'END:VEVENT',
        'END:VCALENDAR'
      ].filter(Boolean).join('\r\n');
      const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.replace(/[^a-z0-9-_ ]/gi, '').trim() || 'event'}.ics`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showToast('Calendar file downloaded');
    });
  });

  // Leader card modal behavior (restored)
  const leaderModal = document.getElementById('leader-modal');
  const modalPhoto = leaderModal?.querySelector('.modal-photo img');
  const modalName = leaderModal?.querySelector('.modal-name');
  const modalRole = leaderModal?.querySelector('.modal-role');
  const modalBio = leaderModal?.querySelector('.modal-bio');
  const modalSocial = leaderModal?.querySelector('.modal-social');
  let lastFocusedElement = null;

  function openLeaderModal(card) {
    if (!leaderModal || !card) return;
    const name = card.querySelector('h3')?.textContent || '';
    const role = card.querySelector('.leader-role')?.textContent || '';
    const bio = card.querySelector('.leader-bio')?.textContent || '';
    const img = card.querySelector('.leader-photo img');

    modalName.textContent = name;
    modalRole.textContent = role;
    modalBio.textContent = bio;
    if (img) {
      modalPhoto.src = img.src;
      modalPhoto.alt = img.alt || name;
    }

    // Build social links
    modalSocial.innerHTML = '';
    card.querySelectorAll('.leader-social a').forEach((a) => {
      const clone = a.cloneNode(true);
      clone.classList.add('modal-social-link');
      clone.removeAttribute('aria-hidden');
      modalSocial.appendChild(clone);
    });

    leaderModal.classList.add('show');
    leaderModal.setAttribute('aria-hidden', 'false');
    lastFocusedElement = document.activeElement;
    const closeBtn = leaderModal.querySelector('[data-close]');
    if (closeBtn) closeBtn.focus();
    document.body.style.overflow = 'hidden';

    // Handle escape key
    document.addEventListener('keydown', handleModalEscape);
  }

  function closeLeaderModal() {
    if (!leaderModal) return;
    leaderModal.classList.remove('show');
    leaderModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocusedElement) lastFocusedElement.focus();
    document.removeEventListener('keydown', handleModalEscape);
  }

  function handleModalEscape(e) {
    if (e.key === 'Escape') closeLeaderModal();
  }

  // Attach open handlers to each leader card
  document.querySelectorAll('.leader-card').forEach((card) => {
    card.addEventListener('click', (e) => {
      // don't open modal if clicking a link inside card
      if (e.target.closest('a')) return;
      openLeaderModal(card);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLeaderModal(card);
      }
    });
  });

  // Close modal on backdrop or close button
  leaderModal?.addEventListener('click', (e) => {
    if (e.target === leaderModal || e.target.closest('[data-close]')) closeLeaderModal();
  });

  // Ensure focus trap (basic)
  leaderModal?.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const focusables = Array.from(leaderModal.querySelectorAll('a, button, [tabindex]')).filter((el) => !el.hasAttribute('disabled'));
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      last.focus();
      e.preventDefault();
    } else if (!e.shiftKey && document.activeElement === last) {
      first.focus();
      e.preventDefault();
    }
  });

  // --- Founder card effects & modal ---
  const inViewTargets = document.querySelectorAll('.founder-card, .profile-card');
  if (inViewTargets.length) {
    try {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('in-view'); obs.unobserve(e.target); }
        });
      }, { threshold: 0.18 });
      inViewTargets.forEach(el => obs.observe(el));
    } catch (err) { inViewTargets.forEach(el => el.classList.add('in-view')); }
  }

  // Founder modal open/close
  const founderModal = document.getElementById('founder-modal');
  const founderModalText = founderModal?.querySelector('.founder-modal-text');
  const founderModalClose = founderModal?.querySelector('[data-close]');

  function openFounderModal() {
    if (!founderModal || !founderModalText) return;
    // copy text from page
    const body = document.querySelector('.founder-body');
    founderModalText.innerHTML = body ? body.innerHTML : '<p>Founder story not available.</p>';
    founderModal.classList.add('show');
    founderModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // focus trap - move focus to close
    const closeBtn = founderModal.querySelector('[data-close]'); if (closeBtn) closeBtn.focus();
    document.addEventListener('keydown', handleFounderEscape);
  }

  function closeFounderModal() {
    if (!founderModal) return;
    founderModal.classList.remove('show');
    founderModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleFounderEscape);
  }

  function handleFounderEscape(e) { if (e.key === 'Escape') closeFounderModal(); }

  document.querySelectorAll('.open-founder-story').forEach((btn) => btn.addEventListener('click', (e) => { e.preventDefault(); openFounderModal(); }));
  founderModal?.addEventListener('click', (e) => { if (e.target === founderModal || e.target.closest('[data-close]')) closeFounderModal(); });

}); 