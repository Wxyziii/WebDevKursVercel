// ========================================
// PART 4: FREE BUILD - HTML/CSS/JS OR REACT
// ========================================

let currentMode = 'html'; // 'html' or 'react'
let currentFile = 'html';

// HTML mode editors
let htmlEditor = null;
let cssEditor = null;
let jsEditor = null;
let htmlEditorContainer = null;
let cssEditorContainer = null;
let jsEditorContainer = null;

// React mode editors
let jsxEditor = null;
let cssReactEditor = null;
let mainEditor = null;
let jsxEditorContainer = null;
let cssReactEditorContainer = null;
let mainEditorContainer = null;

// ========================================
// DEBOUNCE UTILITY
// ========================================

function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// ========================================
// CHECK LOCK STATUS
// ========================================

document.addEventListener("DOMContentLoaded", () => {
  updateAuthUI();

  if (!CourseState.isPart3Completed()) {
    document.getElementById("locked-overlay").style.display = "flex";
    return;
  }

  document.getElementById("locked-overlay").style.display = "none";
  initializeCourse();
});

function initializeCourse() {
  updateNavigation();
  updateAuthUI();

  // Restore saved mode
  currentMode = CourseState.getMode();
  renderFileTabs();
  updateModeButtons();
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
  if (!CourseState.isPart3Completed()) return;

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

  const editorOptions = {
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
  };

  // --- HTML mode editors ---

  htmlEditorContainer = document.createElement("div");
  htmlEditorContainer.style.width = "100%";
  htmlEditorContainer.style.height = "100%";
  mainContainer.appendChild(htmlEditorContainer);

  cssEditorContainer = document.createElement("div");
  cssEditorContainer.style.width = "100%";
  cssEditorContainer.style.height = "100%";
  cssEditorContainer.style.display = "none";
  mainContainer.appendChild(cssEditorContainer);

  jsEditorContainer = document.createElement("div");
  jsEditorContainer.style.width = "100%";
  jsEditorContainer.style.height = "100%";
  jsEditorContainer.style.display = "none";
  mainContainer.appendChild(jsEditorContainer);

  htmlEditor = monaco.editor.create(htmlEditorContainer, {
    ...editorOptions,
    value: CourseState.getCode(4, "html"),
    language: "html",
  });

  cssEditor = monaco.editor.create(cssEditorContainer, {
    ...editorOptions,
    value: CourseState.getCode(4, "css"),
    language: "css",
  });

  jsEditor = monaco.editor.create(jsEditorContainer, {
    ...editorOptions,
    value: CourseState.getCode(4, "js"),
    language: "javascript",
  });

  // --- React mode editors ---

  jsxEditorContainer = document.createElement("div");
  jsxEditorContainer.style.width = "100%";
  jsxEditorContainer.style.height = "100%";
  jsxEditorContainer.style.display = "none";
  mainContainer.appendChild(jsxEditorContainer);

  cssReactEditorContainer = document.createElement("div");
  cssReactEditorContainer.style.width = "100%";
  cssReactEditorContainer.style.height = "100%";
  cssReactEditorContainer.style.display = "none";
  mainContainer.appendChild(cssReactEditorContainer);

  mainEditorContainer = document.createElement("div");
  mainEditorContainer.style.width = "100%";
  mainEditorContainer.style.height = "100%";
  mainEditorContainer.style.display = "none";
  mainContainer.appendChild(mainEditorContainer);

  jsxEditor = monaco.editor.create(jsxEditorContainer, {
    ...editorOptions,
    value: CourseState.getCode(4, "jsx"),
    language: "javascript",
  });

  cssReactEditor = monaco.editor.create(cssReactEditorContainer, {
    ...editorOptions,
    value: CourseState.getCode(4, "cssReact"),
    language: "css",
  });

  mainEditor = monaco.editor.create(mainEditorContainer, {
    ...editorOptions,
    value: CourseState.getCode(4, "main"),
    language: "javascript",
  });

  // Live preview updates
  const debouncedPreview = debounce(updatePreview, 300);
  htmlEditor.onDidChangeModelContent(debouncedPreview);
  cssEditor.onDidChangeModelContent(debouncedPreview);
  jsEditor.onDidChangeModelContent(debouncedPreview);
  jsxEditor.onDidChangeModelContent(debouncedPreview);
  cssReactEditor.onDidChangeModelContent(debouncedPreview);
  mainEditor.onDidChangeModelContent(debouncedPreview);

  // Auto-save
  htmlEditor.onDidChangeModelContent(debounce(() => CourseState.saveCode(4, "html", htmlEditor.getValue()), 1000));
  cssEditor.onDidChangeModelContent(debounce(() => CourseState.saveCode(4, "css", cssEditor.getValue()), 1000));
  jsEditor.onDidChangeModelContent(debounce(() => CourseState.saveCode(4, "js", jsEditor.getValue()), 1000));
  jsxEditor.onDidChangeModelContent(debounce(() => CourseState.saveCode(4, "jsx", jsxEditor.getValue()), 1000));
  cssReactEditor.onDidChangeModelContent(debounce(() => CourseState.saveCode(4, "cssReact", cssReactEditor.getValue()), 1000));
  mainEditor.onDidChangeModelContent(debounce(() => CourseState.saveCode(4, "main", mainEditor.getValue()), 1000));

  // Restore mode and show correct editors
  applyMode(currentMode);
  updatePreview();
});

// ========================================
// MODE SWITCHING
// ========================================

function switchMode(mode) {
  if (mode === currentMode) return;
  currentMode = mode;
  CourseState.saveMode(mode);
  applyMode(mode);
  updatePreview();
}

function applyMode(mode) {
  currentMode = mode;
  updateModeButtons();
  renderFileTabs();

  // Hide all editor containers
  if (htmlEditorContainer) htmlEditorContainer.style.display = "none";
  if (cssEditorContainer) cssEditorContainer.style.display = "none";
  if (jsEditorContainer) jsEditorContainer.style.display = "none";
  if (jsxEditorContainer) jsxEditorContainer.style.display = "none";
  if (cssReactEditorContainer) cssReactEditorContainer.style.display = "none";
  if (mainEditorContainer) mainEditorContainer.style.display = "none";

  if (mode === 'html') {
    currentFile = 'html';
    if (htmlEditorContainer) {
      htmlEditorContainer.style.display = "block";
      if (htmlEditor) htmlEditor.layout();
    }
  } else {
    currentFile = 'jsx';
    if (jsxEditorContainer) {
      jsxEditorContainer.style.display = "block";
      if (jsxEditor) jsxEditor.layout();
    }
  }
}

