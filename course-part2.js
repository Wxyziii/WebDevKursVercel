// ========================================
// PART 2: INTERACTIVE JAVASCRIPT COURSE
// ========================================

let htmlEditor = null;
let cssEditor = null;
let jsEditor = null;
let currentFile = 'html';
let timerInterval = null;
let timeRemaining = CourseState.getTimeRemaining(2);
let startTime = Date.now();

// Editor containers
let htmlEditorContainer = null;
let cssEditorContainer = null;
let jsEditorContainer = null;

// Initialize cheat detection
if (CourseState.isPart1Completed()) {
    CheatDetector.init(2);
}

// ========================================
// CHECK LOCK STATUS
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    
    if (!CourseState.isPart1Completed()) {
        document.getElementById('locked-overlay').style.display = 'flex';
        return;
    }
    
    document.getElementById('locked-overlay').style.display = 'none';
    initializeCourse();
});

function initializeCourse() {
    startTimer();
    updateProgress();
    updateNavigation();
    updateAuthUI();
}

// ========================================
// MONACO EDITOR SETUP
// ========================================

require.config({ 
    paths: { 
        'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' 
    }
});

require(['vs/editor/editor.main'], function() {
    if (!CourseState.isPart1Completed()) return;
    
    // Define dark theme
    monaco.editor.defineTheme('courseTheme', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'comment', foreground: '6A9955' },
            { token: 'keyword', foreground: 'C586C0' },
            { token: 'string', foreground: 'CE9178' },
            { token: 'number', foreground: 'B5CEA8' },
            { token: 'tag', foreground: '569CD6' },
            { token: 'attribute.name', foreground: '9CDCFE' },
            { token: 'attribute.value', foreground: 'CE9178' },
        ],
        colors: {
            'editor.background': '#1a1a1a',
            'editor.foreground': '#d4d4d4',
            'editor.lineHighlightBackground': '#2a2a2a',
            'editorCursor.foreground': '#ffffff',
            'editor.selectionBackground': '#264f78',
            'editorLineNumber.foreground': '#858585',
            'editorLineNumber.activeForeground': '#c6c6c6',
        }
    });

    const mainContainer = document.getElementById('editor-container');
    
    // Create container for HTML editor
    htmlEditorContainer = document.createElement('div');
    htmlEditorContainer.style.width = '100%';
    htmlEditorContainer.style.height = '100%';
    mainContainer.appendChild(htmlEditorContainer);
    
    // Create container for CSS editor (hidden initially)
    cssEditorContainer = document.createElement('div');
    cssEditorContainer.style.width = '100%';
    cssEditorContainer.style.height = '100%';
    cssEditorContainer.style.display = 'none';
    mainContainer.appendChild(cssEditorContainer);
    
    // Create container for JS editor (hidden initially)
    jsEditorContainer = document.createElement('div');
    jsEditorContainer.style.width = '100%';
    jsEditorContainer.style.height = '100%';
    jsEditorContainer.style.display = 'none';
    mainContainer.appendChild(jsEditorContainer);
    
    // Create HTML editor
    htmlEditor = monaco.editor.create(htmlEditorContainer, {
        value: CourseState.getCode(2, 'html'),
        language: 'html',
        theme: 'courseTheme',
        fontSize: 14,
        fontFamily: "'Fira Code', 'Consolas', monospace",
        minimap: { enabled: false },
        automaticLayout: true,
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        lineNumbers: 'on',
        renderWhitespace: 'selection',
        tabSize: 2,
        padding: { top: 16, bottom: 16 }
    });

    // Create CSS editor
    cssEditor = monaco.editor.create(cssEditorContainer, {
        value: CourseState.getCode(2, 'css'),
        language: 'css',
        theme: 'courseTheme',
        fontSize: 14,
        fontFamily: "'Fira Code', 'Consolas', monospace",
        minimap: { enabled: false },
        automaticLayout: true,
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        lineNumbers: 'on',
        renderWhitespace: 'selection',
        tabSize: 2,
        padding: { top: 16, bottom: 16 }
    });

    // Create JS editor
    jsEditor = monaco.editor.create(jsEditorContainer, {
        value: CourseState.getCode(2, 'js'),
        language: 'javascript',
        theme: 'courseTheme',
        fontSize: 14,
        fontFamily: "'Fira Code', 'Consolas', monospace",
        minimap: { enabled: false },
        automaticLayout: true,
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        lineNumbers: 'on',
        renderWhitespace: 'selection',
        tabSize: 2,
        padding: { top: 16, bottom: 16 }
    });

    // Live preview update
    htmlEditor.onDidChangeModelContent(debounce(updatePreview, 300));
    cssEditor.onDidChangeModelContent(debounce(updatePreview, 300));
    jsEditor.onDidChangeModelContent(debounce(updatePreview, 300));

    // Auto-save and cheat tracking
    htmlEditor.onDidChangeModelContent((e) => {
        debounce(() => CourseState.saveCode(2, 'html', htmlEditor.getValue()), 1000)();
        CheatDetector.onCodeChange(e.changes.reduce((sum, c) => sum + c.text.length, 0));
    });
    
    cssEditor.onDidChangeModelContent((e) => {
        debounce(() => CourseState.saveCode(2, 'css', cssEditor.getValue()), 1000)();
        CheatDetector.onCodeChange(e.changes.reduce((sum, c) => sum + c.text.length, 0));
    });
    
    jsEditor.onDidChangeModelContent((e) => {
        debounce(() => CourseState.saveCode(2, 'js', jsEditor.getValue()), 1000)();
        CheatDetector.onCodeChange(e.changes.reduce((sum, c) => sum + c.text.length, 0));
    });

    // Track keystrokes
    htmlEditor.onKeyDown(() => CheatDetector.onKeystroke());
    cssEditor.onKeyDown(() => CheatDetector.onKeystroke());
    jsEditor.onKeyDown(() => CheatDetector.onKeystroke());

    // Initial preview and exercise check
    updatePreview();
    setTimeout(checkExercises, 500);
});

