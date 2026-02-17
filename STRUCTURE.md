# Project Structure

```
WebDevKursVercel/
├── index.html              # Homepage
├── part1.html              # Del 1: HTML & CSS (15 min)
├── part2.html              # Del 2: JavaScript (15 min)
├── part3.html              # Del 3: React + Vite (30 min)
├── gallery.html            # Project gallery
├── leaderboard.html        # Leaderboard
├── profile.html            # User profile
├── test.html               # Test page
├── vercel.json             # Vercel deployment config
│
├── assets/                 # Static assets
│   ├── css/
│   │   └── styles.css     # Main stylesheet
│   ├── js/
│   │   ├── app.js         # Core app logic & state management
│   │   ├── auth.js        # Authentication service
│   │   ├── database.js    # Supabase database service
│   │   ├── course-part1.js
│   │   ├── course-part2.js
│   │   └── course-part3.js
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
