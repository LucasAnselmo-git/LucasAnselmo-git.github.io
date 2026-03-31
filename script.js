// ==========================================================
// 1. DATA CONFIGURATION (Edit this section to update your site)
// ==========================================================
const PORTFOLIO_DATA = {
  about:
    "I'm currently a cybersecurity student. I always was a techy person but only in the last few years I decided to really go after it. I took a couple of courses on programming, then got a degree in Software Development. By the end of my course I had a summer module on cybersecurity and ended up really enjoying it, so I decided to focus on it and here I am.",

  projects: [
    {
      id: "01",
      name: "Pi-Hole",
      cmd: "pihole",
      desc: "A DNS filtering server using a RaspberryPi",
      link: "https://github.com/LucasAnselmo-git/Cybersecurity/tree/main/PiHole",
    },
  ],

  contacts: [
    {
      id: "EMAIL",
      cmd: "email",
      display: "luc_anselmo@hotmail.com",
      url: "mailto:luc_anselmo@hotmail.com",
      msg: "Opening local mail client protocol...",
    },
    {
      id: "GITHUB",
      cmd: "github",
      display: "github.com/LucasAnselmo",
      url: "https://github.com/LucasAnselmo-git",
      msg: "Initiating secure handshake with GitHub... opening in new tab.",
    },
    {
      id: "LINKEDIN",
      cmd: "linkedin",
      display: "linkedin.com/in/lucas-anselmo",
      url: "https://www.linkedin.com/in/lucas-anselmo-928b321b3/",
      msg: "Establishing connection to LinkedIn... opening in new tab.",
    },
  ],
};

// ==========================================================
// 2. DOM ELEMENTS & SYSTEM INITIALIZATION
// ==========================================================
const inputField = document.getElementById("cmd-input");
const typedTextSpan = document.getElementById("typed-text");
const outputDiv = document.getElementById("output");
const minimizeBtn = document.getElementById("minimize-btn");
const terminalFrame = document.getElementById("terminal-frame");

const welcomeHTML = `
    <h1 class="display-lg">System Archive</h1>
    <p>User authenticated. Welcome to the digital portfolio of Lucas Anselmo.</p>
    <p class="code" style="margin-top: 16px;">> Type 'help' to access the directory.</p>
`;

// Print header immediately on load
printHTMLToTerminal(welcomeHTML);

// ==========================================================
// 3. EVENT LISTENERS & SECURITY
// ==========================================================
let lastCommandTime = 0; // For Rate Limiting (Anti-Spam)

// Hide terminal when minimize is clicked
minimizeBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  terminalFrame.classList.add("minimized");
});

// Restore window OR keep input focused
document.addEventListener("click", () => {
  if (terminalFrame.classList.contains("minimized")) {
    terminalFrame.classList.remove("minimized");
    setTimeout(() => {
      inputField.focus();
    }, 400);
  } else {
    inputField.focus();
  }
});

// Cursor hack mirroring
inputField.addEventListener("input", () => {
  typedTextSpan.textContent = inputField.value;
});

// Command execution listener
inputField.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    // --- SECURITY: Rate Limiting ---
    const now = Date.now();
    if (now - lastCommandTime < 400) return; // Ignore if faster than 400ms
    lastCommandTime = now;

    const rawCommand = inputField.value.trim().toLowerCase();

    // Clear the inputs
    inputField.value = "";
    typedTextSpan.textContent = "";

    if (rawCommand !== "") {
      // --- SECURITY: Sanitize output ---
      const safeCommand = sanitizeHTML(rawCommand);
      printHTMLToTerminal(`<div class="command-echo">> $ ${safeCommand}</div>`);
    }

    processCommand(rawCommand);
  }
});

// ==========================================================
// 4. SECURITY HELPER FUNCTIONS
// ==========================================================

// --- SECURITY: XSS Sanitizer ---
function sanitizeHTML(str) {
  const tempDiv = document.createElement("div");
  tempDiv.textContent = str;
  return tempDiv.innerHTML;
}

