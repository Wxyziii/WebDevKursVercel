// ========================================
// COURSE STATE MANAGEMENT
// ========================================

const CourseState = {
    STORAGE_KEY: 'webdev_course_state',
    
    getState() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
        return {
            part1Completed: false,
            part1TimeRemaining: 30 * 60,
            part2TimeRemaining: 30 * 60,
            part1Code: {
                html: this.getDefaultHTML(1),
                css: this.getDefaultCSS(1),
                js: ''
            },
            part2Code: {
                html: this.getDefaultHTML(2),
                css: this.getDefaultCSS(2),
                js: this.getDefaultJS()
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
    
    saveCode(part, type, code) {
        const state = this.getState();
        state[`part${part}Code`][type] = code;
        this.saveState(state);
    },
    
    getCode(part, type) {
        return this.getState()[`part${part}Code`][type];
    },
    
    saveTimeRemaining(part, time) {
        const state = this.getState();
        state[`part${part}TimeRemaining`] = time;
        this.saveState(state);
    },
    
    getTimeRemaining(part) {
        return this.getState()[`part${part}TimeRemaining`];
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
    <!-- 
    Velkommen til Del 1! 🎉
    
    Du skal bygge en personlig portfolio-side.
    Følg oppgavene i sidepanelet til venstre.
    
    Start med å erstatte denne kommentaren med:
    <header></header>
    <main></main>
    <footer></footer>
    -->
    
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
            <p>Skriv om deg selv her...</p>
        </section>
        
        <section class="ferdigheter">
            <h2>Ferdigheter</h2>
            <ul>
                <li>HTML</li>
                <li>CSS</li>
                <li>JavaScript</li>
            </ul>
        </section>
        
        <!-- Del 2: Legg til prosjekter og kontaktskjema her -->
        
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
            return `/* 
   Din Portfolio CSS
   Følg oppgavene for å style siden!
*/

/* Legg til CSS her etterhvert som du gjør oppgavene */
`;
        }
        return `/* Din CSS fra Del 1 vil vises her */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Arial, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
}

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
}`;
    },
    
    getDefaultJS() {
        return `// JavaScript for din Portfolio
// Følg oppgavene for å gjøre siden interaktiv!

console.log('Portfolio lastet! 🚀');

// Legg til JavaScript her etterhvert som du gjør oppgavene

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
    
    if (CourseState.isPart1Completed()) {
        if (navPart2) navPart2.classList.remove('locked');
        if (part2Card) part2Card.classList.remove('locked');
        if (part2Btn) {
            part2Btn.innerHTML = 'Start Del 2';
        }
    } else {
        if (navPart2) navPart2.classList.add('locked');
        if (part2Card) part2Card.classList.add('locked');
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
            showToast('Fullfør Del 1 først for å låse opp Del 2', 'info');
        });
    }
    
    const part2Btn = document.getElementById('part2-btn');
    if (part2Btn && !CourseState.isPart1Completed()) {
        part2Btn.addEventListener('click', (e) => {
            e.preventDefault();
            showToast('Fullfør Del 1 først for å låse opp Del 2', 'info');
        });
    }
});

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