// ========================================
// PREVIEW FUNCTIONALITY
// ========================================

function updatePreview() {
    if (!htmlEditor || !cssEditor || !jsEditor) return;
    
    const htmlCode = htmlEditor.getValue();
    const cssCode = cssEditor.getValue();
    const jsCode = jsEditor.getValue();
    
    const previewFrame = document.getElementById('preview-frame');
    
    // Build complete HTML document
    let combinedHTML = htmlCode;
    
    // Inject CSS
    if (htmlCode.includes('</head>')) {
        combinedHTML = htmlCode.replace('</head>', `<style>${cssCode}</style></head>`);
    } else if (htmlCode.includes('<head>')) {
        combinedHTML = htmlCode.replace('<head>', `<head><style>${cssCode}</style>`);
    } else {
        combinedHTML = `<style>${cssCode}</style>${htmlCode}`;
    }
    
    // Inject JS (before </body> or at end)
    if (combinedHTML.includes('</body>')) {
        combinedHTML = combinedHTML.replace('</body>', `<script>${jsCode}<\/script></body>`);
    } else {
        combinedHTML += `<script>${jsCode}<\/script>`;
    }
    
    // Use srcdoc for better compatibility
    previewFrame.srcdoc = combinedHTML;
    
    // Check exercises after preview update
    checkExercises();
}

// ========================================
// EXERCISE CHECKING
// ========================================

const exerciseChecks = {
    1: () => {
        const html = htmlEditor.getValue();
        return html.includes('class="prosjekter"') && html.includes('prosjekt-grid');
    },
    2: () => {
        const html = htmlEditor.getValue();
        return html.includes('prosjekt-kort') && html.includes('se-mer-btn');
    },
    3: () => {
        const css = cssEditor.getValue();
        return css.includes('.prosjekt-grid') && css.includes('grid') && css.includes('.prosjekt-kort');
    },
    4: () => {
        const html = htmlEditor.getValue();
        return html.includes('kontakt-form') && html.includes('<input') && html.includes('<textarea');
    },
    5: () => {
        const css = cssEditor.getValue();
        return css.includes('#kontakt-form') && css.includes('flex') && css.includes('padding');
    },
    6: () => {
        const js = jsEditor.getValue();
        return js.includes('kontakt-form') && js.includes('addEventListener') && js.includes('submit');
    },
    7: () => {
        const js = jsEditor.getValue();
        return js.includes('se-mer-btn') && js.includes('addEventListener') && js.includes('click');
    },
    8: () => {
        const css = cssEditor.getValue();
        return css.includes('hover') && css.includes('transition') && css.includes('transform');
    }
};

let completedExercises = new Set();

