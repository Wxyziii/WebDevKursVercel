// ========================================
// PART 3: REACT + VITE COURSE
// ========================================

let jsxEditor = null;
let cssEditor = null;
let mainEditor = null;
let currentFile = "jsx";
let timerInterval = null;
let timeRemaining = CourseState.getTimeRemaining(3);
let startTime = Date.now();

// Editor containers
let jsxEditorContainer = null;
let cssEditorContainer = null;
let mainEditorContainer = null;

// Initialize cheat detection
if (isAdminUser() || CourseState.isPart2Completed()) {
  CheatDetector.init(3);
}

// ========================================
// CHECK LOCK STATUS
// ========================================

document.addEventListener("DOMContentLoaded", () => {
  updateAuthUI();

  if (!isAdminUser() && !CourseState.isPart2Completed()) {
    document.getElementById("locked-overlay").style.display = "flex";
    return;
  }

  document.getElementById("locked-overlay").style.display = "none";
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
    vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs",
  },
});

require(["vs/editor/editor.main"], function () {
  if (!isAdminUser() && !CourseState.isPart2Completed()) return;

  // Define dark theme
  monaco.editor.defineTheme("courseTheme", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "6A9955" },
      { token: "keyword", foreground: "C586C0" },
      { token: "string", foreground: "CE9178" },
      { token: "number", foreground: "B5CEA8" },
      { token: "tag", foreground: "569CD6" },
      { token: "attribute.name", foreground: "9CDCFE" },
      { token: "attribute.value", foreground: "CE9178" },
    ],
    colors: {
      "editor.background": "#1a1a1a",
      "editor.foreground": "#d4d4d4",
      "editor.lineHighlightBackground": "#2a2a2a",
      "editorCursor.foreground": "#ffffff",
      "editor.selectionBackground": "#264f78",
      "editorLineNumber.foreground": "#858585",
      "editorLineNumber.activeForeground": "#c6c6c6",
    },
  });

  const mainContainer = document.getElementById("editor-container");

  // Create container for JSX editor
  jsxEditorContainer = document.createElement("div");
  jsxEditorContainer.style.width = "100%";
  jsxEditorContainer.style.height = "100%";
  mainContainer.appendChild(jsxEditorContainer);

  // Create container for CSS editor (hidden initially)
  cssEditorContainer = document.createElement("div");
  cssEditorContainer.style.width = "100%";
  cssEditorContainer.style.height = "100%";
  cssEditorContainer.style.display = "none";
  mainContainer.appendChild(cssEditorContainer);

  // Create container for main.jsx editor (hidden initially)
  mainEditorContainer = document.createElement("div");
  mainEditorContainer.style.width = "100%";
  mainEditorContainer.style.height = "100%";
  mainEditorContainer.style.display = "none";
  mainContainer.appendChild(mainEditorContainer);

  // Create JSX editor
  jsxEditor = monaco.editor.create(jsxEditorContainer, {
    value: CourseState.getCode(3, "jsx"),
    language: "javascript",
    theme: "courseTheme",
    fontSize: 14,
    fontFamily: "'Fira Code', 'Consolas', monospace",
    minimap: { enabled: false },
    automaticLayout: true,
    scrollBeyondLastLine: false,
    wordWrap: "on",
    lineNumbers: "on",
    renderWhitespace: "selection",
    tabSize: 2,
    padding: { top: 16, bottom: 16 },
  });

  // Create CSS editor
  cssEditor = monaco.editor.create(cssEditorContainer, {
    value: CourseState.getCode(3, "css"),
    language: "css",
    theme: "courseTheme",
    fontSize: 14,
    fontFamily: "'Fira Code', 'Consolas', monospace",
    minimap: { enabled: false },
    automaticLayout: true,
    scrollBeyondLastLine: false,
    wordWrap: "on",
    lineNumbers: "on",
    renderWhitespace: "selection",
    tabSize: 2,
    padding: { top: 16, bottom: 16 },
  });

  // Create main.jsx editor
  mainEditor = monaco.editor.create(mainEditorContainer, {
    value: CourseState.getCode(3, "main"),
    language: "javascript",
    theme: "courseTheme",
    fontSize: 14,
    fontFamily: "'Fira Code', 'Consolas', monospace",
    minimap: { enabled: false },
    automaticLayout: true,
    scrollBeyondLastLine: false,
    wordWrap: "on",
    lineNumbers: "on",
    renderWhitespace: "selection",
    tabSize: 2,
    padding: { top: 16, bottom: 16 },
  });

  // Live preview update
  jsxEditor.onDidChangeModelContent(debounce(updatePreview, 100));
  cssEditor.onDidChangeModelContent(debounce(updatePreview, 100));
  mainEditor.onDidChangeModelContent(debounce(updatePreview, 100));

  // Auto-save and cheat tracking
  jsxEditor.onDidChangeModelContent((e) => {
    debounce(
      () => CourseState.saveCode(3, "jsx", jsxEditor.getValue()),
      1000,
    )();
    CheatDetector.onCodeChange(
      e.changes.reduce((sum, c) => sum + c.text.length, 0),
    );
  });

  cssEditor.onDidChangeModelContent((e) => {
    debounce(
      () => CourseState.saveCode(3, "css", cssEditor.getValue()),
      1000,
    )();
    CheatDetector.onCodeChange(
      e.changes.reduce((sum, c) => sum + c.text.length, 0),
    );
  });

  mainEditor.onDidChangeModelContent((e) => {
    debounce(
      () => CourseState.saveCode(3, "main", mainEditor.getValue()),
      1000,
    )();
    CheatDetector.onCodeChange(
      e.changes.reduce((sum, c) => sum + c.text.length, 0),
    );
  });

  // Track keystrokes
  jsxEditor.onKeyDown(() => CheatDetector.onKeystroke());
  cssEditor.onKeyDown(() => CheatDetector.onKeystroke());
  mainEditor.onKeyDown(() => CheatDetector.onKeystroke());

  // Initial preview and exercise check
  updatePreview();
  setTimeout(checkExercises, 500);
});

