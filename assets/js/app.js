// ========================================
// COURSE STATE MANAGEMENT
// ========================================

const CourseState = {
    STORAGE_KEY: 'webdev_course_state',
    
    getState() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        let state;
        
        if (stored) {
            state = JSON.parse(stored);
            
            // Migrate old state to new structure if needed
            if (!state.part2Completed) {
                state.part2Completed = false;
            }
            if (!state.part3TimeRemaining) {
                state.part3TimeRemaining = 30 * 60;
            }
            if (!state.part3Code) {
                state.part3Code = {
                    jsx: this.getDefaultJSX(),
                    css: this.getDefaultCSS(3),
                    main: this.getDefaultMain()
                };
            }
            // Migrate old Part 2 portfolio code to new task manager skeleton
            if (state.part2Code && state.part2Code.html && state.part2Code.html.includes('Min Portfolio')) {
                state.part2Code.html = this.getDefaultHTML(2);
                state.part2Code.css = this.getDefaultCSS(2);
                state.part2Code.js = this.getDefaultJS(2);
                this.saveState(state);
            }
            if (!state.part4Code) {
                state.part4Code = {
                    mode: 'html',
                    html: this.getDefaultHTML(4),
                    css: this.getDefaultCSS(4),
                    js: this.getDefaultJS(4),
                    jsx: this.getDefaultJSX(4),
                    cssReact: this.getDefaultCSS(4),
                    main: this.getDefaultMain()
                };
            }
            
            return state;
        }
        
        return {
            part1Completed: false,
            part2Completed: false,
            part1TimeRemaining: 15 * 60,
            part2TimeRemaining: 15 * 60,
            part3TimeRemaining: 30 * 60,
            part1Code: {
                html: this.getDefaultHTML(1),
                css: this.getDefaultCSS(1),
                js: ''
            },
            part2Code: {
                html: this.getDefaultHTML(2),
                css: this.getDefaultCSS(2),
                js: this.getDefaultJS()
            },
            part3Code: {
                jsx: this.getDefaultJSX(),
                css: this.getDefaultCSS(3),
                main: this.getDefaultMain()
            },
            part4TimeRemaining: 60 * 60,
            part4Code: {
                mode: 'html',
                html: this.getDefaultHTML(4),
                css: this.getDefaultCSS(4),
                js: this.getDefaultJS(4),
                jsx: this.getDefaultJSX(4),
                cssReact: this.getDefaultCSS(4),
                main: this.getDefaultMain()
            }
        };
    },
    
    saveState(state) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    },
    
    completePart1() {
        const state = this.getState();
        state.part1Completed = true;
        this.saveState(state);
    },
    
    isPart1Completed() {
        return this.getState().part1Completed;
    },
    
    isPart2Completed() {
        return this.getState().part2Completed;
    },
    
    completePart2() {
        const state = this.getState();
        state.part2Completed = true;
        this.saveState(state);
    },
    
    completePart3() {
        const state = this.getState();
        state.part3Completed = true;
        this.saveState(state);
    },
    
    isPart3Completed() {
        return this.getState().part3Completed === true;
    },
    
    isPartStarted(part) {
        return this.getState()[`part${part}Started`] === true;
    },
    
    startPart(part) {
        const state = this.getState();
        state[`part${part}Started`] = true;
        this.saveState(state);
    },
    
    completePart4() {
        const state = this.getState();
        state.part4Completed = true;
        this.saveState(state);
    },
    
    saveCode(part, type, code) {
        const state = this.getState();
        
        // Ensure part code exists
        if (!state[`part${part}Code`]) {
            if (part === 3) {
                state[`part${part}Code`] = {
                    jsx: this.getDefaultJSX(),
                    css: this.getDefaultCSS(3),
                    main: this.getDefaultMain()
                };
            }
            if (part === 4) {
                state[`part${part}Code`] = {
                    mode: 'html',
                    html: this.getDefaultHTML(4),
                    css: this.getDefaultCSS(4),
                    js: this.getDefaultJS(4),
                    jsx: this.getDefaultJSX(4),
                    cssReact: this.getDefaultCSS(4),
                    main: this.getDefaultMain()
                };
            }
        }
        
        state[`part${part}Code`][type] = code;
        this.saveState(state);
    },
    
    getCode(part, type) {
        const state = this.getState();
        const partCode = state[`part${part}Code`];
        
        // If part code doesn't exist, return defaults
        if (!partCode) {
            if (part === 1) return type === 'html' ? this.getDefaultHTML(1) : type === 'css' ? this.getDefaultCSS(1) : '';
            if (part === 2) return type === 'html' ? this.getDefaultHTML(2) : type === 'css' ? this.getDefaultCSS(2) : type === 'js' ? this.getDefaultJS() : '';
            if (part === 3) return type === 'jsx' ? this.getDefaultJSX() : type === 'css' ? this.getDefaultCSS(3) : type === 'main' ? this.getDefaultMain() : '';
            if (part === 4) return type === 'html' ? this.getDefaultHTML(4) : type === 'css' ? this.getDefaultCSS(4) : type === 'js' ? this.getDefaultJS(4) : type === 'jsx' ? this.getDefaultJSX(4) : type === 'cssReact' ? this.getDefaultCSS(4) : type === 'main' ? this.getDefaultMain() : '';
        }
        
        return partCode[type] || '';
    },
    
    saveTimeRemaining(part, time) {
        const state = this.getState();
        state[`part${part}TimeRemaining`] = time;
        this.saveState(state);
    },
    
    getTimeRemaining(part) {
        const state = this.getState();
        const timeRemaining = state[`part${part}TimeRemaining`];
        
        // Return defaults if not set
        if (timeRemaining === undefined) {
            if (part === 1 || part === 2) return 15 * 60;
            if (part === 3) return 30 * 60;
            if (part === 4) return 60 * 60;
        }
        
        return timeRemaining;
    },
    
    resetCourse() {
        localStorage.removeItem(this.STORAGE_KEY);
        location.reload();
    },
    
    getDefaultHTML(part) {
        if (part === 1) {
            return `<!DOCTYPE html>
<html lang="no">
<head>
    <meta charset="UTF-8">
    <title>Min Portfolio</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <header>
        <!-- Oppgave 2: Legg til <h1> med navn og <p> med tittel -->
        <!-- Oppgave 8: Legg til <img> med profilbilde -->
    </header>

    <main>
        <section class="om-meg">
            <!-- Oppgave 3: Legg til <h2> og <p> med beskrivelse -->
        </section>

        <section class="ferdigheter">
            <!-- Oppgave 4: Legg til <h2> og <ul> med <li>-elementer -->
        </section>
    </main>

    <footer>
        <!-- Oppgave 7: Legg til kontaktinformasjon -->
    </footer>

</body>
</html>`;
        }
        if (part === 4) {
            return `<!DOCTYPE html>
<html lang="no">
<head>
    <meta charset="UTF-8">
    <title>Mitt Prosjekt</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <!-- Bygg hva du vil her! 🚀 -->

    <script src="script.js"><\/script>
</body>
</html>`;
        }
        return `<!DOCTYPE html>
<html lang="no">
<head>
    <meta charset="UTF-8">
    <title>Min Oppgaveliste</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <div class="container">
        <!-- Oppgave 1: Legg til overskrift, input-felt og legg til-knapp -->
        <!-- Oppgave 1: Legg til <ul id="oppgave-liste"></ul> -->

        <!-- Oppgave 6: Legg til <p id="teller"></p> for oppgaveteller -->

        <!-- Oppgave 7: Legg til filterknapper (Alle/Aktive/Fullførte) -->
    </div>

    <script src="script.js"><\/script>
</body>
</html>`;
    },
    
    getDefaultCSS(part) {
        if (part === 1) {
            return `/* Din Portfolio CSS */

body {
    /* Oppgave 6: Legg til font-family, margin: 0 og background */
}

header {
    /* Oppgave 5: Legg til background-color, color, padding og text-align */
}

.profilbilde {
    /* Oppgave 8: Legg til width og border-radius: 50% */
}

section {
    /* Oppgave 6: Legg til padding, max-width, margin og background */
}

footer {
    /* Oppgave 7: Legg til background, color, text-align og padding */
}
`;
        }
        if (part === 3) {
            return `/* App.css - Stiler for React-appen */

.app {
    /* Oppgave 5: Legg til font-family, max-width og margin */
}

.card {
    /* Oppgave 5: Legg til background, padding, border-radius og box-shadow */
    /* Oppgave 8: Legg til transition */
}

.card:hover {
    /* Oppgave 8: Legg til transform og box-shadow */
}

button {
    /* Oppgave 5: Legg til background, color, padding, border og border-radius */
}

button:hover {
    /* Oppgave 8: Legg til hover-bakgrunn */
}
`;
        }
        if (part === 4) {
            return `/* Stiler for ditt prosjekt */

body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background: #f5f5f5;
}

/* Legg til dine egne stiler her */
`;
        }
        return `/* Oppgaveliste CSS */

/* Oppgave 2: Style body med font-family, background og margin */
body {
}

/* Oppgave 2: Style .container med max-width, margin, padding og background */
.container {
}

/* Oppgave 2: Style input og knapp med padding, border og font-size */
#oppgave-input {
}

#legg-til-btn {
}

/* Oppgave 2: Style listeelementene */
#oppgave-liste {
    list-style: none;
    padding: 0;
}

#oppgave-liste li {
}

/* Oppgave 5: Style .ferdig-klassen med strikethrough og opacity */
.ferdig {
}

/* Oppgave 4: Style slett-knappen */
.slett-btn {
}

/* Oppgave 7: Style filterknappene */
.filter-knapper {
}

.filter-knapper button {
}

.filter-knapper button.aktiv {
}`;
    },
    
    getDefaultJS(part = 2) {
        if (part === 4) {
            return `// JavaScript for ditt prosjekt
console.log('Prosjekt lastet! 🚀');

// Legg til din kode her
`;
        }
        return `// JavaScript for Oppgaveliste
console.log('Oppgaveliste lastet! ✅');

// Oppgave 3: Hent elementer med getElementById
// Oppgave 3: Legg til click-event på knappen som kaller en funksjon for å legge til oppgaver
// Oppgave 3: Bruk createElement('li') og appendChild for å legge til i listen

// Oppgave 4: Lag en funksjon som legger til en slett-knapp (×) på hvert element
// Oppgave 4: Bruk addEventListener('click') og element.remove()

// Oppgave 5: Legg til click-event på hvert li-element
// Oppgave 5: Bruk classList.toggle('ferdig') for å markere som ferdig

// Oppgave 6: Lag en oppdaterTeller() funksjon
// Oppgave 6: Tell antall li og antall med klassen 'ferdig'

// Oppgave 7: Legg til click-events på filterknappene
// Oppgave 7: Bruk style.display for å vise/skjule basert på filter

// Oppgave 8: Bruk localStorage.setItem() og localStorage.getItem()
// Oppgave 8: Lagre oppgavene som JSON og last dem ved oppstart
`;
    },
    
    getDefaultJSX(part = 3) {
        if (part === 4) {
            return `// App.jsx - Din React-komponent
// VIKTIG: Ikke bruk "import" - hooks er allerede tilgjengelig!

function App() {
    // Legg til state her med useState

    return (
        <div className="app">
            {/* Bygg hva du vil her! 🚀 */}
            <h1>Mitt React Prosjekt</h1>
        </div>
    );
}
`;
        }
        return `// App.jsx - Din React-komponent
// VIKTIG: Ikke bruk "import" - hooks er allerede tilgjengelig!

// Oppgave 4: Lag Card-komponenten her
function Card(props) {
    return (
        <div className="card">
            {/* Vis props.title og props.description */}
        </div>
    );
}

function App() {
    // Oppgave 2: Legg til useState for teller (count, setCount)
    // Oppgave 7: Legg til useState for visible (visible, setVisible)

    // Oppgave 6: Lag en skills-array med ['React', 'Vite', 'JavaScript']

    return (
        <div className="app">
            <h1>Min React App</h1>

            {/* Oppgave 2: Vis telleren med <p> */}
            {/* Oppgave 3: Legg til <button> med onClick som øker telleren */}

            {/* Oppgave 4: Bruk <Card>-komponenten med title og description */}

            {/* Oppgave 6: Vis skills-arrayen med .map() og <ul>/<li> */}

            {/* Oppgave 7: Legg til knapp som toggler visible, og betinget rendering */}
        </div>
    );
}
`;
    },
    
    getDefaultMain() {
        return `// main.jsx - Inngangspunktet for React-appen
// Dette filen monterer App-komponenten i DOM-en

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
`;
    },

    saveMode(mode) {
        const state = this.getState();
        if (!state.part4Code) state.part4Code = {};
        state.part4Code.mode = mode;
        this.saveState(state);
    },

    getMode() {
        const state = this.getState();
        return state.part4Code?.mode || 'html';
    }
};

