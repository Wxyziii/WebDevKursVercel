// ========================================
// AUTHENTICATION SERVICE
// ========================================

const AuthService = {
    STORAGE_KEY: 'webdev_current_user',

    getCurrentUser() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    },

    setCurrentUser(user) {
        if (user) {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
        } else {
            localStorage.removeItem(this.STORAGE_KEY);
        }
    },

    isLoggedIn() {
        return this.getCurrentUser() !== null;
    },

    isAdmin() {
        const user = this.getCurrentUser();
        return user && user.isAdmin === true;
    },

    async register(name, email, password) {
        if (!name || name.length < 2) {
            throw new Error('Navn må være minst 2 tegn');
        }
        if (!email || !email.includes('@')) {
            throw new Error('Ugyldig e-postadresse');
        }
        if (!password || password.length < 6) {
            throw new Error('Passord må være minst 6 tegn');
        }

        const user = await db.createUser(name, email, password);
        this.setCurrentUser(user);
        return user;
    },

    async login(email, password) {
        const user = await db.loginUser(email, password);
        this.setCurrentUser(user);
        return user;
    },

    logout() {
        this.setCurrentUser(null);
        window.location.href = 'index.html';
    },

    async refreshUser() {
        const current = this.getCurrentUser();
        if (current) {
            const updated = await db.getUserById(current.id);
            if (updated) {
                this.setCurrentUser(updated);
                return updated;
            }
        }
        return null;
    }
};

// ========================================
// CHEAT DETECTION SERVICE
// ========================================

const CheatDetector = {
    sessionId: null,
    activityLog: [],
    keystrokes: 0,
    codeChanges: 0,
    focusTime: 0,
    lastFocusTime: null,
    editorActive: false,
    startTime: null,

    init(part) {
        this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        this.activityLog = [];
        this.keystrokes = 0;
        this.codeChanges = 0;
        this.focusTime = 0;
        this.lastFocusTime = Date.now();
        this.editorActive = true;
        this.startTime = Date.now();
        this.part = part;

        // Track window focus
        window.addEventListener('focus', () => this.onFocus());
        window.addEventListener('blur', () => this.onBlur());

        // Track visibility
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.onBlur();
            } else {
                this.onFocus();
            }
        });

        this.logActivity('session_start', { part });
    },

    onFocus() {
        if (!this.editorActive) {
            this.lastFocusTime = Date.now();
            this.editorActive = true;
            this.logActivity('window_focus', {});
        }
    },

    onBlur() {
        if (this.editorActive && this.lastFocusTime) {
            this.focusTime += Date.now() - this.lastFocusTime;
            this.editorActive = false;
            this.logActivity('window_blur', { focusTime: this.focusTime });
        }
    },

    onKeystroke() {
        this.keystrokes++;
    },

    onCodeChange(changeSize) {
        this.codeChanges++;
        
        // Detect large pastes (potential copy-paste)
        if (changeSize > 100) {
            this.logActivity('large_paste', { size: changeSize });
        }
    },

    logActivity(type, data) {
        const activity = {
            type,
            data,
            timestamp: Date.now()
        };
        this.activityLog.push(activity);

        // Save to database if user is logged in
        const user = AuthService.getCurrentUser();
        if (user) {
            db.logActivity(user.id, this.sessionId, type, data).catch(console.error);
        }
    },

    getActivitySummary() {
        // Calculate final focus time
        if (this.editorActive && this.lastFocusTime) {
            this.focusTime += Date.now() - this.lastFocusTime;
        }

        const totalTime = Date.now() - this.startTime;
        const focusPercentage = (this.focusTime / totalTime) * 100;

        return {
            sessionId: this.sessionId,
            totalTime,
            focusTime: this.focusTime,
            focusPercentage,
            keystrokes: this.keystrokes,
            codeChanges: this.codeChanges,
            activityLog: this.activityLog
        };
    },

    analyzeForCheating(timeUsed) {
        const summary = this.getActivitySummary();
        const flags = [];
        let suspicionScore = 0;

        // Check 1: Unrealistically fast completion (less than 5 minutes for a 30-min course)
        if (timeUsed < 5 * 60) {
            flags.push('Fullført på under 5 minutter');
            suspicionScore += 40;
        } else if (timeUsed < 10 * 60) {
            flags.push('Fullført veldig raskt (under 10 minutter)');
            suspicionScore += 20;
        }

        // Check 2: Very few keystrokes
        if (this.keystrokes < 50) {
            flags.push('Svært få tastetrykk registrert');
            suspicionScore += 30;
        } else if (this.keystrokes < 100) {
            flags.push('Få tastetrykk registrert');
            suspicionScore += 15;
        }

        // Check 3: Very few code changes
        if (this.codeChanges < 10) {
            flags.push('Svært få kodeendringer');
            suspicionScore += 30;
        } else if (this.codeChanges < 20) {
            flags.push('Få kodeendringer');
            suspicionScore += 15;
        }

        // Check 4: Low focus time (window not active)
        if (summary.focusPercentage < 30) {
            flags.push('Editoren var lite aktiv (under 30% av tiden)');
            suspicionScore += 25;
        } else if (summary.focusPercentage < 50) {
            flags.push('Editoren var aktiv mindre enn halvparten av tiden');
            suspicionScore += 10;
        }

        // Check 5: Large pastes detected
        const largePastes = this.activityLog.filter(a => a.type === 'large_paste');
        if (largePastes.length > 3) {
            flags.push(`${largePastes.length} store innliminger oppdaget`);
            suspicionScore += 20;
        }

        return {
            isSuspicious: suspicionScore >= 50,
            suspicionScore,
            flags,
            summary
        };
    }
};

