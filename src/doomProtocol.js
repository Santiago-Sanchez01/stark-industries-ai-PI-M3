
export const PROTOCOL_STATES = {
  NORMAL: "normal",
  ALERT: "alert",
  DOOM: "doom",
  RECOVERY: "recovery",
};

let currentState = PROTOCOL_STATES.NORMAL;
let transitionTimer = null;

// Configuración visual de cada estado del protocolo.
const PROTOCOL_UI = {
  normal: {
    eyebrow: "COMUNICACIÓN ENCRIPTADA",
    title: "CANAL STARK",
    description:
      "Conectado con la simulación de Tony Stark.",
    status: "TONY STARK",
    online: "EN LÍNEA",
    banner: "",
    placeholder: "Escribí tu mensaje...",
  },

  alert: {
    eyebrow: "ALERTA DE SEGURIDAD",
    title: "INTRUSIÓN DETECTADA",
    description:
      "Se detectó un acceso no autorizado al sistema Stark.",
    status: "INTRUSIÓN DETECTADA",
    online: "ALERTA",
    banner: "⚠ SECURITY BREACH DETECTED",
    placeholder: "Acceso temporalmente bloqueado...",
  },

  doom: {
    eyebrow: "TRANSMISIÓN INTERVENIDA // LATVERIA",
    title: "DOOM PROTOCOL",
    description:
      "Los sistemas Stark están bajo el control ficticio de Doctor Doom.",
    status: "DOCTOR DOOM",
    online: "CONTROL TOMADO",
    banner: "⚠ DOOM PROTOCOL ACTIVE",
    placeholder: "Dirigite al soberano de Latveria...",
  },

  recovery: {
    eyebrow: "PROTOCOLO DE RECUPERACIÓN",
    title: "RESTAURANDO SISTEMA",
    description:
      "J.A.R.V.I.S. está recuperando el control de Stark Industries.",
    status: "J.A.R.V.I.S. RESTAURANDO SISTEMA",
    online: "RECUPERANDO",
    banner: "J.A.R.V.I.S. // RECUPERANDO CONTROL",
    placeholder: "Restaurando comunicaciones...",
  },
};

export function getProtocolState() {
  return currentState;
}

// Actualiza el contenido textual de un elemento,
// siempre que exista en la vista actual.
function setText(selector, value) {
  const element = document.querySelector(selector);

  if (element) {
    element.textContent = value;
  }
}

function updateProtocolUI() {
  const config = PROTOCOL_UI[currentState];

  if (!config) return;

  // Esta propiedad activa los estilos correspondientes.
  document.body.dataset.protocol = currentState;

  // Identidad dinámica del chat.
  setText("#chat-eyebrow", config.eyebrow);
  setText("#chat-title", config.title);
  setText("#chat-description", config.description);
  setText("#protocol-status", config.status);
  setText("#chat-online-label", config.online);

  const banner = document.querySelector(
    "#protocol-banner"
  );

  const flag = document.querySelector(
    "#latveria-panel"
  );

  const recoverButton = document.querySelector(
    "#recover-button"
  );

  const input = document.querySelector(
    "#message-input"
  );

  const sendButton = document.querySelector(
    "#chat-send-button"
  );

  const transitionInProgress =
    currentState === PROTOCOL_STATES.ALERT ||
    currentState === PROTOCOL_STATES.RECOVERY;

  if (banner) {
    banner.hidden =
      currentState === PROTOCOL_STATES.NORMAL;

    banner.textContent = config.banner;
  }

  if (flag) {
    flag.hidden =
      currentState !== PROTOCOL_STATES.DOOM;
  }

  if (recoverButton) {
    recoverButton.hidden =
      currentState !== PROTOCOL_STATES.DOOM;
  }

  if (input) {
    input.disabled = transitionInProgress;
    input.placeholder = config.placeholder;
  }

  if (sendButton) {
    sendButton.disabled = transitionInProgress;
  }

  // Conservamos el evento utilizado por chat.js.
  document.dispatchEvent(
    new CustomEvent("protocolchange", {
      detail: { state: currentState },
    })
  );
}

function changeState(newState) {
  currentState = newState;
  updateProtocolUI();
}

export function activateDoomProtocol() {
  if (currentState !== PROTOCOL_STATES.NORMAL) {
    return false;
  }

  clearTimeout(transitionTimer);

  changeState(PROTOCOL_STATES.ALERT);

  transitionTimer = setTimeout(() => {
    changeState(PROTOCOL_STATES.DOOM);
    transitionTimer = null;
  }, 1800);

  return true;
}

export function restoreJarvisControl() {
  if (currentState !== PROTOCOL_STATES.DOOM) {
    return false;
  }

  clearTimeout(transitionTimer);

  changeState(PROTOCOL_STATES.RECOVERY);

  transitionTimer = setTimeout(() => {
    changeState(PROTOCOL_STATES.NORMAL);
    transitionTimer = null;
  }, 1800);

  return true;
}

export function initDoomProtocol() {
  const recoverButton = document.querySelector(
    "#recover-button"
  );

  if (recoverButton) {
    recoverButton.addEventListener(
      "click",
      restoreJarvisControl
    );
  }

  // Sincroniza la UI al entrar o regresar a /chat.
  updateProtocolUI();
}
