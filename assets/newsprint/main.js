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

  /* ---------- Tiny GitHub fetch with localStorage caching ----------
     Anonymous calls to api.github.com are rate-limited to 60/hr per IP.
     Cache successful responses for the given TTL and serve any cached
     value as a fallback on 403/429, so a rate-limited page still
     renders content. Declared early so later IIFEs can use it.          */
  const ghFetch = (url, ttlMs) => {
    const key = 'gh:' + url;
    const now = Date.now();
    let cached = null;
    try { cached = JSON.parse(localStorage.getItem(key) || 'null'); } catch(_) {}
    if (cached && (now - cached.t) < (ttlMs || 600000)) {
      return Promise.resolve(cached.v);
    }
    return fetch(url, { headers: { 'Accept': 'application/vnd.github+json' } })
      .then(r => {
        if (r.ok) return r.json().then(v => {
          try { localStorage.setItem(key, JSON.stringify({ t: now, v: v })); } catch(_) {}
          return v;
        });
        if (cached) return cached.v;
        return Promise.reject(r.status);
      });
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
    let _twGestured = false;
    const ensureCtx = () => {
      if (!_twGestured) return null; // don't create AudioContext before a user gesture
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
    const unlock = () => { _twGestured = true; ensureCtx(); };
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

  /* ---------- Daily Crossword — rotating pool ---------- */
  /*
    Pool of 5×5 mini-crossword puzzles. Each entry:
      sol:  5-element array of 5-char strings ('#' = black, letter = solution)
      nums: { 'r,c': clueNumber } for numbered cells
      clues: { across: [{n, clue}], down: [{n, clue}] }

    Daily puzzle = pool[ dayOfYear % pool.length ]
    Verified intersections: every down letter matches the across letter at that cell.
  */
  (function crossword() {
    const cwEl    = document.getElementById('crossword');
    const cluesEl = document.getElementById('cwClues');
    const numEl   = document.getElementById('cwPuzzleNum');
    if (!cwEl) return;

    /* ── Puzzle pool ──────────────────────────────────────────────────────
       Grid encoding: 5 strings of length 5.  '#' = black.
       All intersections verified by construction.
    ─────────────────────────────────────────────────────────────────────── */
    const POOL = [
      /* 0 — CODE / CABLE / DIGIT */
      {
        sol:  ['#CODE#', /* too wide — use 5 cols */
               null],   // placeholder, real entries below
      },
      // Real format: array of 5 strings, each exactly 5 chars
    ];

    // Clean pool — all verified 5×5
    const PUZZLES = [
      /* 0 ─ CODE / CABLE / DIGIT / BUGS
           C O D E #
           A # I # #
           B U G S #
           L # I # #
           E # T # #
         1A=CODE, 3A=BUGS, 1D=CABLE, 2D=DIGIT */
      {
        sol:  ['CODE#','A#I##','BUGS#','L#I##','E#T##'],
        nums: {'0,0':1,'0,2':2,'2,0':3},
        clues: {
          across: [{n:1,t:'What we write, not prose (4)'},{n:3,t:'Not features (4)'}],
          down:   [{n:1,t:'Network tether (5)'},{n:2,t:'A finger, or 0–9 (5)'}]
        }
      },
      /* 1 ─ REACT / RAILS / LOOP / TYPE
           R E A C T
           A # O # Y
           I L O P #
           L # P # #
           S # # # #
         1A=REACT, 3A=LOOP→ILOP?  Let's verify carefully.
         1D col0: R A I L S ✓  (REACT[0]=R)
         2D col3: C O P → only 3 cells needed?
         Redo with cleaner layout:
           R E A C T
           A # # # Y
           I L O O P   ← 3A ILOOP? not a word
         Use simpler words:
           TYPE#
           Y#A##
           PARSE  ← 3A
           E#S##
           #####
         1A=TYPE(4), 3A=PARSE(5), 1D col0: T Y P E → TYPE (4) = 1A conflict at (0,0)
         Need distinct across/down words.

         Clean verified:
           T A S K #
           E # T # #
           S T A C K   ← 3A=STACK; 1D col0: T E S T S ✗ (TESTS 5 but row4 needs S)
           T # C # #
           S # K # #
         1A=TASK(4), 3A=STACK(5), 1D=TESTS(5) col0: T(0,0)E(1,0)S(2,0)T(3,0)S(4,0) ✓ TASK[0]=T ✓
         2D col2: S(0,2)T(1,2)A(2,2)C(3,2)K(4,2) = STACK col wait: STACK is across (2,0-4),
           STACK[2]=A at (2,2). 2D col2: rows 0-4: S(0,2) T(1,2) A(2,2) C(3,2) K(4,2) = STACK ✓ same letters, clue = STACK? That's the same word.
         Give 2D a different clue: "STACK" could be "push/pop structure" for down and "developer skill set" for across — but same word used twice looks odd.
         Use different col:
           T A S K #
           E # # # #
           S T Y P E   ← 3A=STYPE? not a word
         Let's try:
           P A T C H
           I # A # #
           P I P E #
           E # # # #
           #####
         1A=PATCH(5), 3A=PIPE(4), 1D col0: P I P E # = PIPE(4) — same as 3A ✗
         Simple verified puzzle:
           L O O P #
           I # # # #
           N O D E #
           K # # # #
           #####
         1A=LOOP(4), 3A=NODE(4), 1D col0: L I N K = LINK(4) rows 0-3 ✓ LOOP[0]=L ✓
         2D col2: O(0,2) # # # = only 1, skip
         Numbers: 1=(0,0), 2=(0,2)? no down there. Just 1A,3A,1D. Need a 2nd down.
         Add down at col 3: P(LOOP[3]=P? no LOOP is L,O,O,P → col3=P row0
                            D(NODE[3]=E? NODE is N,O,D,E → col3=E row2
                            P at (0,3), rows 1 black, E at (2,3) — not contiguous
         Keep it: 1A LOOP, 3A NODE, 1D LINK. 3 clues like original. */
      {
        sol:  ['LOOP#','I####','NODE#','K####','#####'],
        nums: {'0,0':1,'2,0':3},
        clues: {
          across: [{n:1,t:'Iteration construct; for or while (4)'},{n:3,t:'Server-side JS runtime: ___.js (4)'}],
          down:   [{n:1,t:'Hyperlink; chain connection (4)'}]
        }
      },
      /* 2 ─ HASH / HAIKU / SASS / HUGO / XUNIT */
      /* Verified:
           H A S H #
           A # A # #
           S A S S #
           H # # # #
           #####
         1A=HASH(4), 3A=SASS(4), 1D col0: H A S H = HASH same as 1A ✗
         Use:
           B Y T E #
           R # Y # #
           A R R A Y   ← 3A=ARRAY(5); 1D col0: B R A # # = BRA(3) only, needs 5 rows
           # # A # #
           #####
         1D col0 rows 0-2: B R A → only 3 ✗
         Simple:
           T Y P E #
           O # A # #
           K E Y S #
           E # # # #
           N # # # #
         1A=TYPE(4), 3A=KEYS(4), 1D col0: TOKEN(5) T(0,0)O(1,0)K(2,0)E(3,0)N(4,0) ✓ TYPE[0]=T ✓
         2D col2: P(TYPE[2]=P row0) A(1,2) Y(KEYS[2]=Y row2) # # → P A Y = PAY(3 rows)
                 need len≥3. PAY is 3. Give clue: "Salary (3)" — wait col2 rows0-2=PAY, rows3-4 black.
                 Numbers: 1=(0,0), 2=(0,2), 3=(2,0). NUMS: '0,0':1,'0,2':2,'2,0':3
                 2D = PAY(3) ✓ */
      {
        sol:  ['TYPE#','O#A##','KEYS#','E####','N####'],
        nums: {'0,0':1,'0,2':2,'2,0':3},
        clues: {
          across: [{n:1,t:'Variable classification; string, int, bool (4)'},{n:3,t:'Keyboard shortcuts; dict ___ (4)'}],
          down:   [{n:1,t:'Access control token for auth (5)'},{n:2,t:'Compensate; wages (3)'}]
        }
      },
      /* 3 ─ PORT / PROXY / REST
           P O R T #
           R # E # #
           O # S # #
           X # T # #
           Y # # # #
         1A=PORT(4), 1D col0: PROXY(5) P(0,0)R(1,0)O(2,0)X(3,0)Y(4,0) ✓ PORT[0]=P ✓
         2D col2: R(PORT[2]=R row0) E(1,2) S(2,2) T(3,2) # → REST(4) rows 0-3 ✓ PORT[2]=R ✓ */
      {
        sol:  ['PORT#','R#E##','O#S##','X#T##','Y####'],
        nums: {'0,0':1,'0,2':2},
        clues: {
          across: [{n:1,t:'TCP/IP door number (4)'}],
          down:   [{n:1,t:'Intermediary server; forward ___ (5)'},{n:2,t:'Stateless API style; take a break (4)'}]
        }
      },
      /* 4 ─ HOOK / QUEUE / SCOPE
           H O O K #
           #####
           S C O P E
           #####
           Q U E U E
         1A=HOOK(4) row0, 3A=SCOPE(5) row2, 5A=QUEUE(5) row4
         No intersecting down words (rows 1,3 all black). Add down:
           H O O K #
           # C # # #
           S C O P E
           # O # # #
           # P # # #
         2D col1: O(HOOK[1]=O row0) C(1,1) C(SCOPE[1]=C row2) O(3,1) P(4,1) = OCCO P ✗
         Simpler: just 3 across, no down (unusual). Add 1 down:
           H O O K #
           U # # # #
           B O O T S   ← 3A=BOOTS(5); 1D col0: H U B # # = HUB(3)
           # # # # #
           #####
         1D=HUB(3) col0 rows0-2: H(0,0) U(1,0) B(2,0) ✓ HOOK[0]=H, BOOTS[0]=B ✓ */
      {
        sol:  ['HOOK#','U####','BOOTS','#####','#####'],
        nums: {'0,0':1,'2,0':3},
        clues: {
          across: [{n:1,t:'React lifecycle helper; a function that ___ into state (4)'},{n:3,t:'Startup sequence; to ___ a system (5)'}],
          down:   [{n:1,t:'USB ___ ; central connector (3)'}]
        }
      },
      /* 5 ─ MOCK / MONAD / STUB / UNIX
           M O C K #
           O # T # #
           N A D # #   ← 3A=NAD? not a word
         Fix:
           M O C K #
           O # U # #
           N A X # #   ← still no
         Use:
           M A K E #
           O # E # #
           D E B U G   ← 3A=DEBUG(5)
           E # # # #
           M # # # #
         1A=MAKE(4), 3A=DEBUG(5), 1D col0: MODEM(5) M(0,0)O(1,0)D(2,0)E(3,0)M(4,0)
           MAKE[0]=M ✓, DEBUG[0]=D ✓
         2D col2: K(MAKE[2]=K row0) E(1,2) B(DEBUG[2]=B row2) # # = KEB(3)? not a word
         Try col1: A(MAKE[1]=A row0) # E(DEBUG[1]=E row2) # # → not contiguous (row1 black) ✗
         Use col4: #(MAKE[4]='#') → black ✗
         Skip 2nd down, use 1D only:
           M A K E #
           O # # # #
           D E B U G
           E # # # #
           M # # # #
         1A=MAKE(4), 3A=DEBUG(5), 1D=MODEM(5) ✓ */
      {
        sol:  ['MAKE#','O####','DEBUG','E####','M####'],
        nums: {'0,0':1,'2,0':3},
        clues: {
          across: [{n:1,t:'build tool command; ___ file (4)'},{n:3,t:'Find and fix errors in code (5)'}],
          down:   [{n:1,t:'Dial-up hardware; modulator-demodulator (5)'}]
        }
      },
      /* 6 ─ BLOB / BRANCH / LINE / NULL
           B L O B #
           R # I # #
           A # N # #
           N # E # #
           C # # # #
         Wait: 1A=BLOB(4) row0, 1D col0: B R A N C = BRANC(5)? Not a word.
         Use BRAND(5): B R A N D
           B L O B #
           R # # # #
           A # # # #
           N # # # #
           D # # # #
         1A=BLOB(4), 1D=BRAND(5): BLOB[0]=B ✓. Only 2 clues.
         Add 2A at row 0 col 2 (after O): OB is too short. Add 3A:
           B L O B #
           R # L # #
           A # L # #
           N # O # #
           D # C # #
         2D col2: O(BLOB[2]=O row0) L(1,2) L(2,2) O(3,2) C(4,2) = OLLOC ✗
         Simple 3-clue:
           B L O B #
           R # # # #
           A P I # #   ← 3A=API(3)
           N # # # #
           D # # # #
         1A=BLOB(4), 3A=API(3), 1D=BRAND(5) col0: B(0,0)R(1,0)A(2,0)N(3,0)D(4,0) ✓ */
      {
        sol:  ['BLOB#','R####','API##','N####','D####'],
        nums: {'0,0':1,'2,0':3},
        clues: {
          across: [{n:1,t:'Binary large object; unstructured data (4)'},{n:3,t:'Software interface contract (3)'}],
          down:   [{n:1,t:'Repository fork; tree ___ (5)'}]
        }
      },
      /* 7 ─ LINT / LOCAL / NULL / SCOPE
           L I N T #
           O # U # #
           C # L # #
           A # L # #
           L # # # #
         1A=LINT(4), 1D col0: LOCAL(5) L(0,0)O(1,0)C(2,0)A(3,0)L(4,0) ✓ LINT[0]=L ✓
         2D col2: N(LINT[2]=N row0) U(1,2) L(2,2) L(3,2) # = NULL(4) rows 0-3 ✓ LINT[2]=N ✓ */
      {
        sol:  ['LINT#','O#U##','C#L##','A#L##','L####'],
        nums: {'0,0':1,'0,2':2},
        clues: {
          across: [{n:1,t:'Code style checker; ___ tool (4)'}],
          down:   [{n:1,t:'Not remote; on this machine (5)'},{n:2,t:'Empty reference; absence of value (4)'}]
        }
      },
      /* 8 ─ DIFF / DEFER / ICON / FONT
           D I F F #
           E # O # #
           F # N # #
           E # T # #
           R # # # #
         1A=DIFF(4), 1D col0: DEFER(5) D(0,0)E(1,0)F(2,0)E(3,0)R(4,0) ✓ DIFF[0]=D ✓
         2D col2: F(DIFF[2]=F row0) O(1,2) N(2,2) T(3,2) # = FONT(4) rows 0-3 ✓ DIFF[2]=F ✓ */
      {
        sol:  ['DIFF#','E#O##','F#N##','E#T##','R####'],
        nums: {'0,0':1,'0,2':2},
        clues: {
          across: [{n:1,t:'Git comparison output; patch file (4)'}],
          down:   [{n:1,t:'Delay execution; Promise.___ (5)'},{n:2,t:'Typeface; CSS ___ -family (4)'}]
        }
      },
      /* 9 ─ FLEX / FLOAT / GRID / FLOW
           F L E X #
           L # R # #
           O # I # #
           A # D # #
           T # # # #
         1A=FLEX(4), 1D col0: FLOAT(5) F(0,0)L(1,0)O(2,0)A(3,0)T(4,0) ✓ FLEX[0]=F ✓
         2D col2: E(FLEX[2]=E row0) R(1,2) I(2,2) D(3,2) # = ERID ✗
         Use col3: X(FLEX[3]=X) → ✗
         3A at row2: O # I # # → starts at (2,0), run=1 (then black) ✗
         Add 3A: GRID at row2 starting col2? (2,2)=I — IRID? no.
         Use:
           F L E X #
           L # # # #
           O G R I D   ← 3A=OGRID? no. start at col1: GRID starts (2,1)
           A # # # #
           T # # # #
         1A=FLEX(4), 3A GRID row2 col1: G(2,1)R(2,2)I(2,3)D(2,4) len4 ✓
         1D col0: FLOAT(5) ✓ FLEX[0]=F ✓
         2D col1: L(FLEX[1]=L row0) # G(GRID[0]=G row2) # # → not contiguous (row1 black) ✗
         Keep FLOAT down, FLEX across, add GRID across row2 at col1 (isolated, no down conflict):
           F L E X #
           L # # # #
           # G R I D
           A # # # #
           T # # # #
         1D col0: F(0,0)L(1,0)#(2,0 black)A(3,0)T(4,0) → not contiguous ✗
         Use:
           F L E X #
           L # G # #
           O # R # #
           A # I # #
           T # D # #
         1A=FLEX(4), 1D=FLOAT(5) col0 ✓, 2D col2: G R I D = GRID(4) rows 1-4 ✓ FLEX[2]=E≠G ✗
         Different col for GRID:
         2D col3: X(FLEX[3]=X) → ✗ starts with X
         Abandon GRID, use QUERY:
           F L E X #
           L # # # #
           O # # # #
           A # # # #
           T # # # #
         Only 2 clues. Keep it: 1A=FLEX, 1D=FLOAT */
      {
        sol:  ['FLEX#','L####','O####','A####','T####'],
        nums: {'0,0':1},
        clues: {
          across: [{n:1,t:'CSS layout mode; display: ___ (4)'}],
          down:   [{n:1,t:'CSS position; number with decimals (5)'}]
        }
      },
      /* 10 ─ OPEN / OAUTH / PATH / TYPE
           O P E N #
           A # A # #
           U # T # #
           T # H # #
           H # # # #
         1A=OPEN(4), 1D col0: OAUTH(5) O(0,0)A(1,0)U(2,0)T(3,0)H(4,0) ✓ OPEN[0]=O ✓
         2D col2: E(OPEN[2]=E row0) A(1,2) T(2,2) H(3,2) # = EATH? not standard. PATH(4)?
           P(0)A(1)T(2)H(3): but OPEN[2]=E≠P ✗
         Use col3: N(OPEN[3]=N) → starts with N. TYPE? N≠T ✗
         Try: 2D at col2 = EASY(4)? OPEN[2]=E ✓, then E(0,2)A(1,2)S(2,2)Y(3,2)
         No standard word needed — use EACH: E(0,2)A(1,2)C(2,2)H(3,2) = EACH ✓
           O P E N #
           A # A # #
           U # C # #
           T # H # #
           H # # # #
         2D col2=EACH(4): OPEN[2]=E ✓ */
      {
        sol:  ['OPEN#','A#A##','U#C##','T#H##','H####'],
        nums: {'0,0':1,'0,2':2},
        clues: {
          across: [{n:1,t:'Not closed; public source (4)'}],
          down:   [{n:1,t:'Auth delegation standard; ___ 2.0 (5)'},{n:2,t:'Every one; ___ of them (4)'}]
        }
      },
      /* 11 ─ EMIT / EVENT / QUEUE / TICK
           E M I T #
           V # # # #
           E Q U E U   ← too wide for col
         Use:
           E M I T #
           V # C # #
           E # K # #
           N # # # #
           T # # # #
         1A=EMIT(4), 1D col0: EVENT(5) E(0,0)V(1,0)E(2,0)N(3,0)T(4,0) ✓ EMIT[0]=E ✓
         2D col2: I(EMIT[2]=I row0) C(1,2) K(2,2) # # = ICK(3) rows 0-2 ✓ */
      {
        sol:  ['EMIT#','V#C##','E#K##','N####','T####'],
        nums: {'0,0':1,'0,2':2},
        clues: {
          across: [{n:1,t:"Fire an event; pub/sub ___ter (4)"}],
          down:   [{n:1,t:'Browser action; DOM ___ (5)'},{n:2,t:'Clock tap; node ___ (3)'}]
        }
      },
      /* 12 ─ ATOM / ASYNC / TEST / MOCK
           A T O M #
           S # E # #
           Y # S # #
           N # T # #
           C # # # #
         1A=ATOM(4), 1D col0: ASYNC(5) A(0,0)S(1,0)Y(2,0)N(3,0)C(4,0) ✓ ATOM[0]=A ✓
         2D col2: O(ATOM[2]=O row0) E(1,2) S(2,2) T(3,2) # = OEST ✗
         Use: 2D col3: M(ATOM[3]=M) starts with M. MOCK? M(0,3)O(1,3)C(2,3)K(3,3) but (1,3)=# ✗
         Keep 1A,1D only + add 3A:
           A T O M #
           S # # # #
           Y # T E A   ← 3A=YTEA? no. 3A starts at (2,0): Y # T = not a word
         Use row2 from col2: TEST starting (2,2): T(2,2)E(2,3)S(2,4)T? only 5 wide, col4=T row2
           A T O M #
           S # # # #
           Y # T E S   ← 3A=(2,2)=TES(3)?
         Start 3A at (2,2): TES? Use (2,0)=YIELD? too long.
         Simple: drop extra clue, keep 1A ATOM + 1D ASYNC */
      {
        sol:  ['ATOM#','S####','Y####','N####','C####'],
        nums: {'0,0':1},
        clues: {
          across: [{n:1,t:'Smallest unit; feed format (4)'}],
          down:   [{n:1,t:'Non-blocking; ___ /await pattern (5)'}]
        }
      },
      /* 13 ─ BLOB / CLONE / PUSH / SYNC
           P U S H #
           U # Y # #
           L # N # #
           L # C # #
           # # # # #
         1A=PUSH(4), 1D col0: PULL(4) P(0,0)U(1,0)L(2,0)L(3,0) ✓ PUSH[0]=P ✓
         2D col2: S(PUSH[2]=S row0) Y(1,2) N(2,2) C(3,2) # = SYNC(4) rows 0-3 ✓ PUSH[2]=S ✓ */
      {
        sol:  ['PUSH#','U#Y##','L#N##','L#C##','#####'],
        nums: {'0,0':1,'0,2':2},
        clues: {
          across: [{n:1,t:'Send commits to remote (4)'}],
          down:   [{n:1,t:'Opposite of push; fetch down (4)'},{n:2,t:'Keep in step; ___ ronize (4)'}]
        }
      },
      /* 14 ─ PIPE / PROXY / EMIT / EXEC
           P I P E #
           R # # # #
           O # # # #
           X # # # #
           Y # # # #
         1A=PIPE(4), 1D col0: PROXY(5) P(0,0)R(1,0)O(2,0)X(3,0)Y(4,0) ✓ PIPE[0]=P ✓
         2D col3: E(PIPE[3]=E row0) # # # # → only 1 white. Add 3A:
           P I P E #
           R # # # #
           O K A Y #   ← 3A=OKAY(4) row2 col1: K(2,1)A(2,2)Y(2,3) len3 starts (2,1)
         3A OKAY row2 col1 len4: K A Y # — only 3 letters before black? col4 is '#'
           O(2,0)K(2,1)A(2,2)Y(2,3) → 4 letters ✓ but 3A starts at (2,0)=O not K
         Numbers: 3=(2,0) since first white in row2.
         3A=OKAY(4) at (2,0): O K A Y
           P I P E #
           R # # # #
           O K A Y #
           X # # # #
           Y # # # #
         1D col0: PROXY(5) ✓, OKAY[0]=O=PROXY[2] ✓
         2D col1: I(PIPE[1]=I row0) # K(OKAY[1]=K row2) # # → not contiguous ✗
         Add 2D at col3: E(PIPE[3]=E row0) # Y(OKAY[3]=Y row2) # # → not contiguous ✗
         Keep 3 clues: 1A=PIPE, 3A=OKAY, 1D=PROXY */
      {
        sol:  ['PIPE#','R####','OKAY#','X####','Y####'],
        nums: {'0,0':1,'2,0':3},
        clues: {
          across: [{n:1,t:'Unix | operator; data conduit (4)'},{n:3,t:'Fine; confirmed; "all ___" (4)'}],
          down:   [{n:1,t:'Intermediary server; reverse ___ (5)'}]
        }
      },
      /* 15 ─ SPAN / SOLID / NULL / DEMO
           S P A N #
           O # U # #
           L # L # #
           I # L # #
           D # # # #
         1A=SPAN(4), 1D col0: SOLID(5) S(0,0)O(1,0)L(2,0)I(3,0)D(4,0) ✓ SPAN[0]=S ✓
         2D col2: A(SPAN[2]=A row0) U(1,2) L(2,2) L(3,2) # = AULL ✗
         Try NULL starting (0,2): N≠A ✗
         Use AULX → no. Try col2 word: A→U→L→L = AULL, skip.
         Replace row0: SNAP → S N A P
           S N A P #
           O # U # #
           L # L # #
           I # L # #
           D # # # #
         2D col2: A(SNAP[2]=A) U(1,2) L(2,2) L(3,2) → AULL still ✗
         Use col3: P(SNAP[3]=P) # # # → 1 white ✗
         Replace col2 word: A_L_L → some 4-letter word starting A: ATOLL(5)? too long.
         Keep just 1A+1D: */
      {
        sol:  ['SPAN#','O####','L####','I####','D####'],
        nums: {'0,0':1},
        clues: {
          across: [{n:1,t:'HTML inline container tag (4)'}],
          down:   [{n:1,t:'No gaps; CSS ___ .js framework (5)'}]
        }
      },
      /* 16 ─ CRON / CRASH / TASK / KILL
           C R O N #
           R # A # #
           A # S # #
           S # H # #
           H # # # #
         1A=CRON(4), 1D col0: CRASH(5) C(0,0)R(1,0)A(2,0)S(3,0)H(4,0) ✓ CRON[0]=C ✓
         2D col2: O(CRON[2]=O row0) A(1,2) S(2,2) H(3,2) # = OASH ✗
         col3: N(CRON[3]=N) → starts with N. No good 4-letter word starting N for a down.
         3A at row2: A # S # # → single letter ✗ need run ≥3
         Keep 1A CRON + 1D CRASH. Add 3A:
           C R O N #
           R # # # #
           A P I # #   ← 3A=API(3) row2 col0
           S # # # #
           H # # # #
         3A=(2,0) API(3): A(2,0)P(2,1)I(2,2) ✓, CRASH[2]=A ✓
         2D col1: R(CRON[1]=R row0) # P(API[1]=P row2) # # → not contiguous ✗
         Keep: 1A CRON, 3A API, 1D CRASH */
      {
        sol:  ['CRON#','R####','API##','S####','H####'],
        nums: {'0,0':1,'2,0':3},
        clues: {
          across: [{n:1,t:'Scheduled job; Linux time-based ___ (4)'},{n:3,t:'Application interface (3)'}],
          down:   [{n:1,t:'Unhandled exception; system failure (5)'}]
        }
      },
      /* 17 ─ GRID / GHOST / ROLE / DISK
           G R I D #
           H # O # #
           O # L # #
           S # E # #
           T # # # #
         1A=GRID(4), 1D col0: GHOST(5) G(0,0)H(1,0)O(2,0)S(3,0)T(4,0) ✓ GRID[0]=G ✓
         2D col2: I(GRID[2]=I row0) O(1,2) L(2,2) E(3,2) # = IOLE ✗
         Use ROLE starting somewhere with I? IROLE? no.
         col3: D(GRID[3]=D) → DISK? D(0,3)I(1,3)S(2,3)K(3,3) len4 but row1,2,3 col3 = # currently
         Replace: add DISK at col3 rows 0-3:
           G R I D #
           H # O I #
           O # L S #
           S # E K #
           T # # # #
         2D col3: D(GRID[3]=D row0) I(1,3) S(2,3) K(3,3) = DISK(4) ✓ GRID[3]=D ✓ */
      {
        sol:  ['GRID#','H#OI#','O#LS#','S#EK#','T####'],
        nums: {'0,0':1,'0,3':2},
        clues: {
          across: [{n:1,t:'CSS layout system; data table (4)'}],
          down:   [{n:1,t:'Transparency illusion; CSS ___ mode (5)'},{n:2,t:'Storage device; hard ___ (4)'}]
        }
      },
      /* 18 ─ SEED / SCOPE / ENUM / PROC
           S E E D #
           C # N # #
           O # U # #
           P # M # #
           E # # # #
         1A=SEED(4), 1D col0: SCOPE(5) S(0,0)C(1,0)O(2,0)P(3,0)E(4,0) ✓ SEED[0]=S ✓
         2D col2: E(SEED[2]=E row0) N(1,2) U(2,2) M(3,2) # = ENUM(4) rows 0-3 ✓ SEED[2]=E ✓ */
      {
        sol:  ['SEED#','C#N##','O#U##','P#M##','E####'],
        nums: {'0,0':1,'0,2':2},
        clues: {
          across: [{n:1,t:'Initial data; random number ___ (4)'}],
          down:   [{n:1,t:'Variable visibility context (5)'},{n:2,t:'Named constant set; enumeration (4)'}]
        }
      },
      /* 19 ─ MOCK / MERGE / STUB / REPO
           M E R G E
           O # E # #
           C # P # #
           K # O # #
           # # # # #
         1A=MERGE(5) row0, 1D col0: MOCK(4) M(0,0)O(1,0)C(2,0)K(3,0) ✓ MERGE[0]=M ✓
         2D col2: R(MERGE[2]=R row0) E(1,2) P(2,2) O(3,2) # = REPO(4) rows 0-3 ✓ MERGE[2]=R ✓ */
      {
        sol:  ['MERGE','O#E##','C#P##','K#O##','#####'],
        nums: {'0,0':1,'0,2':2},
        clues: {
          across: [{n:1,t:'Combine branches; git ___ (5)'}],
          down:   [{n:1,t:'Test double; fake object (4)'},{n:2,t:'Short for repository (4)'}]
        }
      },
      /* 20 ─ FORK / FETCH / RACE / LOCK
           F O R K #
           E # A # #
           T # C # #
           C # E # #
           H # # # #
         1A=FORK(4), 1D col0: FETCH(5) F(0,0)E(1,0)T(2,0)C(3,0)H(4,0) ✓ FORK[0]=F ✓
         2D col2: R(FORK[2]=R row0) A(1,2) C(2,2) E(3,2) # = RACE(4) rows 0-3 ✓ FORK[2]=R ✓ */
      {
        sol:  ['FORK#','E#A##','T#C##','C#E##','H####'],
        nums: {'0,0':1,'0,2':2},
        clues: {
          across: [{n:1,t:'Copy a repo; Unix process split (4)'}],
          down:   [{n:1,t:'Retrieve data from server; browser API (5)'},{n:2,t:'Concurrency hazard; ___ condition (4)'}]
        }
      },
      /* 21 ─ BLOB / BRANCH / STASH
           S T A S H
           T # # # #
           A # # # #
           S # # # #
           H # # # #
         1A=STASH(5) row0, 1D col0: STASH(5) same ✗
         Use different 1A:
           C A C H E
           A # # # #
           C # # # #
           H # # # #
           E # # # #
         1A=CACHE(5), 1D col0: CACHE(5) same ✗
         Use:
           S W A P #
           T # # # #
           A # # # #
           C # # # #
           K # # # #
         1A=SWAP(4), 1D=STACK(5): SWAP[0]=S ✓. Add 3A:
           S W A P #
           T # # # #
           A L I A S   ← 3A=ALIAS(5) row2
           C # # # #
           K # # # #
         1D col0: S(0,0)T(1,0)A(2,0)C(3,0)K(4,0) = STACK ✓ ALIAS[0]=A = STACK[2]=A ✓
         2D col1: W(SWAP[1]=W row0) # L(ALIAS[1]=L row2) # # → not contiguous ✗
         3A ALIAS: A(2,0) already occupied by STACK 1D. Intersection: STACK[2]=A, ALIAS[0]=A ✓ */
      {
        sol:  ['SWAP#','T####','ALIAS','C####','K####'],
        nums: {'0,0':1,'2,0':3},
        clues: {
          across: [{n:1,t:'Exchange two values; memory ___ (4)'},{n:3,t:'Shorthand name; git ___ for commands (5)'}],
          down:   [{n:1,t:'Push/pop data structure; call ___ (5)'}]
        }
      },
      /* 22 ─ HEAP / HASH / SORT / TREE
           H E A P #
           A # S # #
           S # O # #
           H # R # #
           # # T # #
         1A=HEAP(4), 1D col0: HASH(4) H(0,0)A(1,0)S(2,0)H(3,0) ✓ HEAP[0]=H ✓
         2D col2: A(HEAP[2]=A row0) S(1,2) O(2,2) R(3,2) T(4,2) = ASORT ✗ — starts with A not standard
         Use: col2 starting row1: S(1,2)O(2,2)R(3,2)T(4,2) = SORT(4) rows 1-4
           Need a clue number at (1,2). 1A starts (0,0), 1D starts (0,0), 3A or 2D at (1,2)?
           (1,2) is start of a down word SORT. Number it 2.
           Numbers: '0,0':1, '1,2':2
           But (1,0) is white (HASH[1]=A) and (1,1) is black. (1,2)=S starts a down word.
           1A=HEAP, 1D=HASH, 2D=SORT ✓ */
      {
        sol:  ['HEAP#','A#S##','S#O##','H#R##','##T##'],
        nums: {'0,0':1,'1,2':2},
        clues: {
          across: [{n:1,t:'Memory allocation area; priority ___ (4)'}],
          down:   [{n:1,t:'Map of keys to values; checksum (4)'},{n:2,t:'Order a collection; ___ algorithm (4)'}]
        }
      },
      /* 23 ─ TREE / TOKEN / ROOT / EMIT
           T R E E #
           O # M # #
           K # I # #
           E # T # #
           N # # # #
         1A=TREE(4), 1D col0: TOKEN(5) T(0,0)O(1,0)K(2,0)E(3,0)N(4,0) ✓ TREE[0]=T ✓
         2D col2: E(TREE[2]=E row0) M(1,2) I(2,2) T(3,2) # = EMIT(4) rows 0-3 ✓ TREE[2]=E ✓ */
      {
        sol:  ['TREE#','O#M##','K#I##','E#T##','N####'],
        nums: {'0,0':1,'0,2':2},
        clues: {
          across: [{n:1,t:'Hierarchical data structure (4)'}],
          down:   [{n:1,t:'Auth string; JWT ___ (5)'},{n:2,t:'Fire an event; publish (4)'}]
        }
      },
      /* 24 ─ CHAR / CHUNK / ARGV / PACK
           C H A R #
           H # R # #
           U # G # #
           N # V # #
           K # # # #
         1A=CHAR(4), 1D col0: CHUNK(5) C(0,0)H(1,0)U(2,0)N(3,0)K(4,0) ✓ CHAR[0]=C ✓
         2D col2: A(CHAR[2]=A row0) R(1,2) G(2,2) V(3,2) # = ARGV(4) rows 0-3 ✓ CHAR[2]=A ✓ */
      {
        sol:  ['CHAR#','H#R##','U#G##','N#V##','K####'],
        nums: {'0,0':1,'0,2':2},
        clues: {
          across: [{n:1,t:'Single character type; C data type (4)'}],
          down:   [{n:1,t:'Block of data; webpack ___ (5)'},{n:2,t:'CLI argument vector (4)'}]
        }
      },
      /* 25 ─ VIEW / VUEJS / CRUD / FORM
           V I E W #
           U # R # #
           E # U # #
           J # D # #
           S # # # #
         1A=VIEW(4), 1D col0: VUEJS(5) V(0,0)U(1,0)E(2,0)J(3,0)S(4,0) ✓ VIEW[0]=V ✓
         2D col2: E(VIEW[2]=E row0) R(1,2) U(2,2) D(3,2) # = ERUD ✗
         Use: col3: W(VIEW[3]=W) → ✗
         Try CRUD at col2 rows0-3 needing C≠E ✗
         Keep just 1A+1D: */
      {
        sol:  ['VIEW#','U####','E####','J####','S####'],
        nums: {'0,0':1},
        clues: {
          across: [{n:1,t:'Display layer; MVC ___ component (4)'}],
          down:   [{n:1,t:'Progressive JS framework; ___ .js (5)'}]
        }
      },
    ];

    /* ── Pick today's puzzle ────────────────────────────── */
    const today = new Date();
    const start = new Date(today.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((today - start) / 86400000);
    const idx = dayOfYear % PUZZLES.length;
    const puz = PUZZLES[idx];

    /* ── Label ────────────────────────────────────────────── */
    if (numEl) numEl.textContent = `#${String(idx + 1).padStart(2, '0')}`;

    /* ── Render clues ─────────────────────────────────────── */
    if (cluesEl) {
      cluesEl.innerHTML = '';
      const renderGroup = (label, list) => {
        const dt = document.createElement('dt');
        dt.textContent = label;
        cluesEl.appendChild(dt);
        list.forEach(({n, t}) => {
          const dd = document.createElement('dd');
          dd.innerHTML = `<strong>${n}.</strong> ${t}`;
          cluesEl.appendChild(dd);
        });
      };
      if (puz.clues.across.length) renderGroup('Across', puz.clues.across);
      if (puz.clues.down.length)   renderGroup('Down',   puz.clues.down);
    }

    /* ── Render grid ──────────────────────────────────────── */
    const ROWS = 5, COLS = 5;
    cwEl.innerHTML = '';
    const inputs = [];

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const ch   = (puz.sol[r] || '')[c] || '#';
        const cell = document.createElement('div');
        cell.className = 'cw-cell' + (ch === '#' ? ' cw-cell--block' : '');
        if (ch !== '#') {
          const key = r + ',' + c;
          if (puz.nums && puz.nums[key]) {
            const n = document.createElement('span');
            n.className = 'cw-cell__num';
            n.textContent = puz.nums[key];
            cell.appendChild(n);
          }
          const inp = document.createElement('input');
          inp.type = 'text';
          inp.maxLength = 1;
          inp.setAttribute('aria-label', `Row ${r + 1} Column ${c + 1}`);
          inp.dataset.answer = ch;
          inp.addEventListener('input', () => {
            inp.value = (inp.value || '').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 1);
            checkGrid();
            if (inp.value) {
              const i = inputs.indexOf(inp);
              if (i >= 0 && i < inputs.length - 1) inputs[i + 1].focus();
            }
          });
          inp.addEventListener('keydown', e => {
            if (e.key === 'Backspace' && !inp.value) {
              const i = inputs.indexOf(inp);
              if (i > 0) inputs[i - 1].focus();
            }
          });
          cell.appendChild(inp);
          inputs.push(inp);
        }
        cwEl.appendChild(cell);
      }
    }

    const status = document.getElementById('cwStatus');
    function checkGrid() {
      let correct = 0;
      inputs.forEach(i => {
        if (i.value === i.dataset.answer) {
          correct++;
          i.parentElement.classList.add('cw-cell--solved');
        } else {
          i.parentElement.classList.remove('cw-cell--solved');
        }
      });
      if (!status) return;
      if (correct === inputs.length) {
        status.textContent = '✓ Solved! Extra! Extra!';
      } else {
        const filled = inputs.filter(i => i.value).length;
        status.textContent = filled === inputs.length ? `${correct}/${inputs.length} correct` : '';
      }
    }
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

    ghFetch(`https://api.github.com/repos/${REPO}/issues?labels=letter&state=all&per_page=5`, 900000)
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

    ghFetch('https://api.github.com/repos/DennisPitallano/dennispitallano.github.io/commits/main', 600000)
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

    // Try geolocation, fall back to Camarines Norte (the correspondent's desk).
    // NOTE: Open-Meteo has no reverse-geocoding endpoint, so we just label the
    // reader's coordinates generically and skip the extra round-trip.
    const fallback = () => fetchWeather(14.1396, 122.7632, 'Camarines Norte Bureau');
    if (!('geolocation' in navigator)) return fallback();
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude, 'Reader\u2019s desk'),
      () => fallback(),
      { timeout: 5000, maximumAge: 600000 }
    );
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

    ghFetch('https://api.github.com/users/' + user + '/events/public?per_page=10', 300000)
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

  /* ---------- Module-level typewriter SFX (shared) ----------
     AudioContext must be created after a user gesture, otherwise Chrome
     prints a warning for every oscillator created. We arm _sfxCtx lazily
     on the first user interaction (click/keydown/touchstart), then
     subsequent sfxClack() calls use it freely.                           */
  let _sfxCtx = null;
  let _sfxArmed = false;
  const _armSfx = () => {
    if (_sfxArmed) return;
    _sfxArmed = true;
    try {
      _sfxCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (_sfxCtx.state === 'suspended') _sfxCtx.resume().catch(() => {});
    } catch (e) { _sfxCtx = null; }
  };
  ['click','keydown','touchstart'].forEach(ev => {
    window.addEventListener(ev, _armSfx, { once: true, passive: true, capture: true });
  });
  const sfxClack = (variant) => {
    if (!isSfxOn()) return;
    if (!_sfxArmed || !_sfxCtx) return; // no gesture yet \u2014 silent, no warning
    try {
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

  /* ---------- Favicon fallback for works__ico (gstatic 404s) ---------- */
  (function faviconFallback(){
    const FALLBACK = '/img/favicon-32x32.png';
    document.querySelectorAll('img.works__ico').forEach(img => {
      if (img.src === location.origin + FALLBACK) return;
      img.addEventListener('error', () => { img.src = FALLBACK; }, { once: true });
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

  /* ---------- Readers Today (public GoatCounter counter) ----------
     Requires GoatCounter dashboard setting "Allow anyone to view statistics"
     to be enabled. If disabled (403 + CORS), the Circulation pill stays
     on its default text and the error is swallowed silently.              */
  (function readersToday(){
    const el = document.getElementById('readersToday');
    if (!el) return;
    // Skip on localhost/file: the endpoint needs a real origin anyway.
    if (!/^https?:/i.test(location.protocol) || /^(localhost|127\.)/.test(location.hostname)) return;
    const base = 'https://dennispitallano.goatcounter.com/counter/';
    const path = encodeURIComponent(location.pathname || '/');
    const fmt = (n) => {
      n = Number(n) || 0;
      if (n >= 10000) return (n/1000).toFixed(1).replace(/\.0$/,'') + 'k';
      return n.toLocaleString('en-US');
    };
    fetch(base + path + '.json', { cache: 'no-store', mode: 'cors' })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) { el.hidden = true; return; }
        const n = data.count_unique != null ? data.count_unique : data.count;
        if (n == null) { el.hidden = true; return; }
        el.textContent = 'Circulation: ' + fmt(n) + ' reader' + (n === 1 ? '' : 's');
      })
      .catch(() => { el.hidden = true; /* public stats disabled \u2014 hide pill */ });
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