// ========================================
// PREVIEW FUNCTIONALITY
// ========================================

function updatePreview() {
  if (!jsxEditor || !cssEditor || !mainEditor) return;

  const jsxCode = jsxEditor.getValue();
  const cssCode = cssEditor.getValue();
  const mainCode = mainEditor.getValue();

  const previewFrame = document.getElementById("preview-frame");

  // Build an HTML page that loads React via CDN, transpiles JSX with Babel standalone
  const previewHTML = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>${cssCode}</style>
    <script src="https://unpkg.com/react@18/umd/react.development.js"><\/script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"><\/script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel">
const { useState, useEffect, useRef } = React;
${jsxCode}
${mainCode}
    <\/script>
</body>
</html>`;

  previewFrame.srcdoc = previewHTML;

  // Check exercises after preview update
  checkExercises();
}

// ========================================
// EXERCISE CHECKING
// ========================================

const exerciseChecks = {
  1: () => {
    const jsx = jsxEditor.getValue();
    return (
      jsx.includes("function App") &&
      jsx.includes("return") &&
      jsx.includes("className")
    );
  },
  2: () => {
    const jsx = jsxEditor.getValue();
    return (
      jsx.includes("useState") &&
      jsx.includes("count") &&
      jsx.includes("setCount")
    );
  },
  3: () => {
    const jsx = jsxEditor.getValue();
    return jsx.includes("onClick") && jsx.includes("setCount");
  },
  4: () => {
    const jsx = jsxEditor.getValue();
    return (
      jsx.includes("function Card") &&
      jsx.includes("props") &&
      jsx.includes("<Card")
    );
  },
  5: () => {
    const css = cssEditor.getValue();
    return (
      css.includes(".card") && css.includes("button") && css.includes("padding")
    );
  },
  6: () => {
    const jsx = jsxEditor.getValue();
    return jsx.includes(".map(") && jsx.includes("key=");
  },
  7: () => {
    const jsx = jsxEditor.getValue();
    return (
      ((jsx.includes("visible") || jsx.includes("show")) &&
        jsx.includes("&&") &&
        jsx.includes("setVisible")) ||
      jsx.includes("setShow")
    );
  },
  8: () => {
    const css = cssEditor.getValue();
    return (
      css.includes("hover") &&
      css.includes("transition") &&
      css.includes("transform")
    );
  },
};

let completedExercises = new Set();

function checkExercises() {
  if (!jsxEditor || !cssEditor || !mainEditor) return;

  let completed = 0;
  const total = Object.keys(exerciseChecks).length;

  for (const [num, check] of Object.entries(exerciseChecks)) {
    const statusEl = document.getElementById(`ex${num}-status`);
    if (!statusEl) continue;

    try {
      if (check()) {
        if (!completedExercises.has(num)) {
          completedExercises.add(num);
          statusEl.classList.add("completed");
          statusEl.textContent = "✓";
        }
        completed++;
      }
    } catch (e) {
      // Ignore errors in checks
    }
  }

  // Update progress bar based on exercises
  const progress = (completed / total) * 100;
  const progressFill = document.getElementById("progress-fill");
  if (progressFill) {
    progressFill.style.width = `${progress}%`;
  }

  // Enable complete button only if at least 6 exercises are done
  const completeBtn = document.getElementById("complete-btn");
  if (completeBtn) {
    if (completed >= 6) {
      completeBtn.disabled = false;
      completeBtn.classList.remove("btn-disabled");
    } else {
      completeBtn.disabled = true;
      completeBtn.classList.add("btn-disabled");
    }
  }
}

// ========================================
// FILE TAB SWITCHING
// ========================================

document.querySelectorAll(".file-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    const file = tab.dataset.file;
    if (file === currentFile) return;

    // Update active tab
    document
      .querySelectorAll(".file-tab")
      .forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    // Switch editors by toggling display
    jsxEditorContainer.style.display = "none";
    cssEditorContainer.style.display = "none";
    mainEditorContainer.style.display = "none";

    if (file === "jsx") {
      jsxEditorContainer.style.display = "block";
      jsxEditor.layout();
    } else if (file === "css") {
      cssEditorContainer.style.display = "block";
      cssEditor.layout();
    } else if (file === "main") {
      mainEditorContainer.style.display = "block";
      mainEditor.layout();
    }

    currentFile = file;
  });
});

// ========================================
// SIDEBAR TABS
// ========================================

document.querySelectorAll(".sidebar-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    const tabName = tab.dataset.tab;

    // Update active tab
    document
      .querySelectorAll(".sidebar-tab")
      .forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    // Show corresponding panel
    document
      .querySelectorAll(".tab-panel")
      .forEach((panel) => panel.classList.remove("active"));
    document.getElementById(`${tabName}-panel`).classList.add("active");
  });
});

// ========================================
// TIMER FUNCTIONALITY
// ========================================

function startTimer() {
  updateTimerDisplay();

  timerInterval = setInterval(() => {
    timeRemaining--;
    updateTimerDisplay();

    try {
      CourseState.saveTimeRemaining(3, timeRemaining);
    } catch (e) {
      // localStorage might fail in private browsing mode
    }

    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      showToast(
        "Tiden er ute! Du kan fortsette å jobbe, men timeren har stoppet.",
        "info",
      );
    }
  }, 1000);
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const display = document.getElementById("timer-display");
  if (display) {
    display.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  const timer = document.getElementById("timer");
  if (timer) {
    timer.classList.remove("warning", "danger");

    if (timeRemaining <= 300 && timeRemaining > 60) {
      timer.classList.add("warning");
    } else if (timeRemaining <= 60) {
      timer.classList.add("danger");
    }
  }
}

function updateProgress() {
  const totalTime = 30 * 60;
  const elapsed = totalTime - timeRemaining;
  const progress = (elapsed / totalTime) * 100;
  const progressFill = document.getElementById("progress-fill");
  if (progressFill) {
    progressFill.style.width = `${Math.min(progress, 100)}%`;
  }
}

// ========================================
// TOOLBAR ACTIONS
// ========================================

document.getElementById("save-btn")?.addEventListener("click", () => {
  CourseState.saveCode(3, "jsx", jsxEditor.getValue());
  CourseState.saveCode(3, "css", cssEditor.getValue());
  CourseState.saveCode(3, "main", mainEditor.getValue());
  showToast("Koden er lagret!", "success");
});

document.getElementById("save-project-btn")?.addEventListener("click", () => {
  showSaveProjectModal(
    jsxEditor.getValue(),
    cssEditor.getValue(),
    mainEditor.getValue(),
    3,
  );
});

document.getElementById("reset-btn")?.addEventListener("click", () => {
  if (
    confirm("Er du sikker på at du vil tilbakestille koden til utgangspunktet?")
  ) {
    jsxEditor.setValue(CourseState.getDefaultJSX());
    cssEditor.setValue(CourseState.getDefaultCSS(3));
    mainEditor.setValue(CourseState.getDefaultMain());
    showToast("Koden er tilbakestilt", "success");
  }
});

document.getElementById("download-btn")?.addEventListener("click", () => {
  const jsxCode = jsxEditor.getValue();
  const cssCode = cssEditor.getValue();
  const mainCode = mainEditor.getValue();

  // Create a complete HTML file with React CDN
  const fullHTML = `<!DOCTYPE html>
<html lang="no">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Min React App</title>
    <style>
${cssCode}
    </style>
    <script src="https://unpkg.com/react@18/umd/react.development.js"><\/script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"><\/script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel">
const { useState, useEffect, useRef } = React;
${jsxCode}
${mainCode}
    <\/script>
</body>
</html>`;

  const blob = new Blob([fullHTML], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "min-react-app.html";
  a.click();
  URL.revokeObjectURL(url);

  showToast("Filen er lastet ned!", "success");
});

// ========================================
// COMPLETION
// ========================================

document.getElementById("complete-btn")?.addEventListener("click", async () => {
  const timeUsed = 30 * 60 - timeRemaining;

  // Run cheat detection
  const cheatAnalysis = CheatDetector.analyzeForCheating(timeUsed);

  const user = AuthService.getCurrentUser();

  if (user) {
    try {
      // Get existing completion
      const existingCompletion = await db.getLatestUserCompletion(user.id);

      if (existingCompletion) {
        const part1Time = existingCompletion.part1_time || 0;
        const part2Time = existingCompletion.part2_time || 0;
        const totalTime = part1Time + part2Time + timeUsed;

        await db.updateCompletion(existingCompletion.id, {
          part3Time: timeUsed,
          totalTime: totalTime,
          isFlagged: cheatAnalysis.isSuspicious || existingCompletion.is_flagged,
          flagReason: cheatAnalysis.isSuspicious
            ? cheatAnalysis.flags.join(", ")
            : existingCompletion.flag_reason,
          cheatScore: Math.max(
            cheatAnalysis.summary?.cheatScore || 0,
            existingCompletion.cheat_score || 0,
          ),
        });
      } else {
        await db.saveCompletion(user.id, {
          part1Time: null,
          part2Time: null,
          part3Time: timeUsed,
          totalTime: timeUsed,
          isFlagged: cheatAnalysis.isSuspicious,
          flagReason: cheatAnalysis.isSuspicious
            ? cheatAnalysis.flags.join(", ")
            : null,
          cheatScore: cheatAnalysis.summary?.cheatScore || 0,
        });
      }

      // Flag user if suspicious
      if (cheatAnalysis.isSuspicious) {
        await db.flagUser(user.id, cheatAnalysis.flags.join(", "));
        console.warn("User flagged for suspicious activity:", cheatAnalysis);
      }

      // Update user record
      try {
        await db.updateUser(user.id, { part3Completed: true });
      } catch (e) {
        console.warn("Could not update part3_completed (run Supabase migration):", e.message);
      }
    } catch (err) {
      console.error("Failed to save completion to database:", err);
      showToast("DB-feil: " + err.message, "error");
    }
  }

  CourseState.completePart3();

  if (timerInterval) {
    clearInterval(timerInterval);
  }

  // Show appropriate modal
  if (cheatAnalysis.isSuspicious) {
    showCheatWarningModal(cheatAnalysis);
  } else {
    document.getElementById("completion-modal").classList.add("active");
  }
});

function showCheatWarningModal(analysis) {
  const modal = document.createElement("div");
  modal.className = "modal-overlay active";
  modal.innerHTML = `
        <div class="modal">
            <div class="modal-icon">⚠️</div>
            <h2>Kurs Fullført!</h2>
            <p>Vi har registrert noe uvanlig aktivitet under din sesjon:</p>
            <ul style="text-align: left; margin: 16px 0; color: var(--text-secondary); font-size: 14px;">
                ${analysis.flags.map((f) => `<li style="margin-bottom: 8px;">${f}</li>`).join("")}
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

const resizer = document.getElementById("resizer");
const editorArea = document.querySelector(".editor-container");
let isResizing = false;

resizer?.addEventListener("mousedown", (e) => {
  isResizing = true;
  document.body.style.cursor = "col-resize";
  document.body.style.userSelect = "none";
});

document.addEventListener("mousemove", (e) => {
  if (!isResizing || !editorArea) return;

  const containerRect = editorArea.getBoundingClientRect();
  const percentage =
    ((e.clientX - containerRect.left) / containerRect.width) * 100;

  if (percentage > 20 && percentage < 80) {
    document.querySelector(".code-editor").style.flex = `0 0 ${percentage}%`;
    document.querySelector(".preview-container").style.flex =
      `0 0 ${100 - percentage}%`;

    if (currentFile === "jsx" && jsxEditor) {
      jsxEditor.layout();
    } else if (currentFile === "css" && cssEditor) {
      cssEditor.layout();
    } else if (mainEditor) {
      mainEditor.layout();
    }
  }
});

document.addEventListener("mouseup", () => {
  isResizing = false;
  document.body.style.cursor = "";
  document.body.style.userSelect = "";
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
