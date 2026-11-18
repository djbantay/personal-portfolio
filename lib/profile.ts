// Single source of truth for everything about Daniel.
// The desktop UI, the `ask` AI command, project pages and link previews all read from here.

export type Project = { slug: string; name: string; award?: string; blurb: string; tech: string[]; details: string[]; repo?: string; demo?: string };
export type Job = { role: string; org: string; when: string; where: string; bullets: string[] };

export const PROFILE = {
  "name": "Daniel Bantay",
  "handle": "djbantay",
  "title": "Computer Science @ UC Berkeley",
  "avatar": "/me/avatar.gif",
  "location": "Berkeley, CA",
  "bio": "I'm a CS student at UC Berkeley working across ML, data engineering, and full-stack development. I've built ETL pipelines over 1B+ retail transactions, a real-time AI spotter for event photographers, and accessible web interfaces. I like turning messy data and fuzzy problems into things people can actually use.",
  "links": {
    "email": "dj.bantay@berkeley.edu",
    "linkedin": "https://linkedin.com/in/daniel-bantay",
    "github": "https://github.com/djbantay",
    "resume": "/resume.pdf"
  },
  "projects": [
    {
      "name": "Wallflower",
      "award": "Finalist · ~20-team hackathon",
      "blurb": "An AI spotter for solo event photographers. It watches live camera frames and pings your phone when a starred guest appears.",
      "tech": [
        "Python",
        "FastAPI",
        "TypeScript",
        "React",
        "Gemini API",
        "Ollama"
      ],
      "details": [
        "FastAPI backend runs Gemini vision on live camera frames to track starred guests, pushing real-time WebSocket alerts to a React/TypeScript phone app.",
        "Benchmarked 6 Gemini models (picked one with 1.56s median latency, 6/6 accurate), with timeouts and failover to on-device Gemma 4 via Ollama (10/10 correct, no API quota).",
        "Engineered alert rules (2-tick confirmation, cooldowns, feedback-adjusted thresholds) covered by 37 pytest tests, plus a go/no-go webcam test script with explicit pass criteria."
      ],
      "repo": "",
      "demo": "",
      "slug": "wallflower"
    },
    {
      "name": "CampusFlow @ Berkeley",
      "award": "12-person team · 8-week build",
      "blurb": "A campus navigation app with shortcut routing, food discovery, and library crowd tracking.",
      "tech": [
        "Python",
        "Google Maps API",
        "Figma",
        "Git"
      ],
      "details": [
        "Designed 4 core user flows in Figma and worked with a 12-person team to turn them into a working product over an 8-week build.",
        "Led usability testing with 10 students across all 4 flows and synthesized the feedback into design changes the team prioritized.",
        "Built the Python backend integrating the Google Maps API to power shortcut routing, food discovery, and library crowd tracking."
      ],
      "repo": "",
      "demo": "",
      "slug": "campusflow"
    },
    {
      "name": "Mentor Matcher @ Berkeley",
      "award": "",
      "blurb": "A mentor-matching engine with a transparent, capacity-aware compatibility score.",
      "tech": [
        "Python",
        "FastAPI",
        "SQLAlchemy",
        "SQLite",
        "Pydantic"
      ],
      "details": [
        "Ranks mentors on major, shared interests, and first-gen alignment, validated by 6 unit tests covering each scoring rule.",
        "Modeled the two-sided matching, request, and approval flow in a relational schema with SQLAlchemy and SQLite.",
        "REST API with Pydantic validation and bcrypt-hashed passwords for profiles and match requests."
      ],
      "repo": "",
      "demo": "",
      "slug": "mentor-matcher"
    }
  ],
  "experience": [
    {
      "role": "ML & Data Engineering (Contract)",
      "org": "Catalyst Brands",
      "when": "Jan 2026 – May 2026",
      "where": "New York, NY",
      "bullets": [
        "Cut duplication/noise 25% with Python/SQL ETL pipelines in Databricks joining 3 Redshift systems (1B+ transactions, 21.6M customers), credentials secured in AWS Secrets Manager.",
        "Profiled Gen Z customers (top 20% drive ~65% of revenue; ~22% show lapsing signals), focusing the client's retention plan on the mid-tier segment.",
        "Clustered Gen Z customers into 5 personas with K-Means built from scratch on log-scaled RFM, AOV, and coupon features, revealing 71% of discount-dependent shoppers were one-time buyers.",
        "Traced a 99% data loss to systems sharing no customer ID and recommended unified identity resolution before migration, presented to the Chief Enterprise Architect."
      ]
    },
    {
      "role": "Data Analytics (Contract)",
      "org": "Sugar Creek Studio",
      "when": "Sep 2025 – Dec 2025",
      "where": "Chicago, IL",
      "bullets": [
        "Analyzed 500+ UC Berkeley student surveys (75% preferred $75–100 quality/sustainable pieces) and built Tableau dashboards to guide pricing strategy.",
        "Narrowed 100+ micro-influencers to 4 creators (52K–92K followers) by benchmarking engagement, proposing Instagram and TikTok collaboration concepts.",
        "Turned Gen Z research into 4 checkout recommendations (verified reviews, urgency cues, Complete the Look) to reduce friction.",
        "Shipped 2 accessibility-improved website screens meeting WCAG 2.1 AA ahead of the client's relaunch."
      ]
    }
  ],
  "education": {
    "school": "University of California, Berkeley",
    "degree": "B.A. Computer Science",
    "when": "",
    "courses": []
  },
  "personal": {
    "intro": "Off the clock I'm usually on a bouldering wall, in the gym, on a golf course, or hunting for the next great cafe.",
    "hobbies": [
      { "name": "rock climbing", "scene": "climb", "detail": "bouldering", "quip": "falling off walls, recreationally" },
      { "name": "the gym", "scene": "gym", "detail": "", "quip": "git commit -m \"gains\"" },
      { "name": "golf", "scene": "golf", "detail": "favorite course: Franklin Canyon (Hercules)", "quip": "ctrl+z does not work on the course" },
      { "name": "volleyball", "scene": "volley", "detail": "", "quip": "bump, set, ship it" },
      { "name": "fashion & shopping", "scene": "fashion", "detail": "favorite brands: Diesel, Buck Mason", "quip": "fit check before every git push" },
      { "name": "cafes & food", "scene": "cafe", "detail": "top Berkeley spot: Mind Coffee", "quip": "will review your favorite spot, honestly" },
      { "name": "cars & F1", "scene": "car", "detail": "dream car: BMW M4 Competition", "quip": "box box, it's boba o'clock" }
    ],
    "cafes": [
      { "name": "Mind Coffee", "city": "Berkeley", "note": "current #1" }
    ],
    "dessertSpot": "Hui Lau Shan",
    "dreamCar": "BMW M4 Competition",
    "learning": "Mandarin",
    "learningWhy": "I'm learning Mandarin so I can travel in China someday, understand the culture firsthand, and talk with my friends in their language.",
    "photos": [
      { "src": "/me/photos/crew.webp", "caption": "the crew" }
    ],
    "funFacts": [
      "I have a twin brother. Statistically, one of us is the better coder.",
      "I'm learning Mandarin: 你好 (nǐ hǎo) is locked in, the tones are still a work in progress.",
      "My go-to dessert spot in Berkeley is Hui Lau Shan.",
      "Dream car: BMW M4 Competition. Current car: a laptop."
    ]
  },
  "skills": {
    "Languages": [
      "Python",
      "SQL",
      "TypeScript"
    ],
    "Frameworks & Libs": [
      "FastAPI",
      "React",
      "Pydantic",
      "Pandas",
      "SQLAlchemy",
      "Matplotlib",
      "pytest"
    ],
    "Data, Cloud & Tools": [
      "SQLite",
      "AWS Redshift",
      "Databricks",
      "Git",
      "JupyterLab",
      "Tableau",
      "Figma",
      "Excel",
      "boto3"
    ],
    "Concepts": [
      "OOP",
      "Unit Testing",
      "ETL Pipelines",
      "Unsupervised Learning",
      "Model Evaluation",
      "A/B Testing"
    ],
    "AI Tools": [
      "Gemini API",
      "Ollama",
      "GitHub Copilot",
      "Claude",
      "Codex"
    ]
  }
} as {
  name: string; handle: string; title: string; avatar?: string; location: string; bio: string;
  links: { email: string; linkedin: string; github: string; resume: string };
  projects: Project[]; experience: Job[];
  education: { school: string; degree: string; when: string; courses: string[] };
  skills: Record<string, string[]>;
  personal: { intro: string; hobbies: { name: string; scene?: string; detail: string; quip: string }[]; cafes: { name: string; city: string; note: string }[];
    dessertSpot: string; dreamCar: string; learning: string; learningWhy: string; photos: { src: string; caption: string }[]; funFacts: string[] };
};

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");
