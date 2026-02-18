# WebDev Kurs 🌐

A free, self-contained web development course built as a static site and deployed on Vercel. Students learn HTML, CSS, JavaScript, and React through hands-on exercises with a live code editor — no setup required.

## Features

- **3 Course Parts** — HTML & CSS (15 min), JavaScript (15 min), React + Vite (30 min)
- **Monaco Code Editor** — Professional in-browser editor with syntax highlighting and autocomplete
- **Live Preview** — Instant visual feedback as students write code
- **Auto-save** — Progress saved to `localStorage` automatically
- **Progressive Unlock** — Each part unlocks after completing the previous one
- **Cheat Detection** — Tracks keystrokes, code changes, and timing for integrity
- **Leaderboard** — Ranked by completion time with validity badges
- **Project Gallery** — Showcase of student-submitted work
- **🇳🇴/🇬🇧 Language Toggle** — Full Norwegian and English support
- **Auto-clear** — Session resets after 75 minutes

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vanilla HTML, CSS, JavaScript |
| Editor | [Monaco Editor](https://microsoft.github.io/monaco-editor/) (CDN) |
| React (Del 3) | React 18 + Babel standalone via CDN |
| Database | [Supabase](https://supabase.com/) (auth, completions, projects) |
| Hosting | [Vercel](https://vercel.com/) (static site) |
| i18n | Custom `Lang` module with `data-i18n` attributes |

## Project Structure

```
WebDevKursVercel/
├── index.html                # Homepage
├── part1.html                # Del 1: HTML & CSS
├── part2.html                # Del 2: JavaScript
├── part3.html                # Del 3: React + Vite
├── gallery.html              # Project gallery
├── leaderboard.html          # Leaderboard
├── profile.html              # User profile
├── vercel.json               # Vercel deployment config
│
├── assets/
│   ├── css/styles.css        # Main stylesheet
│   ├── js/
│   │   ├── app.js            # Core state management & UI helpers
│   │   ├── lang.js           # i18n translations (NO/EN)
│   │   ├── auth.js           # Supabase authentication
│   │   ├── database.js       # Supabase database service
│   │   ├── course-part1.js   # Part 1 editor & exercises
│   │   ├── course-part2.js   # Part 2 editor & exercises
│   │   └── course-part3.js   # Part 3 editor & exercises
│   └── images/               # Educational diagrams
│
├── sql/                      # Database schema
│   └── supabase-setup.sql
└── docs/                     # Additional documentation
```

## Getting Started

### Local Development

No build step needed — just serve the static files:

```bash
# Using Python
python3 -m http.server 8000

# Using Node.js
npx serve .
```

Then open `http://localhost:8000` in your browser.

### Deploy to Vercel

1. Push the repository to GitHub
2. Import the repo in [Vercel](https://vercel.com/new)
3. Deploy — no build settings needed (static site)

Or via CLI:

```bash
npm i -g vercel
vercel --prod
```

### Database Setup

1. Create a [Supabase](https://supabase.com/) project
2. Run `sql/supabase-setup.sql` in the Supabase SQL editor
3. Update the Supabase URL and anon key in `assets/js/database.js`

## How It Works

1. **Part 1** — Students build a portfolio site learning HTML structure and CSS styling (8 exercises)
2. **Part 2** — Extends the portfolio with JavaScript interactivity: forms, events, DOM manipulation (8 exercises)
3. **Part 3** — Introduces React concepts: components, useState, props, .map(), conditional rendering (8 exercises)

Each part has a timer, exercise checklist, resource panel with diagrams, and a completion modal that unlocks the next part.

## License

This project is for educational purposes.
