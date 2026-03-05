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
            }
        };
    },
    
    saveState(state) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    },
    
    completePart1() {
        const state = this.getState();
        state.part1Completed = true;
        
        // Copy code from part 1 to part 2, merging with part 2 template
        const part1Html = state.part1Code.html;
        const part1Css = state.part1Code.css;
        
        // Extract body content from part 1 HTML
        const bodyMatch = part1Html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
        const part1BodyContent = bodyMatch ? bodyMatch[1].trim() : '';
        
        // Create part 2 HTML with part 1 content inside main
        state.part2Code.html = `<!DOCTYPE html>
<html lang="no">
<head>
    <meta charset="UTF-8">
    <title>Min Interaktive Nettside</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header class="header">
        <h1>Min Webapp</h1>
    </header>
    
    <main class="main">
        <!-- Din kode fra Del 1 -->
${part1BodyContent}
        
        <!-- Legg til interaktive elementer her -->
        
    </main>
    
    <script src="script.js"></script>
</body>
</html>`;
        
        // Merge CSS - add part 1 CSS to part 2 CSS
        state.part2Code.css = `/* Din CSS fra Del 1 */
${part1Css}

/* ===== Del 2: Nye stiler ===== */
.header {
    background: rgba(255, 255, 255, 0.1);
    padding: 20px;
    text-align: center;
    color: white;
}

.main {
    padding: 40px;
    max-width: 800px;
    margin: 0 auto;
}

/* Legg til mer CSS her */
`;
        
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
        <img src="https://via.placeholder.com/150" alt="Profilbilde" class="profilbilde">
        <h1>Ditt Navn</h1>
        <p>Webutvikler</p>
    </header>

    <main>
        <section class="om-meg">
            <h2>Om meg</h2>
            <p>Skriv litt om deg selv her. Hva er du interessert i?</p>
        </section>

        <section class="ferdigheter">
            <h2>Ferdigheter</h2>
            <ul>
                <li>HTML</li>
                <li>CSS</li>
                <li>JavaScript</li>
            </ul>
        </section>
    </main>

    <footer>
        <p>Kontakt: din@epost.no</p>
    </footer>

</body>
</html>`;
        }
        return `<!DOCTYPE html>
<html lang="no">
<head>
    <meta charset="UTF-8">
    <title>Min Portfolio</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <header>
        <h1>Ditt Navn</h1>
        <p>Webutvikler</p>
    </header>

    <main>
        <section class="om-meg">
            <h2>Om meg</h2>
            <p>Skriv litt om deg selv her.</p>
        </section>

        <section class="ferdigheter">
            <h2>Ferdigheter</h2>
            <ul>
                <li>HTML</li>
                <li>CSS</li>
                <li>JavaScript</li>
            </ul>
        </section>

        <section class="prosjekter">
            <h2>Mine Prosjekter</h2>
            <div class="prosjekt-grid">
                <div class="prosjekt-kort">
                    <h3>Prosjekt 1</h3>
                    <p>Beskrivelse av prosjekt 1.</p>
                    <button class="se-mer-btn">Se mer</button>
                </div>
                <div class="prosjekt-kort">
                    <h3>Prosjekt 2</h3>
                    <p>Beskrivelse av prosjekt 2.</p>
                    <button class="se-mer-btn">Se mer</button>
                </div>
                <div class="prosjekt-kort">
                    <h3>Prosjekt 3</h3>
                    <p>Beskrivelse av prosjekt 3.</p>
                    <button class="se-mer-btn">Se mer</button>
                </div>
            </div>
        </section>

        <section class="kontakt">
            <h2>Kontakt meg</h2>
            <form id="kontakt-form">
                <input type="text" id="navn" placeholder="Ditt navn">
                <input type="email" id="epost" placeholder="Din e-post">
                <textarea id="melding" placeholder="Din melding"></textarea>
                <button type="submit">Send</button>
            </form>
        </section>
    </main>

    <footer>
        <p>Kontakt: din@epost.no</p>
    </footer>

    <script src="script.js"></script>
</body>
</html>`;
    },
    
    getDefaultCSS(part) {
        if (part === 1) {
            return `/* Din Portfolio CSS */

body {
    font-family: Arial, sans-serif;
    margin: 0;
    background: #f5f5f5;
}

header {
    background-color: #333;
    color: white;
    padding: 40px;
    text-align: center;
}

.profilbilde {
    width: 150px;
    border-radius: 50%;
    margin-bottom: 20px;
}

section {
    padding: 30px;
    max-width: 800px;
    margin: 20px auto;
    background: white;
    border-radius: 8px;
}

footer {
    background: #333;
    color: white;
    text-align: center;
    padding: 20px;
}
`;
        }
        if (part === 3) {
            return `/* App.css - Stiler for React-appen */

.app {
    font-family: 'Segoe UI', Arial, sans-serif;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.card {
    background: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    margin: 10px 0;
    transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

button {
    background: #646cff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
}

button:hover {
    background: #535bf2;
}
`;
        }
        return `/* CSS for Din Portfolio */

body {
    font-family: Arial, sans-serif;
    margin: 0;
    background: #f5f5f5;
}

header {
    background-color: #333;
    color: white;
    padding: 40px;
    text-align: center;
}

section {
    padding: 30px;
    max-width: 800px;
    margin: 20px auto;
    background: white;
    border-radius: 8px;
}

footer {
    background: #333;
    color: white;
    text-align: center;
    padding: 20px;
}

/* Prosjekter */
.prosjekt-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
}

.prosjekt-kort {
    background: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: transform 0.3s, box-shadow 0.3s;
}

.prosjekt-kort:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.se-mer-btn:hover {
    background: #555;
}

/* Kontaktskjema */
#kontakt-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

#kontakt-form input, #kontakt-form textarea {
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
}

#kontakt-form button {
    background: #333;
    color: white;
    padding: 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}`;
    },
    
    getDefaultJS() {
        return `// JavaScript for din Portfolio
