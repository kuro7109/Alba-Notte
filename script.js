/* ==========================================================
   Alba & Notte — interactions
   ========================================================== */
(function () {
  'use strict';

  /* ---------- Data ---------- */
  const MENU = {
    alba: {
      note: 'Served from morning through the afternoon.',
      items: [
        { name: 'Classic Laccha Croissant', price: '€4.50', img: 'assets/day1.webp',
          desc: 'A flaky, golden croissant inspired by North Indian laccha paratha, laminated with a butter–ghee blend. Served warm with white butter and jaggery or honey with salted butter.' },
        { name: 'Tandoori Paneer & Spiced Tomato Bruschetta', price: '€9.50', img: 'assets/day0.webp',
          desc: 'Olive-oil toasted sourdough with a slow-cooked spiced tomato base and lightly charred tandoori paneer, finished with pickled onions and fresh herbs.' },
        { name: 'Bhetki “Malai Bianco” Pasta', price: '€15.50', img: 'assets/day2.webp',
          desc: 'Tagliatelle in a creamy Bengali-malai-inspired white sauce with flakes of pan-seared bhetki (sea bass), white pepper and a touch of citrus.' }
      ]
    },
    notte: {
      note: 'Served once the lights dim, into the evening.',
      items: [
        { name: 'Golden Raat Rum Lassi', price: '€9.50', img: 'assets/night1.webp', cal: '≈ 310 kcal',
          desc: 'A night-time reinterpretation of the classic Indian mango lassi, blended with Maltese white rum and lightly spiced with cardamom and saffron.' },
        { name: 'Malta Sunset Rum Punch', price: '€9.00', img: 'assets/night0.webp', cal: '≈ 260 kcal',
          desc: 'Inspired by Valletta’s golden sunsets, this vibrant rum punch blends fresh Malta orange juice with cranberry and pineapple, balanced by lime and local dark rum.' },
        { name: 'Monolit Coconut Rum Spritz', price: '€8.50', img: 'assets/night2.webp', cal: '≈ 240 kcal',
          desc: 'Inspired by warm Mediterranean nights, this refreshing spritz blends Maltese white rum with smooth coconut cream, fresh lime, and soda.' }
      ]
    }
  };

  const POSTS = [
    { img: 'assets/blog1.jpg', alt: 'A busy café interior with plants and wicker chairs', title: 'Heading', excerpt: '[Two-line post excerpt]', body: '[Full blog post body goes here.]' },
    { img: 'assets/blog2.jpg', alt: 'A bright café counter under arched windows', title: 'Heading', excerpt: '[Two-line post excerpt]', body: '[Full blog post body goes here.]' },
    { img: 'assets/blog3.jpg', alt: 'Friends clinking latte cups over a wooden table', title: 'Heading', excerpt: '[Two-line post excerpt]', body: '[Full blog post body goes here.]' }
  ];

  const HOURS = [
    { day: 'Monday', time: '9:00AM-9:00PM' },
    { day: 'Tuesday', time: '9:00AM-9:00PM' },
    { day: 'Wednesday', time: '9:00AM-9:00PM' },
    { day: 'Thursday', time: '9:00AM-9:00PM' },
    { day: 'Friday', time: '9:00AM-9:00PM' },
    { day: 'Saturday', time: '9:00AM-9:00PM' },
    { day: 'Sunday', time: 'CLOSE', closed: true }
  ];
  const OPEN_HOUR = 9;
  const CLOSE_HOUR = 21;
  const TIME_ZONE = 'Europe/Malta';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const arrowSvg = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M2 8h12M9 3l5 5-5 5"/></svg>';

  /* ---------- Nav: scroll spy + shadow ---------- */
  const header = $('#siteHeader');
  const navLinks = $$('.navlink');
  // section id -> nav key
  const spy = [
    ['home', 'home'], ['about', 'about'], ['notte', 'about'],
    ['products', 'products'], ['alba', 'products'], ['products-day', 'products'],
    ['blog', 'blog'], ['visit', 'blog']
  ].map(([id, key]) => ({ el: document.getElementById(id), key })).filter((s) => s.el);

  let ticking = false;
  function updateNav() {
    ticking = false;
    const offset = header.offsetHeight + 40;
    let current = 'home';
    spy.forEach(({ el, key }) => {
      if (el.getBoundingClientRect().top <= offset) current = key;
    });
    navLinks.forEach((a) => a.classList.toggle('is-active', a.dataset.nav === current));
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(updateNav); }
  }, { passive: true });
  window.addEventListener('resize', updateNav);
  updateNav();

  /* ---------- Modals ---------- */
  const menuModal = $('#menuModal');
  const postModal = $('#postModal');
  let lastFocus = null;

  function openModal(modal) {
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.classList.add('modal-open');
    const focusable = modal.querySelector('[data-close], button, a');
    if (focusable) focusable.focus();
  }
  function closeModals() {
    [menuModal, postModal].forEach((m) => { m.hidden = true; });
    document.body.classList.remove('modal-open');
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  [menuModal, postModal].forEach((modal) => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.closest('[data-close]')) closeModals();
    });
    // keep Tab focus inside the open dialog
    modal.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const items = $$('button, a[href], input', modal).filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && (!menuModal.hidden || !postModal.hidden)) closeModals();
  });

  /* ---------- Menu modal ---------- */
  function renderMenu(tab) {
    const data = MENU[tab];
    $$('.tab', menuModal).forEach((b) => {
      const on = b.dataset.tab === tab;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
      b.tabIndex = on ? 0 : -1;
    });
    $('#menuPanel').setAttribute('aria-labelledby', 'tab-' + tab);
    $('#menuNote').textContent = data.note;
    $('#menuItems').innerHTML = data.items.map((m) => `
      <div class="menu-item">
        <img src="${esc(m.img)}" alt="">
        <div style="flex:1;min-width:0">
          <div class="pline"><h3 class="pname">${esc(m.name)}</h3><span class="dots" aria-hidden="true"></span><span class="price">${esc(m.price)}</span></div>
          <p>${esc(m.desc)}</p>${m.cal ? `<p class="pcal">Calories: ${esc(m.cal)}</p>` : ''}
        </div>
      </div>`).join('');
  }

  $$('[data-open-menu]').forEach((btn) => {
    btn.addEventListener('click', () => {
      renderMenu(btn.dataset.openMenu);
      openModal(menuModal);
    });
  });
  $$('.tab', menuModal).forEach((btn) => {
    btn.addEventListener('click', () => renderMenu(btn.dataset.tab));
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const next = btn.dataset.tab === 'alba' ? 'notte' : 'alba';
        renderMenu(next);
        $(`[data-tab="${next}"]`, menuModal).focus();
      }
    });
  });

  /* ---------- Blog carousel ---------- */
  const cardsEl = $('#blogCards');
  const dotsEl = $('#blogDots');
  let start = 0;

  function renderBlog() {
    const n = POSTS.length;
    const order = [0, 1, 2].map((i) => (start + i) % n);
    cardsEl.innerHTML = order.map((idx) => {
      const p = POSTS[idx];
      return `
        <article class="card">
          <img src="${esc(p.img)}" alt="${esc(p.alt)}" loading="lazy">
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.excerpt)}</p>
          <button type="button" class="textlink" data-post="${idx}">Read Blog ${arrowSvg}</button>
        </article>`;
    }).join('');
    dotsEl.innerHTML = POSTS.map((_, i) =>
      `<button type="button" class="dot${i === start ? ' is-on' : ''}" data-dot="${i}" aria-label="Show post ${i + 1}"${i === start ? ' aria-current="true"' : ''}></button>`
    ).join('');
  }

  $('#prevPost').addEventListener('click', () => { start = (start - 1 + POSTS.length) % POSTS.length; renderBlog(); });
  $('#nextPost').addEventListener('click', () => { start = (start + 1) % POSTS.length; renderBlog(); });
  dotsEl.addEventListener('click', (e) => {
    const d = e.target.closest('[data-dot]');
    if (d) { start = Number(d.dataset.dot); renderBlog(); }
  });
  cardsEl.addEventListener('click', (e) => {
    const b = e.target.closest('[data-post]');
    if (!b) return;
    const p = POSTS[Number(b.dataset.post)];
    $('#postImg').src = p.img;
    $('#postImg').alt = p.alt;
    $('#postTitle').textContent = p.title;
    $('#postText').textContent = p.body;
    openModal(postModal);
  });

  // swipe on touch screens
  let touchX = null;
  cardsEl.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  cardsEl.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) {
      start = (start + (dx < 0 ? 1 : -1) + POSTS.length) % POSTS.length;
      renderBlog();
    }
    touchX = null;
  });
  renderBlog();

  /* ---------- Opening hours ---------- */
  function maltaNow() {
    try {
      const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: TIME_ZONE, weekday: 'long', hour: 'numeric', hour12: false
      }).formatToParts(new Date());
      return {
        day: parts.find((p) => p.type === 'weekday').value,
        hour: parseInt(parts.find((p) => p.type === 'hour').value, 10) % 24
      };
    } catch (err) {
      const d = new Date();
      return { day: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()], hour: d.getHours() };
    }
  }

  function renderHours() {
    const now = maltaNow();
    $('#hours').innerHTML = HOURS.map((h) => {
      const today = h.day === now.day;
      const open = today && !h.closed && now.hour >= OPEN_HOUR && now.hour < CLOSE_HOUR;
      const badge = today
        ? `<span class="badge ${open ? 'badge-open' : 'badge-closed'}">${open ? 'Open now' : 'Closed now'}</span>`
        : '';
      return `
        <div class="hrow${today ? ' is-today' : ''}">
          <span class="hday">${h.day.toUpperCase()}</span>
          <span class="hdots">${badge}</span>
          <span class="htime">${h.time}</span>
        </div>`;
    }).join('');
  }
  renderHours();
  setInterval(renderHours, 60 * 1000);

  /* ---------- Newsletter ---------- */
  const form = $('#newsletter');
  const email = $('#nlEmail');
  const help = $('#nlHelp');
  const btn = $('#nlBtn');
  const DEFAULT_HELP = help.textContent;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = email.value.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    help.classList.remove('is-error', 'is-done');
    if (!valid) {
      email.classList.add('is-invalid');
      email.setAttribute('aria-invalid', 'true');
      help.classList.add('is-error');
      help.textContent = 'Please enter a valid email address.';
      email.focus();
      return;
    }
    // TODO: connect to your email provider (Mailchimp, Formspree, etc.) here.
    email.classList.remove('is-invalid');
    email.removeAttribute('aria-invalid');
    help.classList.add('is-done');
    help.textContent = 'Thanks! You’re on the list — see you at Alba & Notte.';
    btn.textContent = 'Subscribed';
    email.value = '';
  });
  email.addEventListener('input', () => {
    if (help.classList.contains('is-error')) {
      help.classList.remove('is-error');
      help.textContent = DEFAULT_HELP;
      email.classList.remove('is-invalid');
      email.removeAttribute('aria-invalid');
    }
  });

  /* ---------- Scroll reveal ---------- */
  const revealTargets = $$('.about-art, .about-copy, .story, .products-head, .prow, .visit-row, .blog-heading');
  if ('IntersectionObserver' in window) {
    revealTargets.forEach((el) => el.classList.add('reveal'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealTargets.forEach((el) => io.observe(el));
  }
})();