function checkExercises() {
    if (!htmlEditor || !cssEditor || !jsEditor) return;
    
    let completed = 0;
    const total = Object.keys(exerciseChecks).length;
    
    for (const [num, check] of Object.entries(exerciseChecks)) {
        const statusEl = document.getElementById(`ex${num}-status`);
        if (!statusEl) continue;
        
        try {
            if (check()) {
                if (!completedExercises.has(num)) {
                    completedExercises.add(num);
                    statusEl.classList.add('completed');
                    statusEl.textContent = '✓';
                }
                completed++;
            }
        } catch (e) {
            // Ignore errors in checks
        }
    }
    
    // Update progress bar based on exercises
    const progress = (completed / total) * 100;
    const progressFill = document.getElementById('progress-fill');
    if (progressFill) {
        progressFill.style.width = `${progress}%`;
    }
    
    // Enable complete button only if at least 6 exercises are done
    const completeBtn = document.getElementById('complete-btn');
    if (completeBtn) {
        if (completed >= 6) {
            completeBtn.disabled = false;
            completeBtn.classList.remove('btn-disabled');
        } else {
            completeBtn.disabled = true;
            completeBtn.classList.add('btn-disabled');
        }
    }
}

// ========================================
// FILE TAB SWITCHING
// ========================================

document.querySelectorAll('.file-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const file = tab.dataset.file;
        if (file === currentFile) return;
        
        // Update active tab
        document.querySelectorAll('.file-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Switch editors by toggling display
        htmlEditorContainer.style.display = 'none';
        cssEditorContainer.style.display = 'none';
        jsEditorContainer.style.display = 'none';
        
        if (file === 'html') {
            htmlEditorContainer.style.display = 'block';
            htmlEditor.layout();
        } else if (file === 'css') {
            cssEditorContainer.style.display = 'block';
            cssEditor.layout();
        } else if (file === 'js') {
            jsEditorContainer.style.display = 'block';
            jsEditor.layout();
        }
        
        currentFile = file;
    });
});

// ========================================
// SIDEBAR TABS
// ========================================

document.querySelectorAll('.sidebar-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;
        
        // Update active tab
        document.querySelectorAll('.sidebar-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Show corresponding panel
        document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
        document.getElementById(`${tabName}-panel`).classList.add('active');
    });
});

// ========================================
// TIMER FUNCTIONALITY
// ========================================

