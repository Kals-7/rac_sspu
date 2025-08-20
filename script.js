document.addEventListener('DOMContentLoaded', () => {
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

  // Entry gate: BOD login modal must be completed to access site
  const loginModal = document.getElementById('login-modal');
  const loginForm = loginModal?.querySelector('form');
  const modalContent = loginModal?.querySelector('.modal-content');

  function showModalRequired() {
    if (!loginModal) return;
    loginModal.classList.add('show');
    // prevent scroll behind modal
    document.body.style.overflow = 'hidden';
  }

  function hideModal() {
    if (!loginModal) return;
    loginModal.classList.remove('show');
    document.body.style.overflow = '';
    console.log('Modal hidden');
  }

  // Expose helpers for navbar button / close icon
  window.openLoginModal = showModalRequired;
  window.closeLoginModal = () => {
    // Allow closing for all users
    hideModal();
  };

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
  window.bodLogout = function() {
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
  window.testMemberRegistration = async function() {
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

  // BOD Modal Member Registration functionality
  const bodLoginForm = document.getElementById('bod-login-form');
  const bodMemberRegisterForm = document.getElementById('bod-member-register-form');
  const showMemberRegisterLink = document.getElementById('show-member-register');
  const showBodLoginLink = document.getElementById('show-bod-login');

  // Toggle between BOD login and member registration
  if (showMemberRegisterLink) {
    showMemberRegisterLink.addEventListener('click', (e) => {
      e.preventDefault();
      bodLoginForm.style.display = 'none';
      bodMemberRegisterForm.style.display = 'block';
    });
  }

  if (showBodLoginLink) {
    showBodLoginLink.addEventListener('click', (e) => {
      e.preventDefault();
      bodMemberRegisterForm.style.display = 'none';
      bodLoginForm.style.display = 'block';
    });
  }

  // BOD Member Registration Form Handler
  const bodMemberRegisterFormEl = document.getElementById('bod-member-register');
  if (bodMemberRegisterFormEl) {
    bodMemberRegisterFormEl.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = bodMemberRegisterFormEl.querySelector('#bod-reg-name').value.trim();
      const email = bodMemberRegisterFormEl.querySelector('#bod-reg-email').value.trim();
      const password = bodMemberRegisterFormEl.querySelector('#bod-reg-password').value;
      const confirmPassword = bodMemberRegisterFormEl.querySelector('#bod-reg-confirm').value;
      const interest = bodMemberRegisterFormEl.querySelector('#bod-reg-interest').value;

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
        hideModal(); // Close BOD modal
        updateMemberUI(data.member);

      } catch (err) {
        showToast(err.message, true);
      }
    });
  }

  // Add event listener as backup for BOD login button
  const bodLoginBtn = document.getElementById('bod-login-btn');
  if (bodLoginBtn) {
    bodLoginBtn.addEventListener('click', () => {
      console.log('BOD Login button clicked via event listener');
      showModalRequired();
      // Reset to BOD login form when opening modal
      if (bodLoginForm && bodMemberRegisterForm) {
        bodLoginForm.style.display = 'block';
        bodMemberRegisterForm.style.display = 'none';
      }
    });
  }

  // Add event listener for close button
  const closeBtn = document.querySelector('.modal .close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      console.log('Close button clicked');
      hideModal();
    });
  }

  // Add event listener for logout button as backup
  const logoutBtnBackup = document.getElementById('logout-btn');
  if (logoutBtnBackup) {
    logoutBtnBackup.addEventListener('click', () => {
      console.log('Logout button clicked via event listener');
      window.bodLogout();
    });
  }

  // Block clicks on overlay from closing; keep focus inside modal
  if (loginModal) {
    loginModal.addEventListener('click', (e) => {
      if (e.target === loginModal) {
        // ignore clicks on the backdrop unless authenticated
        if (sessionStorage.getItem('bodAuthenticated') === 'true') {
          hideModal();
        }
      }
    });
  }
  if (modalContent) {
    modalContent.addEventListener('click', (e) => e.stopPropagation());
  }

  // Require login on first load of the session
  if (sessionStorage.getItem('bodAuthenticated') !== 'true') {
    showModalRequired();
  }

  // API base: if opened from file:// use backend localhost; otherwise use same origin
  const API_BASE = (location.origin.startsWith('file')) ? 'http://localhost:3000' : '';

  // Handle login form submit (use backend if available)
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const usernameEl = loginForm.querySelector('#bod-username');
      const passwordEl = loginForm.querySelector('#bod-password');
      const username = usernameEl?.value?.trim();
      const password = passwordEl?.value?.trim();
      if (!username || !password) { showToast('Enter username and password', true); return; }
      try {
        const res = await fetch(`${API_BASE}/api/auth/login`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        if (!res.ok) throw new Error('Invalid');
        const data = await res.json();
        if (!data?.token) throw new Error('No token');
        sessionStorage.setItem('authToken', data.token);
        sessionStorage.setItem('bodAuthenticated', 'true');
        sessionStorage.setItem('bodUsername', username);
        showToast(`Welcome, ${username}!`);
        hideModal();
        
        // Show username and logout button
        const logoutBtn = document.getElementById('logout-btn');
        const usernameDisplay = document.getElementById('username-display');
        const loggedUsername = document.getElementById('logged-username');
        
        if (logoutBtn) logoutBtn.style.display = '';
        if (usernameDisplay) usernameDisplay.style.display = '';
        if (loggedUsername) loggedUsername.textContent = username;
        
        // Hide BOD login button
        const bodLoginBtn = document.getElementById('bod-login-btn');
        if (bodLoginBtn) bodLoginBtn.style.display = 'none';
        
      } catch (err) {
        showToast('Invalid credentials', true);
      }
    });
  }

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
            img.onerror = function() {
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
  window.openLightbox = function(src, alt) {
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
  window.downloadImage = function(src, filename) {
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
}); 