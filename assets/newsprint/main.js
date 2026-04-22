/* =========================================================
   The Oragon Gazette - Interactive behaviors
   ========================================================= */
(function () {
  'use strict';

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

  /* ---------- Typewriter intro (first visit per session) ---------- */
  (function typewriterIntro() {
    const h1 = document.querySelector('.masthead h1');
    if (!h1) return;
    let played = false;
    try { played = sessionStorage.getItem('gazette.introPlayed') === '1'; } catch (e) {}
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (played || prefersReduced) return;

    const text = h1.textContent;
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
    const tick = (isBell = false) => {
      try {
        if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = isBell ? 'triangle' : 'square';
        o.frequency.value = isBell ? 1760 : 1100 + Math.random() * 400;
        g.gain.value = isBell ? 0.06 : 0.018;
        o.connect(g).connect(ctx.destination);
        o.start();
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + (isBell ? 0.35 : 0.04));
        o.stop(ctx.currentTime + (isBell ? 0.4 : 0.05));
      } catch (e) {}
    };

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
        try { sessionStorage.setItem('gazette.introPlayed', '1'); } catch (e) {}
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
  if (saved) document.documentElement.setAttribute('data-edition', saved);
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

  /* ---------- Crossword (click to reveal) ---------- */
  /* 7x7 grid. '#' = black. Word entries: OR A GON across, DOTNET down, etc. */
  const grid = [
    ['#','O','R','A','G','O','N'],
    ['D','E','V','#','I','#','E'],
    ['O','#','U','#','T','E','T'],
    ['T','S','E','R','V','E','R'],
    ['N','#','#','#','#','#','#'],
    ['E','L','I','X','I','R','#'],
    ['T','#','A','P','I','#','S']
  ];
  const nums = {'0,1':1,'1,0':2,'2,3':3,'3,0':4,'5,0':5,'6,6':6};
  const cwEl = document.getElementById('crossword');
  if (cwEl) {
    grid.forEach((row, r) => row.forEach((ch, c) => {
      const cell = document.createElement('div');
      cell.className = 'cw-cell' + (ch === '#' ? ' black' : '');
      if (ch !== '#') {
        cell.dataset.letter = ch;
        const key = r + ',' + c;
        if (nums[key]) cell.innerHTML = `<span class="cw-cell__num">${nums[key]}</span>`;
        cell.addEventListener('click', () => {
          if (cell.classList.contains('revealed')) {
            cell.classList.remove('revealed');
            cell.childNodes.forEach(n => { if (n.nodeType === 3) n.remove(); });
          } else {
            cell.classList.add('revealed');
            cell.appendChild(document.createTextNode(ch));
          }
        });
      }
      cwEl.appendChild(cell);
    }));
  }

  /* ---------- Article modal ---------- */
  const articles = {
    about: {
      kicker: 'Cover Story',
      title: 'Bicolano Developer Writes Code by Candlelight, Still Compiles',
      byline: 'By The Editor · Naga City Bureau',
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
        if (secret) { secret.style.display = 'block'; secret.scrollIntoView({behavior:'smooth'}); }
      }
    } else {
      idx = 0;
    }
  });

  /* ---------- On This Day in Computing History ---------- */
  const history = [
    [1,4,1975,'Microsoft is founded','Bill Gates and Paul Allen register the company in Albuquerque. The world has never been the same, especially on Tuesdays.'],
    [2,24,1955,'Steve Jobs is born','Future turtleneck enthusiast and founder of Apple.'],
    [3,12,1989,'Tim Berners-Lee proposes the World Wide Web','A humble memo at CERN. "Vague but exciting," wrote his manager.'],
    [4,1,1976,'Apple Computer Company is founded','In a garage. Funded by a Volkswagen microbus.'],
    [4,4,1975,'Microsoft officially formed','"Micro-Soft" — the hyphen dropped later, like so many features.'],
    [5,9,1983,'The first mobile phone call in the Philippines','A prelude to your pocket computer.'],
    [6,23,1912,'Alan Turing is born','The father of computer science. We owe him everything, including Candy Crush.'],
    [7,20,1969,'Humans walk on the Moon','Guided by computers with less RAM than a modern light switch.'],
    [8,12,1981,'IBM releases the PC (Model 5150)','MS-DOS ships with it. Thus began a forty-year argument.'],
    [9,9,1945,'The first actual computer bug is logged','A moth, found in the Harvard Mark II relay. Grace Hopper taped it to the log.'],
    [10,5,1991,'Linus Torvalds releases Linux 0.02','"Just a hobby, nothing big." Reader, it became big.'],
    [11,7,1996,'Internet Explorer 3.0 ships','The great browser wars begin. Casualties: many afternoons.'],
    [12,9,1968,'"The Mother of All Demos"','Doug Engelbart demonstrates the mouse, hypertext, and video conferencing — in 1968.']
  ];
  const todayOTD = new Date();
  const m = todayOTD.getMonth() + 1, d = todayOTD.getDate();
  let entry = history.find(h => h[0] === m && h[1] === d)
    || history[Math.abs((m * 31 + d)) % history.length];
  const otdH = document.getElementById('otdHeadline');
  const otdB = document.getElementById('otdBody');
  const otdBy = document.getElementById('otdByline');
  if (otdH && entry) {
    const monthName = new Date(entry[2], entry[0]-1, entry[1]).toLocaleString('en-US',{month:'long'});
    otdH.textContent = `${entry[2]}: ${entry[3]}`;
    otdBy.textContent = `Historical Desk · ${monthName} ${entry[1]}, ${entry[2]}`;
    otdB.textContent = entry[4];
  }

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
    const css = getComputedStyle(document.documentElement);
    const col = (n) => css.getPropertyValue(n).trim();
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

})();
