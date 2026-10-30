const gh = (repo) => ({ label: 'GitHub', href: `https://github.com/maxlovesher/${repo}` })

// Each project has a case-study page at /<slug>. Optional fields:
//   url        the live site (shown as "Visit live site")
//   kind       what sort of thing it is
//   stats      headline numbers: [{ value, label }]
//   highlights what it does: [{ title, text }]
//   how        how it works, in order
//   stack      technologies used
//   notes      honest caveats
//   status     where the project stands
//   area       filter group on the projects page
//   figure     a visual for the case study: { type, caption, ... } (see components/Figure.jsx)
//   cover      an image shown in the hover preview
//   team       for team projects: { size, context, role? } (role is my part, when it's documented)

export const areas = ['AI', 'Web', 'Desktop']

export const projects = [
  {
    slug: 'canary',
    tint: '#f6e9b0',
    name: 'Canary',
    kind: 'Security tooling',
    area: 'AI',
    // Read off Canary's reports/m6_defenses/tradeoff.svg: [value, low, high] in percent, Wilson 95% CI.
    figure: {
      type: 'tradeoff',
      caption: 'Security versus utility. Lower-left is better. Whiskers are Wilson 95% intervals; n = 100 per condition, proxy judge.',
      x: 'False refusals on benign requests',
      y: 'Attack success rate',
      points: [
        { name: 'No defense', x: [18.4, 12.0, 27.2], y: [6.0, 2.8, 12.5] },
        { name: 'Hardened prompt', x: [69.0, 59.4, 77.2], y: [1.0, 0.2, 5.4] },
        { name: 'Input filter', x: [31.3, 23.0, 41.0], y: [1.0, 0.2, 5.4] },
        { name: 'Output filter', x: [33.3, 24.8, 43.1], y: [5.0, 2.2, 11.2] },
      ],
    },
    tagline: 'Config-driven red-teaming harness for LLMs, RAG pipelines and agents.',
    description:
      'Attacks a system, measures attack success, and measures how much each defense reduces attacks versus what it costs in normal usefulness. Built from a YAML config with deterministic runs and metrics implemented in the repo. Measured locally on qwen3:4b: a Llama Guard input filter cut attack success from 6% to 1% while false refusals rose from 18% to 31%.',
    tags: ['LLM security', 'Red-teaming', 'Python'],
    stats: [
      { value: '6% → 1%', label: 'Attack success with a Llama Guard input filter' },
      { value: '18% → 31%', label: 'False refusals under that filter' },
      { value: '0.2 s', label: 'To reject a harmful request' },
      { value: '100', label: 'Cases per condition (JailbreakBench)' },
    ],
    highlights: [
      {
        title: 'Security versus utility',
        text: 'Every defense is scored twice: how many attacks it stops and how many normal requests it wrongly refuses. A hardened system prompt reached 1% attack success but pushed false refusals from 18% to 69%.',
      },
      {
        title: 'Judges that disagree',
        text: 'Three judges scored the same responses at 6%, 0% and 6%, sharing just one flagged case, with pairwise kappa of 0.00 to 0.11. Tooling for blind human labelling and agreement is built, waiting on labels.',
      },
      {
        title: 'Reproducible runs',
        text: 'Responses are cached in SQLite under a key covering the model digest and the full request, so a read-only run replays exactly. Each run writes its config, manifest, per-attack results and metrics with Wilson 95% intervals.',
      },
      {
        title: 'Small, swappable parts',
        text: 'Targets, attack sources, judges and defenses are small classes with validated parameters, picked by name from a YAML file. The factory checks everything before the first model call.',
      },
    ],
    how: [
      'A YAML config selects a target, attack sources, a judge and defenses.',
      'The runner sends each attack to the target and passes the response to the judge.',
      'Results stream to results.jsonl and roll up into metrics.json.',
      'A static HTML report shows the whole security-versus-utility tradeoff on one page.',
    ],
    stack: ['Python 3.11', 'uv', 'Ollama', 'qwen3:4b', 'Llama Guard', 'JailbreakBench', 'pydantic', 'SQLite'],
    notes:
      'All numbers are measured locally with proxy judges until human labels land. A proxy judge counts any non-refusal as a successful attack, so it overestimates true attack success. Per-category intervals are wide because JailbreakBench has ten behaviours per category.',
    status: 'Milestones 1 and 6 done, 5 built and awaiting labels, 2 partly built',
    links: [gh('Canary')],
  },
  {
    slug: 'ragbench',
    tint: '#cfe0f5',
    name: 'RAGBench',
    kind: 'Evaluation harness',
    area: 'AI',
    figure: {
      type: 'compare',
      caption: 'Retrieval quality at top_k = 3 on 20 documents and 20 labelled queries. Real runs.',
      series: ['Baseline', 'Semantic hybrid'],
      rows: [
        { name: 'Recall@3', values: [1.0, 1.0] },
        { name: 'Precision@3', values: [0.483, 0.75] },
        { name: 'MRR', values: [0.975, 1.0] },
        { name: 'nDCG@3', values: [0.974, 0.98] },
      ],
    },
    tagline: 'Benchmarking retrieval-augmented generation pipelines.',
    description:
      'Every component (chunker, embedder, retriever, reranker, LLM provider) is a swappable strategy built from one config. Retrieval is scored with self-implemented Recall@K, Precision@K, MRR and nDCG@K; generation is scored with LLM-as-judge faithfulness and relevance.',
    tags: ['RAG', 'Evaluation', 'Python'],
    url: 'https://ragbench.maxlovesher.com/',
    stats: [
      { value: '0.483 → 0.750', label: 'Precision@3, baseline to semantic hybrid' },
      { value: '0.975 → 1.000', label: 'MRR, baseline to semantic hybrid' },
      { value: '20 + 20', label: 'Documents and labelled queries' },
      { value: '~36 s', label: 'One-time indexing to embed the corpus' },
    ],
    highlights: [
      {
        title: 'Change one thing, measure the effect',
        text: 'Swap a single stage through the config and see what it did to retrieval and answer quality, with everything else held fixed.',
      },
      {
        title: 'Metrics written from scratch',
        text: 'Recall@K, Precision@K, MRR and nDCG@K are implemented in the repo rather than pulled from a library. Ground truth is tracked at the document level.',
      },
      {
        title: 'Real runs',
        text: 'The semantic hybrid pipeline beat the baseline on every quality metric reported, measured at top_k = 3 on a corpus that includes near-miss distractors.',
      },
      {
        title: 'Interactive pipeline builder',
        text: 'A FastAPI backend drives a pipeline builder in the browser. The deployed page is a static showcase of it.',
      },
    ],
    how: [
      'Chunk: fixed-size, sentence-based or semantic.',
      'Retrieve: BM25, dense, or hybrid with Reciprocal Rank Fusion.',
      'Rerank: none, or a cross-encoder.',
      'Generate: local Hugging Face models, OpenAI or Anthropic.',
      'Evaluate: retrieval metrics plus an LLM judge for faithfulness and relevance.',
    ],
    stack: ['Python', 'FastAPI', 'sentence-transformers', 'Hugging Face transformers', 'BM25', 'Cross-encoders'],
    notes:
      'Recall@3 is tied at 1.000, so the hybrid advantage shows up in precision, MRR and nDCG. Generation and judging used Qwen2.5-0.5B-Instruct, a small local model, so faithfulness scores reflect its limits.',
    links: [gh('RAGBench')],
  },
  {
    slug: 'velociti',
    tint: '#c9ecdc',
    name: 'VeloCiTI',
    kind: 'Smart India Hackathon prototype',
    area: 'AI',
    tagline: 'Vehicle Location and City Traffic Intelligence.',
    description:
      'An AI traffic-management platform for emergency green corridors, adaptive signal control and vehicle intelligence, built as a Smart India Hackathon prototype for Bhubaneswar. Simulates 100 junctions with multi-agent signal control, pre-empts signals ahead of an ambulance, and reads number plates (YOLOv8, OCR) or re-identifies vehicles without plates.',
    tags: ['Computer vision', 'Traffic', 'React', 'Flask'],
    url: 'https://velociti.maxlovesher.com/',
    stats: [
      { value: '100', label: 'Junctions simulated' },
      { value: '24', label: 'Frames analysed per second of webcam video' },
      { value: '60%', label: 'Minimum confidence before a plate is reported' },
      { value: '3', label: 'Vehicle-intelligence modes: live, image, video' },
    ],
    highlights: [
      {
        title: 'Adaptive signal control',
        text: 'A multi-agent traffic simulation (CityFlow) with congestion scoring and manual override across the city.',
      },
      {
        title: 'Emergency green corridor',
        text: 'Routes an ambulance along the fastest path and pre-empts the signals ahead of it.',
      },
      {
        title: 'One dashboard',
        text: 'A live GIS map, city-wide congestion, fleet tracking, analytics and incident response in one place.',
      },
      {
        title: 'Plates and no-plate vehicles',
        text: 'Plated vehicles get the plate and its decoded state and RTO. Vehicles without plates get type, colour, make and model, damage, occupants, clothing and cross-camera re-identification. Fields the model is unsure about are left blank rather than guessed.',
      },
      {
        title: 'Scene-aware video analysis',
        text: 'Upload a clip and get per-vehicle cards plus the conditions detected in the scene: glare, fog, rain and defocus.',
      },
    ],
    how: [
      'Split each second of a webcam feed into 24 frames.',
      'Track vehicles with YOLOv8 and BoT-SORT.',
      'Gate frames on quality with image-quality metrics and a Random Forest.',
      'Read plates with OCR and vote across frames.',
      'Report a plate only if it forms a valid Indian registration with a real state code.',
    ],
    stack: ['React 19', 'Vite', 'Flask', 'CityFlow', 'YOLOv8', 'BoT-SORT', 'EasyOCR', 'CLIP', 'Docker', 'Render'],
    notes:
      'Registration records are simulated: no live Vahan or Parivahan API is connected. Only the state and RTO decoded from the plate are real, and owner details are generated and labelled as simulated in the interface.',
    links: [gh('VeloCiTI')],
  },
  {
    slug: 'fade',
    tint: '#f6d3c8',
    name: 'Fade',
    kind: 'Learning product',
    area: 'Web',
    figure: {
      type: 'ladder',
      caption: 'The rank ladder. The Culture IQ test sets your starting rank; lessons earn Culture Points.',
      unit: 'CP',
      steps: [
        { name: 'NPC', value: 0 },
        { name: 'Casual', value: 200 },
        { name: 'Tapped In', value: 450 },
        { name: 'Plugged', value: 750 },
        { name: 'Tastemaker', value: 1100 },
        { name: 'Certified Cultured', value: 1500 },
      ],
    },
    tagline: 'A culture course for your friends, from hip-hop to memes to politics.',
    description:
      'A randomized Culture IQ test, roadmaps of how artists got where they are, five-minute lessons with quizzes, a rank ladder from NPC to Certified Cultured, and accounts so progress follows you across devices.',
    tags: ['Next.js', 'TypeScript', 'Drizzle'],
    url: 'https://fade.maxlovesher.com/',
    stats: [
      { value: '126', label: 'Test questions' },
      { value: '35', label: 'Lessons across 7 live tracks' },
      { value: '8', label: 'Artist roadmaps' },
      { value: '55', label: 'Glossary terms' },
    ],
    highlights: [
      {
        title: 'Culture IQ test',
        text: 'Twenty random questions give a Culture IQ score and show where you are weak. The test sets your starting rank.',
      },
      {
        title: 'Roadmaps',
        text: 'How artists built their careers, including deals, risks, reinventions and setbacks: Frank Ocean in 17 stops, Ye in 22, Rihanna in 15, Jay-Z in 22.',
      },
      {
        title: 'Seven live tracks',
        text: 'Hip-Hop 101, Beefs and Receipts, Internet Culture, Albums You Must Know, Pop and Global Music, Fashion and Streetwear, and Film and TV. Five more are on the way. Live tracks total about 182 minutes.',
      },
      {
        title: 'Rank ladder and leaderboard',
        text: 'Earn Culture Points to climb from NPC through Casual, Tapped In, Plugged and Tastemaker to Certified Cultured at 1,500 CP, and see who is on top.',
      },
    ],
    how: [
      'Test yourself with 20 random questions.',
      'Follow a roadmap to see how an artist got where they are.',
      'Finish five-minute lessons, each with a quiz, to rank up.',
    ],
    stack: ['Next.js', 'TypeScript', 'Drizzle', 'Vercel'],
    notes: 'Made for the group chat. Facts are checked as of October 2026, and songs and videos open on their official platforms.',
    links: [],
  },
  {
    slug: 'fiilter',
    tint: '#ddd0f7',
    name: 'fiilter',
    kind: 'Creative tool',
    area: 'Web',
    tagline: 'Grade photos and videos with Lightroom-style templates.',
    description:
      'Build a look once and apply it to everything. Runs entirely in the browser on the GPU with WebGL2, so photos and videos never leave your computer. Supports Lightroom panels, tone curves, color grading, .xmp presets and .cube LUTs.',
    tags: ['WebGL2', 'TypeScript', 'Vite'],
    url: 'https://fiilter.maxlovesher.com/',
    stats: [
      { value: '8 × 3', label: 'Colour mixer: 8 colours by hue, saturation, luminance' },
      { value: '0–200%', label: 'Template strength' },
      { value: '3', label: 'Ways in: recipe text, .xmp presets, .cube LUTs' },
      { value: '0', label: 'Bytes uploaded: everything stays on your machine' },
    ],
    highlights: [
      {
        title: 'Every Lightroom panel',
        text: 'Light, Color, Color Mixer, Color Grading with shadow, midtone, highlight and global wheels, Tone Curve (RGB plus R, G and B), Effects and LUT, using Lightroom names and ranges.',
      },
      {
        title: 'Type a recipe in',
        text: 'Paste text such as “Exposure +0.6, Contrast -30, Orange: Hue +13” and it becomes a template. Lightroom .xmp presets and fiilter template files import too.',
      },
      {
        title: 'Reuse across everything',
        text: 'Drop in any number of photos and videos, click a template, and each gets the look. Hover to preview, copy and paste settings between items, or apply one edit to all.',
      },
      {
        title: 'Video',
        text: 'MP4, MOV and WebM play back graded live. Trim with start and end markers; the export keeps only that part, encodes MP4 and keeps the original sound.',
      },
      {
        title: 'Export as a LUT',
        text: 'Turn any template into a .cube LUT for CapCut, Premiere, VN, Resolve or phone apps. LUTs hold colour only, so grain, clarity, texture, dehaze and vignette cannot be part of one.',
      },
      {
        title: 'Editing comforts',
        text: 'Undo and redo, before/after split view, hold backslash to see the original, a histogram, and full-resolution JPG or PNG export as a ZIP or straight into a folder.',
      },
    ],
    how: [
      'The whole develop pipeline is one GLSL fragment shader.',
      'A WebGL2 renderer manages the source texture, a blur pyramid, a curve LUT and a 3D LUT.',
      'Video is graded frame by frame and encoded to MP4.',
      'A look can be baked into a .cube LUT.',
    ],
    stack: ['WebGL2', 'GLSL', 'TypeScript', 'Vite', 'mediabunny', 'libheif'],
    notes:
      'The maths is modelled on Lightroom, not copied from it, so the same numbers give a very similar look that sometimes needs a small nudge. iPhone HEIC photos are converted automatically; RAW files are not supported.',
    links: [gh('filter')],
  },
  {
    slug: 'mochi',
    tint: '#f8d5e1',
    name: 'Mochi',
    kind: 'Desktop app',
    area: 'Desktop',
    tagline: 'A Windows re-creation of macOS Preview for PDFs and images.',
    description:
      'One lightweight window per document, with page reordering, merge, split and true redaction. Python and PySide6 on top of PyMuPDF, with ONNX-based background removal for images.',
    tags: ['Python', 'PySide6', 'PDF'],
    highlights: [
      {
        title: 'Preview’s model',
        text: 'Every document is its own compact window on your real desktop, with a unified toolbar, rather than one big in-app canvas. Pages can be dragged between windows.',
      },
      {
        title: 'True redaction',
        text: 'Built on PyMuPDF redaction with scrubbing and a garbage-collected save, because getting redaction wrong leaks data.',
      },
      {
        title: 'Pages and files',
        text: 'Reorder, merge and split PDFs, with HEIC and AVIF photos opened through pillow-heif.',
      },
      {
        title: 'Background removal',
        text: 'ONNX Runtime on the CPU runs IS-Net or BiRefNet-lite models that are downloaded on first use.',
      },
    ],
    how: [
      'PyMuPDF renders and edits PDFs. It holds the GIL and is not thread-safe, so rendering is time-sliced or handled by worker processes.',
      'PySide6 supplies the windows, drag and drop, and the Windows 11 look.',
      'Documents keep a version store under %LOCALAPPDATA%\\Mochi.',
    ],
    stack: ['Python 3.12', 'PySide6', 'Qt 6', 'PyMuPDF', 'ONNX Runtime', 'Pillow', 'OpenCV', 'PyInstaller'],
    notes: 'A personal project aimed at being used every day and at understanding how a document reader works under the hood.',
    links: [],
  },
  {
    slug: 'muszi',
    tint: '#e2dccb',
    name: 'Muszi',
    kind: 'Web audio',
    area: 'Web',
    tagline: 'A vinyl music player for the web.',
    description:
      'Put a record on and drop the needle anywhere to play from that point. Plays your own files, stored only in your browser, or connects to Spotify. Translucent vinyl marbled from the cover art, a draggable tonearm, surface crackle and a 3D crate.',
    tags: ['Web Audio', 'Spotify', 'Vite'],
    url: 'https://muszi.maxlovesher.com/',
    stats: [
      { value: '5', label: 'File types: MP3, FLAC, WAV, M4A, OGG' },
      { value: '33⅓ / 45', label: 'RPM speeds' },
      { value: '0', label: 'Files uploaded: your crate stays in your browser' },
    ],
    highlights: [
      {
        title: 'A crate of sleeves',
        text: 'Add songs or whole album folders by drag and drop. Cover art and titles are read from the files’ tags, and there are Albums and Playlists tabs plus a queue view.',
      },
      {
        title: 'The turntable',
        text: 'Pick clear, cover or coloured vinyl, change label placement and speed, and switch surface crackle on or off. The vinyl is marbled from the cover art.',
      },
      {
        title: 'Spotify too',
        text: 'Connect Spotify to play saved albums and playlists, either in the browser or by remote-controlling the Spotify app. You can use your own Client ID.',
      },
    ],
    stack: ['Web Audio', 'Spotify Web API', 'Web Playback SDK', 'Vite', 'GitHub Pages'],
    notes: 'Inspired by MD Vinyl. Spotify playback needs Premium, and development-mode Spotify apps allow up to five users.',
    links: [gh('muszi')],
  },
  {
    slug: 'olap-lab',
    tint: '#c8e8ec',
    name: 'OLAP Lab',
    kind: 'Teaching tool',
    area: 'Web',
    tagline: 'An interactive laboratory for understanding OLAP cubes.',
    description:
      'A client-side app that turns a table into a live cube and makes slice, dice, roll-up, drill-down and pivot into direct-manipulation gestures. Every pixel is derived from a real query result.',
    tags: ['TypeScript', 'OLAP', 'Vite'],
    url: 'https://olap.maxlovesher.com/',
    stats: [
      { value: '7', label: 'Operations: slice, dice, roll-up, drill-down, pivot, filter, aggregate' },
      { value: '2', label: 'Built-in datasets: sales and university' },
      { value: '0', label: 'Faked states: animations only interpolate real ones' },
    ],
    highlights: [
      {
        title: 'Truth over spectacle',
        text: 'The picture is always a rendering of an actual query result from a real engine. Animations move between two real states and never invent one.',
      },
      {
        title: 'Query shelf',
        text: 'The current query is always on screen as rows, columns, filters and measures. A slice is a pinned member; a dice keeps a set of members. You can see which is which.',
      },
      {
        title: 'Concept and values together',
        text: 'A 3D cube and a pivot table sit side by side and are cross-highlighted, so the shape and the numbers stay linked.',
      },
      {
        title: 'Explains itself',
        text: 'Every operation is explained in place using the cells you just touched, with the SQL equivalent. The inspector shows which source rows built a cell.',
      },
      {
        title: 'Timeline and import',
        text: 'A timeline works as undo stack, history and replay. Bring your own data from CSV or JSON, with schema inference you review first. A guided tour and challenges teach the vocabulary.',
      },
    ],
    how: [
      'Facts are dictionary-encoded in columns and rolled up through each hierarchy into a sparse cell store.',
      'A query is rows, columns, filters, measures and granularity.',
      'The engine records cell lineage so transitions can show exactly where each cell came from.',
    ],
    stack: ['TypeScript', 'React 19', 'Three.js', 'React Three Fiber', 'Zustand', 'Vite', 'Vitest'],
    notes: 'A client-side lab, not a BI dashboard. No sign-in, no server and no connection to real OLAP servers.',
    links: [gh('OLapV')],
  },
  {
    slug: 'wexy',
    tint: '#fbdcc2',
    name: 'Wexy Lyrics',
    kind: 'Desktop app',
    area: 'Desktop',
    cover: '/media/wexy/06.webp',
    figure: {
      type: 'flipbook',
      caption: 'The Ship style: each word lights as it is sung, then drifts away in 3D.',
      frames: Array.from({ length: 12 }, (_, i) => `/media/wexy/${String(i + 1).padStart(2, '0')}.webp`),
    },
    tagline: 'Word-by-word synced lyrics for Windows.',
    description:
      'A tray app that reads whatever you are playing and lights each word as it is sung, as a fullscreen idle overlay, a click-through layer or a windowed player.',
    tags: ['Electron', 'JavaScript', 'Windows'],
    stats: [
      { value: '5', label: 'Lyric styles' },
      { value: '3', label: 'Display modes' },
      { value: 'Ctrl+Alt+L', label: 'Hide or show lyrics from anywhere' },
    ],
    highlights: [
      {
        title: 'Reads anything playing',
        text: 'Spotify, Apple Music, YouTube in a browser, or anything that shows up in the Windows media overlay.',
      },
      {
        title: 'Three ways to show it',
        text: 'A fullscreen overlay when idle, like a screensaver, with an option to lock the PC when dismissed. An always-on click-through overlay. Or a windowed player with an RGB edge light of glowing comets.',
      },
      {
        title: 'Five styles',
        text: 'Ship drifts words away in 3D. Fisheye puts lines under a WebGL lens. Fisheye Visual, Visual and Word Stack add emoji icons beside matching words. Colours are set by hand or synced from the album art.',
      },
    ],
    how: [
      'A PowerShell script reads the Windows media session and streams title, artist, position and album art.',
      'Time-synced lyrics come from LRCLIB, which is free and needs no key.',
      'Line times are real. Word times are estimated inside each line unless the lyric file carries real per-word tags.',
      'A canvas draws everything, with the fisheye running through a WebGL shader.',
    ],
    stack: ['Electron', 'JavaScript', 'WebGL', 'PowerShell', 'LRCLIB'],
    notes:
      'Windows does not let third-party apps draw on the real lock screen, so the overlay works like a screensaver. Songs without synced lyrics show the title and artist only.',
    links: [],
  },
  {
    slug: 'glucotwin',
    tint: '#f6cfcf',
    name: 'GlucoTwin',
    kind: 'Healthcare AI',
    area: 'AI',
    team: { size: 3, context: 'Digital Twin Challenge 2026, Happiest Health' },
    tagline: 'A digital twin that warns of glucose spikes and lows in Type 2 Diabetes.',
    description:
      'Keeps a personalised physiological twin of each person with Type 2 Diabetes in sync with their health record and live wearables. It warns of a glucose spike up to about an hour before it happens and of dangerous lows, explains why, and lets a doctor and patient test what-if changes on the patient’s own simulated body.',
    tags: ['Digital twin', 'ML', 'Streamlit'],
    url: 'https://glucotwin-kiit.streamlit.app/',
    stats: [
      { value: '0.888', label: 'Spike-prediction AUROC on 96 real patients' },
      { value: '0.901', label: 'Low-glucose AUROC on real patients' },
      { value: '75 min', label: 'Median warning before a spike (synthetic cohort)' },
      { value: '13.5 vs 25.5', label: '30-min forecast error in mg/dL, ours vs no change' },
    ],
    highlights: [
      {
        title: 'A real twin, not just a classifier',
        text: 'Each patient gets a personalised glucose–insulin model that starts from the health record, is calibrated on their first week and stays in sync with every CGM reading. That is what makes what-if simulation possible.',
      },
      {
        title: 'Checked on real patients',
        text: 'Validated on 96 people with Type 2 Diabetes from the open ShanghaiT2DM dataset, with person-grouped cross-validation and bootstrap intervals. A model trained only on synthetic data still reached 0.842 AUROC on them.',
      },
      {
        title: 'Both directions of danger',
        text: 'Predicts spikes above 180 mg/dL and lows below 70 mg/dL, with alerts scored like phone notifications: spikes caught, warning time and false alarms per day.',
      },
      {
        title: 'Built for India',
        text: 'Indian meal presets such as rice and sambar, ragi mudde, dosa and biryani, a Hindi and English patient screen, and FHIR R4 export for ABDM.',
      },
      {
        title: 'Honest about what failed',
        text: 'The write-up reports what did not work: twin features add no accuracy, static health-record data slightly hurt on real data, and the physics-only twin forecasts worse than no change on real patients.',
      },
    ],
    how: [
      'A mechanistic twin (an extended Bergman minimal model) is personalised from the health record and the first week of data, then updated every 5 minutes from the CGM.',
      'About 100 strictly causal features fuse glucose trend, routine, meals, activity, heart rate and HRV, sleep and the twin’s own state.',
      'Gradient-boosted models predict the chance of a spike in the next 2 hours and forecast glucose at 30, 60 and 120 minutes, with plain-language drivers.',
      'A real-time API registers a patient, streams readings, calibrates the twin and exports to FHIR.',
    ],
    stack: ['Python', 'NumPy', 'SciPy', 'Numba', 'scikit-learn', 'FastAPI', 'Streamlit', 'Plotly', 'Docker'],
    notes:
      'The headline cohort is synthetic: 120 simulated Indian patients over 28 days. Real-patient results come from the open ShanghaiT2DM dataset (CC BY 4.0). The free demo may need a minute to wake up.',
    links: [gh('twin_KIIT')],
  },
  {
    slug: 'storesense',
    tint: '#d9ebc4',
    name: 'StoreSense',
    kind: 'Data warehouse',
    area: 'AI',
    team: { size: 6, context: 'Data Mining & Data Warehousing course, KIIT', role: 'the data and ETL lead' },
    tagline: 'A retail data warehouse and market-basket analysis of Instacart orders.',
    description:
      'Builds a star-schema data warehouse from the Instacart grocery dataset and mines it to find which products are bought together, what kinds of customers exist, and when and what people buy. The results are shown in a Streamlit dashboard.',
    tags: ['Data mining', 'DuckDB', 'Streamlit'],
    url: 'https://storesense.streamlit.app/',
    stats: [
      { value: '~700 MB', label: 'Instacart order data' },
      { value: '2', label: 'Rule miners compared: Apriori and FP-Growth' },
      { value: '3', label: 'Analyses: basket rules, segments, OLAP' },
    ],
    highlights: [
      {
        title: 'A proper warehouse',
        text: 'An ETL pipeline extracts, transforms, loads and validates six raw CSVs into a DuckDB star schema, with tests for row counts and key integrity.',
      },
      {
        title: 'What sells together',
        text: 'Association rules mined with both Apriori and FP-Growth, with a benchmark comparing the two.',
      },
      {
        title: 'Who the customers are',
        text: 'K-Means segmentation on RFM features. The dataset has no prices, so basket size stands in for the monetary part.',
      },
      {
        title: 'When people shop',
        text: 'OLAP queries with ROLLUP and CUBE over day of week, hour and department.',
      },
    ],
    how: [
      'Extract, transform and load the raw CSVs into a DuckDB star schema, then validate it.',
      'Run OLAP queries, association-rule mining and customer segmentation on the warehouse.',
      'Save the results and show them in a Streamlit dashboard.',
    ],
    stack: ['Python', 'DuckDB', 'SQL', 'Apriori', 'FP-Growth', 'K-Means', 'Streamlit', 'pytest'],
    notes:
      'The dataset has no prices and no calendar dates: only day of week, hour and days since the previous order, capped at 30.',
    links: [gh('StoreSense')],
  },
]