function updateModeButtons() {
  const htmlBtn = document.getElementById('mode-html-btn');
  const reactBtn = document.getElementById('mode-react-btn');
  if (htmlBtn) htmlBtn.classList.toggle('active', currentMode === 'html');
  if (reactBtn) reactBtn.classList.toggle('active', currentMode === 'react');
}

function renderFileTabs() {
  const fileTabsEl = document.getElementById('file-tabs');
  if (!fileTabsEl) return;

  if (currentMode === 'html') {
    fileTabsEl.innerHTML = `
      <button class="file-tab ${currentFile === 'html' ? 'active' : ''}" data-file="html">index.html</button>
      <button class="file-tab ${currentFile === 'css' ? 'active' : ''}" data-file="css">style.css</button>
      <button class="file-tab ${currentFile === 'js' ? 'active' : ''}" data-file="js">script.js</button>
    `;
  } else {
    fileTabsEl.innerHTML = `
      <button class="file-tab ${currentFile === 'jsx' ? 'active' : ''}" data-file="jsx">App.jsx</button>
      <button class="file-tab ${currentFile === 'cssReact' ? 'active' : ''}" data-file="cssReact">App.css</button>
      <button class="file-tab ${currentFile === 'main' ? 'active' : ''}" data-file="main">main.jsx</button>
    `;
  }

  // Re-attach tab click handlers
  fileTabsEl.querySelectorAll('.file-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      const file = tab.dataset.file;
      if (file === currentFile) return;
      switchFile(file);
    });
  });
}

function switchFile(file) {
  currentFile = file;

  // Hide all
  if (htmlEditorContainer) htmlEditorContainer.style.display = "none";
  if (cssEditorContainer) cssEditorContainer.style.display = "none";
  if (jsEditorContainer) jsEditorContainer.style.display = "none";
  if (jsxEditorContainer) jsxEditorContainer.style.display = "none";
  if (cssReactEditorContainer) cssReactEditorContainer.style.display = "none";
  if (mainEditorContainer) mainEditorContainer.style.display = "none";

  // Show correct one
  if (file === 'html' && htmlEditorContainer) { htmlEditorContainer.style.display = "block"; if (htmlEditor) htmlEditor.layout(); }
  else if (file === 'css' && cssEditorContainer) { cssEditorContainer.style.display = "block"; if (cssEditor) cssEditor.layout(); }
  else if (file === 'js' && jsEditorContainer) { jsEditorContainer.style.display = "block"; if (jsEditor) jsEditor.layout(); }
  else if (file === 'jsx' && jsxEditorContainer) { jsxEditorContainer.style.display = "block"; if (jsxEditor) jsxEditor.layout(); }
  else if (file === 'cssReact' && cssReactEditorContainer) { cssReactEditorContainer.style.display = "block"; if (cssReactEditor) cssReactEditor.layout(); }
  else if (file === 'main' && mainEditorContainer) { mainEditorContainer.style.display = "block"; if (mainEditor) mainEditor.layout(); }

  // Update tab active state
  renderFileTabs();
}

// ========================================
// PREVIEW FUNCTIONALITY
// ========================================

