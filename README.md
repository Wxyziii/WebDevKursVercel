# WebDev Kurs - Setup Guide

## 🚀 Sette opp Supabase (10 minutter)

### Steg 1: Opprett Supabase-prosjekt
1. Gå til [supabase.com](https://supabase.com) og logg inn (eller lag konto)
2. Klikk **"New Project"**
3. Velg en organisasjon, gi prosjektet et navn (f.eks. "webdev-kurs")
4. Lag et sterkt database-passord (lagre det!)
5. Velg region nærmest deg (f.eks. Frankfurt)
6. Klikk **"Create new project"** og vent 2 minutter

### Steg 2: Opprett database-tabeller
1. I Supabase Dashboard, gå til **SQL Editor** (venstre meny)
2. Klikk **"New query"**
3. Kopier HELE innholdet fra filen `supabase-setup.sql`
4. Lim inn i SQL Editor
5. Klikk **"Run"** (eller Ctrl+Enter)
6. Du skal se "Success" melding

### Steg 3: Hent API-nøkler
1. Gå til **Settings** → **API** (venstre meny)
2. Under "Project URL", kopier URL-en (ser ut som `https://xxxxx.supabase.co`)
3. Under "Project API keys", kopier **anon/public** key

### Steg 4: Konfigurer nettsiden
1. Åpne filen `database.js`
2. Erstatt linje 7-8 med dine verdier:
```javascript
const SUPABASE_URL = 'https://DIN_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'din_anon_key_her';
```

### Steg 5: Aktiver e-post auth
1. I Supabase, gå til **Authentication** → **Providers**
2. Sjekk at **Email** er aktivert
3. (Valgfritt) Under **Authentication** → **Settings**, kan du:
   - Skru av "Confirm email" for enklere testing
   - Justere "Site URL" til din Vercel URL senere

---

## 🌐 Deploy til Vercel

### Alternativ A: Via GitHub (anbefalt)
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/DITT-BRUKERNAVN/webdev-kurs.git
git push -u origin main
```

Deretter:
1. Gå til [vercel.com](https://vercel.com) og logg inn med GitHub
2. Klikk **"New Project"**
3. Importer GitHub-repoet ditt
4. Klikk **"Deploy"**
5. Ferdig! Du får en URL som `webdev-kurs.vercel.app`

### Alternativ B: Vercel CLI
```bash
npm install -g vercel
vercel
```

---

## 👤 Admin-konto

For å bli admin, registrer deg med e-posten:
```
admin@kurs.no
```

Som admin kan du:
- Slette oppføringer fra leaderboard
- Slette prosjekter fra galleriet
- Se slett-knapper i UI

---

## 📁 Filstruktur

```
├── index.html          # Startside
├── part1.html          # Kurs del 1 (HTML/CSS)
├── part2.html          # Kurs del 2 (JavaScript)
├── leaderboard.html    # Rangering
├── gallery.html        # Prosjektgalleri
├── styles.css          # All styling
├── app.js              # Hoved-app logikk
├── auth.js             # Autentisering & UI
├── database.js         # Supabase tilkobling
├── course-part1.js     # Del 1 kode-editor
├── course-part2.js     # Del 2 kode-editor
├── supabase-setup.sql  # Database oppsett
├── vercel.json         # Vercel konfigurasjon
└── README.md           # Denne filen
```

---

## ⚠️ Viktig

- **IKKE** del `SUPABASE_ANON_KEY` offentlig (selv om den er "anon", er det best practice)
- For produksjon, vurder å bruke Vercel Environment Variables
- Supabase gratis tier har begrensninger, men er nok for et kurs
