/* =========================================================
   The Oragon Gazette - Interactive behaviors
   ========================================================= */
(function () {
  'use strict';

  /* ---------- Sound preferences ---------- */
  const SFX_KEY = 'gazette.sfx';
  const isSfxOn = () => {
    try { return localStorage.getItem(SFX_KEY) !== 'off'; } catch (e) { return true; }
  };
  const setSfx = (on) => {
    try { localStorage.setItem(SFX_KEY, on ? 'on' : 'off'); } catch (e) {}
  };

  /* ---------- Date in masthead ---------- */
  const dateEl = document.getElementById('todayDate');
  const volumeEl = document.getElementById('volumeNo');
  if (dateEl) {
    const now = new Date();
    const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateEl.textContent = now.toLocaleDateString('en-US', opts);
  }
  if (volumeEl) {
    const year = new Date().getFullYear();
    const vol = year - 1991; // est. birth year of the brand ;)
    const issue = Math.floor((Date.now() / 86400000) % 9999);
    volumeEl.textContent = `VOL. ${vol} · NO. ${issue}`;
  }

  /* ---------- Typewriter intro (every page load) ---------- */
  (function typewriterIntro() {
    const h1 = document.querySelector('.masthead h1');
    if (!h1) return;
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const text = h1.textContent.trim();
    h1.textContent = '';
    h1.setAttribute('aria-label', text);
    h1.classList.add('typing');

    // Build per-letter spans
    const chars = [...text];
    chars.forEach((ch) => {
      const s = document.createElement('span');
      s.className = 'tw-ch';
      s.textContent = ch === ' ' ? '\u00A0' : ch;
      h1.appendChild(s);
    });
    const cursor = document.createElement('span');
    cursor.className = 'tw-cursor';
    cursor.textContent = '▍';
    h1.appendChild(cursor);

    // SFX via WebAudio (no asset needed)
    let ctx = null;
    const ensureCtx = () => {
      if (!ctx) {
        try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; }
      }
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      return ctx;
    };
    const tick = (isBell = false) => {
      if (!isSfxOn()) return;
      const ac = ensureCtx();
      if (!ac) return;
      try {
        const now = ac.currentTime;
        const o = ac.createOscillator();
        const g = ac.createGain();
        o.type = isBell ? 'triangle' : 'square';
        o.frequency.setValueAtTime(isBell ? 1760 : 1000 + Math.random() * 500, now);
        const peak = isBell ? 0.08 : 0.04;
        const dur = isBell ? 0.45 : 0.06;
        g.gain.setValueAtTime(0.0001, now);
        g.gain.exponentialRampToValueAtTime(peak, now + 0.005);
        g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
        o.connect(g).connect(ac.destination);
        o.start(now);
        o.stop(now + dur + 0.02);
      } catch (e) {}
    };
    // Unlock audio on first interaction if the context was still suspended
    const unlock = () => { ensureCtx(); document.removeEventListener('pointerdown', unlock); document.removeEventListener('keydown', unlock); };
    document.addEventListener('pointerdown', unlock, { once: true });
    document.addEventListener('keydown', unlock, { once: true });

    // Reveal letter-by-letter
    const spans = h1.querySelectorAll('.tw-ch');
    let i = 0;
    const step = () => {
      if (i >= spans.length) {
        tick(true); // ding
        setTimeout(() => {
          h1.classList.remove('typing');
          cursor.remove();
          spans.forEach(s => s.classList.remove('tw-hidden'));
        }, 420);
        return;
      }
      spans[i].classList.remove('tw-hidden');
      if (spans[i].textContent.trim()) tick(false);
      i++;
      // Variable cadence for realism
      const delay = 55 + Math.random() * 55 + (spans[i - 1].textContent === ' ' ? 40 : 0);
      setTimeout(step, delay);
    };
    spans.forEach(s => s.classList.add('tw-hidden'));
    // Small initial pause so the paper settles
    setTimeout(step, 350);
  })();

  /* ---------- Evening / Morning Edition toggle ---------- */
  const editionBtn = document.getElementById('editionToggle');
  const saved = localStorage.getItem('gazette.edition');
  if (saved) {
    document.documentElement.setAttribute('data-edition', saved);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // Respect the reader's OS preference on first visit
    document.documentElement.setAttribute('data-edition', 'evening');
  }
  // Follow subsequent OS-level changes if the user hasn't explicitly toggled
  if (window.matchMedia) {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (e) => {
      if (localStorage.getItem('gazette.edition')) return; // user made an explicit choice
      document.documentElement.setAttribute('data-edition', e.matches ? 'evening' : 'morning');
      updateBtn();
    };
    if (mql.addEventListener) mql.addEventListener('change', listener);
    else if (mql.addListener) mql.addListener(listener);
  }
  const updateBtn = () => {
    if (!editionBtn) return;
    const mode = document.documentElement.getAttribute('data-edition') || 'morning';
    editionBtn.textContent = mode === 'evening' ? '☀ Morning Ed.' : '☾ Evening Ed.';
  };
  updateBtn();
  editionBtn && editionBtn.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-edition');
    const next = cur === 'evening' ? 'morning' : 'evening';
    document.documentElement.setAttribute('data-edition', next);
    localStorage.setItem('gazette.edition', next);
    updateBtn();
  });

  /* ---------- Ticker injection ---------- */
  const ticker = document.querySelector('.ticker__track');
  if (ticker) {
    const items = [
      'BREAKING: Full-Stack Developer ships production code on Friday',
      'Markets: C# up 2.4%, jQuery down 18%, Rust steady',
      'Weather in Bicol: Partly cloudy with chance of commits',
      'Local dev still uses tabs — refuses to comment',
      'Coffee reserves at critical low, stand-up postponed',
      'New feature deployed — users demand it be deployed again',
      'StackOverflow answer accepted 9 years later'
    ];
    const html = items.map(t => `<span>${t}</span>`).join('');
    ticker.innerHTML = html + html; // duplicate for seamless scroll
  }

  /* ---------- Reveal on scroll ---------- */
  const io = ('IntersectionObserver' in window) && new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }});
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => io ? io.observe(el) : el.classList.add('in'));

  /* ---------- Live Tech Stock Index (randomized, seeded per session) ---------- */
  const stocks = [
    { sym: 'CSHP', name: 'C# Holdings', base: 248.50 },
    { sym: 'NET',  name: '.NET Corp',   base: 312.00 },
    { sym: 'JSX',  name: 'JavaScript',  base: 184.20 },
    { sym: 'SQL',  name: 'SQL Futures', base:  97.45 },
    { sym: 'VUE',  name: 'Vue Indust.', base: 132.10 },
    { sym: 'NEST', name: 'NestJS Ltd',  base:  76.90 },
    { sym: 'RDS',  name: 'Redis Co.',   base: 154.30 },
    { sym: 'K8S',  name: 'Kubernetes',  base: 421.75 }
  ];
  const stocksEl = document.getElementById('stocks');
  const renderStocks = () => {
    if (!stocksEl) return;
    stocksEl.innerHTML = stocks.map(s => {
      const chg = (Math.random() * 6 - 3);
      const val = (s.base * (1 + chg / 100)).toFixed(2);
      const cls = chg >= 0 ? 'up' : 'dn';
      const arr = chg >= 0 ? '▲' : '▼';
      return `<div class="stocks__row" title="${s.name}">
        <span class="stocks__sym">${s.sym}</span>
        <span class="stocks__val">${val}</span>
        <span class="stocks__chg stocks__chg--${cls}">${arr} ${Math.abs(chg).toFixed(2)}%</span>
      </div>`;
    }).join('');
  };
  renderStocks();
  setInterval(renderStocks, 4000);

  /* ---------- Code Forecast (weather-esque) ---------- */
  const forecasts = [
    { icon: '☀', label: 'CLEAR BUILDS',      desc: 'No errors expected' },
    { icon: '⛅', label: 'PARTLY DEPRECATED', desc: 'Light warnings midday' },
    { icon: '☁', label: 'CLOUDY MERGES',    desc: 'Conflicts possible' },
    { icon: '☂', label: 'STACK TRACES',      desc: 'Heavy logging advised' },
    { icon: '⚡', label: 'PROD OUTAGE',       desc: 'Seek shelter in staging' },
    { icon: '❄', label: 'FROZEN REPO',       desc: 'Cold start imminent' }
  ];
  const fc = forecasts[Math.floor(Math.random() * forecasts.length)];
  const fcIcon = document.getElementById('fcIcon');
  const fcLabel = document.getElementById('fcLabel');
  const fcDesc = document.getElementById('fcDesc');
  if (fcIcon) fcIcon.textContent = fc.icon;
  if (fcLabel) fcLabel.textContent = fc.label;
  if (fcDesc) fcDesc.textContent = fc.desc;

  /* ---------- Crossword (real mini, 3 clues) ---------- */
  /* 5x5 grid. Solution:
     Row 0: . C O D E  (1-Across: CODE)
     Row 1: . A . I .
     Row 2: . B U G S  (2-Down: CAT, 3-Across: BUGS — via grid layout below)
     Row 3: . L . T .
     Row 4: . E . . .  (2-Down full: CABLE)
     Clues: 1A=CODE (what we write), 2D=CABLE (network wire), 3A=BUGS (not a feature) */
  (function crossword() {
    const cwEl = document.getElementById('crossword');
    if (!cwEl) return;

    // '#' = black square; otherwise the solution letter
    const SOL = [
      ['#','C','O','D','E'],
      ['#','A','#','I','#'],
      ['#','B','U','G','S'],
      ['#','L','#','I','#'],
      ['#','E','#','T','#']
    ];
    // Cell numbers for clues (row,col -> number)
    // 1 = 1-Across (CODE) & 1-Down (CABLE), 2 = 2-Down (DIGIT), 3 = 3-Across (BUGS)
    const NUMS = { '0,1':1, '0,3':2, '2,1':3 };

    // Map row,col to answer letter
    cwEl.innerHTML = '';
    const inputs = [];
    for (let r = 0; r < SOL.length; r++) {
      for (let c = 0; c < SOL[r].length; c++) {
        const ch = SOL[r][c];
        const cell = document.createElement('div');
        cell.className = 'cw-cell' + (ch === '#' ? ' cw-cell--block' : '');
        if (ch !== '#') {
          const key = r + ',' + c;
          if (NUMS[key]) {
            const n = document.createElement('span');
            n.className = 'cw-cell__num';
            n.textContent = NUMS[key];
            cell.appendChild(n);
          }
          const inp = document.createElement('input');
          inp.type = 'text';
          inp.maxLength = 1;
          inp.setAttribute('aria-label', `Row ${r + 1} Column ${c + 1}`);
          inp.dataset.answer = ch;
          inp.dataset.row = r;
          inp.dataset.col = c;
          inp.addEventListener('input', () => {
            inp.value = (inp.value || '').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 1);
            check();
            // auto-advance to next input
            if (inp.value) {
              const idx = inputs.indexOf(inp);
              if (idx >= 0 && idx < inputs.length - 1) inputs[idx + 1].focus();
            }
          });
          inp.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !inp.value) {
              const idx = inputs.indexOf(inp);
              if (idx > 0) inputs[idx - 1].focus();
            }
          });
          cell.appendChild(inp);
          inputs.push(inp);
        }
        cwEl.appendChild(cell);
      }
    }

    const status = document.getElementById('cwStatus');
    const check = () => {
      let correct = 0, filled = 0;
      inputs.forEach(i => {
        if (i.value) filled++;
        if (i.value === i.dataset.answer) {
          correct++;
          i.parentElement.classList.add('cw-cell--solved');
        } else {
          i.parentElement.classList.remove('cw-cell--solved');
        }
      });
      if (correct === inputs.length) {
        if (status) status.textContent = '✓ Solved! Extra! Extra!';
      } else if (filled === inputs.length) {
        if (status) status.textContent = `${correct}/${inputs.length} correct`;
      } else {
        if (status) status.textContent = '';
      }
    };
  })();

  /* ---------- Article modal ---------- */
  const articles = {
    about: {
      kicker: 'Cover Story',
      title: 'Bicolano Developer Writes Code by Candlelight, Still Compiles',
      byline: 'By The Editor · Camarines Norte Bureau',
      body: [
        'DENNIS PITALLANO, a full-stack software developer of unremarkable sleeping habits, was observed once more this week assembling web applications from little more than a keyboard, caffeinated conviction, and a long-suffering git repository.',
        'Colleagues describe him as "fluent in .NET, JavaScript, and the ancient art of rescuing production on Friday afternoons." Based in the Philippines, he has spent the better part of a decade converting business requirements into running software — sometimes in that order.',
        'When asked about his methodology, Mr. Pitallano reportedly shrugged and said: "It works on my machine." This paper has independently verified that, in fact, it does.',
        'He is currently available for interesting problems, honest conversations, and exactly one more cup of coffee.'
      ]
    },
    stack: {
      kicker: 'Technology',
      title: 'The Tools of the Trade — An Unauthorized Inventory',
      byline: 'Filed from the server room',
      body: [
        'Daily drivers: C#, .NET, TypeScript, JavaScript, HTML, CSS, SQL. Familiar terrain: Vue, React, Next.js, NestJS, FastAPI, Xamarin, Bootstrap, Tailwind-adjacent stylesheets.',
        'Data: Microsoft SQL Server, PostgreSQL, MySQL, MongoDB, Redis, SQLite — whichever one the architect picked before lunch.',
        'Ops-adjacent: Docker, Kubernetes, Nginx, Jenkins, GitHub Actions. Project instruments: Jira, Trello, and a notebook with suspicious coffee stains.',
        'Currently learning: whatever the community argued about on Hacker News this morning.'
      ]
    },
    projects: {
      kicker: 'Field Reports',
      title: 'Selected Works & Recent Dispatches',
      byline: 'From the portfolio desk',
      body: [
        '<strong>— CONTRIBUTIONS —</strong>',
        '<a href="https://www.agiletechops.com/" target="_blank" rel="noopener">AgileTechOps</a> — Contributor. Consulting and engineering work for a DevOps-focused practice.',
        '<a href="https://www.digibyte.org/" target="_blank" rel="noopener">DigiByte (digibyte.org)</a> — Contributor to the official site of the DigiByte blockchain, one of the longer-running proof-of-work networks.',
        '<a href="https://www.digi-id.io/" target="_blank" rel="noopener">Digi-ID</a> — Contributor to the open, password-free authentication protocol built on the DigiByte blockchain.',
        '<strong>— PERSONAL WORKS —</strong>',
        '<a href="https://pay.dgbwallet.app/" target="_blank" rel="noopener">pay.dgbwallet.app</a> — A payment gateway built on DigiByte; send and receive DGB with merchant-friendly flows.',
        '<a href="https://dgbwallet.app/" target="_blank" rel="noopener">dgbwallet.app</a> — A clean, self-custody DigiByte wallet for the modern browser.',
        '<a href="https://clockinplus.com/" target="_blank" rel="noopener">ClockIn+</a> — A time-tracking and attendance platform for small teams.',
        '<strong>— ONGOING PROJECTS —</strong>',
        '<a href="https://diskarte-production-10d2.up.railway.app/" target="_blank" rel="noopener">Diskarte</a> — In development. A Filipino-flavored productivity experiment.',
        '<a href="https://the-daily-classifieds-production.up.railway.app/" target="_blank" rel="noopener">The Daily Classifieds</a> — In development. A classifieds board in the same newsprint spirit as this very Gazette.',
        '<em>…and more to come.</em>',
        '<strong>— OPEN SOURCE —</strong>',
        'BSCSCAN .NET — A .NET client for interacting with the BscScan API. CASH .NET — Monetary utilities that decline to summon floating-point demons. Oragon Tutorials — Written walkthroughs. Full archive via the <a href="https://github.com/DennisPitallano" target="_blank" rel="noopener">GitHub bureau</a>.'
      ]
    },
    contact: {
      kicker: 'Public Notice',
      title: 'Correspondence Welcomed — No Telegrams, Please',
      byline: 'The Dispatch Desk',
      body: [
        'The author may be reached by electronic mail at dpitallano@gmail.com for professional inquiries, freelance missions, and polite arguments about semicolons.',
        'Also reachable on the usual wires: GitHub (DennisPitallano), LinkedIn, StackOverflow, Discord, Facebook, and Reddit. Response times vary with the tides and with deployment cycles.',
        'For urgent matters, please attach a minimal reproducible example.'
      ],
      extra: `
        <form class="sub-card" id="contactForm" novalidate>
          <div class="sub-card__stamp-mark">POSTE · PAID</div>
          <div class="sub-card__kicker">— Subscription Card —</div>
          <h3 class="sub-card__title">File a Dispatch</h3>
          <p class="sub-card__lede">Complete the form below and hand it to the nearest courier.</p>
          <hr/>
          <div class="sub-card__row">
            <div class="sub-card__field">
              <label class="sub-card__label" for="cfName">Name of Correspondent</label>
              <input class="sub-card__input" id="cfName" name="name" type="text" required autocomplete="name" />
            </div>
            <div class="sub-card__field">
              <label class="sub-card__label" for="cfEmail">Return Address</label>
              <input class="sub-card__input" id="cfEmail" name="email" type="email" required autocomplete="email" />
            </div>
            <div class="sub-card__field sub-card__field--full">
              <label class="sub-card__label" for="cfSubject">Re:</label>
              <input class="sub-card__input" id="cfSubject" name="subject" type="text" placeholder="e.g. Freelance mission, polite argument, etc." required />
            </div>
            <div class="sub-card__field sub-card__field--full">
              <label class="sub-card__label" for="cfBody">Message to the Editor</label>
              <textarea class="sub-card__textarea" id="cfBody" name="message" rows="5" required></textarea>
            </div>
          </div>
          <div class="sub-card__actions">
            <span class="sub-card__stamp">Rec'd · <span id="cfStamp"></span></span>
            <button class="sub-card__submit" type="submit">Send by Post ✉</button>
          </div>
          <p class="sub-card__note">Submitting will open your mail client with this dispatch ready for delivery.</p>
        </form>
      `
    },
    blog: {
      kicker: 'Editorial',
      title: 'On Writing Software That Other Humans Must Read',
      byline: 'Op-Ed · By D. Pitallano',
      body: [
        'Code is read far more often than it is written. This truism, worn smooth by repetition, remains stubbornly unpracticed. A function named doStuff() is not a function; it is a threat.',
        'Clear names, small functions, honest comments — the craft is unglamorous but durable. The reward is a codebase one can return to after six months without reflexively apologizing to it.',
        'For longer essays, visit the /blog section of this publication.'
      ]
    },
    archives: {
      kicker: 'The Archives',
      title: 'Back Issues & Morgue Files',
      byline: 'Reference Desk · Basement of the Gazette',
      body: [
        'Welcome to the morgue — where old issues of The Oragon Gazette go to be filed, dusted, and occasionally re-read with embarrassment.',
        '<strong>— RECENT DISPATCHES —</strong>',
        '<a href="/blog/welcome">Welcome to the Gazette</a> — An introductory note from the editor.',
        '<a href="/blog/first-blog-post">First Post</a> — Every publication must begin somewhere.',
        '<a href="/blog/long-blog-post">A Longer Essay</a> — For readers with coffee to spare.',
        '<a href="/blog/mdx-blog-post">Of Markdown &amp; Components</a> — On writing rich text in plain files.',
        '<strong>— FEEDS —</strong>',
        '<a href="/blog/rss.xml">RSS</a> · <a href="/blog/atom.xml">Atom</a> · <a href="/blog/tags">Browse by Tag</a> · <a href="/blog/archive">Full Archive Index</a>',
        '<em>New editions filed irregularly, as inspiration and deployment schedules permit.</em>'
      ]
    },
    manuals: {
      kicker: 'The Manuals',
      title: 'Technical Manuals & Reference Works',
      byline: 'From the Technology Section',
      body: [
        'A working collection of technical guides and open-source documentation maintained by the author. Handle with care — some pages are still drying.',
        '<strong>— OPEN-SOURCE LIBRARIES —</strong>',
        '<a href="/docs/intro">BscScan .NET Core &amp; Cash .NET Core</a> — The main manual covering both libraries. Installation, getting started, and endpoint references all begin here.',
        '<strong>— DEEP REFERENCE —</strong>',
        '<a href="/docs/bscsan-netcore/get-start">BscScan .NET Core — Getting Started</a>',
        '<a href="/docs/cash-netcore/cashgetstarted">Cash .NET Core — Getting Started</a>',
        '<em>New manuals typeset as the press allows. Submissions and corrections may be addressed to the Editor.</em>'
      ]
    }
  };

  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modalBody');
  const openModal = (key) => {
    const a = articles[key]; if (!a || !modal) return;
    modalBody.innerHTML = `
      <div class="modal__kicker">${a.kicker}</div>
      <h2>${a.title}</h2>
      <div class="byline">${a.byline}</div>
      ${a.body.map(p => `<p class="body">${p}</p>`).join('')}
      ${a.extra || ''}
    `;
    // Force all links inside the modal to open in a new tab
    modalBody.querySelectorAll('a[href]').forEach(link => {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    });

    // Wire up contact form (only present in the contact modal)
    const cf = modalBody.querySelector('#contactForm');
    if (cf) {
      const stamp = modalBody.querySelector('#cfStamp');
      if (stamp) {
        const d = new Date();
        stamp.textContent = d.toLocaleDateString('en-US', { month:'short', day:'2-digit', year:'numeric' }).toUpperCase();
      }
      cf.addEventListener('submit', (ev) => {
        ev.preventDefault();
        const name = cf.querySelector('#cfName').value.trim();
        const email = cf.querySelector('#cfEmail').value.trim();
        const subject = cf.querySelector('#cfSubject').value.trim();
        const message = cf.querySelector('#cfBody').value.trim();
        if (!name || !email || !subject || !message) {
          cf.querySelector('.sub-card__note').textContent = '⚠ Please complete every field before posting.';
          return;
        }
        const bodyText =
          `Dear Editor,\n\n${message}\n\n— ${name}\n(${email})\n\n` +
          `--\nFiled via The Oragon Gazette subscription card.`;
        const mailto = 'mailto:dpitallano@gmail.com'
          + '?subject=' + encodeURIComponent('[Gazette] ' + subject)
          + '&body=' + encodeURIComponent(bodyText);
        window.location.href = mailto;
        cf.querySelector('.sub-card__note').innerHTML = '✓ Your mail client should now be open. <em>If nothing happened, write to <a href="mailto:dpitallano@gmail.com">dpitallano@gmail.com</a> directly.</em>';
      });
    }
    // Preserve scroll position while locking body
    const scrollY = window.scrollY;
    document.body.dataset.scrollY = String(scrollY);
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    modal.classList.add('open');
  };
  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('open');
    const y = parseInt(document.body.dataset.scrollY || '0', 10);
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    window.scrollTo(0, y);
  };
  document.querySelectorAll('[data-article]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(el.dataset.article);
    });
  });
  document.getElementById('modalClose') && document.getElementById('modalClose').addEventListener('click', closeModal);
  modal && modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  /* ---------- Ink smudge follower ---------- */
  const smudge = document.createElement('div');
  smudge.className = 'smudge';
  document.body.appendChild(smudge);
  let tx = -20, ty = -20;
  document.addEventListener('pointermove', (e) => { tx = e.clientX - 7; ty = e.clientY - 7; });
  const loop = () => {
    smudge.style.transform = `translate(${tx}px, ${ty}px)`;
    requestAnimationFrame(loop);
  };
  loop();

  /* ---------- Konami easter egg: reveal classified ad ---------- */
  const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let idx = 0;
  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === konami[idx].toLowerCase()) {
      idx++;
      if (idx === konami.length) {
        idx = 0;
        const secret = document.getElementById('secretAd');
        if (secret) { secret.classList.remove('u-hide'); secret.scrollIntoView({behavior:'smooth'}); }
        // Also trigger the newsflash overlay for extra drama
        try { window.__gazetteNewsflash && window.__gazetteNewsflash(); } catch(e) {}
      }
    } else {
      idx = 0;
    }
  });

  /* ---------- Classifieds: Ad of the Day ---------- */
  (function adOfDay() {
    const box = document.getElementById('classifieds');
    const tag = document.getElementById('adOfDay');
    if (!box || !tag) return;
    const ads = Array.from(box.querySelectorAll('.ad')).filter(a => a.id !== 'secretAd');
    if (!ads.length) return;
    // Seed by day-of-year so it's stable within a day and rotates nightly
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const doy = Math.floor((now - start) / 86400000);
    const pick = ads[doy % ads.length];
    pick.classList.add('ad--featured');
    // Move the featured ad to the top of the box
    box.insertBefore(pick, box.firstChild);
    const title = (pick.querySelector('strong') || {}).textContent || 'Today';
    tag.textContent = title.replace(/\s*—\s*$/, '');
  })();

  /* ---------- On This Day in Computing History ---------- */
  (function onThisDay() {
    const otdH = document.getElementById('otdHeadline');
    const otdB = document.getElementById('otdBody');
    const otdBy = document.getElementById('otdByline');
    if (!otdH || !otdB || !otdBy) return;

    const today = new Date();
    const m = today.getMonth() + 1, d = today.getDate();
    const monthName = today.toLocaleString('en-US', { month: 'long' });

    // Curated tech-history fallback (used when Wikipedia is unreachable)
    const fallback = [
      [1,4,1975,'Microsoft is founded','Bill Gates and Paul Allen register the company in Albuquerque.'],
      [2,24,1955,'Steve Jobs is born','Future turtleneck enthusiast and founder of Apple.'],
      [3,12,1989,'Tim Berners-Lee proposes the World Wide Web','A humble memo at CERN. "Vague but exciting," wrote his manager.'],
      [4,1,1976,'Apple Computer Company is founded','In a garage. Funded by a Volkswagen microbus.'],
      [4,4,1975,'Microsoft officially formed','"Micro-Soft" — the hyphen dropped later, like so many features.'],
      [4,22,1993,'NCSA Mosaic 1.0 is released','The graphical web browser that put the Internet on everyone\'s desk.'],
      [5,9,1983,'First mobile call in the Philippines','A prelude to your pocket computer.'],
      [6,23,1912,'Alan Turing is born','The father of computer science. We owe him everything, including Candy Crush.'],
      [7,20,1969,'Humans walk on the Moon','Guided by computers with less RAM than a modern light switch.'],
      [8,12,1981,'IBM releases the PC (Model 5150)','MS-DOS ships with it. Thus began a forty-year argument.'],
      [9,9,1945,'First actual computer bug is logged','A moth, found in the Harvard Mark II relay. Grace Hopper taped it to the log.'],
      [10,5,1991,'Linus Torvalds releases Linux 0.02','"Just a hobby, nothing big." Reader, it became big.'],
      [11,7,1996,'Internet Explorer 3.0 ships','The great browser wars begin. Casualties: many afternoons.'],
      [12,9,1968,'"The Mother of All Demos"','Doug Engelbart demonstrates the mouse, hypertext, and video conferencing — in 1968.']
    ];

    const renderFallback = () => {
      const entry = fallback.find(h => h[0] === m && h[1] === d)
        || fallback[Math.abs((m * 31 + d)) % fallback.length];
      otdH.textContent = `${entry[2]}: ${entry[3]}`;
      otdBy.textContent = `Historical Desk · ${monthName} ${entry[1]}, ${entry[2]}`;
      otdB.innerHTML = `${entry[4]} <div class="otd__source">Source · The Morgue Files</div>`;
    };

    // Try Wikipedia's On This Day feed (CORS-enabled, no key required)
    const mm = String(m).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    const url = `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/events/${mm}/${dd}`;

    if (!/^https?:/i.test(location.protocol)) { renderFallback(); return; }

    otdH.textContent = `On This Day — ${monthName} ${d}`;
    otdBy.textContent = 'Filed from the Historical Desk';
    otdB.textContent = 'Consulting the morning papers…';

    fetch(url, { headers: { 'Accept': 'application/json' } })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(data => {
        const events = (data && data.events) || [];
        if (!events.length) { renderFallback(); return; }
        // Prefer tech-flavored events; else most recent
        const techRegex = /comput|software|internet|web|microsoft|apple|google|ibm|unix|linux|program|digital|silicon|nasa|satellite|radio|telegraph|telephone|network|algorithm|mathematic|cipher|crypt|code|bit|byte|processor|transistor/i;
        const sorted = events.slice().sort((a, b) => (b.year || 0) - (a.year || 0));
        const pick = sorted.find(e => techRegex.test(e.text || '')) || sorted[0];

        const year = pick.year;
        const text = (pick.text || '').replace(/\s+/g, ' ').trim();
        const firstPage = (pick.pages && pick.pages[0]) || null;
        const headline = firstPage ? (firstPage.titles && firstPage.titles.normalized) || firstPage.title : text.split('.')[0];

        otdH.textContent = year ? `${year}: ${headline}` : headline;
        otdBy.textContent = `Historical Desk · ${monthName} ${d}${year ? `, ${year}` : ''}`;
        const pageUrl = firstPage && firstPage.content_urls && firstPage.content_urls.desktop && firstPage.content_urls.desktop.page;
        otdB.innerHTML =
          `${text}` +
          `<div class="otd__source">Source · <a href="${pageUrl || 'https://en.wikipedia.org/wiki/Portal:Current_events'}" target="_blank" rel="noopener">Wikipedia · On This Day</a></div>`;
      })
      .catch(() => renderFallback());
  })();

  /* ---------- Developer Horoscopes ---------- */
  const horos = {
    c:      'Mercury enters the stack. A pointer you trusted will betray you by Thursday. Free what you allocate.',
    java:   'Jupiter demands another AbstractSingletonProxyFactoryBean. Resist. A short walk resolves most design patterns.',
    python: 'The indentation of the universe aligns. Today is ideal for writing a script that you will absolutely rewrite in Rust next month.',
    js:     'Your == is lying to you. Use ===. Also, please go outside — the sun has a nice warm gradient today.',
    csharp: 'A LINQ query you wrote will be read aloud in a meeting, and it will be beautiful. Accept the compliment.',
    ts:     'A stranger will say "any". Correct them, kindly. Your types shall be honored.',
    rust:   'The borrow checker is not your enemy. The borrow checker is your therapist with very strong opinions.',
    go:     'Simplicity favors you today. Resist the urge to add generics. Add a gopher sticker instead.',
    php:    'Do not believe what they say about you. You powered half the internet. Go rest; you have earned it.',
    ruby:   'A poetic refactor awaits. Beware metaprogramming after midnight.',
    cpp:    'Great power. Great segfaults. Read the compiler output aloud — it rhymes if you try.',
    sql:    'A JOIN you dreamed of last night is the correct JOIN. Write it down before you forget.'
  };
  const sel = document.getElementById('signSelect');
  const reading = document.getElementById('horoReading');
  const update = () => { if (reading && sel) reading.textContent = horos[sel.value]; };
  if (sel) { sel.addEventListener('change', update); update(); }

  /* ---------- Comic strip cycling ---------- */
  const strips = [
    [
      ['It works on my machine.', '◔_◔', 'PANEL 1 — THE CLAIM', false],
      ['Then we shall ship your machine.', '⊙▂⊙', 'PANEL 2 — THE ULTIMATUM', true],
      ['…I’ll write a Dockerfile.', '◉︵◉', 'PANEL 3 — THE COMPROMISE', false]
    ],
    [
      ['The tests are flaky.', '⊙_⊙', 'PANEL 1 — DENIAL', false],
      ['They run once, then refuse.', '╥﹏╥', 'PANEL 2 — BARGAINING', true],
      ['I renamed them "integration".', '¬_¬', 'PANEL 3 — ACCEPTANCE', false]
    ],
    [
      ['I’ll just push to main.', '◉‿◉', 'PANEL 1 — CONFIDENCE', false],
      ['The build went red.', '⊙△⊙', 'PANEL 2 — CONSEQUENCE', true],
      ['The blame is now distributed.', '◔ ‿◔', 'PANEL 3 — GIT', false]
    ],
    [
      ['This will only take five minutes.', '◕‿◕', 'PANEL 1 — PROLOGUE', false],
      ['Three hours later…', '◉_◉', 'PANEL 2 — INTERLUDE', true],
      ['I have rewritten the framework.', '⊙﹏⊙', 'PANEL 3 — EPILOGUE', false]
    ],
    [
      ['Why does this work?', '⊙_⊙', 'PANEL 1 — CURIOSITY', false],
      ['I refactored it — now it doesn’t.', '╥_╥', 'PANEL 2 — CLARITY', true],
      ['I put it back. Do not ask.', '◉_◉', 'PANEL 3 — WISDOM', false]
    ]
  ];
  let stripIdx = 0;
  const comicEl = document.getElementById('comicStrip');
  const renderStrip = () => {
    if (!comicEl) return;
    const s = strips[stripIdx % strips.length];
    comicEl.innerHTML = s.map(p => `
      <div class="comic__panel">
        <div class="comic__bubble${p[3] ? ' comic__bubble--r' : ''}">${p[0]}</div>
        <div class="comic__figure">${p[1]}</div>
        <div class="comic__label">${p[2]}</div>
      </div>`).join('');
  };
  renderStrip();
  document.getElementById('comicNext') && document.getElementById('comicNext').addEventListener('click', () => { stripIdx++; renderStrip(); });

  /* ---------- Letters to the Editor (GitHub Issues API) ---------- */
  (function letters() {
    const list = document.getElementById('lettersList');
    if (!list) return;
    const REPO = 'DennisPitallano/dennispitallano.github.io';
    const fallback = [
      { title: 'On Semicolons', body: 'Sir — I maintain that the semicolon is a punctuation mark of distinction, not decoration. Yours in ASCII, R. Braces.' },
      { title: 'In Defense of Vim', body: 'Madam — I wish to register my dissent with your recent editorial. My fingers know not otherwise. — A. Vimmer' },
      { title: 'Re: The Deployment', body: 'To the Editor — The deployment went fine. It is the aftermath I wish to discuss. — DevOps Correspondent' }
    ];
    const truncate = (s, n) => (s || '').replace(/\s+/g, ' ').trim().slice(0, n) + ((s || '').length > n ? '…' : '');
    const render = (items) => {
      list.innerHTML = items.map(it => `
        <li class="letters__item">
          <div class="letters__title">${it.title}</div>
          <div class="letters__body">${truncate(it.body, 160)}</div>
          ${it.user ? `<div class="letters__sig">— ${it.user}${it.url ? ` · <a href="${it.url}" target="_blank" rel="noopener">read on</a>` : ''}</div>` : ''}
        </li>
      `).join('');
    };
    const showFallback = () => render(fallback);

    // Only try API on http(s); file:// will fail CORS
    if (!/^https?:/i.test(location.protocol)) { showFallback(); return; }

    fetch(`https://api.github.com/repos/${REPO}/issues?labels=letter&state=all&per_page=5`, {
      headers: { 'Accept': 'application/vnd.github+json' }
    })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(issues => {
        if (!Array.isArray(issues) || issues.length === 0) { showFallback(); return; }
        const items = issues.slice(0, 5).map(i => ({
          title: i.title.replace(/^To the Editor:\s*/i, ''),
          body: i.body || '',
          user: i.user && i.user.login,
          url: i.html_url
        }));
        render(items);
      })
      .catch(() => showFallback());
  })();

  /* ---------- Snake (The Puzzle Page) ---------- */
  (function snake() {
    const canvas = document.getElementById('snake');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const SIZE = 20, COLS = canvas.width / SIZE;
    let s, dir, food, timer, score, alive = false;
    const bestEl = document.getElementById('snakeBest');
    const scoreEl = document.getElementById('snakeScore');
    let best = parseInt(localStorage.getItem('gazette.snake.best') || '0', 10);
    if (bestEl) bestEl.textContent = best;

    // Cache computed CSS colors; refresh only when edition toggles (avoids per-frame forced reflow)
    let colorCache = {};
    const refreshColors = () => {
      const css = getComputedStyle(document.documentElement);
      colorCache = {
        '--paper': css.getPropertyValue('--paper').trim(),
        '--paper-dark': css.getPropertyValue('--paper-dark').trim(),
        '--ink': css.getPropertyValue('--ink').trim(),
        '--accent': css.getPropertyValue('--accent').trim()
      };
    };
    refreshColors();
    // Re-read when user toggles morning/evening
    new MutationObserver(refreshColors).observe(document.documentElement, { attributes: true, attributeFilter: ['data-edition'] });
    const col = (n) => colorCache[n] || '';
    function reset() {
      s = [{x:5,y:5},{x:4,y:5},{x:3,y:5}];
      dir = {x:1,y:0};
      placeFood();
      score = 0; scoreEl.textContent = 0;
      alive = true;
    }
    function placeFood() {
      while (true) {
        food = { x: Math.floor(Math.random()*COLS), y: Math.floor(Math.random()*COLS) };
        if (!s.some(p => p.x===food.x && p.y===food.y)) break;
      }
    }
    function tick() {
      if (!alive) return;
      const head = { x: s[0].x + dir.x, y: s[0].y + dir.y };
      if (head.x < 0 || head.y < 0 || head.x >= COLS || head.y >= COLS ||
          s.some(p => p.x===head.x && p.y===head.y)) {
        alive = false; draw(true); return;
      }
      s.unshift(head);
      if (head.x === food.x && head.y === food.y) {
        score += 10; scoreEl.textContent = score;
        if (score > best) { best = score; bestEl.textContent = best; localStorage.setItem('gazette.snake.best', String(best)); }
        placeFood();
      } else s.pop();
      draw();
    }
    function draw(gameOver) {
      ctx.fillStyle = col('--paper-dark'); ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle = col('--accent');
      ctx.fillRect(food.x*SIZE+2, food.y*SIZE+2, SIZE-4, SIZE-4);
      ctx.fillStyle = col('--ink');
      s.forEach((p,i) => ctx.fillRect(p.x*SIZE+1, p.y*SIZE+1, SIZE-2, SIZE-2));
      if (gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = col('--paper');
        ctx.font = 'bold 22px Playfair Display, serif';
        ctx.textAlign = 'center';
        ctx.fillText('— GAME OVER —', canvas.width/2, canvas.height/2);
        ctx.font = '12px "Special Elite", monospace';
        ctx.fillText('Press Play to try again', canvas.width/2, canvas.height/2 + 22);
      }
    }
    function setDir(nx, ny) {
      if (!alive) return;
      if (nx === -dir.x && ny === -dir.y) return; // no reverse
      dir = { x: nx, y: ny };
    }
    document.addEventListener('keydown', (e) => {
      if (!alive) return;
      const map = { ArrowUp:[0,-1], ArrowDown:[0,1], ArrowLeft:[-1,0], ArrowRight:[1,0], w:[0,-1], s:[0,1], a:[-1,0], d:[1,0] };
      if (map[e.key]) { setDir(...map[e.key]); e.preventDefault(); }
    });
    document.querySelectorAll('.snake-ctrl [data-dir]').forEach(b => {
      b.addEventListener('click', () => {
        const dd = { up:[0,-1], down:[0,1], left:[-1,0], right:[1,0] }[b.dataset.dir];
        setDir(...dd);
      });
    });
    document.getElementById('snakeStart').addEventListener('click', () => {
      reset();
      clearInterval(timer);
      timer = setInterval(tick, 140);
    });
    // Initial idle draw
    s = [{x:5,y:5},{x:4,y:5},{x:3,y:5}]; food = {x:10,y:10}; dir = {x:1,y:0}; draw();
  })();

  /* ---------- Newsprint Search ---------- */
  (function search() {
    const input = document.getElementById('searchInput');
    const results = document.getElementById('searchResults');
    if (!input || !results) return;

    const index = [];

    // 1) Modal articles
    Object.entries(articles).forEach(([key, a]) => {
      index.push({
        kicker: a.kicker,
        title: a.title,
        snippet: a.body.map(b => b.replace(/<[^>]+>/g, '')).join(' ').slice(0, 220),
        action: () => openModal(key)
      });
    });

    // 2) In-page articles
    document.querySelectorAll('article.article').forEach(art => {
      const k = art.querySelector('.kicker');
      const h = art.querySelector('.headline, h3, h4, h2');
      const p = art.querySelector('.body');
      if (!h) return;
      const id = art.id;
      index.push({
        kicker: k ? k.textContent.trim() : 'Article',
        title: h.textContent.trim(),
        snippet: (p ? p.textContent.trim() : '').slice(0, 220),
        action: () => {
          art.scrollIntoView({behavior:'smooth', block:'start'});
          art.classList.remove('search-hit'); void art.offsetWidth; art.classList.add('search-hit');
          if (id) window.history.replaceState(null, '', '#' + id);
        }
      });
    });

    // 3) Works list (project links)
    document.querySelectorAll('.works__list li').forEach(li => {
      const a = li.querySelector('a');
      if (!a || !a.href) return;
      const em = li.querySelector('em');
      const group = li.closest('.works__group');
      const label = group ? group.querySelector('.works__label') : null;
      index.push({
        kicker: label ? label.textContent.trim().replace(/\s*LIVE\s*$/,'').trim() : 'Works',
        title: a.textContent.trim(),
        snippet: em ? em.textContent.trim() : (a.href || ''),
        action: () => window.open(a.href, '_blank', 'noopener')
      });
    });

    // 4) Obituaries
    document.querySelectorAll('.obit li').forEach(li => {
      const strong = li.querySelector('strong');
      if (!strong) return;
      index.push({
        kicker: 'Obituaries',
        title: strong.textContent.trim(),
        snippet: li.textContent.replace(strong.textContent, '').trim().slice(0, 200),
        action: () => {
          const obit = document.getElementById('obituaries');
          if (obit) { obit.scrollIntoView({behavior:'smooth'}); obit.classList.remove('search-hit'); void obit.offsetWidth; obit.classList.add('search-hit'); }
        }
      });
    });

    // 5) Annals
    document.querySelectorAll('.annals__item').forEach(item => {
      const yr = item.querySelector('.annals__year');
      const strong = item.querySelector('strong');
      const text = item.querySelector('div');
      if (!yr || !strong) return;
      index.push({
        kicker: 'The Annals · ' + yr.textContent.trim(),
        title: strong.textContent.trim(),
        snippet: text ? text.textContent.replace(strong.textContent, '').trim().slice(0, 200) : '',
        action: () => {
          const annals = document.getElementById('annals');
          if (annals) { annals.scrollIntoView({behavior:'smooth'}); item.classList.remove('search-hit'); void item.offsetWidth; item.classList.add('search-hit'); }
        }
      });
    });

    const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const highlight = (text, q) => {
      if (!q) return text;
      return text.replace(new RegExp('(' + esc(q) + ')', 'ig'), '<mark>$1</mark>');
    };

    let activeIdx = -1;
    let lastMatches = [];

    const render = (matches, q) => {
      lastMatches = matches;
      activeIdx = -1;
      if (!q) { results.classList.remove('open'); results.innerHTML = ''; return; }
      if (!matches.length) {
        results.innerHTML = `<div class="searchbar__empty">No dispatches found for “${q}”</div>`;
        results.classList.add('open');
        return;
      }
      results.innerHTML = matches.slice(0, 10).map((m, i) => `
        <button class="sr" data-i="${i}" type="button">
          <span class="sr__kicker">${m.kicker}</span>
          <span class="sr__title">${highlight(m.title, q)}</span>
          <div class="sr__snip">${highlight(m.snippet, q)}…</div>
        </button>
      `).join('');
      results.classList.add('open');
    };

    const doSearch = (q) => {
      q = (q || '').trim();
      if (q.length < 2) { render([], ''); return; }
      const ql = q.toLowerCase();
      const scored = index
        .map(it => {
          const hay = (it.title + ' ' + it.snippet + ' ' + it.kicker).toLowerCase();
          let score = 0;
          if (it.title.toLowerCase().includes(ql)) score += 10;
          if (it.kicker.toLowerCase().includes(ql)) score += 4;
          if (hay.includes(ql)) score += 1;
          return { it, score };
        })
        .filter(x => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(x => x.it);
      render(scored, q);
    };

    input.addEventListener('input', () => doSearch(input.value));
    input.addEventListener('focus', () => { if (input.value.trim().length >= 2) doSearch(input.value); });

    results.addEventListener('click', (e) => {
      const btn = e.target.closest('.sr');
      if (!btn) return;
      const i = parseInt(btn.dataset.i, 10);
      const m = lastMatches[i];
      if (m) {
        results.classList.remove('open');
        input.value = '';
        setTimeout(m.action, 50);
      }
    });

    input.addEventListener('keydown', (e) => {
      const items = results.querySelectorAll('.sr');
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIdx = Math.min(items.length - 1, activeIdx + 1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIdx = Math.max(0, activeIdx - 1);
      } else if (e.key === 'Enter') {
        if (activeIdx >= 0 && lastMatches[activeIdx]) {
          e.preventDefault();
          results.classList.remove('open');
          input.value = '';
          setTimeout(lastMatches[activeIdx].action, 50);
        }
      } else if (e.key === 'Escape') {
        input.value = '';
        results.classList.remove('open');
        input.blur();
      }
      items.forEach((el, i) => el.classList.toggle('active', i === activeIdx));
      if (activeIdx >= 0 && items[activeIdx]) items[activeIdx].scrollIntoView({block:'nearest'});
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.searchbar')) results.classList.remove('open');
    });

    // Keyboard shortcut: "/" focuses the search
    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== input && !e.ctrlKey && !e.metaKey && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        input.focus();
      }
    });
  })();

  /* ---------- Mobile sticky bar + drawer ---------- */
  (function mobileNav() {
    const bar = document.getElementById('mobilebar');
    const drawer = document.getElementById('drawer');
    const menuBtn = document.getElementById('mbMenu');
    const searchBtn = document.getElementById('mbSearch');
    const drawerSearch = document.getElementById('drawerSearch');
    const drawerEdition = document.getElementById('drawerEdition');
    if (!bar || !drawer) return;

    // Open / close drawer
    const openDrawer = () => {
      drawer.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.classList.add('drawer-open');
      menuBtn && menuBtn.setAttribute('aria-expanded', 'true');
    };
    const closeDrawer = () => {
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('drawer-open');
      menuBtn && menuBtn.setAttribute('aria-expanded', 'false');
    };

    menuBtn && menuBtn.addEventListener('click', openDrawer);
    searchBtn && searchBtn.addEventListener('click', () => {
      openDrawer();
      setTimeout(() => drawerSearch && drawerSearch.focus(), 260);
    });

    // Close on backdrop or any [data-close-drawer] click
    drawer.addEventListener('click', (e) => {
      if (e.target.hasAttribute('data-close-drawer') ||
          e.target.closest('[data-close-drawer]')) {
        closeDrawer();
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer();
    });

    // Drawer nav anchor clicks: smooth scroll + open modal if data-article
    drawer.querySelectorAll('.drawer__nav a').forEach(a => {
      a.addEventListener('click', (e) => {
        const art = a.getAttribute('data-article');
        const href = a.getAttribute('href');
        if (art) {
          e.preventDefault();
          closeDrawer();
          setTimeout(() => openModal(art), 260);
        } else if (href && href.startsWith('#')) {
          e.preventDefault();
          closeDrawer();
          setTimeout(() => {
            const target = document.querySelector(href);
            if (target) {
              target.scrollIntoView({behavior:'smooth', block:'start'});
              target.classList.remove('search-hit'); void target.offsetWidth; target.classList.add('search-hit');
            }
          }, 260);
        }
        // else let external links pass through
      });
    });

    // Edition toggle sync in drawer
    const syncEdition = () => {
      const mode = document.documentElement.getAttribute('data-edition') || 'morning';
      if (drawerEdition) drawerEdition.textContent = mode === 'evening' ? '☀ Morning Edition' : '☾ Evening Edition';
    };
    syncEdition();
    drawerEdition && drawerEdition.addEventListener('click', () => {
      const editionBtn = document.getElementById('editionToggle');
      if (editionBtn) editionBtn.click();
      syncEdition();
    });

    // Hide on scroll down, show on scroll up
    let lastY = window.scrollY;
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y > lastY + 6 && y > 120) bar.classList.add('mobilebar--hidden');
        else if (y < lastY - 6 || y < 80) bar.classList.remove('mobilebar--hidden');
        lastY = y;
        ticking = false;
      });
    }, { passive: true });

    // Proxy drawer search to the main search input (reuse the same index)
    if (drawerSearch) {
      const mainInput = document.getElementById('searchInput');
      const mainResults = document.getElementById('searchResults');
      if (mainInput && mainResults) {
        drawerSearch.addEventListener('input', () => {
          mainInput.value = drawerSearch.value;
          mainInput.dispatchEvent(new Event('input'));
          // Mirror result into drawer if we want — simpler: when user hits enter, close drawer and scroll to first
        });
        drawerSearch.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            const first = mainResults.querySelector('.sr');
            if (first) {
              e.preventDefault();
              drawerSearch.value = '';
              mainInput.value = '';
              closeDrawer();
              setTimeout(() => first.click(), 260);
            }
          }
        });
      }
    }
  })();

  /* ---------- Typewriter SFX on masthead click ---------- */
  const mast = document.querySelector('.masthead h1');
  if (mast && window.AudioContext) {
    let ac = null;
    const ding = () => {
      if (!isSfxOn()) return;
      try {
        ac = ac || new AudioContext();
        const t0 = ac.currentTime;
        // typewriter click
        const bufSrc = ac.createBufferSource();
        const buf = ac.createBuffer(1, ac.sampleRate * 0.05, ac.sampleRate);
        const d = buf.getChannelData(0);
        for (let i=0;i<d.length;i++) d[i] = (Math.random()*2-1) * Math.pow(1 - i/d.length, 4);
        bufSrc.buffer = buf;
        const g = ac.createGain(); g.gain.value = 0.25;
        bufSrc.connect(g).connect(ac.destination);
        bufSrc.start(t0);
        // bell
        const o = ac.createOscillator();
        const og = ac.createGain();
        o.type = 'sine'; o.frequency.value = 1760;
        og.gain.setValueAtTime(0.0, t0);
        og.gain.linearRampToValueAtTime(0.15, t0 + 0.01);
        og.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.8);
        o.connect(og).connect(ac.destination);
        o.start(t0 + 0.04); o.stop(t0 + 0.9);
      } catch (_) {}
    };
    mast.style.cursor = 'pointer';
    mast.title = 'Ding!';
    mast.addEventListener('click', ding);
  }

  /* ---------- Sound toggle button ---------- */
  (function sfxToggle() {
    const btn = document.getElementById('sfxToggle');
    if (!btn) return;
    const render = () => {
      const on = isSfxOn();
      btn.textContent = on ? '🔊 Sound' : '🔈 Muted';
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      btn.title = on ? 'Click to mute typewriter & bell' : 'Click to un-mute';
    };
    render();
    btn.addEventListener('click', () => {
      setSfx(!isSfxOn());
      render();
    });
  })();

  /* ---------- Edition stamp (latest commit hash & date) ---------- */
  (function editionStamp() {
    const hashEl = document.getElementById('editionHash');
    const dateEl = document.getElementById('editionDate');
    if (!hashEl || !dateEl) return;
    // Placeholder while loading
    dateEl.textContent = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    if (!/^https?:/i.test(location.protocol)) { hashEl.textContent = 'local'; return; }

    fetch('https://api.github.com/repos/DennisPitallano/dennispitallano.github.io/commits/main', {
      headers: { 'Accept': 'application/vnd.github+json' }
    })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(data => {
        if (data && data.sha) {
          hashEl.textContent = data.sha.slice(0, 7);
          hashEl.title = data.commit && data.commit.message ? data.commit.message.split('\n')[0] : '';
          if (data.commit && data.commit.author && data.commit.author.date) {
            dateEl.textContent = new Date(data.commit.author.date).toLocaleDateString('en-US', { month:'short', day:'2-digit', year:'numeric' });
          }
        }
      })
      .catch(() => { hashEl.textContent = 'offline'; });
  })();

  /* ---------- Service worker registration ---------- */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => { /* silent */ });
    });
  }

  /* ---------- Daily Editor's Note (rotates by day-of-year) ---------- */
  (function editorsNote(){
    const el = document.getElementById('editorsNoteText');
    if (!el) return;
    const notes = [
      'Today\u2019s column was written before coffee. Reader discretion advised.',
      'The typesetter reports unusually clean kerning this morning.',
      'A correspondent filed this dispatch over spotty 4G. Forgive the hyphens.',
      'The Editor regrets nothing \u2014 least of all the Oxford comma.',
      'Printed on recycled optimism and one borrowed semicolon.',
      'A late correction: production is, in fact, the test environment.',
      'Our fact-checker has returned from leave. Expect fewer dragons.',
      'Filed under protest by a developer who prefers tabs.',
      'This issue printed before the daily stand-up. Notes may evolve.',
      'A reader writes to ask when we shall adopt Markdown. We shall not.',
      'No features were harmed in the making of this edition.',
      'Press run briefly interrupted by a rogue cron job. Resumed at dawn.',
      'All opinions herein are the author\u2019s, held with modest confidence.',
      'The newsroom is quiet today \u2014 the linter has nothing to flag.',
      'A merge has been delayed pending the Editor\u2019s second cup.',
      'Today we honour the humble <code>README</code>. Seldom read, often regretted.',
      'Our financial desk notes: technical debt compounds. Pay early.',
      'Notice: the docs are the source of truth. The source is also the truth.',
      'The correspondent is on assignment in the staging environment.',
      'This Gazette does not endorse premature abstraction.',
      'Weather bureau reports: a light drizzle of TypeScript complaints.',
      'Yesterday\u2019s bug has been promoted to a feature. Congratulations.',
      'Letters to the editor are opened, read, and occasionally answered.',
      'We regret that the crossword contains no references to blockchain.',
      'A kind note from the archive desk: <em>your PR is still open.</em>',
      'Deadline extended on account of the compiler. Again.',
      'The presses were halted briefly to rename a variable. Worth it.',
      'A moment of silence, please, for last night\u2019s merge conflict.',
      'Our editorial board voted unanimously to ship it on Monday.',
      'To the anonymous reader who fixed our typo: we remain in your debt.',
      'This edition is dedicated to everyone still waiting on <code>npm install</code>.'
    ];
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    const doy = Math.floor(diff / 86400000);
    el.innerHTML = notes[doy % notes.length];
  })();

  /* ---------- Real Weather (Open-Meteo, no key) ---------- */
  (function weather(){
    const icon = document.getElementById('fcIcon');
    const label = document.getElementById('fcLabel');
    const desc = document.getElementById('fcDesc');
    const temp = document.getElementById('fcTemp');
    const wind = document.getElementById('fcWind');
    const coffee = document.getElementById('fcCoffee');
    const sunset = document.getElementById('fcSunset');
    const loc = document.getElementById('fcLoc');
    if (!icon || !label) return;

    // Weather code → [icon, playful label, descriptor]
    // https://open-meteo.com/en/docs#weathervariables (WMO codes)
    const codeMap = {
      0:  ['\u2600', 'CLEAR BUILDS',    'no errors expected'],
      1:  ['\u{1F324}', 'MOSTLY CLEAR',    'light scattered warnings'],
      2:  ['\u26C5', 'PARTLY CACHED',    'intermittent cloud cover'],
      3:  ['\u2601', 'OVERCAST MERGE',   'heavy cloud, low visibility'],
      45: ['\u{1F32B}', 'FOGGED LOGS',     'trace diagnostics advised'],
      48: ['\u{1F32B}', 'RIMY DEPLOY',     'cold start expected'],
      51: ['\u{1F327}', 'LIGHT DRIZZLE',   'minor PR comments falling'],
      53: ['\u{1F327}', 'STEADY DRIZZLE',  'sustained nitpicks'],
      55: ['\u{1F327}', 'HEAVY DRIZZLE',   'CR backlog rising'],
      61: ['\u{1F327}', 'LIGHT RAIN',      'bring an umbrella \u2014 and tests'],
      63: ['\u{1F327}', 'RAIN',            'tests recommended'],
      65: ['\u26C8', 'HEAVY RAIN',       'rollback gear advised'],
      71: ['\u{1F328}', 'LIGHT SNOW',      'cold cache incoming'],
      73: ['\u{1F328}', 'SNOW',            'freeze on deployment'],
      75: ['\u{1F328}', 'HEAVY SNOW',      'prod is frozen'],
      80: ['\u{1F327}', 'SHOWERS',         'intermittent outages'],
      81: ['\u{1F327}', 'RAIN SHOWERS',    'sustained downpours'],
      82: ['\u26C8', 'VIOLENT SHOWERS',  'page the on-call'],
      95: ['\u26C8', 'THUNDERSTORM',     'incident in progress'],
      96: ['\u26C8', 'STORM + HAIL',     'DECLARE P0'],
      99: ['\u26C8', 'SEVERE STORM',     'panic methodically']
    };

    const fmtTime = (iso) => {
      try {
        return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      } catch(e) { return '\u2014'; }
    };

    const coffeeFromUv = (uv) => {
      if (uv == null) return 'MEDIUM';
      if (uv < 2) return 'LOW';
      if (uv < 5) return 'MEDIUM';
      if (uv < 8) return 'HIGH';
      return 'CRITICAL';
    };

    const fetchWeather = (lat, lon, placeName) => {
      const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lon +
        '&current=temperature_2m,wind_speed_10m,weather_code,relative_humidity_2m,uv_index' +
        '&daily=sunset&timezone=auto&forecast_days=1';
      fetch(url).then(r => r.ok ? r.json() : Promise.reject()).then(data => {
        const c = data.current || {};
        const d = data.daily || {};
        const meta = codeMap[c.weather_code] || ['\u2600', 'UNKNOWN WEATHER', 'conditions unclear'];
        const t = Math.round(c.temperature_2m);
        const rh = c.relative_humidity_2m;
        const mergeChance = rh != null ? Math.max(0, Math.min(99, Math.round(rh * 0.9))) : 12;
        if (icon) icon.textContent = meta[0];
        if (label) label.textContent = meta[1];
        if (desc) desc.textContent = t + '\u00B0C \u00B7 merge chance ' + mergeChance + '%';
        if (temp) temp.textContent = t + '\u00B0C';
        if (wind) wind.textContent = (c.wind_speed_10m != null ? c.wind_speed_10m.toFixed(1) : '\u2014') + ' km/h';
        if (coffee) coffee.textContent = coffeeFromUv(c.uv_index);
        if (sunset) sunset.textContent = (d.sunset && d.sunset[0]) ? fmtTime(d.sunset[0]) : '\u2014';
      }).catch(() => {
        if (desc) desc.textContent = 'Wire interrupted \u2014 forecast from memory';
      });
      if (loc) loc.textContent = placeName;
    };

    // Try geolocation, fall back to Camarines Norte (the correspondent's desk)
    const fallback = () => fetchWeather(14.1396, 122.7632, 'Camarines Norte Bureau');
    if (!('geolocation' in navigator)) return fallback();
    // Quick reverse-label helper using Open-Meteo reverse geocoding
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      const rg = 'https://geocoding-api.open-meteo.com/v1/reverse?latitude=' + latitude +
                 '&longitude=' + longitude + '&count=1&language=en&format=json';
      fetch(rg).then(r => r.ok ? r.json() : null).then(j => {
        const first = j && j.results && j.results[0];
        const name = first ? (first.name + (first.country_code ? ', ' + first.country_code : '')) : 'Reader\u2019s desk';
        fetchWeather(latitude, longitude, name);
      }).catch(() => fetchWeather(latitude, longitude, 'Reader\u2019s desk'));
    }, () => fallback(), { timeout: 5000, maximumAge: 600000 });
  })();

  /* ---------- Dead Drop (anonymous tips) ---------- */
  (function deadDrop(){
    const form = document.getElementById('ddForm');
    if (!form) return;
    const text = document.getElementById('ddText');
    const count = document.getElementById('ddCount');
    const status = document.getElementById('ddStatus');
    const btn = document.getElementById('ddSend');
    // Configure by setting data-endpoint on #ddForm (Formspree/Pipedream/etc)
    // Example: <form id="ddForm" data-endpoint="https://formspree.io/f/xxxx">
    const endpoint = form.getAttribute('data-endpoint') || '';

    text.addEventListener('input', () => {
      count.textContent = text.value.length;
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = (text.value || '').trim();
      if (!msg) { status.textContent = 'The drop must contain a message.'; return; }
      if (msg.length > 140) { status.textContent = 'Too long \u2014 140 characters or less.'; return; }

      if (!endpoint) {
        // No backend configured \u2014 fall back to mailto so it still ships.
        const subject = encodeURIComponent('Dead Drop \u00b7 Anonymous tip');
        const body = encodeURIComponent(msg + '\n\n\u2014 Slipped through the Gazette letterbox');
        window.location.href = 'mailto:dpitallano@gmail.com?subject=' + subject + '&body=' + body;
        status.textContent = 'Opening your letter\u2014carrier\u2026';
        return;
      }

      btn.disabled = true;
      status.textContent = 'Handing it to the runner\u2026';
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, ua: navigator.userAgent, ts: new Date().toISOString() })
      }).then(r => {
        if (!r.ok) throw new Error('bad response');
        form.reset();
        count.textContent = '0';
        status.textContent = 'Received. The Editor bows slightly in your direction.';
      }).catch(() => {
        status.textContent = 'The runner returned. Try again, or e\u2011mail the Editor directly.';
      }).finally(() => { btn.disabled = false; });
    });
  })();

  /* ---------- Wire Service (GitHub public events) ---------- */
  (function wireService(){
    const list = document.getElementById('wireList');
    if (!list) return;
    const user = 'DennisPitallano';

    const fmtAgo = (iso) => {
      const d = new Date(iso);
      const s = Math.max(1, Math.floor((Date.now() - d.getTime()) / 1000));
      if (s < 60) return s + 's ago';
      if (s < 3600) return Math.floor(s/60) + 'm ago';
      if (s < 86400) return Math.floor(s/3600) + 'h ago';
      if (s < 2592000) return Math.floor(s/86400) + 'd ago';
      return Math.floor(s/2592000) + 'mo ago';
    };

    const describe = (ev) => {
      const repo = ev.repo && ev.repo.name ? ev.repo.name.replace(user + '/', '') : 'an unnamed beat';
      const repoUrl = 'https://github.com/' + (ev.repo ? ev.repo.name : user);
      switch (ev.type) {
        case 'PushEvent': {
          const n = ev.payload && ev.payload.commits ? ev.payload.commits.length : 1;
          return 'Filed ' + n + ' commit' + (n === 1 ? '' : 's') + ' to <a href="' + repoUrl + '" target="_blank" rel="noopener">' + repo + '</a>';
        }
        case 'PullRequestEvent': {
          const action = ev.payload.action;
          const num = ev.payload.pull_request && ev.payload.pull_request.number;
          return (action === 'opened' ? 'Opened' : action === 'closed' ? 'Closed' : 'Updated') +
                 ' PR #' + num + ' in <a href="' + repoUrl + '" target="_blank" rel="noopener">' + repo + '</a>';
        }
        case 'IssuesEvent': {
          const a = ev.payload.action;
          const n = ev.payload.issue && ev.payload.issue.number;
          return a.charAt(0).toUpperCase() + a.slice(1) + ' issue #' + n + ' in <a href="' + repoUrl + '" target="_blank" rel="noopener">' + repo + '</a>';
        }
        case 'IssueCommentEvent':
          return 'Commented on <a href="' + repoUrl + '" target="_blank" rel="noopener">' + repo + '</a>';
        case 'WatchEvent':
          return 'Starred <a href="' + repoUrl + '" target="_blank" rel="noopener">' + repo + '</a>';
        case 'ForkEvent':
          return 'Forked <a href="' + repoUrl + '" target="_blank" rel="noopener">' + repo + '</a>';
        case 'CreateEvent': {
          const kind = ev.payload.ref_type || 'ref';
          return 'Created a new ' + kind + ' in <a href="' + repoUrl + '" target="_blank" rel="noopener">' + repo + '</a>';
        }
        case 'ReleaseEvent': {
          const tag = ev.payload.release && ev.payload.release.tag_name;
          return 'Released ' + (tag ? '<code>' + tag + '</code> ' : '') + 'of <a href="' + repoUrl + '" target="_blank" rel="noopener">' + repo + '</a>';
        }
        case 'PublicEvent':
          return 'Made <a href="' + repoUrl + '" target="_blank" rel="noopener">' + repo + '</a> public';
        default:
          return 'Dispatch from <a href="' + repoUrl + '" target="_blank" rel="noopener">' + repo + '</a>';
      }
    };

    fetch('https://api.github.com/users/' + user + '/events/public?per_page=10')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(events => {
        if (!Array.isArray(events) || !events.length) {
          list.innerHTML = '<li class="wire__item u-muted-2">The wire is quiet today.</li>';
          return;
        }
        const items = events.slice(0, 5).map(ev =>
          '<li class="wire__item"><span class="wire__dot">\u25A0</span><span class="wire__text">' +
          describe(ev) + '</span><span class="wire__when small u-muted-2">' + fmtAgo(ev.created_at) + '</span></li>'
        );
        list.innerHTML = items.join('');
      })
      .catch(() => {
        list.innerHTML = '<li class="wire__item u-muted-2">Wire offline \u2014 reader, please check again shortly.</li>';
      });
  })();

  /* ---------- Module-level typewriter SFX (shared) ---------- */
  let _sfxCtx = null;
  const sfxClack = (variant) => {
    if (!isSfxOn()) return;
    try {
      if (!_sfxCtx) _sfxCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (_sfxCtx.state === 'suspended') _sfxCtx.resume().catch(() => {});
      const now = _sfxCtx.currentTime;
      const o = _sfxCtx.createOscillator();
      const g = _sfxCtx.createGain();
      o.type = variant === 'bell' ? 'triangle' : 'square';
      o.frequency.setValueAtTime(variant === 'bell' ? 1760 : 900 + Math.random() * 600, now);
      const peak = variant === 'bell' ? 0.07 : 0.025;
      const dur = variant === 'bell' ? 0.4 : 0.05;
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(peak, now + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      o.connect(g).connect(_sfxCtx.destination);
      o.start(now);
      o.stop(now + dur + 0.02);
    } catch (e) {}
  };

  /* ---------- Typewriter SFX on search input ---------- */
  (function searchSfx(){
    const input = document.getElementById('searchInput');
    if (!input) return;
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { sfxClack('bell'); return; }
      if (e.key.length === 1 || e.key === 'Backspace' || e.key === ' ') sfxClack();
    });
  })();

  /* ---------- Hiring Signal toggle (shift-click to flip) ---------- */
  (function hiring(){
    const box = document.getElementById('hiring');
    if (!box) return;
    const status = document.getElementById('hiringStatus');
    const sub = document.getElementById('hiringSub');
    const STATES = {
      available: {
        label: 'AVAILABLE FOR COMMISSIONS',
        sub: 'Accepting: interesting problems \u00b7 freelance dispatches \u00b7 polite arguments about semicolons'
      },
      booked: {
        label: 'BOOKED \u2014 TAKING SHORT DISPATCHES',
        sub: 'Currently on assignment. Brief consultations and interesting problems still considered.'
      },
      quiet: {
        label: 'OFF THE BEAT \u2014 REPLY SLOWLY',
        sub: 'The correspondent is on furlough. Telegrams will be answered as soon as the coffee permits.'
      }
    };
    const order = ['available', 'booked', 'quiet'];
    const read = () => { try { return localStorage.getItem('gazette.hiring') || 'available'; } catch(e) { return 'available'; } };
    const write = (s) => { try { localStorage.setItem('gazette.hiring', s); } catch(e) {} };
    const render = (s) => {
      box.setAttribute('data-status', s);
      if (status) status.textContent = STATES[s].label;
      if (sub) sub.textContent = STATES[s].sub;
    };
    render(read());
    // Owner-only flip: shift-click (avoids random visitors tripping it)
    box.addEventListener('click', (e) => {
      if (!e.shiftKey) return;
      const cur = read();
      const next = order[(order.indexOf(cur) + 1) % order.length];
      write(next);
      render(next);
      sfxClack('bell');
    });
  })();

  /* ---------- "Clip this article" share buttons ---------- */
  (function clipArticles(){
    const articles = document.querySelectorAll('article.article[id]');
    articles.forEach(art => {
      const head = art.querySelector('.headline');
      if (!head) return;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'clip-btn';
      btn.setAttribute('aria-label', 'Clip this article');
      btn.title = 'Clip this article (copy link)';
      btn.innerHTML = '<span class="clip-btn__icon">\u2702</span><span class="clip-btn__label">Clip</span>';
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const url = location.origin + location.pathname + '#' + art.id;
        const title = head.textContent.trim();
        const shareText = '\u201C' + title + '\u201D \u2014 from The Oragon Gazette';
        try {
          if (navigator.share) {
            await navigator.share({ title: title, text: shareText, url: url });
          } else if (navigator.clipboard) {
            await navigator.clipboard.writeText(shareText + '\n' + url);
            btn.classList.add('clip-btn--copied');
            btn.querySelector('.clip-btn__label').textContent = 'Copied';
            sfxClack('bell');
            setTimeout(() => {
              btn.classList.remove('clip-btn--copied');
              btn.querySelector('.clip-btn__label').textContent = 'Clip';
            }, 1800);
          } else {
            window.prompt('Copy this link:', url);
          }
        } catch (err) { /* user cancelled or denied */ }
      });
      head.insertAdjacentElement('afterend', btn);
    });
  })();

  /* ---------- Preview card images: hide on error so gradient shows ---------- */
  (function previewFallback(){
    document.querySelectorAll('.preview__img').forEach(img => {
      img.addEventListener('error', () => { img.remove(); }, { once: true });
    });
  })();

  /* ---------- Press clipboard toast (shared tiny notifier) ---------- */
  function pressToast(msg){
    const t = document.getElementById('pressToast');
    if (!t) return;
    const m = document.getElementById('pressToastMsg');
    if (m && msg) m.textContent = msg;
    t.hidden = false;
    // reflow so CSS transition runs
    void t.offsetWidth;
    t.classList.add('toast--show');
    clearTimeout(pressToast._t);
    pressToast._t = setTimeout(() => {
      t.classList.remove('toast--show');
      setTimeout(() => { t.hidden = true; }, 260);
    }, 2100);
  }

  /* ---------- Copy email on click (with mailto fallback) ---------- */
  (function emailCopy(){
    const selector = 'a[href^="mailto:"]';
    document.addEventListener('click', (e) => {
      const a = e.target.closest && e.target.closest(selector);
      if (!a) return;
      // allow real mailto via modifier keys or middle-click
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button === 1) return;
      const href = a.getAttribute('href') || '';
      const addr = href.replace(/^mailto:/i, '').split('?')[0].trim();
      if (!addr) return;
      if (!navigator.clipboard || !navigator.clipboard.writeText) return; // let mailto proceed
      e.preventDefault();
      navigator.clipboard.writeText(addr).then(() => {
        pressToast('Copied \u201C' + addr + '\u201D to the press clipboard.');
        sfxClack('bell');
        // Offer mailto as a follow-up after the toast so users still reach their client
        setTimeout(() => { window.location.href = href; }, 650);
      }).catch(() => {
        window.location.href = href;
      });
    });
  })();

  /* ---------- Outbound link tracking (GoatCounter events) ---------- */
  (function outboundTracker(){
    const host = location.hostname;
    document.addEventListener('click', (e) => {
      const a = e.target.closest && e.target.closest('a[href^="http"]');
      if (!a) return;
      let url;
      try { url = new URL(a.href); } catch(_) { return; }
      if (!url.hostname || url.hostname === host) return;
      if (!window.goatcounter || typeof window.goatcounter.count !== 'function') return;
      try {
        window.goatcounter.count({
          path: 'outbound: ' + url.hostname + url.pathname,
          title: a.textContent.trim().slice(0, 80) || url.hostname,
          event: true
        });
      } catch(_) {}
    });
  })();

  /* ---------- Readers Today (public GoatCounter counter) ---------- */
  (function readersToday(){
    const el = document.getElementById('readersToday');
    if (!el) return;
    const base = 'https://dennispitallano.goatcounter.com/counter/';
    const path = encodeURIComponent(location.pathname || '/');
    const fmt = (n) => {
      n = Number(n) || 0;
      if (n >= 10000) return (n/1000).toFixed(1).replace(/\.0$/,'') + 'k';
      return n.toLocaleString('en-US');
    };
    fetch(base + path + '.json', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const n = data.count_unique != null ? data.count_unique : data.count;
        if (n == null) return;
        el.textContent = 'Circulation: ' + fmt(n) + ' reader' + (n === 1 ? '' : 's');
      })
      .catch(() => {});
  })();

  /* ---------- Keyboard shortcuts (? opens reference desk) ---------- */
  (function shortcuts(){
    const modal = document.getElementById('kbModal');
    const closeBtn = document.getElementById('kbClose');
    if (!modal) return;

    const open = () => { modal.hidden = false; modal.classList.add('open'); };
    const close = () => { modal.hidden = true; modal.classList.remove('open'); };
    closeBtn && closeBtn.addEventListener('click', close);
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });

    const isTyping = (e) => {
      const t = e.target;
      return t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
    };

    let gBuffer = null;
    let gTimer = null;
    const clearG = () => { gBuffer = null; if (gTimer) { clearTimeout(gTimer); gTimer = null; } };
    document.addEventListener('keydown', (e) => {
      if (isTyping(e)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      // Chained g-<key>
      if (gBuffer === 'g') {
        const k = e.key.toLowerCase();
        if (k === 'h') { location.href = '/'; clearG(); return; }
        if (k === 'b') { location.href = '/blog/'; clearG(); return; }
        if (k === 'c') { location.href = '/comics/'; clearG(); return; }
        if (k === 'r') { location.href = '/resume.html'; clearG(); return; }
        clearG();
        return;
      }
      if (e.key === 'g') {
        gBuffer = 'g';
        gTimer = setTimeout(clearG, 900);
        return;
      }

      if (e.key === '?') {
        e.preventDefault();
        open();
      } else if (e.key === 'Escape') {
        if (!modal.hidden) close();
      } else if (e.key === '/') {
        const si = document.getElementById('searchInput');
        if (si) { e.preventDefault(); si.focus(); si.select && si.select(); }
      } else if (e.key.toLowerCase() === 'e') {
        const btn = document.getElementById('editionToggle');
        if (btn) btn.click();
      }
    });
  })();

  /* ---------- Newsflash overlay ---------- */
  (function newsflash(){
    const root = document.getElementById('newsflash');
    if (!root) return;
    const closeBtn = document.getElementById('newsflashClose');
    const show = () => {
      root.hidden = false;
      void root.offsetWidth;
      root.classList.add('open');
      sfxClack('bell');
    };
    const hide = () => {
      root.classList.remove('open');
      setTimeout(() => { root.hidden = true; }, 320);
    };
    closeBtn && closeBtn.addEventListener('click', hide);
    root.addEventListener('click', (e) => { if (e.target === root) hide(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !root.hidden) hide(); });
    window.__gazetteNewsflash = show;
  })();

  /* ---------- Paper-aging on scroll (subtle yellowing) ---------- */
  (function paperAging(){
    const root = document.documentElement;
    let ticking = false;
    const update = () => {
      const max = Math.max(1, document.body.scrollHeight - window.innerHeight);
      const pct = Math.min(1, Math.max(0, window.scrollY / max));
      root.style.setProperty('--paper-age', pct.toFixed(3));
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  })();

})();