function updatePreview() {
  const previewFrame = document.getElementById("preview-frame");
  if (!previewFrame) return;

  if (currentMode === 'html') {
    if (!htmlEditor || !cssEditor || !jsEditor) return;
    const htmlCode = htmlEditor.getValue();
    const cssCode = cssEditor.getValue();
    const jsCode = jsEditor.getValue();

    // Inject CSS and JS into the HTML
    const injected = htmlCode
      .replace('</head>', `<style>${cssCode}</style></head>`)
      .replace('</body>', `<script>${jsCode}<\/script></body>`);

    previewFrame.srcdoc = injected;
  } else {
    if (!jsxEditor || !cssReactEditor || !mainEditor) return;
    const jsxCode = jsxEditor.getValue();
    const cssCode = cssReactEditor.getValue();
    const mainCode = mainEditor.getValue();

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
const { useState, useEffect, useRef, useCallback, useMemo } = React;
${jsxCode}
${mainCode}
    <\/script>
</body>
</html>`;
    previewFrame.srcdoc = previewHTML;
  }
}

// ========================================
// SIDEBAR TABS
// ========================================

document.querySelectorAll(".sidebar-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    const tabName = tab.dataset.tab;
    document.querySelectorAll(".sidebar-tab").forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.remove("active"));
    document.getElementById(`${tabName}-panel`).classList.add("active");
  });
});

// ========================================
// TOOLBAR ACTIONS
// ========================================

document.getElementById("save-btn")?.addEventListener("click", () => {
  if (htmlEditor) CourseState.saveCode(4, "html", htmlEditor.getValue());
  if (cssEditor) CourseState.saveCode(4, "css", cssEditor.getValue());
  if (jsEditor) CourseState.saveCode(4, "js", jsEditor.getValue());
  if (jsxEditor) CourseState.saveCode(4, "jsx", jsxEditor.getValue());
  if (cssReactEditor) CourseState.saveCode(4, "cssReact", cssReactEditor.getValue());
  if (mainEditor) CourseState.saveCode(4, "main", mainEditor.getValue());
  showToast("Koden er lagret!", "success");
});

document.getElementById("save-project-btn")?.addEventListener("click", () => {
  if (currentMode === 'html') {
    showSaveProjectModal(
      htmlEditor?.getValue() || '',
      cssEditor?.getValue() || '',
      jsEditor?.getValue() || '',
      4
    );
  } else {
    showSaveProjectModal(
      jsxEditor?.getValue() || '',
      cssReactEditor?.getValue() || '',
      mainEditor?.getValue() || '',
      4
    );
  }
});

document.getElementById("reset-btn")?.addEventListener("click", () => {
  if (confirm("Er du sikker på at du vil tilbakestille koden til utgangspunktet?")) {
    if (htmlEditor) htmlEditor.setValue(CourseState.getDefaultHTML(4));
    if (cssEditor) cssEditor.setValue(CourseState.getDefaultCSS(4));
    if (jsEditor) jsEditor.setValue(CourseState.getDefaultJS(4));
    if (jsxEditor) jsxEditor.setValue(CourseState.getDefaultJSX(4));
    if (cssReactEditor) cssReactEditor.setValue(CourseState.getDefaultCSS(4));
    if (mainEditor) mainEditor.setValue(CourseState.getDefaultMain());
    updatePreview();
    showToast("Koden er tilbakestilt", "success");
  }
});

document.getElementById("download-btn")?.addEventListener("click", () => {
  let fullHTML;
  let filename;

  if (currentMode === 'html') {
    const htmlCode = htmlEditor?.getValue() || '';
    const cssCode = cssEditor?.getValue() || '';
    const jsCode = jsEditor?.getValue() || '';
    fullHTML = htmlCode
      .replace('</head>', `<style>\n${cssCode}\n</style>\n</head>`)
      .replace('<link rel="stylesheet" href="style.css">', '')
      .replace('</body>', `<script>\n${jsCode}\n<\/script>\n</body>`)
      .replace('<script src="script.js"></script>', '');
    filename = "mitt-prosjekt.html";
  } else {
    const jsxCode = jsxEditor?.getValue() || '';
    const cssCode = cssReactEditor?.getValue() || '';
    const mainCode = mainEditor?.getValue() || '';
    fullHTML = `<!DOCTYPE html>
<html lang="no">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mitt React Prosjekt</title>
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
const { useState, useEffect, useRef, useCallback, useMemo } = React;
${jsxCode}
${mainCode}
    <\/script>
</body>
</html>`;
    filename = "mitt-react-prosjekt.html";
  }

  const blob = new Blob([fullHTML], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  showToast("Filen er lastet ned!", "success");
});

// ========================================
// LOAD IDEA TEMPLATES
// ========================================

const ideaTemplates = {
  todo: {
    html: `<!DOCTYPE html>
<html lang="no">
<head>
    <meta charset="UTF-8">
    <title>Todo Liste</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>📝 Min Todo-liste</h1>
        <div class="input-area">
            <input type="text" id="todo-input" placeholder="Legg til oppgave...">
            <button id="add-btn">Legg til</button>
        </div>
        <ul id="todo-list">
            <!-- Oppgaver vises her -->
        </ul>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
    css: `body { font-family: Arial, sans-serif; background: #f5f5f5; display: flex; justify-content: center; padding: 40px; }
.container { background: white; padding: 30px; border-radius: 12px; width: 400px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
h1 { margin-bottom: 20px; }
.input-area { display: flex; gap: 10px; margin-bottom: 20px; }
input { flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 15px; }
button { padding: 10px 16px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; }
#todo-list { list-style: none; padding: 0; }
#todo-list li { padding: 10px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }`,
    js: `// Todo-liste logikk
const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const list = document.getElementById('todo-list');

addBtn.addEventListener('click', addTodo);
input.addEventListener('keypress', (e) => { if (e.key === 'Enter') addTodo(); });

function addTodo() {
    const text = input.value.trim();
    if (!text) return;
    
    const li = document.createElement('li');
    // Legg til tekst og en slett-knapp her
    
    list.appendChild(li);
    input.value = '';
}`,
    jsx: `// App.jsx - Todo-liste med React
function App() {
    const [todos, setTodos] = useState([]);
    const [input, setInput] = useState('');

    function addTodo() {
        if (!input.trim()) return;
        setTodos([...todos, { id: Date.now(), text: input, done: false }]);
        setInput('');
    }

    function toggleTodo(id) {
        setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
    }

    function deleteTodo(id) {
        setTodos(todos.filter(t => t.id !== id));
    }

    return (
        <div className="container">
            <h1>📝 Min Todo-liste</h1>
            <div className="input-area">
                <input value={input} onChange={e => setInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && addTodo()}
                    placeholder="Legg til oppgave..." />
                <button onClick={addTodo}>Legg til</button>
            </div>
            <ul>
                {todos.map(todo => (
                    <li key={todo.id} style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>
                        <span onClick={() => toggleTodo(todo.id)} style={{ cursor: 'pointer' }}>{todo.text}</span>
                        <button onClick={() => deleteTodo(todo.id)}>🗑️</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}`,
  },

  quiz: {
    html: `<!DOCTYPE html>
<html lang="no">
<head>
    <meta charset="UTF-8">
    <title>Quiz App</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="quiz-container">
        <h1>❓ Quiz</h1>
        <div id="question-text"></div>
        <div id="options"></div>
        <div id="result"></div>
        <button id="next-btn" style="display:none">Neste spørsmål</button>
        <div id="score"></div>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
    css: `body { font-family: Arial, sans-serif; background: #1a1a2e; color: white; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
.quiz-container { background: #16213e; padding: 40px; border-radius: 16px; width: 500px; text-align: center; }
h1 { margin-bottom: 24px; }
#question-text { font-size: 20px; margin-bottom: 24px; }
#options { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
.option-btn { padding: 14px; background: #0f3460; border: 2px solid #533483; border-radius: 8px; color: white; font-size: 15px; cursor: pointer; }
.option-btn:hover { background: #533483; }
.correct { background: #2d6a4f !important; border-color: #52b788 !important; }
.wrong { background: #9b2226 !important; border-color: #e63946 !important; }
#result { font-size: 18px; margin: 16px 0; min-height: 28px; }
#next-btn { padding: 12px 24px; background: #533483; color: white; border: none; border-radius: 8px; font-size: 16px; cursor: pointer; }`,
    js: `const questions = [
    { question: 'Hva er HTML?', options: ['Hypertext Markup Language', 'Hyper Transfer Markup Language', 'High Tech Markup Language', 'Hyperlink Text Mode Language'], correct: 0 },
    { question: 'Hvilken CSS-egenskap brukes til farge?', options: ['font-color', 'text-color', 'color', 'foreground'], correct: 2 },
    { question: 'Hva gjør console.log() i JavaScript?', options: ['Lagrer data', 'Skriver ut til konsollen', 'Laster siden', 'Sletter variabler'], correct: 1 },
];

let current = 0;
let score = 0;

function showQuestion() {
    const q = questions[current];
    document.getElementById('question-text').textContent = q.question;
    document.getElementById('result').textContent = '';
    document.getElementById('next-btn').style.display = 'none';
    const opts = document.getElementById('options');
    opts.innerHTML = '';
    q.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = opt;
        btn.onclick = () => checkAnswer(i);
        opts.appendChild(btn);
    });
}

function checkAnswer(index) {
    const q = questions[current];
    const btns = document.querySelectorAll('.option-btn');
    btns.forEach(b => b.disabled = true);
    if (index === q.correct) {
        btns[index].classList.add('correct');
        document.getElementById('result').textContent = '✅ Riktig!';
        score++;
    } else {
        btns[index].classList.add('wrong');
        btns[q.correct].classList.add('correct');
        document.getElementById('result').textContent = '❌ Feil!';
    }
    document.getElementById('next-btn').style.display = current < questions.length - 1 ? 'block' : 'none';
    if (current === questions.length - 1) {
        document.getElementById('score').textContent = \`Poeng: \${score}/\${questions.length}\`;
    }
}

document.getElementById('next-btn').addEventListener('click', () => { current++; showQuestion(); });
showQuestion();`,
    jsx: `// App.jsx - Quiz App med React
const questions = [
    { question: 'Hva er HTML?', options: ['Hypertext Markup Language', 'Hyper Transfer', 'High Tech ML', 'Hyperlink TML'], correct: 0 },
    { question: 'Hvilken CSS-egenskap gir farge?', options: ['font-color', 'text-color', 'color', 'foreground'], correct: 2 },
    { question: 'Hva gjør useState()?', options: ['Lagrer til database', 'Håndterer komponent-tilstand', 'Henter data', 'Rendrer HTML'], correct: 1 },
];

function App() {
    const [current, setCurrent] = useState(0);
    const [score, setScore] = useState(0);
    const [selected, setSelected] = useState(null);
    const [finished, setFinished] = useState(false);

    function checkAnswer(index) {
        if (selected !== null) return;
        setSelected(index);
        if (index === questions[current].correct) setScore(s => s + 1);
    }

    function next() {
        if (current + 1 >= questions.length) { setFinished(true); return; }
        setCurrent(c => c + 1);
        setSelected(null);
    }

    if (finished) return <div className="quiz-container"><h1>🎉 Ferdig!</h1><p>Poeng: {score}/{questions.length}</p></div>;

    const q = questions[current];
    return (
        <div className="quiz-container">
            <h1>❓ Quiz ({current + 1}/{questions.length})</h1>
            <p className="question">{q.question}</p>
            <div className="options">
                {q.options.map((opt, i) => (
                    <button key={i} onClick={() => checkAnswer(i)}
                        className={'option' + (selected !== null ? (i === q.correct ? ' correct' : i === selected ? ' wrong' : '') : '')}>
                        {opt}
                    </button>
                ))}
            </div>
            {selected !== null && <button onClick={next} className="next-btn">Neste →</button>}
        </div>
    );
}`,
  },

  calculator: {
    html: `<!DOCTYPE html>
<html lang="no">
<head>
    <meta charset="UTF-8">
    <title>Kalkulator</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="calculator">
        <div id="display">0</div>
        <div class="buttons">
            <button class="btn-clear" onclick="clearDisplay()">C</button>
            <button onclick="appendToDisplay('/')">÷</button>
            <button onclick="appendToDisplay('*')">×</button>
            <button onclick="deleteLast()">⌫</button>
            <button onclick="appendToDisplay('7')">7</button>
            <button onclick="appendToDisplay('8')">8</button>
            <button onclick="appendToDisplay('9')">9</button>
            <button onclick="appendToDisplay('-')">−</button>
            <button onclick="appendToDisplay('4')">4</button>
            <button onclick="appendToDisplay('5')">5</button>
            <button onclick="appendToDisplay('6')">6</button>
            <button onclick="appendToDisplay('+')">+</button>
            <button onclick="appendToDisplay('1')">1</button>
            <button onclick="appendToDisplay('2')">2</button>
            <button onclick="appendToDisplay('3')">3</button>
            <button class="btn-equals" onclick="calculate()">=</button>
            <button class="btn-zero" onclick="appendToDisplay('0')">0</button>
            <button onclick="appendToDisplay('.')">.</button>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
    css: `body { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #1a1a1a; margin: 0; }
.calculator { background: #2d2d2d; border-radius: 16px; padding: 20px; width: 280px; box-shadow: 0 20px 60px rgba(0,0,0,0.5); }
#display { background: #1a1a1a; color: white; font-size: 32px; padding: 16px; text-align: right; border-radius: 8px; margin-bottom: 16px; min-height: 60px; overflow: hidden; }
.buttons { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
button { padding: 18px; background: #3d3d3d; color: white; border: none; border-radius: 8px; font-size: 18px; cursor: pointer; }
button:hover { background: #4d4d4d; }
.btn-clear { background: #e74c3c; }
.btn-clear:hover { background: #c0392b; }
.btn-equals { background: #3b82f6; grid-row: span 2; }
.btn-equals:hover { background: #2563eb; }
.btn-zero { grid-column: span 2; }`,
    js: `let current = '0';
let shouldReset = false;

function updateDisplay() {
    document.getElementById('display').textContent = current;
}

function appendToDisplay(val) {
    if (shouldReset) { current = ''; shouldReset = false; }
    if (current === '0' && !isNaN(val)) current = val;
    else current += val;
    updateDisplay();
}

function clearDisplay() {
    current = '0';
    updateDisplay();
}

function deleteLast() {
    current = current.length > 1 ? current.slice(0, -1) : '0';
    updateDisplay();
}

function calculate() {
    try {
        current = String(eval(current));
        shouldReset = true;
    } catch(e) {
        current = 'Feil';
    }
    updateDisplay();
}`,
    jsx: `// App.jsx - Kalkulator (bruk HTML/CSS/JS-modus for kalkulator)
function App() {
    const [display, setDisplay] = useState('0');
    const [shouldReset, setShouldReset] = useState(false);

    function press(val) {
        if (shouldReset) { setDisplay(val); setShouldReset(false); return; }
        setDisplay(prev => prev === '0' && !isNaN(val) ? val : prev + val);
    }

    function clear() { setDisplay('0'); setShouldReset(false); }

    function calculate() {
        try { const result = String(eval(display)); setDisplay(result); setShouldReset(true); }
        catch(e) { setDisplay('Feil'); setShouldReset(true); }
    }

    const btn = (label, onClick, cls='') => <button key={label} onClick={onClick} className={cls}>{label}</button>;

    return (
        <div className="calculator">
            <div className="display">{display}</div>
            <div className="buttons">
                {btn('C', clear, 'btn-clear')}
                {btn('÷', () => press('/'))}
                {btn('×', () => press('*'))}
                {btn('⌫', () => setDisplay(d => d.length > 1 ? d.slice(0,-1) : '0'))}
                {[7,8,9,'-',4,5,6,'+',1,2,3].map(v => btn(String(v), () => press(String(v))))}
                {btn('=', calculate, 'btn-equals')}
                {btn('0', () => press('0'), 'btn-zero')}
                {btn('.', () => press('.'))}
            </div>
        </div>
    );
}`,
  },

  countdown: {
    html: `<!DOCTYPE html>
<html lang="no">
<head>
    <meta charset="UTF-8">
    <title>Nedtelling</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>⏱️ Nedtelling</h1>
        <input type="datetime-local" id="target-date">
        <div id="countdown">
            <div class="unit"><span id="days">00</span><label>Dager</label></div>
            <div class="unit"><span id="hours">00</span><label>Timer</label></div>
            <div class="unit"><span id="minutes">00</span><label>Minutter</label></div>
            <div class="unit"><span id="seconds">00</span><label>Sekunder</label></div>
        </div>
        <p id="message"></p>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
    css: `body { font-family: Arial, sans-serif; background: linear-gradient(135deg, #1a1a2e, #16213e); color: white; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
.container { text-align: center; }
h1 { font-size: 36px; margin-bottom: 24px; }
input { padding: 10px; font-size: 16px; border-radius: 8px; border: none; margin-bottom: 32px; }
#countdown { display: flex; gap: 24px; justify-content: center; }
.unit { background: rgba(255,255,255,0.1); padding: 20px 30px; border-radius: 12px; }
.unit span { font-size: 48px; font-weight: bold; display: block; }
.unit label { font-size: 14px; opacity: 0.7; }
#message { font-size: 24px; margin-top: 24px; }`,
    js: `const targetInput = document.getElementById('target-date');

// Set default to 1 hour from now
const oneHour = new Date(Date.now() + 3600000);
targetInput.value = oneHour.toISOString().slice(0, 16);

setInterval(update, 1000);

function update() {
    const target = new Date(targetInput.value);
    const now = new Date();
    const diff = target - now;

    if (diff <= 0) {
        document.getElementById('message').textContent = '🎉 Tiden er ute!';
        return;
    }

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

update();`,
    jsx: `// App.jsx - Nedtelling med React
function App() {
    const [target, setTarget] = useState(() => {
        const d = new Date(Date.now() + 3600000);
        return d.toISOString().slice(0, 16);
    });
    const [timeLeft, setTimeLeft] = useState({});

    useEffect(() => {
        const interval = setInterval(() => {
            const diff = new Date(target) - new Date();
            if (diff <= 0) { setTimeLeft(null); return; }
            setTimeLeft({
                days: Math.floor(diff / 86400000),
                hours: Math.floor((diff % 86400000) / 3600000),
                minutes: Math.floor((diff % 3600000) / 60000),
                seconds: Math.floor((diff % 60000) / 1000),
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [target]);

    const pad = n => String(n).padStart(2, '0');

    return (
        <div className="container">
            <h1>⏱️ Nedtelling</h1>
            <input type="datetime-local" value={target} onChange={e => setTarget(e.target.value)} />
            {timeLeft === null ? <p className="done">🎉 Tiden er ute!</p> : (
                <div className="countdown">
                    {timeLeft && Object.entries(timeLeft).map(([key, val]) => (
                        <div key={key} className="unit">
                            <span>{pad(val)}</span>
                            <label>{{days:'Dager',hours:'Timer',minutes:'Min',seconds:'Sek'}[key]}</label>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}`,
  },

  colorpicker: {
    html: `<!DOCTYPE html>
<html lang="no">
<head>
    <meta charset="UTF-8">
    <title>Fargevelger</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>🎨 Fargevelger</h1>
        <input type="color" id="color-input" value="#3b82f6">
        <div id="color-preview"></div>
        <div id="color-values">
            <div class="value-box"><label>HEX</label><span id="hex-val">#3b82f6</span></div>
            <div class="value-box"><label>RGB</label><span id="rgb-val">rgb(59, 130, 246)</span></div>
        </div>
        <button id="copy-btn">📋 Kopier HEX</button>
        <div id="palette"></div>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
    css: `body { font-family: Arial, sans-serif; background: #111; color: white; display: flex; justify-content: center; padding: 40px; min-height: 100vh; margin: 0; }
.container { text-align: center; width: 400px; }
h1 { margin-bottom: 20px; }
#color-input { width: 100px; height: 100px; border: none; border-radius: 50%; cursor: pointer; margin-bottom: 20px; }
#color-preview { width: 200px; height: 200px; border-radius: 16px; margin: 0 auto 20px; transition: background 0.3s; }
#color-values { display: flex; gap: 16px; justify-content: center; margin-bottom: 16px; }
.value-box { background: #222; padding: 12px 20px; border-radius: 8px; cursor: pointer; }
.value-box label { display: block; font-size: 11px; opacity: 0.6; margin-bottom: 4px; }
.value-box span { font-size: 14px; font-family: monospace; }
#copy-btn { padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 8px; cursor: pointer; margin-bottom: 20px; }
#palette { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
.swatch { width: 40px; height: 40px; border-radius: 8px; cursor: pointer; border: 2px solid transparent; }
.swatch:hover { border-color: white; }`,
    js: `const colorInput = document.getElementById('color-input');
const preview = document.getElementById('color-preview');

colorInput.addEventListener('input', updateColor);
document.getElementById('copy-btn').addEventListener('click', () => {
    navigator.clipboard.writeText(colorInput.value).then(() => alert('Kopiert: ' + colorInput.value));
});

// Preset swatches
const swatches = ['#e74c3c','#e67e22','#f1c40f','#2ecc71','#3b82f6','#9b59b6','#1abc9c','#34495e'];
const palette = document.getElementById('palette');
swatches.forEach(color => {
    const sw = document.createElement('div');
    sw.className = 'swatch';
    sw.style.background = color;
    sw.onclick = () => { colorInput.value = color; updateColor(); };
    palette.appendChild(sw);
});

function hexToRgb(hex) {
    const r = parseInt(hex.slice(1,3), 16);
    const g = parseInt(hex.slice(3,5), 16);
    const b = parseInt(hex.slice(5,7), 16);
    return \`rgb(\${r}, \${g}, \${b})\`;
}

function updateColor() {
    const hex = colorInput.value;
    preview.style.background = hex;
    document.getElementById('hex-val').textContent = hex;
    document.getElementById('rgb-val').textContent = hexToRgb(hex);
}

updateColor();`,
    jsx: `// App.jsx - Fargevelger (denne appen passer best i HTML/CSS/JS-modus)
function App() {
    const [color, setColor] = useState('#3b82f6');
    const [copied, setCopied] = useState(false);
    const swatches = ['#e74c3c','#e67e22','#f1c40f','#2ecc71','#3b82f6','#9b59b6','#1abc9c','#34495e'];

    function hexToRgb(hex) {
        const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
        return \`rgb(\${r}, \${g}, \${b})\`;
    }

    function copyHex() {
        navigator.clipboard.writeText(color).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
    }

    return (
        <div className="container">
            <h1>🎨 Fargevelger</h1>
            <input type="color" value={color} onChange={e => setColor(e.target.value)} />
            <div className="preview" style={{ background: color }}></div>
            <p className="hex">{color}</p>
            <p className="rgb">{hexToRgb(color)}</p>
            <button onClick={copyHex}>{copied ? '✅ Kopiert!' : '📋 Kopier HEX'}</button>
            <div className="palette">
                {swatches.map(s => <div key={s} className="swatch" style={{ background: s }} onClick={() => setColor(s)}></div>)}
            </div>
        </div>
    );
}`,
  },

  weather: {
    html: `<!DOCTYPE html>
<html lang="no">
<head>
    <meta charset="UTF-8">
    <title>Vær-app</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>🌤️ Vær-app</h1>
        <p style="opacity:0.7; font-size:14px;">Merk: Denne appen bruker Open-Meteo API (ingen API-nøkkel nødvendig)</p>
        <div class="search">
            <input type="text" id="city-input" placeholder="Skriv inn by...">
            <button id="search-btn">Søk</button>
        </div>
        <div id="weather-result"></div>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
    css: `body { font-family: Arial, sans-serif; background: linear-gradient(135deg, #74b9ff, #0984e3); min-height: 100vh; display: flex; justify-content: center; align-items: flex-start; padding: 40px; margin: 0; }
.container { background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); border-radius: 20px; padding: 40px; width: 400px; color: white; text-align: center; }
h1 { margin-bottom: 8px; }
.search { display: flex; gap: 10px; margin: 20px 0; }
input { flex: 1; padding: 12px; border: none; border-radius: 8px; font-size: 15px; }
button { padding: 12px 20px; background: #0984e3; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 15px; }
#weather-result { margin-top: 20px; }
.weather-card { background: rgba(255,255,255,0.2); border-radius: 16px; padding: 24px; }
.temp { font-size: 64px; font-weight: bold; }
.city-name { font-size: 24px; margin-bottom: 8px; }`,
    js: `document.getElementById('search-btn').addEventListener('click', searchWeather);
document.getElementById('city-input').addEventListener('keypress', e => { if (e.key === 'Enter') searchWeather(); });

async function searchWeather() {
    const city = document.getElementById('city-input').value.trim();
    if (!city) return;

    const result = document.getElementById('weather-result');
    result.innerHTML = '<p>Laster...</p>';

    try {
        // Geocoding API to get coordinates
        const geoRes = await fetch(\`https://geocoding-api.open-meteo.com/v1/search?name=\${encodeURIComponent(city)}&count=1&language=no\`);
        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
            result.innerHTML = '<p>By ikke funnet. Prøv igjen.</p>';
            return;
        }

        const { latitude, longitude, name, country } = geoData.results[0];

        // Weather API
        const weatherRes = await fetch(\`https://api.open-meteo.com/v1/forecast?latitude=\${latitude}&longitude=\${longitude}&current_weather=true\`);
        const weatherData = await weatherRes.json();
        const weather = weatherData.current_weather;

        const icons = { 0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️', 45: '🌫️', 51: '🌦️', 61: '🌧️', 80: '🌦️' };
        const icon = icons[weather.weathercode] || '🌡️';

        result.innerHTML = \`
            <div class="weather-card">
                <div class="city-name">\${name}, \${country}</div>
                <div style="font-size: 48px;">\${icon}</div>
                <div class="temp">\${Math.round(weather.temperature)}°C</div>
                <div>Vind: \${weather.windspeed} km/t</div>
            </div>\`;
    } catch(e) {
        result.innerHTML = '<p>Feil ved henting av data.</p>';
    }
}`,
    jsx: `// App.jsx - Vær-app med React og Open-Meteo API
function App() {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function searchWeather() {
        if (!city.trim()) return;
        setLoading(true); setError(''); setWeather(null);

        try {
            const geoRes = await fetch(\`https://geocoding-api.open-meteo.com/v1/search?name=\${encodeURIComponent(city)}&count=1&language=no\`);
            const geoData = await geoRes.json();
            if (!geoData.results?.length) { setError('By ikke funnet.'); setLoading(false); return; }

            const { latitude, longitude, name, country } = geoData.results[0];
            const wRes = await fetch(\`https://api.open-meteo.com/v1/forecast?latitude=\${latitude}&longitude=\${longitude}&current_weather=true\`);
            const wData = await wRes.json();
            setWeather({ ...wData.current_weather, name, country });
        } catch(e) { setError('Feil ved henting av data.'); }
        setLoading(false);
    }

    return (
        <div className="container">
            <h1>🌤️ Vær-app</h1>
            <div className="search">
                <input value={city} onChange={e => setCity(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && searchWeather()}
                    placeholder="Skriv inn by..." />
                <button onClick={searchWeather}>Søk</button>
            </div>
            {loading && <p>Laster...</p>}
            {error && <p style={{color:'#ff7675'}}>{error}</p>}
            {weather && (
                <div className="weather-card">
                    <div className="city-name">{weather.name}, {weather.country}</div>
                    <div className="temp">{Math.round(weather.temperature)}°C</div>
                    <div>Vind: {weather.windspeed} km/t</div>
                </div>
            )}
        </div>
    );
}`,
  },

  memory: {
    html: `<!DOCTYPE html>
<html lang="no">
<head>
    <meta charset="UTF-8">
    <title>Memory-spill</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>🃏 Memory-spill</h1>
        <div id="stats">Trekk: <span id="moves">0</span> | Par funnet: <span id="pairs">0</span>/8</div>
        <div id="board"></div>
        <button id="restart-btn">🔄 Start på nytt</button>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
    css: `body { font-family: Arial, sans-serif; background: #1a1a2e; color: white; display: flex; justify-content: center; padding: 40px; min-height: 100vh; margin: 0; }
.container { text-align: center; }
h1 { margin-bottom: 16px; }
#stats { margin-bottom: 20px; opacity: 0.8; }
#board { display: grid; grid-template-columns: repeat(4, 100px); gap: 12px; margin: 0 auto 24px; }
.card { width: 100px; height: 100px; background: #16213e; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 36px; cursor: pointer; transition: transform 0.3s; border: 2px solid #0f3460; }
.card:hover { transform: scale(1.05); }
.card.flipped { background: #0f3460; border-color: #533483; }
.card.matched { background: #2d6a4f; border-color: #52b788; cursor: default; }
#restart-btn { padding: 12px 24px; background: #533483; color: white; border: none; border-radius: 8px; font-size: 16px; cursor: pointer; }`,
    js: `const emojis = ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼'];
const cards = [...emojis, ...emojis];
let flipped = [], matched = 0, moves = 0, locked = false;

function shuffle(arr) { return arr.sort(() => Math.random() - 0.5); }

function createBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';
    flipped = []; matched = 0; moves = 0;
    document.getElementById('moves').textContent = 0;
    document.getElementById('pairs').textContent = 0;

    shuffle(cards).forEach((emoji, i) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.emoji = emoji;
        card.dataset.index = i;
        card.textContent = '?';
        card.addEventListener('click', flipCard);
        board.appendChild(card);
    });
}

function flipCard() {
    if (locked || this.classList.contains('matched') || this.classList.contains('flipped')) return;
    this.textContent = this.dataset.emoji;
    this.classList.add('flipped');
    flipped.push(this);

    if (flipped.length === 2) {
        locked = true;
        moves++;
        document.getElementById('moves').textContent = moves;
        if (flipped[0].dataset.emoji === flipped[1].dataset.emoji) {
            flipped.forEach(c => c.classList.add('matched'));
            matched++;
            document.getElementById('pairs').textContent = matched;
            if (matched === 8) setTimeout(() => alert(\`🎉 Ferdig på \${moves} trekk!\`), 300);
            flipped = []; locked = false;
        } else {
            setTimeout(() => {
                flipped.forEach(c => { c.textContent = '?'; c.classList.remove('flipped'); });
                flipped = []; locked = false;
            }, 800);
        }
    }
}

document.getElementById('restart-btn').addEventListener('click', createBoard);
createBoard();`,
    jsx: `// App.jsx - Memory-spill (denne appen passer best i HTML/CSS/JS-modus)
function App() {
    const emojis = ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼'];
    const [cards, setCards] = useState(() => [...emojis,...emojis].sort(() => Math.random()-0.5).map((e,i) => ({id:i,emoji:e,flipped:false,matched:false})));
    const [selected, setSelected] = useState([]);
    const [moves, setMoves] = useState(0);
    const [locked, setLocked] = useState(false);

    const matched = cards.filter(c => c.matched).length / 2;

    function flip(card) {
        if (locked || card.flipped || card.matched) return;
        const newCards = cards.map(c => c.id === card.id ? {...c, flipped: true} : c);
        const newSelected = [...selected, {...card, flipped: true}];
        setCards(newCards);
        setSelected(newSelected);

        if (newSelected.length === 2) {
            setLocked(true);
            setMoves(m => m + 1);
            if (newSelected[0].emoji === newSelected[1].emoji) {
                setCards(prev => prev.map(c => c.emoji === newSelected[0].emoji ? {...c, matched: true} : c));
                setSelected([]); setLocked(false);
            } else {
                setTimeout(() => {
                    setCards(prev => prev.map(c => newSelected.find(s => s.id === c.id) ? {...c, flipped: false} : c));
                    setSelected([]); setLocked(false);
                }, 800);
            }
        }
    }

    function restart() {
        setCards([...emojis,...emojis].sort(() => Math.random()-0.5).map((e,i) => ({id:i,emoji:e,flipped:false,matched:false})));
        setSelected([]); setMoves(0); setLocked(false);
    }

    return (
        <div className="container">
            <h1>🃏 Memory</h1>
            <p>Trekk: {moves} | Par: {matched}/8</p>
            <div className="board">
                {cards.map(card => (
                    <div key={card.id} className={'card' + (card.flipped ? ' flipped' : '') + (card.matched ? ' matched' : '')} onClick={() => flip(card)}>
                        {card.flipped || card.matched ? card.emoji : '?'}
                    </div>
                ))}
            </div>
            <button onClick={restart}>🔄 Start på nytt</button>
        </div>
    );
}`,
  },

  portfolio: {
    html: `<!DOCTYPE html>
<html lang="no">
<head>
    <meta charset="UTF-8">
    <title>Portfolio</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <div class="avatar">👤</div>
        <h1>Ditt Navn</h1>
        <p class="tagline">Webutvikler & Kreativ Sjel</p>
        <div class="social-links">
            <a href="#">GitHub</a>
            <a href="#">LinkedIn</a>
            <a href="#">E-post</a>
        </div>
    </header>

    <section id="om-meg">
        <h2>Om Meg</h2>
        <p>Skriv en kort introduksjon om deg selv her. Hva er du lidenskapelig opptatt av?</p>
    </section>

    <section id="prosjekter">
        <h2>Prosjekter</h2>
        <div class="prosjekt-grid">
            <div class="prosjekt-kort">
                <h3>🚀 Prosjekt 1</h3>
                <p>Beskrivelse av prosjektet</p>
                <a href="#">Se prosjekt →</a>
            </div>
            <!-- Legg til flere prosjekter her -->
        </div>
    </section>

    <section id="ferdigheter">
        <h2>Ferdigheter</h2>
        <div class="skills">
            <span class="skill">HTML</span>
            <span class="skill">CSS</span>
            <span class="skill">JavaScript</span>
            <span class="skill">React</span>
        </div>
    </section>

    <footer>
        <p>© 2025 Ditt Navn</p>
    </footer>
    <script src="script.js"></script>
</body>
</html>`,
    css: `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Segoe UI', sans-serif; background: #0a0a0a; color: #e0e0e0; }
header { background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 80px 20px; text-align: center; }
.avatar { font-size: 80px; margin-bottom: 16px; }
h1 { font-size: 42px; margin-bottom: 8px; }
.tagline { color: #74b9ff; font-size: 18px; margin-bottom: 20px; }
.social-links { display: flex; gap: 16px; justify-content: center; }
.social-links a { color: #74b9ff; text-decoration: none; padding: 8px 16px; border: 1px solid #74b9ff; border-radius: 20px; }
section { padding: 60px 20px; max-width: 900px; margin: 0 auto; }
h2 { font-size: 28px; margin-bottom: 24px; color: #74b9ff; }
.prosjekt-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; }
.prosjekt-kort { background: #1a1a2e; padding: 24px; border-radius: 12px; border: 1px solid #333; }
.prosjekt-kort h3 { margin-bottom: 8px; }
.prosjekt-kort a { color: #74b9ff; text-decoration: none; display: inline-block; margin-top: 12px; }
.skills { display: flex; flex-wrap: wrap; gap: 12px; }
.skill { background: #1a1a2e; color: #74b9ff; padding: 8px 16px; border-radius: 20px; border: 1px solid #74b9ff; }
footer { text-align: center; padding: 40px; background: #111; color: #666; }`,
    js: `// Legg til interaktivitet her
// For eksempel: smooth scroll, animasjoner, kontaktskjema
console.log('Portfolio lastet! 👋');`,
    jsx: `// App.jsx - Portfolio med React
const projects = [
    { title: '🚀 Prosjekt 1', desc: 'Beskrivelse av prosjektet', link: '#' },
    { title: '💡 Prosjekt 2', desc: 'Et annet kult prosjekt', link: '#' },
];

const skills = ['HTML', 'CSS', 'JavaScript', 'React'];

function App() {
    const [activeSection, setActiveSection] = useState('om-meg');

    return (
        <div className="portfolio">
            <header>
                <div className="avatar">👤</div>
                <h1>Ditt Navn</h1>
                <p className="tagline">Webutvikler & Kreativ Sjel</p>
                <nav>
                    {['om-meg', 'prosjekter', 'ferdigheter'].map(s => (
                        <button key={s} onClick={() => setActiveSection(s)}
                            className={activeSection === s ? 'active' : ''}>
                            {s.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                        </button>
                    ))}
                </nav>
            </header>

            {activeSection === 'om-meg' && (
                <section><h2>Om Meg</h2><p>Skriv om deg selv her!</p></section>
            )}
            {activeSection === 'prosjekter' && (
                <section>
                    <h2>Prosjekter</h2>
                    <div className="grid">
                        {projects.map((p, i) => <div key={i} className="card"><h3>{p.title}</h3><p>{p.desc}</p></div>)}
                    </div>
                </section>
            )}
            {activeSection === 'ferdigheter' && (
                <section>
                    <h2>Ferdigheter</h2>
                    <div className="skills">{skills.map(s => <span key={s} className="skill">{s}</span>)}</div>
                </section>
            )}
        </div>
    );
}`,
  },
};

function loadIdea(type) {
  if (!ideaTemplates[type]) return;

  if (!confirm(`Vil du laste inn startkode for "${type}"? Eksisterende kode i gjeldende modus vil erstattes.`)) return;

  const tmpl = ideaTemplates[type];

  if (currentMode === 'html') {
    if (htmlEditor) htmlEditor.setValue(tmpl.html || CourseState.getDefaultHTML(4));
    if (cssEditor) cssEditor.setValue(tmpl.css || CourseState.getDefaultCSS(4));
    if (jsEditor) jsEditor.setValue(tmpl.js || CourseState.getDefaultJS(4));
  } else {
    if (jsxEditor) jsxEditor.setValue(tmpl.jsx || CourseState.getDefaultJSX(4));
    if (cssReactEditor) cssReactEditor.setValue(tmpl.css || CourseState.getDefaultCSS(4));
    if (mainEditor) mainEditor.setValue(CourseState.getDefaultMain());
  }

  // Save to state
  CourseState.saveCode(4, "html", htmlEditor?.getValue() || CourseState.getDefaultHTML(4));
  CourseState.saveCode(4, "css", cssEditor?.getValue() || CourseState.getDefaultCSS(4));
  CourseState.saveCode(4, "js", jsEditor?.getValue() || CourseState.getDefaultJS(4));
  CourseState.saveCode(4, "jsx", jsxEditor?.getValue() || CourseState.getDefaultJSX(4));
  CourseState.saveCode(4, "cssReact", cssReactEditor?.getValue() || CourseState.getDefaultCSS(4));

  updatePreview();
  showToast(`Startkode for ${type} lastet inn! 🚀`, "success");
}

// ========================================
// RESIZER FUNCTIONALITY
// ========================================

const resizer = document.getElementById("resizer");
const editorArea = document.querySelector(".editor-container");
let isResizing = false;

resizer?.addEventListener("mousedown", () => {
  isResizing = true;
  document.body.style.cursor = "col-resize";
  document.body.style.userSelect = "none";
});

document.addEventListener("mousemove", (e) => {
  if (!isResizing || !editorArea) return;
  const containerRect = editorArea.getBoundingClientRect();
  const percentage = ((e.clientX - containerRect.left) / containerRect.width) * 100;
  if (percentage > 20 && percentage < 80) {
    document.querySelector(".code-editor").style.flex = `0 0 ${percentage}%`;
    document.querySelector(".preview-container").style.flex = `0 0 ${100 - percentage}%`;
    // Trigger layout on current editor
    if (currentMode === 'html') {
      if (currentFile === 'html' && htmlEditor) htmlEditor.layout();
      else if (currentFile === 'css' && cssEditor) cssEditor.layout();
      else if (currentFile === 'js' && jsEditor) jsEditor.layout();
    } else {
      if (currentFile === 'jsx' && jsxEditor) jsxEditor.layout();
      else if (currentFile === 'cssReact' && cssReactEditor) cssReactEditor.layout();
      else if (currentFile === 'main' && mainEditor) mainEditor.layout();
    }
  }
});

document.addEventListener("mouseup", () => {
  isResizing = false;
  document.body.style.cursor = "";
  document.body.style.userSelect = "";
});
