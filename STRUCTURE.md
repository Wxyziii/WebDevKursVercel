# Project Structure

```
WebDevKursVercel/
├── index.html              # Homepage
├── part1.html              # Del 1: HTML & CSS (15 min)
├── part2.html              # Del 2: JavaScript (15 min)
├── part3.html              # Del 3: React + Vite (30 min)
├── part4.html              # Ekstra: Fritt Prosjekt (ubegrenset)
├── gallery.html            # Project gallery
├── leaderboard.html        # Leaderboard
├── profile.html            # User profile
├── admin.html              # Admin panel (user overview, activity status)
├── flag-review.html        # Flag review page (cheat detection details)
├── clear-cache.html        # Cache clearing utility
├── test.html               # Test page
├── test-state.html         # State test page
├── vercel.json             # Vercel deployment config
│
├── assets/                 # Static assets
│   ├── css/
│   │   └── styles.css     # Main stylesheet
│   ├── js/
│   │   ├── app.js         # Core app logic & state management
│   │   ├── auth.js        # Authentication service & cheat detection
│   │   ├── database.js    # Supabase database service
│   │   ├── lang.js        # i18n translations (NO/EN)
│   │   ├── course-part1.js # Part 1 editor & exercises
│   │   ├── course-part2.js # Part 2 editor & exercises
│   │   ├── course-part3.js # Part 3 editor & exercises
│   │   └── course-part4.js # Part 4 free-build editor
│   ├── images/
│   │   ├── CSSModel.png
│   │   ├── DOM.png
│   │   ├── EventFlow.png
│   │   ├── FlexBoxGuide.png
│   │   └── HTMLStructure.png
│   └── Copilot/          # Copilot chat UI
│
├── docs/                  # Documentation
│   ├── README.md
│   └── supbase.txt
│
├── sql/                   # Database setup
│   └── supabase-setup.sql
│
└── config/               # Configuration files (archived)
```

## Deployment

This project is configured for Vercel static site deployment:
- All HTML files are at root level
- Assets are in `/assets/` directory
- `vercel.json` configures routing

To deploy:
```bash
vercel --prod
```

Or push to GitHub and link the repository to Vercel.