// ========================================
// UI HELPERS
// ========================================

function showToast(message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${type === 'success' ? '✓' : 'ℹ'}</span>
        <span class="toast-message">${message}</span>
    `;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Check if current user is admin (bypasses all locks)
function isAdminUser() {
    return typeof AuthService !== 'undefined' && AuthService.isAdmin();
}

function updateNavigation() {
    const admin = isAdminUser();
    const navPart2 = document.getElementById('nav-part2');
    const part2Card = document.getElementById('part2-card');
    const part2Btn = document.getElementById('part2-btn');
    const navPart3 = document.getElementById('nav-part3');
    const part3Card = document.getElementById('part3-card');
    const part3Btn = document.getElementById('part3-btn');
    
    if (admin || CourseState.isPart1Completed()) {
        if (navPart2) navPart2.classList.remove('locked');
        if (part2Card) part2Card.classList.remove('locked');
        if (part2Btn) {
            part2Btn.innerHTML = typeof Lang !== 'undefined' ? Lang.t('index.part1.start').replace('1', '2') : 'Start Del 2';
        }
    } else {
        if (navPart2) navPart2.classList.add('locked');
        if (part2Card) part2Card.classList.add('locked');
    }
    
    if (admin || CourseState.isPart2Completed()) {
        if (navPart3) navPart3.classList.remove('locked');
        if (part3Card) part3Card.classList.remove('locked');
        if (part3Btn) {
            part3Btn.innerHTML = typeof Lang !== 'undefined' ? Lang.t('index.part1.start').replace('1', '3') : 'Start Del 3';
        }
    } else {
        if (navPart3) navPart3.classList.add('locked');
        if (part3Card) part3Card.classList.add('locked');
    }

    const navPart4 = document.getElementById('nav-part4');
    const part4Card = document.getElementById('part4-card');
    const part4Btn = document.getElementById('part4-btn');

    if (admin || CourseState.isPart3Completed()) {
        if (navPart4) navPart4.classList.remove('locked');
        if (part4Card) part4Card.classList.remove('locked');
        if (part4Btn) {
            part4Btn.innerHTML = 'Start Ekstra';
        }
    } else {
        if (navPart4) navPart4.classList.add('locked');
        if (part4Card) part4Card.classList.add('locked');
    }

    // Show/hide admin nav link
    const navAdmin = document.getElementById('nav-admin');
    if (navAdmin) {
        navAdmin.style.display = admin ? '' : 'none';
    }
}

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    updateNavigation();
    
    const admin = isAdminUser();

    // Handle locked navigation (admin bypasses all locks)
    const navPart2 = document.getElementById('nav-part2');
    if (navPart2 && !admin && !CourseState.isPart1Completed()) {
        navPart2.addEventListener('click', (e) => {
            e.preventDefault();
            showToast(typeof Lang !== 'undefined' ? Lang.t('toast.unlockPart2') : 'Fullfør Del 1 først for å låse opp Del 2', 'info');
        });
    }
    
    const navPart3 = document.getElementById('nav-part3');
    if (navPart3 && !admin && !CourseState.isPart2Completed()) {
        navPart3.addEventListener('click', (e) => {
            e.preventDefault();
            showToast(typeof Lang !== 'undefined' ? Lang.t('toast.unlockPart3') : 'Fullfør Del 2 først for å låse opp Del 3', 'info');
        });
    }
    
    const part2Btn = document.getElementById('part2-btn');
    if (part2Btn && !admin && !CourseState.isPart1Completed()) {
        part2Btn.addEventListener('click', (e) => {
            e.preventDefault();
            showToast(typeof Lang !== 'undefined' ? Lang.t('toast.unlockPart2') : 'Fullfør Del 1 først for å låse opp Del 2', 'info');
        });
    }
    
    const part3Btn = document.getElementById('part3-btn');
    if (part3Btn && !admin && !CourseState.isPart2Completed()) {
        part3Btn.addEventListener('click', (e) => {
            e.preventDefault();
            showToast(typeof Lang !== 'undefined' ? Lang.t('toast.unlockPart3') : 'Fullfør Del 2 først for å låse opp Del 3', 'info');
        });
    }

    const navPart4 = document.getElementById('nav-part4');
    if (navPart4 && !admin && !CourseState.isPart3Completed()) {
        navPart4.addEventListener('click', (e) => {
            e.preventDefault();
            showToast(typeof Lang !== 'undefined' ? Lang.t('toast.unlockPart4') : 'Fullfør Del 3 først for å låse opp Ekstra', 'info');
        });
    }

    const part4Btn = document.getElementById('part4-btn');
    if (part4Btn && !admin && !CourseState.isPart3Completed()) {
        part4Btn.addEventListener('click', (e) => {
            e.preventDefault();
            showToast(typeof Lang !== 'undefined' ? Lang.t('toast.unlockPart4') : 'Fullfør Del 3 først for å låse opp Ekstra', 'info');
        });
    }
});

// ========================================
// AUTO-LOGOUT ON BROWSER/TAB CLOSE
// ========================================
// Logs the user out when they close the browser/tab, but preserves
// their code and course progress so it loads back when they return.

(function initSessionCloseLogout() {
    const SESSION_FLAG = 'webdev_active_session';

    if (sessionStorage.getItem(SESSION_FLAG)) {
        // Session is still active (same tab, navigation or refresh) — do nothing
        return;
    }

    // New browser session (tab was closed and reopened)
    sessionStorage.setItem(SESSION_FLAG, 'true');

    // If a user was previously logged in, log them out (auth only)
    if (localStorage.getItem('webdev_current_user')) {
        localStorage.removeItem('webdev_current_user');
        console.log('Browser session ended — user logged out (code & progress preserved)');
    }
})();

// ========================================
// IMAGE LIGHTBOX
// ========================================

function openImageModal(src, alt) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <span class="image-modal-close">&times;</span>
        <img src="${src}" alt="${alt}">
        <div class="image-modal-caption">${alt}</div>
    `;
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('image-modal-close')) {
            modal.remove();
        }
    });
    
    document.addEventListener('keydown', function closeOnEscape(e) {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', closeOnEscape);
        }
    });
    
    document.body.appendChild(modal);
}
