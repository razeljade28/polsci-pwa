// UI helpers (extracted from app.js)
function sanitizeHTML(str) {
  if (!str) return "";
  const temp = document.createElement("div");
  temp.textContent = str;
  return temp.innerHTML;
}

export const UI = {
  toast(opt) {
    const container = document.getElementById("toast-container");
    if (!container) return;
    const el = document.createElement("div");
    const msg = typeof opt === "string" ? opt : opt.message;
    const type = typeof opt === "string" ? "info" : opt.type || "info";
    el.className = `toast ${type}`;
    el.textContent = msg;
    container.appendChild(el);
    setTimeout(() => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      setTimeout(() => el.remove(), 300);
    }, 3000);
  },

  modal(html, opts = {}) {
    const container = document.getElementById("modal-container");
    if (!container) return;
    const overlay = document.getElementById("overlay");
    const div = document.createElement("div");
    div.className = "modal show";
    div.innerHTML = html;
    container.innerHTML = "";
    container.appendChild(div);
    overlay.classList.add("show");

    const close = () => {
      div.classList.remove("show");
      overlay.classList.remove("show");
      setTimeout(() => {
        container.innerHTML = "";
      }, 300);
    };

    overlay.onclick = close;

    div.querySelectorAll("[data-close-modal]").forEach((el) => {
      el.addEventListener("click", close);
    });

    return { close, element: div };
  },

  closeModal() {
    const container = document.getElementById("modal-container");
    const overlay = document.getElementById("overlay");
    if (container) container.innerHTML = "";
    if (overlay) overlay.classList.remove("show");
  },

  showLoading(show = true) {
    const screen = document.getElementById("loading-screen");
    if (screen) {
      screen.style.display = show ? "flex" : "none";
    }
  },

  hideLoading() {
    const screen = document.getElementById("loading-screen");
    if (screen) {
      screen.style.display = "none";
    }
  },

  confetti(options = {}) {
    const count = options.count || 80;
    const colors = [
      "#759954",
      "#A9C88B",
      "#FFD54F",
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
    ];
    const container = document.createElement("div");
    container.style.cssText =
      "position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden;";
    document.body.appendChild(container);

    for (let i = 0; i < count; i++) {
      const el = document.createElement("div");
      const size = 6 + Math.random() * 8;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const left = Math.random() * 100;
      const delay = Math.random() * 0.5;
      const duration = 1.5 + Math.random() * 2;
      const rotation = Math.random() * 720;

      el.style.cssText = `
                position:absolute;
                top:-10px;
                left:${left}%;
                width:${size}px;
                height:${size * (0.5 + Math.random() * 0.5)}px;
                background:${color};
                border-radius:${Math.random() > 0.5 ? "50%" : "2px"};
                animation: confettiFall ${duration}s ease-in ${delay}s forwards;
                transform: rotate(${rotation}deg);
                opacity:1;
            `;
      container.appendChild(el);
    }

    if (!document.getElementById("confetti-style")) {
      const style = document.createElement("style");
      style.id = "confetti-style";
      style.textContent = `
                @keyframes confettiFall {
                    0% { transform: translateY(0) rotate(0deg) scale(1); opacity:1; }
                    100% { transform: translateY(100vh) rotate(720deg) scale(0.3); opacity:0; }
                }
            `;
      document.head.appendChild(style);
    }

    setTimeout(() => container.remove(), 3000);
  },

  floatExp(amount, x, y) {
    const el = document.createElement("div");
    el.textContent = `+${amount} EXP`;
    el.style.cssText = `
            position:fixed;
            left:${x}px;
            top:${y}px;
            font-weight:800;
            font-size:28px;
            color:#759954;
            pointer-events:none;
            z-index:9999;
            animation: floatExpUp 1.2s ease-out forwards;
            text-shadow:0 2px 10px rgba(117,153,84,0.3);
        `;
    document.body.appendChild(el);

    if (!document.getElementById("float-exp-style")) {
      const style = document.createElement("style");
      style.id = "float-exp-style";
      style.textContent = `
                @keyframes floatExpUp {
                    0% { opacity:1; transform: translateY(0) scale(1); }
                    100% { opacity:0; transform: translateY(-80px) scale(1.4); }
                }
            `;
      document.head.appendChild(style);
    }

    setTimeout(() => el.remove(), 1300);
  },

  skeleton(count = 3, type = "card") {
    let html = "";
    for (let i = 0; i < count; i++) {
      html += `
                <div class="card skeleton" style="padding:20px;animation:shimmer 1.5s infinite;">
                    <div style="height:20px;width:70%;background:#e8ece4;border-radius:8px;margin-bottom:12px;"></div>
                    <div style="height:14px;width:90%;background:#e8ece4;border-radius:6px;margin-bottom:8px;"></div>
                    <div style="height:14px;width:60%;background:#e8ece4;border-radius:6px;"></div>
                </div>
            `;
    }
    return html;
  },

  emptyState(message, icon = "inbox", action = null) {
    let html = `
            <div class="card text-center" style="padding:40px 20px;">
                <span class="material-symbols-rounded" style="font-size:64px;color:#c5d0b8;display:block;margin-bottom:16px;">${icon}</span>
                <p style="color:var(--text-light);font-size:1rem;">${sanitizeHTML(message)}</p>
        `;
    if (action) {
      html += `<button class="btn-primary" style="margin-top:16px;width:auto;padding:12px 28px;display:inline-flex;" onclick="${action}">Take Action</button>`;
    }
    html += `</div>`;
    return html;
  },
};
