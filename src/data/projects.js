const gh = (repo) => ({ label: 'GitHub', href: `https://github.com/maxlovesher/${repo}` })

// Optional `url`: the project's own site. When set, tapping the project (or visiting /<slug>)
// redirects there; without it the project gets a page on this site.

export const projects = [
  {
    slug: 'canary',
    name: 'Canary',
    tagline: 'Config-driven red-teaming harness for LLMs, RAG pipelines and agents.',
    description:
      'Attacks a system, measures attack success, and measures how much each defense reduces attacks versus what it costs in normal usefulness. Built from a YAML config with deterministic runs and metrics implemented in the repo. Measured locally on qwen3:4b: a Llama Guard input filter cut attack success from 6% to 1% while false refusals rose from 18% to 31%.',
    tags: ['LLM security', 'Red-teaming', 'Python'],
    links: [gh('Canary')],
  },
  {
    slug: 'ragbench',
    name: 'RAGBench',
    tagline: 'Benchmarking retrieval-augmented generation pipelines.',
    description:
      'Every component (chunker, embedder, retriever, reranker, LLM provider) is a swappable strategy built from one config. Retrieval is scored with self-implemented Recall@K, Precision@K, MRR and nDCG@K; generation is scored with LLM-as-judge faithfulness and relevance.',
    tags: ['RAG', 'Evaluation', 'Python'],
    url: 'https://ragbench-wine.vercel.app/',
    links: [gh('RAGBench')],
  },
  {
    slug: 'velociti',
    name: 'VeloCiTI',
    tagline: 'Vehicle Location and City Traffic Intelligence.',
    description:
      'An AI traffic-management platform for emergency green corridors, adaptive signal control and vehicle intelligence, built as a Smart India Hackathon prototype for Bhubaneswar. Simulates 100 junctions with multi-agent signal control, pre-empts signals ahead of an ambulance, and reads number plates (YOLOv8, OCR) or re-identifies vehicles without plates.',
    tags: ['Computer vision', 'Traffic', 'React', 'Flask'],
    links: [gh('VeloCiTI')],
  },
  {
    slug: 'tapped-in',
    name: 'Tapped In',
    tagline: 'A culture course for your friends, from hip-hop to memes to politics.',
    description:
      'A randomized Culture IQ test, roadmaps of how artists got where they are, five-minute lessons with quizzes, a rank ladder from NPC to Certified Cultured, and accounts so progress follows you across devices.',
    tags: ['Next.js', 'TypeScript', 'Drizzle'],
    url: 'https://tapped-in-tau.vercel.app',
    links: [],
  },
  {
    slug: 'fiilter',
    name: 'fiilter',
    tagline: 'Grade photos and videos with Lightroom-style templates.',
    description:
      'Build a look once and apply it to everything. Runs entirely in the browser on the GPU with WebGL2, so photos and videos never leave your computer. Supports Lightroom panels, tone curves, color grading, .xmp presets and .cube LUTs.',
    tags: ['WebGL2', 'TypeScript', 'Vite'],
    url: 'https://filter-delta-woad.vercel.app',
    links: [gh('filter')],
  },
  {
    slug: 'mochi',
    name: 'Mochi',
    tagline: 'A Windows re-creation of macOS Preview for PDFs and images.',
    description:
      'One lightweight window per document, with page reordering, merge, split and true redaction. Python and PySide6 on top of PyMuPDF, with ONNX-based background removal for images.',
    tags: ['Python', 'PySide6', 'PDF'],
    links: [],
  },
  {
    slug: 'muszi',
    name: 'Muszi',
    tagline: 'A vinyl music player for the web.',
    description:
      'Put a record on and drop the needle anywhere to play from that point. Plays your own files, stored only in your browser, or connects to Spotify. Translucent vinyl marbled from the cover art, a draggable tonearm, surface crackle and a 3D crate.',
    tags: ['Web Audio', 'Spotify', 'Vite'],
    url: 'https://muszi.maxlovesher.com/',
    links: [gh('muszi')],
  },
  {
    slug: 'olap-lab',
    name: 'OLAP Lab',
    tagline: 'An interactive laboratory for understanding OLAP cubes.',
    description:
      'A client-side app that turns a table into a live cube and makes slice, dice, roll-up, drill-down and pivot into direct-manipulation gestures. Every pixel is derived from a real query result.',
    tags: ['TypeScript', 'OLAP', 'Vite'],
    links: [gh('OLapV')],
  },
  {
    slug: 'wexy',
    name: 'Wexy Lyrics',
    tagline: 'Word-by-word synced lyrics for Windows.',
    description:
      'A tray app that reads whatever you are playing and lights each word as it is sung, as a fullscreen idle overlay, a click-through layer or a windowed player.',
    tags: ['Electron', 'JavaScript', 'Windows'],
    links: [],
  },
]
