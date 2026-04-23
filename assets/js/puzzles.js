/* =========================================================
   Crossword Engine — The Oragon Gazette
   Replaces old word-puzzle implementation.
   ========================================================= */
(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────
     PUZZLE DATA
     Each puzzle has:
       gridStr[]: one string per row, '#' = black, letter = solution
       clues[]:  { number, dir:'A'|'D', row, col, len, answer, clue }
     ───────────────────────────────────────────────────────── */
  const CW_PUZZLES = [
    /* ── Full-size puzzles ───────────────────────────────── */
    {
      id: 'cw-001',
      title: 'The Daily Oragon',
      subtitle: 'No. 1 · General Knowledge',
      difficulty: 'Easy',
      rows: 7, cols: 7,
      gridStr: ['CODER##','L#E#E##','O#V#A##','U#O#D##','D#P#Y##','##S####','#LINUX#'],
      clues: [
        { number: 1, dir: 'A', row: 0, col: 0, len: 5, answer: 'CODER',  clue: 'One who writes programs; a developer' },
        { number: 6, dir: 'A', row: 6, col: 1, len: 5, answer: 'LINUX',  clue: 'Open-source OS kernel by Linus Torvalds' },
        { number: 1, dir: 'D', row: 0, col: 0, len: 5, answer: 'CLOUD',  clue: 'Remote computing infrastructure; Azure is one' },
        { number: 2, dir: 'D', row: 0, col: 2, len: 6, answer: 'DEVOPS', clue: 'Culture uniting development & operations (portmanteau)' },
        { number: 3, dir: 'D', row: 0, col: 4, len: 5, answer: 'READY',  clue: 'State of code prepared for deployment' },
      ],
    },
    {
      id: 'cw-002',
      title: 'The Tech Tribune',
      subtitle: 'No. 2 · Methodology & Frameworks',
      difficulty: 'Easy',
      rows: 8, cols: 9,
      gridStr: ['STACK####','#E#######','#S#######','#T#######','#########','REACT####','####E####','#AGILE###'],
      clues: [
        { number: 1, dir: 'A', row: 0, col: 0, len: 5, answer: 'STACK', clue: 'Push/pop data structure; also a technology set' },
        { number: 5, dir: 'A', row: 5, col: 0, len: 5, answer: 'REACT', clue: "Meta's component-based JavaScript UI library" },
        { number: 6, dir: 'A', row: 7, col: 1, len: 5, answer: 'AGILE', clue: 'Iterative, sprint-based software delivery methodology' },
        { number: 2, dir: 'D', row: 0, col: 1, len: 4, answer: 'TEST',  clue: 'Verify correctness; unit ___ or integration ___' },
      ],
    },
    {
      id: 'cw-003',
      title: 'The Oragon Sunday',
      subtitle: 'No. 3 · Dev Tools & Cloud',
      difficulty: 'Medium',
      rows: 10, cols: 9,
      gridStr: ['DOCKER###','##S######','##H######','##A######','##R######','##P######','#########','AZURE####','#########','GITHUB###'],
      clues: [
        { number: 1, dir: 'A', row: 0, col: 0, len: 6, answer: 'DOCKER', clue: 'Container platform for packaging applications' },
        { number: 5, dir: 'A', row: 7, col: 0, len: 5, answer: 'AZURE',  clue: "Microsoft's cloud computing platform" },
        { number: 6, dir: 'A', row: 9, col: 0, len: 6, answer: 'GITHUB', clue: 'Git repository hosting service owned by Microsoft' },
        { number: 2, dir: 'D', row: 0, col: 2, len: 6, answer: 'CSHARP', clue: "Microsoft's compiled OO language; name uses a musical symbol" },
      ],
    },

    /* ── Mini 5×5 puzzles (No. 4–29) ────────────────────── */
    {
      id: 'cw-004',
      title: 'Code & Cable',
      subtitle: 'No. 4 · Mini',
      difficulty: 'Easy',
      rows: 5, cols: 5,
      gridStr: ['CODE#','A#I##','BUGS#','L#I##','E#T##'],
      clues: [
        { number: 1, dir: 'A', row: 0, col: 0, len: 4, answer: 'CODE',  clue: 'What we write, not prose' },
        { number: 3, dir: 'A', row: 2, col: 0, len: 4, answer: 'BUGS',  clue: 'Not features' },
        { number: 1, dir: 'D', row: 0, col: 0, len: 5, answer: 'CABLE', clue: 'Network tether' },
        { number: 2, dir: 'D', row: 0, col: 2, len: 5, answer: 'DIGIT', clue: 'A finger, or 0–9' },
      ],
    },
    {
      id: 'cw-005',
      title: 'Loop & Link',
      subtitle: 'No. 5 · Mini',
      difficulty: 'Easy',
      rows: 5, cols: 5,
      gridStr: ['LOOP#','I####','NODE#','K####','#####'],
      clues: [
        { number: 1, dir: 'A', row: 0, col: 0, len: 4, answer: 'LOOP', clue: 'Iteration construct; for or while' },
        { number: 3, dir: 'A', row: 2, col: 0, len: 4, answer: 'NODE', clue: 'Server-side JS runtime: ___.js' },
        { number: 1, dir: 'D', row: 0, col: 0, len: 4, answer: 'LINK', clue: 'Hyperlink; chain connection' },
      ],
    },
    {
      id: 'cw-006',
      title: 'Type & Token',
      subtitle: 'No. 6 · Mini',
      difficulty: 'Easy',
      rows: 5, cols: 5,
      gridStr: ['TYPE#','O#A##','KEYS#','E####','N####'],
      clues: [
        { number: 1, dir: 'A', row: 0, col: 0, len: 4, answer: 'TYPE',  clue: 'Variable classification; string, int, bool' },
        { number: 3, dir: 'A', row: 2, col: 0, len: 4, answer: 'KEYS',  clue: 'Keyboard shortcuts; dict ___' },
        { number: 1, dir: 'D', row: 0, col: 0, len: 5, answer: 'TOKEN', clue: 'Access control string for auth' },
        { number: 2, dir: 'D', row: 0, col: 2, len: 3, answer: 'PAY',   clue: 'Compensate; wages' },
      ],
    },
    {
      id: 'cw-007',
      title: 'Port & Proxy',
      subtitle: 'No. 7 · Mini',
      difficulty: 'Easy',
      rows: 5, cols: 5,
      gridStr: ['PORT#','R#E##','O#S##','X#T##','Y####'],
      clues: [
        { number: 1, dir: 'A', row: 0, col: 0, len: 4, answer: 'PORT',  clue: 'TCP/IP door number' },
        { number: 1, dir: 'D', row: 0, col: 0, len: 5, answer: 'PROXY', clue: 'Intermediary server; forward ___' },
        { number: 2, dir: 'D', row: 0, col: 2, len: 4, answer: 'REST',  clue: 'Stateless API style; take a break' },
      ],
    },
    {
      id: 'cw-008',
      title: 'Hook & Boot',
      subtitle: 'No. 8 · Mini',
      difficulty: 'Easy',
      rows: 5, cols: 5,
      gridStr: ['HOOK#','U####','BOOTS','#####','#####'],
      clues: [
        { number: 1, dir: 'A', row: 0, col: 0, len: 4, answer: 'HOOK',  clue: 'React lifecycle helper; ___ into state' },
        { number: 3, dir: 'A', row: 2, col: 0, len: 5, answer: 'BOOTS', clue: 'Startup sequence; to ___ a system' },
        { number: 1, dir: 'D', row: 0, col: 0, len: 3, answer: 'HUB',   clue: 'USB ___; central connector' },
      ],
    },
    {
      id: 'cw-009',
      title: 'Make & Debug',
      subtitle: 'No. 9 · Mini',
      difficulty: 'Easy',
      rows: 5, cols: 5,
      gridStr: ['MAKE#','O####','DEBUG','E####','M####'],
      clues: [
        { number: 1, dir: 'A', row: 0, col: 0, len: 4, answer: 'MAKE',  clue: 'Build tool command; ___ file' },
        { number: 3, dir: 'A', row: 2, col: 0, len: 5, answer: 'DEBUG', clue: 'Find and fix errors in code' },
        { number: 1, dir: 'D', row: 0, col: 0, len: 5, answer: 'MODEM', clue: 'Dial-up hardware; modulator-demodulator' },
      ],
    },
    {
      id: 'cw-010',
      title: 'Blob & Brand',
      subtitle: 'No. 10 · Mini',
      difficulty: 'Easy',
      rows: 5, cols: 5,
      gridStr: ['BLOB#','R####','API##','N####','D####'],
      clues: [
        { number: 1, dir: 'A', row: 0, col: 0, len: 4, answer: 'BLOB',  clue: 'Binary large object; unstructured storage' },
        { number: 3, dir: 'A', row: 2, col: 0, len: 3, answer: 'API',   clue: 'Application programming interface (abbr.)' },
        { number: 1, dir: 'D', row: 0, col: 0, len: 5, answer: 'BRAND', clue: 'Product identity; ___ name' },
      ],
    },
    {
      id: 'cw-011',
      title: 'Lint & Local',
      subtitle: 'No. 11 · Mini',
      difficulty: 'Easy',
      rows: 5, cols: 5,
      gridStr: ['LINT#','O#U##','C#L##','A#L##','L####'],
      clues: [
        { number: 1, dir: 'A', row: 0, col: 0, len: 4, answer: 'LINT',  clue: 'Code style checker tool' },
        { number: 1, dir: 'D', row: 0, col: 0, len: 5, answer: 'LOCAL', clue: 'Not remote; on this machine' },
        { number: 2, dir: 'D', row: 0, col: 2, len: 4, answer: 'NULL',  clue: 'Empty reference; absence of value' },
      ],
    },
    {
      id: 'cw-012',
      title: 'Diff & Defer',
      subtitle: 'No. 12 · Mini',
      difficulty: 'Easy',
      rows: 5, cols: 5,
      gridStr: ['DIFF#','E#O##','F#N##','E#T##','R####'],
      clues: [
        { number: 1, dir: 'A', row: 0, col: 0, len: 4, answer: 'DIFF',  clue: 'Git comparison output; patch file' },
        { number: 1, dir: 'D', row: 0, col: 0, len: 5, answer: 'DEFER', clue: 'Delay execution; Promise.___' },
        { number: 2, dir: 'D', row: 0, col: 2, len: 4, answer: 'FONT',  clue: 'Typeface; CSS ___-family' },
      ],
    },
    {
      id: 'cw-013',
      title: 'Flex & Float',
      subtitle: 'No. 13 · Mini',
      difficulty: 'Easy',
      rows: 5, cols: 5,
      gridStr: ['FLEX#','L####','O####','A####','T####'],
      clues: [
        { number: 1, dir: 'A', row: 0, col: 0, len: 4, answer: 'FLEX',  clue: 'CSS layout mode; display: ___' },
        { number: 1, dir: 'D', row: 0, col: 0, len: 5, answer: 'FLOAT', clue: 'CSS position value; decimal number type' },
      ],
    },
    {
      id: 'cw-014',
      title: 'Open & OAuth',
      subtitle: 'No. 14 · Mini',
      difficulty: 'Easy',
      rows: 5, cols: 5,
      gridStr: ['OPEN#','A#A##','U#C##','T#H##','H####'],
      clues: [
        { number: 1, dir: 'A', row: 0, col: 0, len: 4, answer: 'OPEN',  clue: 'Not closed; public source' },
        { number: 1, dir: 'D', row: 0, col: 0, len: 5, answer: 'OAUTH', clue: 'Auth delegation standard; ___ 2.0' },
        { number: 2, dir: 'D', row: 0, col: 2, len: 4, answer: 'EACH',  clue: 'Every one; ___ of them' },
      ],
    },
    {
      id: 'cw-015',
      title: 'Emit & Event',
      subtitle: 'No. 15 · Mini',
      difficulty: 'Easy',
      rows: 5, cols: 5,
      gridStr: ['EMIT#','V#C##','E#K##','N####','T####'],
      clues: [
        { number: 1, dir: 'A', row: 0, col: 0, len: 4, answer: 'EMIT',  clue: 'Fire an event; pub/sub ___ter' },
        { number: 1, dir: 'D', row: 0, col: 0, len: 5, answer: 'EVENT', clue: 'Browser action; DOM ___' },
        { number: 2, dir: 'D', row: 0, col: 2, len: 3, answer: 'ICK',   clue: 'Exclamation of disgust; also how devs feel about PHP (informal)' },
      ],
    },
    {
      id: 'cw-016',
      title: 'Atom & Async',
      subtitle: 'No. 16 · Mini',
      difficulty: 'Easy',
      rows: 5, cols: 5,
      gridStr: ['ATOM#','S####','Y####','N####','C####'],
      clues: [
        { number: 1, dir: 'A', row: 0, col: 0, len: 4, answer: 'ATOM',  clue: 'Smallest unit; feed format' },
        { number: 1, dir: 'D', row: 0, col: 0, len: 5, answer: 'ASYNC', clue: 'Non-blocking; ___/await pattern' },
      ],
    },
    {
      id: 'cw-017',
      title: 'Push & Sync',
      subtitle: 'No. 17 · Mini',
      difficulty: 'Easy',
      rows: 5, cols: 5,
      gridStr: ['PUSH#','U#Y##','L#N##','L#C##','#####'],
      clues: [
        { number: 1, dir: 'A', row: 0, col: 0, len: 4, answer: 'PUSH', clue: 'Send commits to remote' },
        { number: 1, dir: 'D', row: 0, col: 0, len: 4, answer: 'PULL', clue: 'Fetch down from remote' },
        { number: 2, dir: 'D', row: 0, col: 2, len: 4, answer: 'SYNC', clue: 'Keep in step; ___ronize' },
      ],
    },
    {
      id: 'cw-018',
      title: 'Pipe & Proxy',
      subtitle: 'No. 18 · Mini',
      difficulty: 'Easy',
      rows: 5, cols: 5,
      gridStr: ['PIPE#','R####','OKAY#','X####','Y####'],
      clues: [
        { number: 1, dir: 'A', row: 0, col: 0, len: 4, answer: 'PIPE', clue: 'Unix | operator; data conduit' },
        { number: 3, dir: 'A', row: 2, col: 0, len: 4, answer: 'OKAY', clue: 'Fine; confirmed; "all ___"' },
        { number: 1, dir: 'D', row: 0, col: 0, len: 5, answer: 'PROXY', clue: 'Intermediary server; reverse ___' },
      ],
    },
    {
      id: 'cw-019',
      title: 'Span & Solid',
      subtitle: 'No. 19 · Mini',
      difficulty: 'Easy',
      rows: 5, cols: 5,
      gridStr: ['SPAN#','O####','L####','I####','D####'],
      clues: [
        { number: 1, dir: 'A', row: 0, col: 0, len: 4, answer: 'SPAN',  clue: 'HTML inline container tag' },
        { number: 1, dir: 'D', row: 0, col: 0, len: 5, answer: 'SOLID', clue: 'SOLID principles; no gaps; ___.js framework' },
      ],
    },
    {
      id: 'cw-020',
      title: 'Cron & Crash',
      subtitle: 'No. 20 · Mini',
      difficulty: 'Easy',
      rows: 5, cols: 5,
      gridStr: ['CRON#','R####','API##','S####','H####'],
      clues: [
        { number: 1, dir: 'A', row: 0, col: 0, len: 4, answer: 'CRON',  clue: 'Scheduled job; Linux time-based ___' },
        { number: 3, dir: 'A', row: 2, col: 0, len: 3, answer: 'API',   clue: 'Application interface (abbr.)' },
        { number: 1, dir: 'D', row: 0, col: 0, len: 5, answer: 'CRASH', clue: 'Unhandled exception; system failure' },
      ],
    },
    {
      id: 'cw-021',
      title: 'Grid & Ghost',
      subtitle: 'No. 21 · Mini',
      difficulty: 'Easy',
      rows: 5, cols: 5,
      gridStr: ['GRID#','H#OI#','O#LS#','S#EK#','T####'],
      clues: [
        { number: 1, dir: 'A', row: 0, col: 0, len: 4, answer: 'GRID',  clue: 'CSS layout system; data table' },
        { number: 1, dir: 'D', row: 0, col: 0, len: 5, answer: 'GHOST', clue: 'Transparency illusion; CSS ___ mode' },
        { number: 2, dir: 'D', row: 0, col: 3, len: 4, answer: 'DISK',  clue: 'Storage device; hard ___' },
      ],
    },
    {
      id: 'cw-022',
      title: 'Seed & Scope',
      subtitle: 'No. 22 · Mini',
      difficulty: 'Easy',
      rows: 5, cols: 5,
      gridStr: ['SEED#','C#N##','O#U##','P#M##','E####'],
      clues: [
        { number: 1, dir: 'A', row: 0, col: 0, len: 4, answer: 'SEED',  clue: 'Initial data; random number ___' },
        { number: 1, dir: 'D', row: 0, col: 0, len: 5, answer: 'SCOPE', clue: 'Variable visibility context' },
        { number: 2, dir: 'D', row: 0, col: 2, len: 4, answer: 'ENUM',  clue: 'Named constant set; enumeration' },
      ],
    },
    {
      id: 'cw-023',
      title: 'Merge & Mock',
      subtitle: 'No. 23 · Mini',
      difficulty: 'Medium',
      rows: 5, cols: 5,
      gridStr: ['MERGE','O#E##','C#P##','K#O##','#####'],
      clues: [
        { number: 1, dir: 'A', row: 0, col: 0, len: 5, answer: 'MERGE', clue: 'Combine branches; git ___' },
        { number: 1, dir: 'D', row: 0, col: 0, len: 4, answer: 'MOCK',  clue: 'Test double; fake object' },
        { number: 2, dir: 'D', row: 0, col: 2, len: 4, answer: 'REPO',  clue: 'Short for repository' },
      ],
    },
    {
      id: 'cw-024',
      title: 'Fork & Fetch',
      subtitle: 'No. 24 · Mini',
      difficulty: 'Medium',
      rows: 5, cols: 5,
      gridStr: ['FORK#','E#A##','T#C##','C#E##','H####'],
      clues: [
        { number: 1, dir: 'A', row: 0, col: 0, len: 4, answer: 'FORK',  clue: 'Copy a repo; Unix process split' },
        { number: 1, dir: 'D', row: 0, col: 0, len: 5, answer: 'FETCH', clue: 'Retrieve data from server; browser API' },
        { number: 2, dir: 'D', row: 0, col: 2, len: 4, answer: 'RACE',  clue: 'Concurrency hazard; ___ condition' },
      ],
    },
    {
      id: 'cw-025',
      title: 'Swap & Stack',
      subtitle: 'No. 25 · Mini',
      difficulty: 'Medium',
      rows: 5, cols: 5,
      gridStr: ['SWAP#','T####','ALIAS','C####','K####'],
      clues: [
        { number: 1, dir: 'A', row: 0, col: 0, len: 4, answer: 'SWAP',  clue: 'Exchange two values; memory ___' },
        { number: 3, dir: 'A', row: 2, col: 0, len: 5, answer: 'ALIAS', clue: 'Shorthand name; git ___ for commands' },
        { number: 1, dir: 'D', row: 0, col: 0, len: 5, answer: 'STACK', clue: 'Push/pop data structure; call ___' },
      ],
    },
    {
      id: 'cw-026',
      title: 'Heap & Hash',
      subtitle: 'No. 26 · Mini',
      difficulty: 'Medium',
      rows: 5, cols: 5,
      gridStr: ['HEAP#','A#S##','S#O##','H#R##','##T##'],
      clues: [
        { number: 1, dir: 'A', row: 0, col: 0, len: 4, answer: 'HEAP', clue: 'Memory allocation area; priority ___' },
        { number: 1, dir: 'D', row: 0, col: 0, len: 4, answer: 'HASH', clue: 'Map of keys to values; checksum' },
        { number: 2, dir: 'D', row: 1, col: 2, len: 4, answer: 'SORT', clue: 'Order a collection; ___ algorithm' },
      ],
    },
    {
      id: 'cw-027',
      title: 'Tree & Token',
      subtitle: 'No. 27 · Mini',
      difficulty: 'Medium',
      rows: 5, cols: 5,
      gridStr: ['TREE#','O#M##','K#I##','E#T##','N####'],
      clues: [
        { number: 1, dir: 'A', row: 0, col: 0, len: 4, answer: 'TREE', clue: 'Hierarchical data structure' },
        { number: 1, dir: 'D', row: 0, col: 0, len: 5, answer: 'TOKEN', clue: 'Auth string; JWT ___' },
        { number: 2, dir: 'D', row: 0, col: 2, len: 4, answer: 'EMIT',  clue: 'Fire an event; publish' },
      ],
    },
    {
      id: 'cw-028',
      title: 'Char & Chunk',
      subtitle: 'No. 28 · Mini',
      difficulty: 'Medium',
      rows: 5, cols: 5,
      gridStr: ['CHAR#','H#R##','U#G##','N#V##','K####'],
      clues: [
        { number: 1, dir: 'A', row: 0, col: 0, len: 4, answer: 'CHAR',  clue: 'Single character type; C data type' },
        { number: 1, dir: 'D', row: 0, col: 0, len: 5, answer: 'CHUNK', clue: 'Block of data; webpack ___' },
        { number: 2, dir: 'D', row: 0, col: 2, len: 4, answer: 'ARGV',  clue: 'CLI argument vector' },
      ],
    },
    {
      id: 'cw-029',
      title: 'View & Vue',
      subtitle: 'No. 29 · Mini',
      difficulty: 'Medium',
      rows: 5, cols: 5,
      gridStr: ['VIEW#','U####','E####','J####','S####'],
      clues: [
        { number: 1, dir: 'A', row: 0, col: 0, len: 4, answer: 'VIEW',  clue: 'Display layer; MVC ___ component' },
        { number: 1, dir: 'D', row: 0, col: 0, len: 5, answer: 'VUEJS', clue: 'Progressive JS framework; ___.js' },
      ],
    },
  ];

  /* ═══════════════════════════════════════════════════════
     ENGINE
     ═══════════════════════════════════════════════════════ */
  const STORAGE_KEY = 'cw_progress_v2';

  function saveProgress(id, grid) {
    try {
      const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      all[id] = grid;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    } catch (_) {}
  }

  function loadProgress(id) {
    try {
      const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return all[id] || null;
    } catch (_) { return null; }
  }

  function buildSolutionGrid(puz) {
    return puz.gridStr.map(row => row.split(''));
  }

  function isCompleted(id, sol) {
    const saved = loadProgress(id);
    if (!saved) return false;
    for (let r = 0; r < sol.length; r++)
      for (let c = 0; c < sol[r].length; c++) {
        if (sol[r][c] === '#') continue;
        if ((saved[r]?.[c] || '').toUpperCase() !== sol[r][c]) return false;
      }
    return true;
  }

  /* Build { "r_c": number } map from clue start positions */
  function buildNumberMap(puz) {
    const map = {};
    puz.clues.forEach(cl => {
      const key = `${cl.row}_${cl.col}`;
      if (!map[key]) map[key] = cl.number;
    });
    return map;
  }

  /* ── UI state ── */
  let activePuzzle = null;
  let solutionGrid = null;
  let userGrid     = null;
  let activeCellR  = -1, activeCellC = -1;
  let activeDir    = 'A';

  /* ── DOM refs ── */
  const selectorEl     = document.getElementById('cw-selector');
  const boardEl        = document.getElementById('cw-board');
  const listEl         = document.getElementById('cw-puzzle-list');
  const gridEl         = document.getElementById('cw-grid');
  const titleEl        = document.getElementById('cw-title');
  const subtitleEl     = document.getElementById('cw-subtitle');
  const statusEl       = document.getElementById('cw-status');
  const clueLstA       = document.getElementById('cw-clues-across');
  const clueLstD       = document.getElementById('cw-clues-down');
  const activeclueEl   = document.getElementById('cw-activeclue');
  const activeclueNum  = document.getElementById('cw-activeclue-num');
  const activeclueDir  = document.getElementById('cw-activeclue-dir');
  const activeclueText = document.getElementById('cw-activeclue-text');
  const dateEl         = document.getElementById('cw-date');

  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  /* ── Gallery ── */
  function renderGallery() {
    listEl.innerHTML = '';
    CW_PUZZLES.forEach(puz => {
      const sol  = buildSolutionGrid(puz);
      const done = isCompleted(puz.id, sol);
      const aCount = puz.clues.filter(c => c.dir === 'A').length;
      const dCount = puz.clues.filter(c => c.dir === 'D').length;
      const card = document.createElement('div');
      card.className = 'cw-puzzle-card';
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.innerHTML = `
        <div class="cw-puzzle-card__num">${puz.subtitle}</div>
        <div class="cw-puzzle-card__title">${puz.title}</div>
        <div class="cw-puzzle-card__sub">${puz.rows}&times;${puz.cols} grid &middot; ${aCount} Across, ${dCount} Down</div>
        <span class="cw-puzzle-card__badge${done ? ' cw-puzzle-card__badge--done' : ''}">${puz.difficulty}${done ? ' &middot; Completed' : ''}</span>
        ${done ? '<span class="cw-puzzle-card__status">&#10003; Solved</span>' : ''}
      `;
      card.addEventListener('click', () => openPuzzle(puz));
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPuzzle(puz); }
      });
      listEl.appendChild(card);
    });
  }

  /* ── Open puzzle ── */
  function openPuzzle(puz) {
    activePuzzle = puz;
    solutionGrid = buildSolutionGrid(puz);
    const saved  = loadProgress(puz.id);
    userGrid = puz.gridStr.map((rowStr, r) =>
      rowStr.split('').map((ch, c) =>
        ch === '#' ? '#' : (saved?.[r]?.[c] || '')
      )
    );
    titleEl.textContent    = puz.title;
    subtitleEl.textContent = puz.subtitle;
    selectorEl.hidden = true;
    boardEl.hidden    = false;
    statusEl.textContent = '';
    renderGrid();
    renderClues();
    // Focus first across clue
    const first = [...puz.clues].sort((a,b) => {
      if (a.dir !== b.dir) return a.dir === 'A' ? -1 : 1;
      return a.number - b.number;
    })[0];
    if (first) setActiveCell(first.row, first.col, first.dir);
  }

  /* ── Render grid ── */
  function renderGrid() {
    const puz    = activePuzzle;
    const numMap = buildNumberMap(puz);
    gridEl.style.gridTemplateColumns = `repeat(${puz.cols}, 1fr)`;
    gridEl.innerHTML = '';

    for (let r = 0; r < puz.rows; r++) {
      for (let c = 0; c < puz.cols; c++) {
        const ch   = puz.gridStr[r][c];
        const cell = document.createElement('div');
        if (ch === '#') {
          cell.className = 'cw-cell cw-cell--black';
        } else {
          cell.className = 'cw-cell';
          cell.setAttribute('tabindex', '0');
          cell.setAttribute('aria-label', `Row ${r+1} column ${c+1}`);
          cell.dataset.r = r;
          cell.dataset.c = c;
          const num = numMap[`${r}_${c}`];
          if (num !== undefined) {
            const ns = document.createElement('span');
            ns.className = 'cw-cell__num';
            ns.textContent = num;
            cell.appendChild(ns);
          }
          const ls = document.createElement('span');
          ls.className = 'cw-cell__letter';
          ls.textContent = userGrid[r][c] || '';
          cell.appendChild(ls);
          cell.addEventListener('click', () => onCellClick(r, c));
          cell.addEventListener('keydown', e => onCellKey(e, r, c));
        }
        gridEl.appendChild(cell);
      }
    }
  }

  function getCellEl(r, c) {
    return gridEl.querySelector(`[data-r="${r}"][data-c="${c}"]`);
  }

  /* ── Active cell ── */
  function setActiveCell(r, c, dir) {
    if (activePuzzle.gridStr[r]?.[c] === '#') return;
    activeCellR = r; activeCellC = c; activeDir = dir;
    updateHighlight();
    updateActiveClue();
    getCellEl(r, c)?.focus({ preventScroll: false });
  }

  /* Get all white cells belonging to the word at (r,c) in given dir */
  function getWordCells(r, c, dir) {
    const puz = activePuzzle;
    const cells = [];
    let sr = r, sc = c;
    if (dir === 'A') {
      while (sc > 0 && puz.gridStr[sr][sc - 1] !== '#') sc--;
      while (sc < puz.cols && puz.gridStr[sr][sc] !== '#') { cells.push([sr, sc]); sc++; }
    } else {
      while (sr > 0 && puz.gridStr[sr - 1][sc] !== '#') sr--;
      while (sr < puz.rows && puz.gridStr[sr][sc] !== '#') { cells.push([sr, sc]); sr++; }
    }
    return cells;
  }

  function updateHighlight() {
    gridEl.querySelectorAll('.cw-cell').forEach(el =>
      el.classList.remove('cw-cell--active', 'cw-cell--word')
    );
    getWordCells(activeCellR, activeCellC, activeDir).forEach(([wr, wc]) => {
      getCellEl(wr, wc)?.classList.add('cw-cell--word');
    });
    const aEl = getCellEl(activeCellR, activeCellC);
    if (aEl) { aEl.classList.remove('cw-cell--word'); aEl.classList.add('cw-cell--active'); }

    document.querySelectorAll('.cw-clues__item').forEach(el => el.classList.remove('cw-clues__item--active'));
    const clue = findClueForCell(activeCellR, activeCellC, activeDir);
    if (clue) {
      const clueEl = document.querySelector(`.cw-clues__item[data-dir="${clue.dir}"][data-num="${clue.number}"]`);
      clueEl?.classList.add('cw-clues__item--active');
      clueEl?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  function findClueForCell(r, c, dir) {
    const wc = getWordCells(r, c, dir);
    if (!wc.length) return null;
    const [sr, sc] = wc[0];
    return activePuzzle.clues.find(cl => cl.dir === dir && cl.row === sr && cl.col === sc) || null;
  }

  function updateActiveClue() {
    const clue = findClueForCell(activeCellR, activeCellC, activeDir);
    if (!clue) return;
    activeclueNum.textContent  = clue.number;
    activeclueDir.textContent  = clue.dir === 'A' ? 'Across' : 'Down';
    activeclueText.textContent = clue.clue;
  }

  /* ── Click ── */
  function onCellClick(r, c) {
    if (activePuzzle.gridStr[r][c] === '#') return;
    if (r === activeCellR && c === activeCellC) {
      // Toggle direction if word exists in other direction
      const newDir = activeDir === 'A' ? 'D' : 'A';
      if (getWordCells(r, c, newDir).length > 1) setActiveCell(r, c, newDir);
    } else {
      setActiveCell(r, c, activeDir);
    }
  }

  /* ── Keyboard ── */
  function onCellKey(e, r, c) {
    if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
      e.preventDefault();
      const letter = e.key.toUpperCase();
      userGrid[r][c] = letter;
      const ls = getCellEl(r, c)?.querySelector('.cw-cell__letter');
      if (ls) ls.textContent = letter;
      saveProgress(activePuzzle.id, userGrid);
      advanceCursor(r, c);
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault();
      if (userGrid[r][c]) {
        userGrid[r][c] = '';
        const ls = getCellEl(r, c)?.querySelector('.cw-cell__letter');
        if (ls) ls.textContent = '';
        saveProgress(activePuzzle.id, userGrid);
      } else {
        retreatCursor(r, c);
      }
    } else if (e.key === 'ArrowRight') { e.preventDefault(); moveOrDir(r, c, 0,  1, 'A'); }
      else if (e.key === 'ArrowLeft')  { e.preventDefault(); moveOrDir(r, c, 0, -1, 'A'); }
      else if (e.key === 'ArrowDown')  { e.preventDefault(); moveOrDir(r, c, 1,  0, 'D'); }
      else if (e.key === 'ArrowUp')    { e.preventDefault(); moveOrDir(r, c,-1,  0, 'D'); }
      else if (e.key === 'Tab') {
        e.preventDefault();
        navigateWord(e.shiftKey ? -1 : 1);
      }
  }

  function moveOrDir(r, c, dr, dc, preferDir) {
    const puz = activePuzzle;
    const nr = r + dr, nc = c + dc;
    if (nr >= 0 && nr < puz.rows && nc >= 0 && nc < puz.cols && puz.gridStr[nr][nc] !== '#') {
      setActiveCell(nr, nc, preferDir);
    }
  }

  function advanceCursor(r, c) {
    const puz = activePuzzle;
    if (activeDir === 'A') {
      if (c + 1 < puz.cols && puz.gridStr[r][c + 1] !== '#') setActiveCell(r, c + 1, 'A');
    } else {
      if (r + 1 < puz.rows && puz.gridStr[r + 1]?.[c] !== '#') setActiveCell(r + 1, c, 'D');
    }
  }

  function retreatCursor(r, c) {
    const puz = activePuzzle;
    if (activeDir === 'A') {
      if (c - 1 >= 0 && puz.gridStr[r][c - 1] !== '#') setActiveCell(r, c - 1, 'A');
    } else {
      if (r - 1 >= 0 && puz.gridStr[r - 1]?.[c] !== '#') setActiveCell(r - 1, c, 'D');
    }
  }

  function navigateWord(delta) {
    const clues = [...activePuzzle.clues].sort((a, b) => {
      if (a.dir !== b.dir) return a.dir === 'A' ? -1 : 1;
      return a.number - b.number;
    });
    const cur = findClueForCell(activeCellR, activeCellC, activeDir);
    const idx  = cur ? clues.indexOf(cur) : -1;
    const next = clues[(idx + delta + clues.length) % clues.length];
    if (next) setActiveCell(next.row, next.col, next.dir);
  }

  /* ── Clue list ── */
  function renderClues() {
    const puz = activePuzzle;
    [[puz.clues.filter(c => c.dir === 'A'), clueLstA],
     [puz.clues.filter(c => c.dir === 'D'), clueLstD]].forEach(([list, container]) => {
      container.innerHTML = '';
      [...list].sort((a,b) => a.number - b.number).forEach(cl => {
        const li = document.createElement('li');
        li.className = 'cw-clues__item';
        li.dataset.dir = cl.dir;
        li.dataset.num = cl.number;
        li.innerHTML = `<span class="cw-clues__item__num">${cl.number}</span><span>${cl.clue}</span>`;
        li.addEventListener('click', () => setActiveCell(cl.row, cl.col, cl.dir));
        container.appendChild(li);
      });
    });
  }

  /* ── Check / Reveal / Clear ── */
  document.getElementById('cw-check').addEventListener('click', () => {
    if (!activePuzzle) return;
    let wrong = 0, correct = 0, empty = 0;
    gridEl.querySelectorAll('.cw-cell:not(.cw-cell--black)').forEach(el => {
      el.classList.remove('cw-cell--correct', 'cw-cell--wrong');
      const r = +el.dataset.r, c = +el.dataset.c;
      const entered = (userGrid[r]?.[c] || '').toUpperCase();
      const sol     = solutionGrid[r]?.[c];
      if (!entered) { empty++; return; }
      if (entered === sol) { el.classList.add('cw-cell--correct'); correct++; }
      else                 { el.classList.add('cw-cell--wrong');   wrong++;   }
    });
    statusEl.textContent = wrong === 0 && empty === 0
      ? '✓ Puzzle complete — well done!'
      : `${correct} correct · ${wrong} wrong · ${empty} empty`;
  });

  document.getElementById('cw-reveal').addEventListener('click', () => {
    if (!activePuzzle) return;
    getWordCells(activeCellR, activeCellC, activeDir).forEach(([r, c]) => {
      const sol = solutionGrid[r][c];
      userGrid[r][c] = sol;
      const el = getCellEl(r, c);
      if (el) {
        el.querySelector('.cw-cell__letter').textContent = sol;
        el.classList.remove('cw-cell--wrong');
        el.classList.add('cw-cell--correct');
      }
    });
    saveProgress(activePuzzle.id, userGrid);
    statusEl.textContent = 'Current word revealed.';
  });

  document.getElementById('cw-clear').addEventListener('click', () => {
    if (!activePuzzle) return;
    userGrid.forEach((row, r) => row.forEach((_, c) => {
      if (userGrid[r][c] !== '#') userGrid[r][c] = '';
    }));
    saveProgress(activePuzzle.id, userGrid);
    gridEl.querySelectorAll('.cw-cell:not(.cw-cell--black)').forEach(el => {
      el.classList.remove('cw-cell--correct', 'cw-cell--wrong');
      el.querySelector('.cw-cell__letter').textContent = '';
    });
    statusEl.textContent = 'Grid cleared.';
  });

  document.getElementById('cw-back').addEventListener('click', () => {
    activePuzzle = null;
    boardEl.hidden    = true;
    selectorEl.hidden = false;
    renderGallery();
  });

  /* ── Init ── */
  renderGallery();

  // Support ?puzzle=cw-001 deep link
  const params = new URLSearchParams(location.search);
  const deepId = params.get('puzzle');
  if (deepId) {
    const target = CW_PUZZLES.find(p => p.id === deepId);
    if (target) openPuzzle(target);
  }


})();