// --- SECURITY: URL Protocol Validator (prevents javascript: injection) ---
function isSafeURL(url) {
  try {
    const parsed = new URL(url);
    return ["http:", "https:", "mailto:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}

// --- SECURITY: Safe link builder (sanitized + validated + noopener) ---
function buildSafeLink(url, displayText) {
  if (!isSafeURL(url)) {
    return `<span class="code">${sanitizeHTML(displayText)} [invalid link]</span>`;
  }
  return `<a href="${sanitizeHTML(url)}" target="_blank" rel="noopener noreferrer">${sanitizeHTML(displayText)}</a>`;
}

// --- SECURITY: Safe window.open wrapper ---
function safeOpenURL(url) {
  if (!isSafeURL(url)) return;

  if (url.startsWith("mailto:")) {
    window.location.href = url;
  } else {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

// --- Output Renderer & Auto-Scroll ---
function printHTMLToTerminal(htmlString) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = htmlString;

  wrapper.style.opacity = "0";
  wrapper.style.transition = "opacity 0.4s ease";
  outputDiv.appendChild(wrapper);

  // Trigger reflow for animation
  void wrapper.offsetWidth;
  wrapper.style.opacity = "1";

  // Scrolls the '#output' div (keeps input bar fixed at the bottom)
  const terminalOutput = document.getElementById("output");
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

// ==========================================================
// 5. DYNAMIC HTML GENERATORS
// ==========================================================
function buildProjectsHTML() {
  let html = `
    <h2 class="headline-sm">Archived Projects</h2>
    <p>Access project repositories (Click or type command):</p>
    <div style="display: flex; flex-direction: column; gap: 28px; margin-top: 24px;">
  `;

  PORTFOLIO_DATA.projects.forEach((proj) => {
    const safeLink = buildSafeLink(proj.link, proj.name);
    html += `
      <div>
        <div style="display: flex; align-items: baseline; gap: 12px;">
            <div class="code" style="color: var(--primary-container);">
                [${sanitizeHTML(proj.id)}] ${safeLink}
            </div>
            <span class="code" style="opacity: 0.5; font-size: 0.85rem;">(cmd: ${sanitizeHTML(proj.cmd)})</span>
        </div>
        <p style="margin-top: 8px;">${sanitizeHTML(proj.desc)}</p>
      </div>
    `;
  });

  html += `</div>`;
  return html;
}

function buildContactsHTML() {
  let html = `
    <h2 class="headline-sm">Secure Connection</h2>
    <p>Signal routes available (Click or type command):</p>
    <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 16px;">
  `;

  PORTFOLIO_DATA.contacts.forEach((contact) => {
    const safeLink = buildSafeLink(contact.url, contact.display);
    html += `<p class="code">${sanitizeHTML(contact.id)} :: ${safeLink}</p>`;
  });

  html += `</div>`;
  return html;
}

// ==========================================================
// 6. COMMAND LOGIC ENGINE (Object Mapping)
// ==========================================================

// Extracted Easter Egg Logic
function executeSudo() {
  printHTMLToTerminal(
    `<p style="color: #ffb4ab; margin-top: 16px;">[!] SECURITY ALERT: ELEVATED PRIVILEGES REQUESTED [!]</p>`
  );
  inputField.disabled = true;

  setTimeout(
    () =>
      printHTMLToTerminal(
        `<span class="code">> Initiating privilege escalation...</span>`
      ),
    800
  );
  setTimeout(
    () =>
      printHTMLToTerminal(
        `<span class="code">> Bypassing mainframe security protocols...</span>`
      ),
    1800
  );
  setTimeout(
    () =>
      printHTMLToTerminal(
        `<span class="code">> Extracting shadow file hashes...</span>`
      ),
    2800
  );
  setTimeout(() => {
    printHTMLToTerminal(
      `<p style="color: #ffb4ab; margin-top: 16px; font-weight: bold;">FATAL ERROR: UNAUTHORIZED USER.</p><p style="color: #ffb4ab;">This incident has been logged and reported to the system administrator.</p>`
    );
    inputField.disabled = false;
    inputField.focus();
  }, 4000);
  return null;
}

// System Commands Map
const SYSTEM_COMMANDS = {
  help: () => `
    <h2 class="headline-sm">Directory Index <span style="font-size: 0.8rem; opacity: 0.5; font-weight: 400; font-family: var(--font-body);">- type a command for more info</span></h2>
    <ul class="directory-list">
        <li class="directory-item"><span class="code">about</span> - Operator profile & background</li>
        <li class="directory-item"><span class="code">projects</span> - Active and archived threat models</li>
        <li class="directory-item"><span class="code">contact</span> - Establish secure connection</li>
        <li class="directory-item"><span class="code">clear</span> - Flush terminal output</li>
    </ul>
    <p style="margin-top: 16px; opacity: 0.3; font-size: 0.8rem;">Some commands are undocumented. Explore at your own risk.</p>
  `,
  about: () =>
    `<h2 class="headline-sm">Operator Profile</h2><p>${sanitizeHTML(PORTFOLIO_DATA.about)}</p>`,
  projects: () => buildProjectsHTML(),
  contact: () => buildContactsHTML(),
  clear: () => {
    outputDiv.innerHTML = "";
    printHTMLToTerminal(welcomeHTML);
    return null;
  },
  sudo: executeSudo,
  "sudo su": executeSudo,
  su: executeSudo,
};

// Main Command Processor
function processCommand(cmd) {
  if (cmd === "") return;

  // 1. Check if it's a Project Command
  const projectMatch = PORTFOLIO_DATA.projects.find((p) => p.cmd === cmd);
  if (projectMatch) {
    printHTMLToTerminal(
      `<p style="color: var(--primary-container); margin-top: 16px;">Accessing ${sanitizeHTML(projectMatch.name)} repository... opening in new tab.</p>`
    );
    safeOpenURL(projectMatch.link);
    return;
  }

  // 2. Check if it's a Contact Command
  const contactMatch = PORTFOLIO_DATA.contacts.find((c) => c.cmd === cmd);
  if (contactMatch) {
    printHTMLToTerminal(
      `<p style="color: var(--primary-container); margin-top: 16px;">${sanitizeHTML(contactMatch.msg)}</p>`
    );
    safeOpenURL(contactMatch.url);
    return;
  }

  // 3. Check System Commands using Object Mapping
  if (SYSTEM_COMMANDS[cmd]) {
    const response = SYSTEM_COMMANDS[cmd]();
    if (response) {
      printHTMLToTerminal(response);
    }
    return;
  }

  // 4. Fallback: Command not recognized
  const safeCmdForError = sanitizeHTML(cmd);
  printHTMLToTerminal(
    `<p style="color: #ffb4ab; margin-top: 16px;">ERR: Command not recognized: <span class="code">${safeCmdForError}</span></p>`
  );
}