console.log('Portfolio lastet! 🚀');

// Skjemavalidering
document.getElementById('kontakt-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Takk for meldingen!');
});

// Se mer-knapper
document.querySelectorAll('.se-mer-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        alert('Mer info kommer snart!');
    });
});
`;
    },
    
    getDefaultJSX() {
        return `// App.jsx - Din React-komponent
// VIKTIG: Ikke bruk "import" - hooks er allerede tilgjengelig!

function Card(props) {
    return (
        <div className="card">
            <h3>{props.title}</h3>
            <p>{props.description}</p>
        </div>
    );
}

function App() {
    const [count, setCount] = useState(0);
    const [visible, setVisible] = useState(false);

    const skills = ['React', 'Vite', 'JavaScript'];

    return (
        <div className="app">
            <h1>Min React App</h1>

            <p>Teller: {count}</p>
            <button onClick={() => setCount(count + 1)}>
                Klikk meg!
            </button>

            <Card title="Mitt kort" description="Dette er en React-komponent!" />

            <ul>
                {skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                ))}
            </ul>

            <button onClick={() => setVisible(!visible)}>Vis/Skjul</button>
            {visible && <p>Hemmelig innhold!</p>}
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

function updateNavigation() {
    const navPart2 = document.getElementById('nav-part2');
    const part2Card = document.getElementById('part2-card');
    const part2Btn = document.getElementById('part2-btn');
    const navPart3 = document.getElementById('nav-part3');
    const part3Card = document.getElementById('part3-card');
    const part3Btn = document.getElementById('part3-btn');
    
    if (CourseState.isPart1Completed()) {
        if (navPart2) navPart2.classList.remove('locked');
        if (part2Card) part2Card.classList.remove('locked');
        if (part2Btn) {
            part2Btn.innerHTML = typeof Lang !== 'undefined' ? Lang.t('index.part1.start').replace('1', '2') : 'Start Del 2';
        }
    } else {
        if (navPart2) navPart2.classList.add('locked');
        if (part2Card) part2Card.classList.add('locked');
    }
    
    if (CourseState.isPart2Completed()) {
        if (navPart3) navPart3.classList.remove('locked');
        if (part3Card) part3Card.classList.remove('locked');
        if (part3Btn) {
            part3Btn.innerHTML = typeof Lang !== 'undefined' ? Lang.t('index.part1.start').replace('1', '3') : 'Start Del 3';
        }
    } else {
        if (navPart3) navPart3.classList.add('locked');
        if (part3Card) part3Card.classList.add('locked');
    }
}

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    updateNavigation();
    
    // Handle locked navigation
    const navPart2 = document.getElementById('nav-part2');
    if (navPart2 && !CourseState.isPart1Completed()) {
        navPart2.addEventListener('click', (e) => {
            e.preventDefault();
            showToast(typeof Lang !== 'undefined' ? Lang.t('toast.unlockPart2') : 'Fullfør Del 1 først for å låse opp Del 2', 'info');
        });
    }
    
    const navPart3 = document.getElementById('nav-part3');
    if (navPart3 && !CourseState.isPart2Completed()) {
        navPart3.addEventListener('click', (e) => {
            e.preventDefault();
            showToast(typeof Lang !== 'undefined' ? Lang.t('toast.unlockPart3') : 'Fullfør Del 2 først for å låse opp Del 3', 'info');
        });
    }
    
    const part2Btn = document.getElementById('part2-btn');
    if (part2Btn && !CourseState.isPart1Completed()) {
        part2Btn.addEventListener('click', (e) => {
            e.preventDefault();
            showToast(typeof Lang !== 'undefined' ? Lang.t('toast.unlockPart2') : 'Fullfør Del 1 først for å låse opp Del 2', 'info');
        });
    }
    
    const part3Btn = document.getElementById('part3-btn');
    if (part3Btn && !CourseState.isPart2Completed()) {
        part3Btn.addEventListener('click', (e) => {
            e.preventDefault();
            showToast(typeof Lang !== 'undefined' ? Lang.t('toast.unlockPart3') : 'Fullfør Del 2 først for å låse opp Del 3', 'info');
        });
    }
});