function startTimer() {
    updateTimerDisplay();
    
    timerInterval = setInterval(() => {
        timeRemaining--;
        CourseState.saveTimeRemaining(2, timeRemaining);
        updateTimerDisplay();
        updateProgress();
        
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            showToast('Tiden er ute! Du kan fortsette å jobbe, men timeren har stoppet.', 'info');
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const display = document.getElementById('timer-display');
    if (display) {
        display.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    
    const timer = document.getElementById('timer');
    if (timer) {
        timer.classList.remove('warning', 'danger');
        
        if (timeRemaining <= 300 && timeRemaining > 60) {
            timer.classList.add('warning');
        } else if (timeRemaining <= 60) {
            timer.classList.add('danger');
        }
    }
}

function updateProgress() {
    const totalTime = 30 * 60;
    const elapsed = totalTime - timeRemaining;
    const progress = (elapsed / totalTime) * 100;
    const progressFill = document.getElementById('progress-fill');
    if (progressFill) {
        progressFill.style.width = `${Math.min(progress, 100)}%`;
    }
}

// ========================================
// TOOLBAR ACTIONS
// ========================================

document.getElementById('save-btn')?.addEventListener('click', () => {
    CourseState.saveCode(2, 'html', htmlEditor.getValue());
    CourseState.saveCode(2, 'css', cssEditor.getValue());
    CourseState.saveCode(2, 'js', jsEditor.getValue());
    showToast('Koden er lagret!', 'success');
});

document.getElementById('save-project-btn')?.addEventListener('click', () => {
    showSaveProjectModal(
        htmlEditor.getValue(),
        cssEditor.getValue(),
        jsEditor.getValue(),
        2
    );
});

document.getElementById('reset-btn')?.addEventListener('click', () => {
    if (confirm('Er du sikker på at du vil tilbakestille koden til utgangspunktet?')) {
        htmlEditor.setValue(CourseState.getDefaultHTML(2));
        cssEditor.setValue(CourseState.getDefaultCSS(2));
        jsEditor.setValue(CourseState.getDefaultJS());
        showToast('Koden er tilbakestilt', 'success');
    }
});

document.getElementById('download-btn')?.addEventListener('click', () => {
    const htmlCode = htmlEditor.getValue();
    const cssCode = cssEditor.getValue();
    const jsCode = jsEditor.getValue();
    
    // Create complete HTML file
    let fullHTML = htmlCode;
    if (htmlCode.includes('</head>')) {
        fullHTML = htmlCode.replace('</head>', `<style>\n${cssCode}\n</style>\n</head>`);
    }
    if (fullHTML.includes('</body>')) {
        fullHTML = fullHTML.replace('</body>', `<script>\n${jsCode}\n<\/script>\n</body>`);
    }
    
    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'min-webapp.html';
    a.click();
    URL.revokeObjectURL(url);
    
    showToast('Filen er lastet ned!', 'success');
});

// ========================================
// COMPLETION
// ========================================

document.getElementById('complete-btn')?.addEventListener('click', async () => {
    const timeUsed = (30 * 60) - timeRemaining;
    
    // Run cheat detection
    const cheatAnalysis = CheatDetector.analyzeForCheating(timeUsed);
    
    const user = AuthService.getCurrentUser();
    
    if (user) {
        // Get existing completion from Part 1
        const existingCompletion = await db.getLatestUserCompletion(user.id);
        
        if (existingCompletion) {
            // Update existing completion with Part 2 time
            const part1Time = existingCompletion.part1_time || 0;
            const totalTime = part1Time + timeUsed;
            
            await db.updateCompletion(existingCompletion.id, {
                part2Time: timeUsed,
                totalTime: totalTime,
                isFlagged: cheatAnalysis.isSuspicious || existingCompletion.is_flagged,
                flagReason: cheatAnalysis.isSuspicious ? cheatAnalysis.flags.join(', ') : existingCompletion.flag_reason,
                cheatScore: Math.max(cheatAnalysis.summary?.cheatScore || 0, existingCompletion.cheat_score || 0)
            });
        } else {
            // No Part 1 completion found, create new (shouldn't normally happen)
            await db.saveCompletion(user.id, {
                part1Time: null,
                part2Time: timeUsed,
                totalTime: timeUsed,
                isFlagged: cheatAnalysis.isSuspicious,
                flagReason: cheatAnalysis.isSuspicious ? cheatAnalysis.flags.join(', ') : null,
                cheatScore: cheatAnalysis.summary?.cheatScore || 0
            });
        }
        
        // Flag user if suspicious
        if (cheatAnalysis.isSuspicious) {
            await db.flagUser(user.id, cheatAnalysis.flags.join(', '));
            console.warn('User flagged for suspicious activity:', cheatAnalysis);
        }
        
        // Update user record
        await db.updateUser(user.id, { part2Completed: true });
    }
    
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    // Show appropriate modal
    if (cheatAnalysis.isSuspicious) {
        showCheatWarningModal(cheatAnalysis);
    } else {
        document.getElementById('completion-modal').classList.add('active');
    }
});

function showCheatWarningModal(analysis) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-icon">⚠️</div>
            <h2>Kurs Fullført!</h2>
            <p>Vi har registrert noe uvanlig aktivitet under din sesjon:</p>
            <ul style="text-align: left; margin: 16px 0; color: var(--text-secondary); font-size: 14px;">
                ${analysis.flags.map(f => `<li style="margin-bottom: 8px;">${f}</li>`).join('')}
            </ul>
            <p style="font-size: 13px; color: var(--text-muted);">
                Resultatet ditt er lagret, men kan bli vurdert nærmere. 
                Husk at ekte læring tar tid!
            </p>
            <div class="modal-actions">
                <a href="index.html" class="btn btn-primary">Tilbake til Hjem</a>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// ========================================
// RESIZER FUNCTIONALITY
// ========================================

const resizer = document.getElementById('resizer');
const editorArea = document.querySelector('.editor-container');
let isResizing = false;

resizer?.addEventListener('mousedown', (e) => {
    isResizing = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
});

document.addEventListener('mousemove', (e) => {
    if (!isResizing || !editorArea) return;
    
    const containerRect = editorArea.getBoundingClientRect();
    const percentage = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    
    if (percentage > 20 && percentage < 80) {
        document.querySelector('.code-editor').style.flex = `0 0 ${percentage}%`;
        document.querySelector('.preview-container').style.flex = `0 0 ${100 - percentage}%`;
        
        if (currentFile === 'html' && htmlEditor) {
            htmlEditor.layout();
        } else if (currentFile === 'css' && cssEditor) {
            cssEditor.layout();
        } else if (jsEditor) {
            jsEditor.layout();
        }
    }
});

document.addEventListener('mouseup', () => {
    isResizing = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
});

// ========================================
// UTILITY FUNCTIONS
// ========================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
