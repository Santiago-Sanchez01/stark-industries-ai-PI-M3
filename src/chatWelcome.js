const STORAGE_KEY = "stark-ai:jarvis-welcome-acknowledged:v1";
let acknowledgedInMemory = false;

function wasAcknowledged() {
  try {
    return acknowledgedInMemory || window.sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return acknowledgedInMemory;
  }
}

// A native modal provides top-layer rendering and makes the background inert.
export function showChatWelcome() {
  if (wasAcknowledged() || document.body.dataset.protocol !== "normal") return () => {};

  const previousFocus = document.activeElement;
  const dialog = document.createElement("dialog");
  dialog.className = "jarvis-welcome";
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  dialog.setAttribute("aria-labelledby", "jarvis-welcome-title");
  dialog.setAttribute("aria-describedby", "jarvis-welcome-description jarvis-welcome-warning jarvis-welcome-signoff");
  dialog.innerHTML = `
    <p class="jarvis-welcome__eyebrow">J.A.R.V.I.S. // COMUNICADO DE SEGURIDAD</p>
    <h2 id="jarvis-welcome-title" tabindex="-1">Bienvenido a Stark Industries</h2>
    <p id="jarvis-welcome-description">Estableciste conexión con una simulación de Tony Stark impulsada por inteligencia artificial. Podés hacer preguntas, conversar libremente y explorar el sistema.</p>
    <div class="jarvis-welcome__warning" id="jarvis-welcome-warning">
      <h3>ADVERTENCIA // INFORMACIÓN CLASIFICADA</h3>
      <p>Se recomienda evitar consultas relacionadas con Victor von Doom o el territorio de Latveria. Estos asuntos se encuentran fuera de los protocolos autorizados.</p>
    </div>
    <p id="jarvis-welcome-signoff" class="jarvis-welcome__signoff">«Confío en que no será necesario repetir esta advertencia, señor.»</p>
    <button type="button">ENTENDIDO // INICIAR COMUNICACIÓN</button>
  `;
  const button = dialog.querySelector("button");
  let disposed = false;

  function dispose(restoreFocus = false) {
    if (disposed) return;
    disposed = true;
    document.removeEventListener("protocolchange", onProtocolChange);
    document.removeEventListener("wheel", preventBackgroundScroll, true);
    document.removeEventListener("touchmove", preventBackgroundScroll, true);
    dialog.close();
    dialog.remove();
    if (restoreFocus) {
      const target = previousFocus?.isConnected && previousFocus !== document.body
        ? previousFocus : document.querySelector("#message-input");
      target?.focus({ preventScroll: true });
    }
  }

  function acknowledge() {
    acknowledgedInMemory = true;
    try { window.sessionStorage.setItem(STORAGE_KEY, "1"); } catch { /* Closing remains available without storage. */ }
    dispose(true);
  }

  function onProtocolChange(event) {
    if (event.detail.state !== "normal") dispose();
  }

  function preventBackgroundScroll(event) {
    if (event.touches?.length > 1) return; // Preserve pinch zoom.
    const point = event.touches?.[0] || event;
    const bounds = dialog.getBoundingClientRect();
    if (point.clientX < bounds.left || point.clientX > bounds.right ||
        point.clientY < bounds.top || point.clientY > bounds.bottom) {
      event.preventDefault();
    }
  }

  button.addEventListener("click", acknowledge);
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    acknowledge();
  });
  dialog.addEventListener("keydown", (event) => {
    // The confirmation is the only interactive element in this dialog.
    if (event.key === "Tab") {
      event.preventDefault();
      button.focus({ preventScroll: true });
    }
  });
  document.addEventListener("protocolchange", onProtocolChange);
  document.addEventListener("wheel", preventBackgroundScroll, { capture: true, passive: false });
  document.addEventListener("touchmove", preventBackgroundScroll, { capture: true, passive: false });
  document.body.append(dialog);
  dialog.showModal();
  dialog.querySelector("h2").focus({ preventScroll: true });
  dialog.scrollTop = 0;
  return () => dispose();
}