// ========================================
// AUTO-CLEAR LOCALSTORAGE AFTER 75 MINUTES
// ========================================

(function initAutoClearTimer() {
    const SESSION_KEY = 'webdev_session_start';
    const CLEAR_AFTER_MS = 75 * 60 * 1000; // 75 minutes in milliseconds
    
    // Get or set session start time
    let sessionStart = localStorage.getItem(SESSION_KEY);
    
    if (!sessionStart) {
        // First visit - set start time
        sessionStart = Date.now().toString();
        localStorage.setItem(SESSION_KEY, sessionStart);
    }
    
    // Check if 75 minutes have passed
    function checkAndClearIfExpired() {
        const startTime = parseInt(localStorage.getItem(SESSION_KEY));
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        
        if (elapsed >= CLEAR_AFTER_MS) {
            // Time's up! Clear everything
            console.log('75 minutes elapsed - clearing localStorage');
            
            // Show notification before clearing
            showToast(typeof Lang !== 'undefined' ? Lang.t('toast.sessionExpired') : 'Session utløpt (75 min) - localStorage ryddes', 'info');
            
            // Clear all localStorage data after a short delay
            setTimeout(() => {
                localStorage.clear();
                
                // Show final message
                showToast(typeof Lang !== 'undefined' ? Lang.t('toast.courseReset') : 'Kurset er tilbakestilt. Last siden på nytt for å starte på nytt.', 'info');
                
                // Optionally reload after 3 seconds
                setTimeout(() => {
                    if (confirm(typeof Lang !== 'undefined' ? Lang.t('confirm.sessionExpired') : 'Session utløpt. Vil du laste siden på nytt?')) {
                        window.location.reload();
                    }
                }, 3000);
            }, 1000);
            
            return true;
        }
        
        return false;
    }
    
    // Check immediately on load
    if (!checkAndClearIfExpired()) {
        // If not expired, check every minute
        setInterval(checkAndClearIfExpired, 60 * 1000);
        
        // Optional: Show time remaining in console
        const startTime = parseInt(sessionStart);
        const timeRemaining = CLEAR_AFTER_MS - (Date.now() - startTime);
        console.log(`Session will auto-clear in ${Math.floor(timeRemaining / 60000)} minutes`);
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