// ========================================
// UI COMPONENTS
// ========================================

function createAuthModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'auth-modal';
    modal.innerHTML = `
        <div class="modal auth-modal">
            <button class="modal-close" onclick="closeAuthModal()">&times;</button>
            <div class="auth-tabs">
                <button class="auth-tab active" data-tab="login">Logg inn</button>
                <button class="auth-tab" data-tab="register">Registrer</button>
            </div>
            
            <form id="login-form" class="auth-form">
                <div class="form-group">
                    <label for="login-email">E-post</label>
                    <input type="email" id="login-email" required placeholder="din@epost.no">
                </div>
                <div class="form-group">
                    <label for="login-password">Passord</label>
                    <input type="password" id="login-password" required placeholder="••••••••">
                </div>
                <div class="form-error" id="login-error"></div>
                <button type="submit" class="btn btn-primary btn-block">Logg inn</button>
            </form>
            
            <form id="register-form" class="auth-form hidden">
                <div class="form-group">
                    <label for="register-name">Navn</label>
                    <input type="text" id="register-name" required placeholder="Ditt navn">
                </div>
                <div class="form-group">
                    <label for="register-email">E-post</label>
                    <input type="email" id="register-email" required placeholder="din@epost.no">
                </div>
                <div class="form-group">
                    <label for="register-password">Passord</label>
                    <input type="password" id="register-password" required placeholder="Minst 6 tegn">
                </div>
                <div class="form-error" id="register-error"></div>
                <button type="submit" class="btn btn-primary btn-block">Registrer</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);

    // Tab switching
    modal.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            modal.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const isLogin = tab.dataset.tab === 'login';
            document.getElementById('login-form').classList.toggle('hidden', !isLogin);
            document.getElementById('register-form').classList.toggle('hidden', isLogin);
        });
    });

    // Login form
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const errorEl = document.getElementById('login-error');

        try {
            await AuthService.login(email, password);
            closeAuthModal();
            updateAuthUI();
            showToast('Innlogget!', 'success');
        } catch (err) {
            errorEl.textContent = err.message;
        }
    });

    // Register form
    document.getElementById('register-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const errorEl = document.getElementById('register-error');

        try {
            await AuthService.register(name, email, password);
            closeAuthModal();
            updateAuthUI();
            showToast('Konto opprettet!', 'success');
        } catch (err) {
            errorEl.textContent = err.message;
        }
    });

    return modal;
}

function showAuthModal() {
    let modal = document.getElementById('auth-modal');
    if (!modal) {
        modal = createAuthModal();
    }
    modal.classList.add('active');
}

function closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function updateAuthUI() {
    const user = AuthService.getCurrentUser();
    const authBtn = document.getElementById('auth-btn');
    const userInfo = document.getElementById('user-info');

    if (user) {
        if (authBtn) authBtn.style.display = 'none';
        if (userInfo) {
            userInfo.style.display = 'flex';
            userInfo.querySelector('.user-name').textContent = user.name;
        }
    } else {
        if (authBtn) authBtn.style.display = 'block';
        if (userInfo) userInfo.style.display = 'none';
    }
}

// ========================================
// LEADERBOARD
// ========================================

async function loadLeaderboard() {
    const container = document.getElementById('leaderboard-content');
    if (!container) return;

    container.innerHTML = '<div class="loading">Laster rangeringsliste...</div>';
    const isAdmin = AuthService.isAdmin();

    try {
        const leaderboard = await db.getLeaderboard();
        
        if (leaderboard.length === 0) {
            container.innerHTML = '<div class="empty-state">Ingen har fullført kurset ennå. Bli den første!</div>';
            return;
        }

        container.innerHTML = `
            <table class="leaderboard-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Navn</th>
                        <th>Del 1</th>
                        <th>Del 2</th>
                        <th>Total tid</th>
                        <th>Status</th>
                        ${isAdmin ? '<th>Admin</th>' : ''}
                    </tr>
                </thead>
                <tbody>
                    ${leaderboard.map((entry, index) => `
                        <tr class="${entry.isFlagged ? 'flagged' : ''}" data-completion-id="${entry.id}" data-user-id="${entry.userId}">
                            <td class="rank">${index + 1}</td>
                            <td class="name">${escapeHtml(entry.userName)}</td>
                            <td>${formatTime(entry.part1Time)}</td>
                            <td>${formatTime(entry.part2Time)}</td>
                            <td class="total-time">${formatTime(entry.totalTime)}</td>
                            <td class="status">
                                ${entry.isFlagged ? '<span class="flag-badge">⚠️ Flagget</span>' : '<span class="valid-badge">✓ Gyldig</span>'}
                            </td>
                            ${isAdmin ? `
                            <td class="admin-actions">
                                <button class="btn btn-sm btn-danger" onclick="adminDeleteEntry(${entry.id}, ${entry.userId})">🗑️</button>
                            </td>
                            ` : ''}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (err) {
        container.innerHTML = `<div class="error">Feil ved lasting: ${err.message}</div>`;
    }
}

// Admin delete entry from leaderboard
async function adminDeleteEntry(completionId, userId) {
    if (!AuthService.isAdmin()) {
        showToast('Kun admin kan gjøre dette', 'error');
        return;
    }
    
    if (!confirm('Er du sikker på at du vil slette denne oppføringen fra leaderboard?')) {
        return;
    }
    
    try {
        await db.deleteCompletion(completionId);
        showToast('Oppføring slettet fra leaderboard', 'success');
        loadLeaderboard();
    } catch (err) {
        showToast('Feil ved sletting: ' + err.message, 'error');
    }
}

// Admin delete user completely
async function adminDeleteUser(userId) {
    if (!AuthService.isAdmin()) {
        showToast('Kun admin kan gjøre dette', 'error');
        return;
    }
    
    if (!confirm('Er du sikker på at du vil slette denne brukeren og alt deres innhold?')) {
        return;
    }
    
    try {
        await db.deleteUser(userId);
        showToast('Bruker og alt innhold slettet', 'success');
        loadLeaderboard();
        loadGallery();
    } catch (err) {
        showToast('Feil ved sletting: ' + err.message, 'error');
    }
}

// Admin delete project from gallery
async function adminDeleteProject(projectId) {
    if (!AuthService.isAdmin()) {
        showToast('Kun admin kan gjøre dette', 'error');
        return;
    }
    
    if (!confirm('Er du sikker på at du vil slette dette prosjektet?')) {
        return;
    }
    
    try {
        await db.deleteProject(projectId);
        showToast('Prosjekt slettet', 'success');
        closeProjectModal();
        loadGallery();
    } catch (err) {
        showToast('Feil ved sletting: ' + err.message, 'error');
    }
}

// ========================================
// GALLERY (View other users' work)
// ========================================

async function loadGallery() {
    const container = document.getElementById('gallery-content');
    if (!container) return;

    container.innerHTML = '<div class="loading">Laster prosjekter...</div>';

    try {
        const projects = await db.getPublicProjects();
        
        if (projects.length === 0) {
            container.innerHTML = '<div class="empty-state">Ingen offentlige prosjekter ennå. Del ditt arbeid!</div>';
            return;
        }

        container.innerHTML = '<div class="gallery-grid"></div>';
        const grid = container.querySelector('.gallery-grid');
        
        projects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'gallery-card glass-card';
            card.onclick = () => viewProject(project.id);
            
            const preview = document.createElement('div');
            preview.className = 'gallery-preview';
            
            const iframe = document.createElement('iframe');
            iframe.sandbox = 'allow-scripts';
            iframe.srcdoc = buildProjectHTML(project);
            preview.appendChild(iframe);
            
            const info = document.createElement('div');
            info.className = 'gallery-info';
            info.innerHTML = `
                <h4>${escapeHtml(project.title)}</h4>
                <p>av ${escapeHtml(project.userName)}</p>
                <span class="gallery-date">${formatDate(project.createdAt)}</span>
            `;
            
            card.appendChild(preview);
            card.appendChild(info);
            grid.appendChild(card);
        });
    } catch (err) {
        container.innerHTML = `<div class="error">Feil ved lasting: ${err.message}</div>`;
    }
}

async function viewProject(projectId) {
    const project = await db.getProjectById(projectId);
    if (!project) {
        showToast('Prosjekt ikke funnet', 'error');
        return;
    }

    const isAdmin = AuthService.isAdmin();
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.id = 'project-modal';
    modal.innerHTML = `
        <div class="modal project-modal">
            <button class="modal-close" onclick="closeProjectModal()">&times;</button>
            <div class="project-header">
                <div>
                    <h2>${escapeHtml(project.title)}</h2>
                    <p class="project-author">av ${escapeHtml(project.userName)}</p>
                </div>
                ${isAdmin ? `<button class="btn btn-danger btn-sm" onclick="adminDeleteProject(${project.id})">🗑️ Slett prosjekt</button>` : ''}
            </div>
            
            <div class="project-tabs">
                <button class="project-tab active" data-tab="preview">Preview</button>
                <button class="project-tab" data-tab="html">HTML</button>
                <button class="project-tab" data-tab="css">CSS</button>
                ${project.js ? '<button class="project-tab" data-tab="js">JavaScript</button>' : ''}
            </div>
            
            <div class="project-content">
                <div class="project-panel active" id="preview-panel">
                </div>
                <div class="project-panel" id="html-panel">
                    <pre class="code-display"><code>${escapeHtml(project.html)}</code></pre>
                </div>
                <div class="project-panel" id="css-panel">
                    <pre class="code-display"><code>${escapeHtml(project.css)}</code></pre>
                </div>
                ${project.js ? `
                <div class="project-panel" id="js-panel">
                    <pre class="code-display"><code>${escapeHtml(project.js)}</code></pre>
                </div>
                ` : ''}
            </div>
        </div>
    `;
    
    // Create iframe separately to avoid escaping issues
    const previewPanel = modal.querySelector('#preview-panel');
    const iframe = document.createElement('iframe');
    iframe.className = 'project-preview-frame';
    iframe.srcdoc = buildProjectHTML(project);
    previewPanel.appendChild(iframe);
    
    document.body.appendChild(modal);

    // Tab switching
    modal.querySelectorAll('.project-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            modal.querySelectorAll('.project-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            modal.querySelectorAll('.project-panel').forEach(p => p.classList.remove('active'));
            document.getElementById(`${tab.dataset.tab}-panel`).classList.add('active');
        });
    });
}

function closeProjectModal() {
    const modal = document.getElementById('project-modal');
    if (modal) modal.remove();
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function buildProjectHTML(project) {
    let html = project.html;
    
    if (html.includes('</head>')) {
        html = html.replace('</head>', `<style>${project.css}</style></head>`);
    } else {
        html = `<style>${project.css}</style>${html}`;
    }
    
    if (project.js) {
        if (html.includes('</body>')) {
            html = html.replace('</body>', `<script>${project.js}<\/script></body>`);
        } else {
            html += `<script>${project.js}<\/script>`;
        }
    }
    
    return html;
}

function formatTime(seconds) {
    if (seconds === null || seconds === undefined) return '-';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
}

function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString('no-NO', { day: 'numeric', month: 'short', year: 'numeric' });
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ========================================
// SAVE PROJECT MODAL
// ========================================

async function showSaveProjectModal(html, css, js, part) {
    const user = AuthService.getCurrentUser();
    if (!user) {
        showAuthModal();
        showToast('Logg inn for å lagre prosjektet', 'info');
        return;
    }

    // Check if user already has a public project
    const hasExisting = await db.hasPublicProject(user.id);
    const publicNote = hasExisting 
        ? '<p class="form-note">Du har allerede et offentlig prosjekt. Hvis du velger offentlig, vil det erstatte ditt eksisterende prosjekt i galleriet.</p>'
        : '';

    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.id = 'save-project-modal';
    modal.innerHTML = `
        <div class="modal">
            <button class="modal-close" onclick="closeSaveProjectModal()">&times;</button>
            <div class="modal-icon">💾</div>
            <h2>Lagre Prosjekt</h2>
            <form id="save-project-form">
                <div class="form-group">
                    <label for="project-title">Prosjektnavn</label>
                    <input type="text" id="project-title" required placeholder="Mitt kule prosjekt">
                </div>
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="project-public">
                        Gjør prosjektet offentlig (andre kan se det)
                    </label>
                    ${publicNote}
                </div>
                <div class="form-error" id="save-project-error"></div>
                <div class="modal-actions">
                    <button type="button" class="btn btn-secondary" onclick="closeSaveProjectModal()">Avbryt</button>
                    <button type="submit" class="btn btn-primary">Lagre</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('save-project-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('project-title').value;
        const isPublic = document.getElementById('project-public').checked;

        try {
            await db.saveProject(user.id, {
                title,
                html,
                css,
                js,
                part,
                isPublic
            });
            closeSaveProjectModal();
            showToast(isPublic && hasExisting ? 'Prosjekt oppdatert i galleriet!' : 'Prosjekt lagret!', 'success');
        } catch (err) {
            document.getElementById('save-project-error').textContent = err.message;
        }
    });
}

function closeSaveProjectModal() {
    const modal = document.getElementById('save-project-modal');
    if (modal) modal.remove();
}
