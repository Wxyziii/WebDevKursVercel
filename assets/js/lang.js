// ========================================
// INTERNATIONALIZATION (i18n)
// ========================================

const Lang = {
    STORAGE_KEY: 'webdev_lang',
    currentLang: 'no',

    translations: {
        // ========== NAVBAR ==========
        'nav.home': { no: 'Hjem', en: 'Home' },
        'nav.part1': { no: 'Del 1', en: 'Part 1' },
        'nav.part2': { no: 'Del 2', en: 'Part 2' },
        'nav.part3': { no: 'Del 3', en: 'Part 3' },
        'nav.part4': { no: 'Ekstra', en: 'Extra' },
        'nav.leaderboard': { no: 'Rangering', en: 'Leaderboard' },
        'nav.gallery': { no: 'Galleri', en: 'Gallery' },
        'nav.login': { no: 'Logg inn', en: 'Log in' },
        'nav.logout': { no: 'Logg ut', en: 'Log out' },

        // ========== INDEX PAGE ==========
        'index.badge': { no: 'Gratis Kurs', en: 'Free Course' },
        'index.title1': { no: 'Lær Webutvikling', en: 'Learn Web Development' },
        'index.title2': { no: 'fra Bunnen av', en: 'from Scratch' },
        'index.desc': {
            no: 'Et komplett, selvforklarende kurs i HTML, CSS og JavaScript. Ingen forkunnskaper nødvendig – alt du trenger er 60 minutter og nysgjerrighet.',
            en: 'A complete, self-explanatory course in HTML, CSS and JavaScript. No prior knowledge needed – all you need is 60 minutes and curiosity.'
        },
        'index.stat.parts': { no: 'Deler', en: 'Parts' },
        'index.stat.minutes': { no: 'Minutter', en: 'Minutes' },
        'index.stat.possibilities': { no: 'Muligheter', en: 'Possibilities' },
        'index.startCourse': { no: 'Start Kurset', en: 'Start Course' },
        'index.whatYouLearn': { no: 'Hva du vil lære', en: 'What you will learn' },
        'index.part1.title': { no: 'Del 1: HTML & CSS Grunnlag', en: 'Part 1: HTML & CSS Basics' },
        'index.part1.desc': {
            no: 'Lær strukturen til nettsider med HTML og gi dem stil med CSS. Perfekt for nybegynnere.',
            en: 'Learn the structure of web pages with HTML and style them with CSS. Perfect for beginners.'
        },
        'index.part1.item1': { no: 'HTML-elementer og struktur', en: 'HTML elements and structure' },
        'index.part1.item2': { no: 'CSS styling og farger', en: 'CSS styling and colors' },
        'index.part1.item3': { no: 'Layout med Flexbox', en: 'Layout with Flexbox' },
        'index.part1.item4': { no: 'Bygg din første nettside', en: 'Build your first website' },
        'index.part1.duration': { no: '⏱️ 15 minutter', en: '⏱️ 15 minutes' },
        'index.part1.start': { no: 'Start Del 1', en: 'Start Part 1' },
        'index.part2.title': { no: 'Del 2: Interaktiv JavaScript', en: 'Part 2: Interactive JavaScript' },
        'index.part2.desc': {
            no: 'Gjør nettsiden din levende med JavaScript. Lag interaktive elementer og dynamisk innhold.',
            en: 'Bring your website to life with JavaScript. Create interactive elements and dynamic content.'
        },
        'index.part2.item1': { no: 'JavaScript grunnleggende', en: 'JavaScript basics' },
        'index.part2.item2': { no: 'DOM-manipulering', en: 'DOM manipulation' },
        'index.part2.item3': { no: 'Event handling', en: 'Event handling' },
        'index.part2.item4': { no: 'Bygg en komplett webapp', en: 'Build a complete web app' },
        'index.part2.duration': { no: '⏱️ 15 minutter', en: '⏱️ 15 minutes' },
        'index.part2.locked': { no: '🔒 Lås opp med Del 1', en: '🔒 Unlock with Part 1' },
        'index.part3.title': { no: 'Del 3: React + Vite', en: 'Part 3: React + Vite' },
        'index.part3.desc': {
            no: 'Bygg moderne webapper med React og Vite. Lær komponent-basert utvikling og state management.',
            en: 'Build modern web apps with React and Vite. Learn component-based development and state management.'
        },
        'index.part3.item1': { no: 'React-komponenter og JSX', en: 'React components and JSX' },
        'index.part3.item2': { no: 'useState og state management', en: 'useState and state management' },
        'index.part3.item3': { no: 'Props og barnkomponenter', en: 'Props and child components' },
        'index.part3.item4': { no: 'Bygg en komplett React-app', en: 'Build a complete React app' },
        'index.part3.duration': { no: '⏱️ 30 minutter', en: '⏱️ 30 minutes' },
        'index.part3.locked': { no: '🔒 Lås opp med Del 2', en: '🔒 Unlock with Part 2' },
        'index.features.title': { no: 'Kursfunksjoner', en: 'Course Features' },
        'index.features.editor': { no: 'Live Kode-editor', en: 'Live Code Editor' },
        'index.features.editorDesc': {
            no: 'Skriv kode direkte i nettleseren med en profesjonell Monaco Editor.',
            en: 'Write code directly in the browser with a professional Monaco Editor.'
        },
        'index.features.preview': { no: 'Sanntids Preview', en: 'Real-time Preview' },
        'index.features.previewDesc': {
            no: 'Se endringene dine umiddelbart mens du koder.',
            en: 'See your changes instantly as you code.'
        },
        'index.features.autosave': { no: 'Auto-lagring', en: 'Auto-save' },
        'index.features.autosaveDesc': {
            no: 'Koden din lagres automatisk slik at du kan fortsette hvor du slapp.',
            en: 'Your code is saved automatically so you can continue where you left off.'
        },
        'index.features.media': { no: 'Video & Bilder', en: 'Video & Images' },
        'index.features.mediaDesc': {
            no: 'Multimedia-innhold som forklarer konseptene visuelt.',
            en: 'Multimedia content that explains concepts visually.'
        },
        'index.footer': { no: '© 2026 WebDev Kurs. Laget for å lære.', en: '© 2026 WebDev Course. Made for learning.' },

        // ========== COURSE COMMON ==========
        'course.exercises': { no: 'Oppgaver', en: 'Exercises' },
        'course.resources': { no: 'Ressurser', en: 'Resources' },
        'course.save': { no: '💾 Lagre', en: '💾 Save' },
        'course.saveProject': { no: '📁 Lagre prosjekt', en: '📁 Save project' },
        'course.reset': { no: '↺ Tilbakestill', en: '↺ Reset' },
        'course.download': { no: '⬇ Last ned', en: '⬇ Download' },
        'course.livePreview': { no: 'Live Preview', en: 'Live Preview' },
        'course.backHome': { no: 'Tilbake til Hjem', en: 'Back to Home' },

        // ========== PART 1 ==========
        'part1.title': { no: 'Del 1: HTML & CSS Grunnlag', en: 'Part 1: HTML & CSS Basics' },
        'part1.subtitle': { no: 'Lær å bygge og style nettsider fra bunnen av', en: 'Learn to build and style websites from scratch' },
        'part1.complete': { no: '✓ Fullfør Del 1', en: '✓ Complete Part 1' },
        'part1.completedTitle': { no: 'Del 1 Fullført!', en: 'Part 1 Complete!' },
        'part1.completedMsg': {
            no: 'Gratulerer! Du har lært grunnleggende HTML og CSS. Nå er du klar for å ta det neste steget og lære JavaScript i Del 2.',
            en: 'Congratulations! You have learned basic HTML and CSS. Now you are ready to take the next step and learn JavaScript in Part 2.'
        },
        'part1.startPart2': { no: 'Start Del 2 →', en: 'Start Part 2 →' },
        'part1.ex1.title': { no: 'Sett opp strukturen', en: 'Set up the structure' },
        'part1.ex1.desc': {
            no: 'Vi skal bygge en personlig portfolio-side! Start med å lage grunnstrukturen med en <code>&lt;header&gt;</code>, <code>&lt;main&gt;</code> og <code>&lt;footer&gt;</code>.',
            en: 'We are building a personal portfolio site! Start by creating the basic structure with a <code>&lt;header&gt;</code>, <code>&lt;main&gt;</code> and <code>&lt;footer&gt;</code>.'
        },
        'part1.ex2.title': { no: 'Header med navn', en: 'Header with name' },
        'part1.ex2.desc': { no: 'Headeren skal inneholde navnet ditt og en kort tittel/beskrivelse.', en: 'The header should contain your name and a short title/description.' },
        'part1.ex3.title': { no: 'Om meg-seksjon', en: 'About me section' },
        'part1.ex3.desc': { no: 'Lag en seksjon som forteller litt om deg selv.', en: 'Create a section that tells a little about yourself.' },
        'part1.ex4.title': { no: 'Ferdigheter-liste', en: 'Skills list' },
        'part1.ex4.desc': { no: 'Vis frem ferdighetene dine i en liste.', en: 'Show off your skills in a list.' },
        'part1.ex5.title': { no: 'Style headeren (CSS)', en: 'Style the header (CSS)' },
        'part1.ex5.desc': { no: 'Nå skal vi style! Bytt til <strong>style.css</strong>-fanen.', en: 'Now let\'s style! Switch to the <strong>style.css</strong> tab.' },
        'part1.ex6.title': { no: 'Style body og seksjonene', en: 'Style body and sections' },
        'part1.ex6.desc': { no: 'Gi siden en fin bakgrunn og style seksjonene.', en: 'Give the page a nice background and style the sections.' },
        'part1.ex7.title': { no: 'Footer med kontaktinfo', en: 'Footer with contact info' },
        'part1.ex7.desc': { no: 'Legg til en footer med kontaktinformasjon.', en: 'Add a footer with contact information.' },
        'part1.ex8.title': { no: 'Legg til et bilde', en: 'Add an image' },
        'part1.ex8.desc': { no: 'Gjør siden mer personlig med et profilbilde.', en: 'Make the page more personal with a profile picture.' },
        'part1.res.htmlTitle': { no: '📖 HTML Struktur', en: '📖 HTML Structure' },
        'part1.res.htmlDesc': {
            no: 'Et HTML-dokument har alltid &lt;html&gt;, &lt;head&gt; og &lt;body&gt; som grunnstruktur.',
            en: 'An HTML document always has &lt;html&gt;, &lt;head&gt; and &lt;body&gt; as its basic structure.'
        },
        'part1.res.cssTitle': { no: '🎨 CSS Box Model', en: '🎨 CSS Box Model' },
        'part1.res.cssDesc': {
            no: 'Hver CSS-boks består av content (innhold), padding (indre avstand), border (ramme) og margin (ytre avstand).',
            en: 'Every CSS box consists of content, padding, border and margin.'
        },
        'part1.res.flexTitle': { no: '📐 Flexbox Guide', en: '📐 Flexbox Guide' },
        'part1.res.flexDesc': {
            no: 'Flexbox gjør det enkelt å lage responsive layouts. Hovedakse (main axis) og tverrakse (cross axis) bestemmer retningen.',
            en: 'Flexbox makes it easy to create responsive layouts. The main axis and cross axis determine the direction.'
        },
        'part1.res.linksTitle': { no: '🔗 Nyttige Ressurser', en: '🔗 Useful Resources' },

        // ========== PART 2 ==========
        'part2.title': { no: 'Del 2: Interaktiv JavaScript', en: 'Part 2: Interactive JavaScript' },
        'part2.subtitle': { no: 'Gjør nettsiden din levende med JavaScript', en: 'Bring your website to life with JavaScript' },
        'part2.locked.title': { no: 'Del 2 er Låst', en: 'Part 2 is Locked' },
        'part2.locked.msg': {
            no: 'Du må fullføre Del 1 før du kan starte med JavaScript. Gå tilbake og fullfør HTML & CSS grunnlaget først.',
            en: 'You must complete Part 1 before starting JavaScript. Go back and complete the HTML & CSS basics first.'
        },
        'part2.locked.btn': { no: '← Gå til Del 1', en: '← Go to Part 1' },
        'part2.complete': { no: '✓ Fullfør Del 2', en: '✓ Complete Part 2' },
        'part2.completedTitle': { no: 'Del 2 Fullført!', en: 'Part 2 Complete!' },
        'part2.completedMsg': {
            no: 'Gratulerer! Du har lært JavaScript og DOM-manipulering. Nå er du klar for å ta det neste steget og lære React + Vite i Del 3.',
            en: 'Congratulations! You have learned JavaScript and DOM manipulation. Now you are ready to take the next step and learn React + Vite in Part 3.'
        },
        'part2.startPart3': { no: 'Start Del 3 →', en: 'Start Part 3 →' },
        'part2.ex1.title': { no: 'Prosjekt-seksjon', en: 'Project section' },
        'part2.ex1.desc': { no: 'Vi fortsetter portfolioen! Legg til en prosjekt-seksjon for å vise arbeidet ditt.', en: 'We continue the portfolio! Add a project section to show your work.' },
        'part2.ex2.title': { no: 'Prosjektkort', en: 'Project cards' },
        'part2.ex2.desc': { no: 'Lag kort som viser hvert prosjekt.', en: 'Create cards that display each project.' },
        'part2.ex3.title': { no: 'CSS Grid for prosjekter', en: 'CSS Grid for projects' },
        'part2.ex3.desc': { no: 'Bruk CSS Grid for å vise prosjektene i et pent rutenett.', en: 'Use CSS Grid to display the projects in a nice grid.' },
        'part2.ex4.title': { no: 'Kontaktskjema', en: 'Contact form' },
        'part2.ex4.desc': { no: 'Legg til et kontaktskjema så besøkende kan nå deg.', en: 'Add a contact form so visitors can reach you.' },
        'part2.ex5.title': { no: 'Style skjemaet', en: 'Style the form' },
        'part2.ex5.desc': { no: 'Gjør skjemaet pent og brukervennlig.', en: 'Make the form look nice and user-friendly.' },
        'part2.ex6.title': { no: 'JavaScript: Skjemavalidering', en: 'JavaScript: Form validation' },
        'part2.ex6.desc': {
            no: 'Bytt til <strong>script.js</strong>-fanen. La oss gjøre siden interaktiv!',
            en: 'Switch to the <strong>script.js</strong> tab. Let\'s make the page interactive!'
        },
        'part2.ex7.title': { no: 'Knapp-interaktivitet', en: 'Button interactivity' },
        'part2.ex7.desc': { no: 'Gjør "Se mer"-knappene interaktive.', en: 'Make the "See more" buttons interactive.' },
        'part2.ex8.title': { no: 'Hover-effekter', en: 'Hover effects' },
        'part2.ex8.desc': { no: 'Legg til animasjoner for en profesjonell følelse.', en: 'Add animations for a professional feel.' },
        'part2.res.domTitle': { no: '🌲 DOM Forklart', en: '🌲 DOM Explained' },
        'part2.res.domDesc': {
            no: 'DOM er en trestruktur som representerer HTML-dokumentet. JavaScript kan traversere og endre denne strukturen for å oppdatere siden.',
            en: 'The DOM is a tree structure representing the HTML document. JavaScript can traverse and modify this structure to update the page.'
        },
        'part2.res.eventTitle': { no: '🎯 Event Flow', en: '🎯 Event Flow' },
        'part2.res.eventDesc': {
            no: 'Events "bobler" oppover i DOM-treet. Du kan lytte på events på hvilken som helst node i hierarkiet.',
            en: 'Events "bubble" up through the DOM tree. You can listen for events on any node in the hierarchy.'
        },
        'part2.res.linksTitle': { no: '📚 JavaScript Referanser', en: '📚 JavaScript References' },

        // ========== PART 3 ==========
        'part3.title': { no: 'Del 3: React + Vite', en: 'Part 3: React + Vite' },
        'part3.subtitle': { no: 'Bygg moderne webapper med React og Vite', en: 'Build modern web apps with React and Vite' },
        'part3.locked.title': { no: 'Del 3 er Låst', en: 'Part 3 is Locked' },
        'part3.locked.msg': {
            no: 'Du må fullføre Del 2 før du kan starte med React + Vite. Gå tilbake og fullfør JavaScript-delen først.',
            en: 'You must complete Part 2 before starting React + Vite. Go back and complete the JavaScript section first.'
        },
        'part3.locked.btn': { no: '← Gå til Del 2', en: '← Go to Part 2' },
        'part3.complete': { no: '✓ Fullfør Del 3', en: '✓ Complete Part 3' },
        'part3.completedTitle': { no: 'Gratulerer!', en: 'Congratulations!' },
        'part3.completedMsg': {
            no: 'Du har fullført Del 3! Du kan nå gå videre til Ekstra-delen og bygge hva du vil — enten med vanlig HTML/CSS/JS eller React!',
            en: 'You have completed Part 3! You can now go to the Extra section and build whatever you want — using either plain HTML/CSS/JS or React!'
        },
        'part3.ex1.title': { no: 'React-komponent', en: 'React component' },
        'part3.ex1.desc': {
            no: 'Vi starter med å bygge en React-komponent! Lag en <code>App</code>-funksjon som returnerer JSX.',
            en: 'Let\'s start by building a React component! Create an <code>App</code> function that returns JSX.'
        },
        'part3.ex2.title': { no: 'useState Hook', en: 'useState Hook' },
        'part3.ex2.desc': {
            no: 'Bruk <code>useState</code> for å legge til tilstand (state) i komponenten.',
            en: 'Use <code>useState</code> to add state to the component.'
        },
        'part3.ex2.warn': {
            no: '⚠️ Ikke bruk "import" - hooks er allerede tilgjengelig!',
            en: '⚠️ Don\'t use "import" - hooks are already available!'
        },
        'part3.ex3.title': { no: 'Event Handler', en: 'Event Handler' },
        'part3.ex3.desc': { no: 'Legg til en knapp som øker telleren når du klikker.', en: 'Add a button that increases the counter when you click.' },
        'part3.ex4.title': { no: 'Barnkomponent', en: 'Child component' },
        'part3.ex4.desc': { no: 'Lag en egen <code>Card</code>-komponent som du bruker inne i App.', en: 'Create a separate <code>Card</code> component that you use inside App.' },
        'part3.ex5.title': { no: 'Style med CSS', en: 'Style with CSS' },
        'part3.ex5.desc': {
            no: 'Bytt til <strong>App.css</strong>-fanen og style komponentene.',
            en: 'Switch to the <strong>App.css</strong> tab and style the components.'
        },
        'part3.ex6.title': { no: 'Liste med .map()', en: 'List with .map()' },
        'part3.ex6.desc': { no: 'Bruk <code>.map()</code> for å vise en liste med data.', en: 'Use <code>.map()</code> to display a list of data.' },
        'part3.ex7.title': { no: 'Betinget rendering', en: 'Conditional rendering' },
        'part3.ex7.desc': { no: 'Vis eller skjul innhold basert på state.', en: 'Show or hide content based on state.' },
        'part3.ex8.title': { no: 'Hover og animasjon', en: 'Hover and animation' },
        'part3.ex8.desc': { no: 'Legg til hover-effekter og overganger for en profesjonell følelse.', en: 'Add hover effects and transitions for a professional feel.' },
        'part3.res.warnTitle': { no: '⚠️ Viktig: Ingen imports!', en: '⚠️ Important: No imports!' },
        'part3.res.warnMsg': {
            no: 'Vi bruker React fra CDN, ikke en build tool som Vite.',
            en: 'We use React from CDN, not a build tool like Vite.'
        },
        'part3.res.warnDont': { no: 'Ikke bruk:', en: 'Don\'t use:' },
        'part3.res.warnDo': { no: 'Bruk direkte:', en: 'Use directly:' },
        'part3.res.warnHooks': {
            no: 'Hooks (useState, useEffect, useRef) er allerede tilgjengelig!',
            en: 'Hooks (useState, useEffect, useRef) are already available!'
        },
        'part3.res.reactTitle': { no: '⚛️ React Komponent-tre', en: '⚛️ React Component Tree' },
        'part3.res.reactDesc': {
            no: 'React bygger UI som et tre av komponenter. Hver komponent har sin egen tilstand og kan sende data nedover via props.',
            en: 'React builds UI as a tree of components. Each component has its own state and can pass data down via props.'
        },
        'part3.res.viteTitle': { no: '⚡ Vite Byggesystem', en: '⚡ Vite Build System' },
        'part3.res.viteDesc': {
            no: 'Vite er et lynraskt byggesystem for moderne webprosjekter. Det bruker ES-moduler for rask utvikling og Rollup for produksjonsbygg.',
            en: 'Vite is a lightning-fast build system for modern web projects. It uses ES modules for fast development and Rollup for production builds.'
        },
        'part3.res.linksTitle': { no: '📚 React + Vite Referanser', en: '📚 React + Vite References' },

        // ========== PART 4 ==========
        'part4.title': { no: 'Ekstra: Fritt Prosjekt', en: 'Extra: Free Project' },
        'part4.subtitle': { no: 'Bygg hva du vil – velg mellom HTML/CSS/JS eller React', en: 'Build what you want – choose between HTML/CSS/JS or React' },
        'part4.locked.title': { no: 'Ekstra er Låst', en: 'Extra is Locked' },
        'part4.locked.msg': { no: 'Fullfør Del 3 for å låse opp den frie byggeseksjonen.', en: 'Complete Part 3 to unlock the free build section.' },
        'part4.locked.btn': { no: '← Gå til Del 3', en: '← Go to Part 3' },
        'part4.modeHtml': { no: 'HTML/CSS/JS', en: 'HTML/CSS/JS' },
        'part4.modeReact': { no: 'React', en: 'React' },
        'part4.save': { no: '💾 Lagre', en: '💾 Save' },
        'part4.ideas': { no: '💡 Prosjektideer', en: '💡 Project Ideas' },
        'part4.resources': { no: '📚 Ressurser', en: '📚 Resources' },

        // Part 4 index card
        'index.part4.title': { no: 'Ekstra: Fritt Prosjekt', en: 'Extra: Free Project' },
        'index.part4.desc': { no: 'Bygg hva du vil! Velg mellom HTML/CSS/JS eller React og lag ditt eget prosjekt fra bunnen av.', en: 'Build what you want! Choose between HTML/CSS/JS or React and create your own project from scratch.' },
        'index.part4.li1': { no: 'Fritt valg av teknologi', en: 'Free choice of technology' },
        'index.part4.li2': { no: '8 prosjektideer med startkode', en: '8 project ideas with starter code' },
        'index.part4.li3': { no: 'Del prosjektet i galleriet', en: 'Share your project in the gallery' },
        'index.part4.li4': { no: 'Ingen oppgaver – bare kreativitet!', en: 'No assignments – just creativity!' },
        'index.part4.locked': { no: 'Lås opp med Del 3', en: 'Unlock with Part 3' },

        // ========== GALLERY ==========
        'gallery.title': { no: '🎨 Prosjektgalleri', en: '🎨 Project Gallery' },
        'gallery.subtitle': { no: 'Se hva andre brukere har laget under kurset', en: 'See what other users have made during the course' },
        'gallery.loading': { no: 'Laster prosjekter...', en: 'Loading projects...' },

        // ========== LEADERBOARD ==========
        'leaderboard.title': { no: '🏆 Rangering', en: '🏆 Leaderboard' },
        'leaderboard.subtitle': { no: 'Se hvem som har fullført kurset raskest', en: 'See who completed the course fastest' },
        'leaderboard.loading': { no: 'Laster rangeringsliste...', en: 'Loading leaderboard...' },
        'leaderboard.about': { no: 'Om rangeringen', en: 'About the leaderboard' },
        'leaderboard.aboutDesc': {
            no: 'Rangeringen viser brukere som har fullført både Del 1 og Del 2 av kurset, sortert etter total tid brukt.',
            en: 'The leaderboard shows users who have completed both Part 1 and Part 2 of the course, sorted by total time spent.'
        },
        'leaderboard.valid': { no: '✓ Gyldig', en: '✓ Valid' },
        'leaderboard.validDesc': { no: 'Brukeren har bestått alle sjekkene', en: 'The user has passed all checks' },
        'leaderboard.flagged': { no: '⚠️ Flagget', en: '⚠️ Flagged' },
        'leaderboard.flaggedDesc': { no: 'Mistenkelig aktivitet oppdaget', en: 'Suspicious activity detected' },

        // ========== PROFILE ==========
        'profile.loading': { no: 'Laster profil...', en: 'Loading profile...' },

        // ========== TOASTS / DYNAMIC JS ==========
        'toast.codeSaved': { no: 'Koden er lagret!', en: 'Code saved!' },
        'toast.codeReset': { no: 'Koden er tilbakestilt', en: 'Code reset' },
        'toast.fileDownloaded': { no: 'Filen er lastet ned!', en: 'File downloaded!' },
        'toast.timeUp': {
            no: 'Tiden er ute! Du kan fortsette å jobbe, men timeren har stoppet.',
            en: 'Time is up! You can keep working, but the timer has stopped.'
        },
        'toast.unlockPart2': { no: 'Fullfør Del 1 først for å låse opp Del 2', en: 'Complete Part 1 first to unlock Part 2' },
        'toast.unlockPart3': { no: 'Fullfør Del 2 først for å låse opp Del 3', en: 'Complete Part 2 first to unlock Part 3' },
        'toast.unlockPart4': { no: 'Fullfør Del 3 først for å låse opp Ekstra', en: 'Complete Part 3 first to unlock Extra' },
        'confirm.resetCode': {
            no: 'Er du sikker på at du vil tilbakestille koden til utgangspunktet?',
            en: 'Are you sure you want to reset the code to the starting point?'
        },
        'cheat.title': { no: 'Kurs Fullført!', en: 'Course Completed!' },
        'cheat.msg': {
            no: 'Vi har registrert noe uvanlig aktivitet under din sesjon:',
            en: 'We detected some unusual activity during your session:'
        },
        'cheat.note': {
            no: 'Resultatet ditt er lagret, men kan bli vurdert nærmere. Husk at ekte læring tar tid!',
            en: 'Your result is saved, but may be reviewed further. Remember that real learning takes time!'
        },
    },

    init() {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        this.currentLang = saved || 'no';
        this.applyTranslations();
        this.updateToggleButton();
    },

    toggle() {
        this.currentLang = this.currentLang === 'no' ? 'en' : 'no';
        localStorage.setItem(this.STORAGE_KEY, this.currentLang);
        this.applyTranslations();
        this.updateToggleButton();
    },

    t(key) {
        const entry = this.translations[key];
        if (!entry) return key;
        return entry[this.currentLang] || entry['no'] || key;
    },

    applyTranslations() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = this.t(key);
            // Use innerHTML for elements that contain HTML tags
            if (translation.includes('<') || translation.includes('&lt;')) {
                el.innerHTML = translation;
            } else {
                el.textContent = translation;
            }
        });

        // Update placeholder attributes
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            el.placeholder = this.t(key);
        });

        // Update title attributes
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            el.title = this.t(key);
        });
    },

    updateToggleButton() {
        const btn = document.getElementById('lang-toggle');
        if (btn) {
            btn.textContent = this.currentLang === 'no' ? '🇬🇧 EN' : '🇳🇴 NO';
            btn.title = this.currentLang === 'no' ? 'Switch to English' : 'Bytt til norsk';
        }
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    Lang.init();
});
