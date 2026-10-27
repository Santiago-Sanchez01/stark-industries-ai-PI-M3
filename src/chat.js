import { createMessageElement } from "./messageView.js";

import { requestGeminiReply } from "./api.js";

import {
  normalizeMessage,
  detectDoomReference,
} from "./utils.js";

import {
  activateDoomProtocol,
  getProtocolState,
  PROTOCOL_STATES,
} from "./doomProtocol.js";

// Mensajes visibles en la interfaz
const displayMessages = [
  {
    role: "model",
    character: "tony",
    text: "Bueno, bueno... Parece que alguien logró acceder a mi sistema. Soy Tony Stark. ¿Qué necesitás, genio?",
  },
];

// Historial independiente para cada personaje
const histories = {
  tony: [],
  doom: [],
};

let isTyping = false;
let errorMessage = "";
let pendingDoomIntro = false;
let previousProtocolState = PROTOCOL_STATES.NORMAL;

// Determina qué personaje está activo
function getActiveCharacter() {
  return getProtocolState() === PROTOCOL_STATES.DOOM
    ? "doom"
    : "tony";
}

// Dibuja los mensajes en pantalla
function renderMessages() {
  const container = document.querySelector("#messages");

  if (!container) return;

  container.replaceChildren();

  displayMessages.forEach((message) => {
    container.appendChild(
      createMessageElement(message)
    );
  });

  if (isTyping) {
    const indicator = document.createElement("div");
    indicator.className = "message ai-message typing";
    indicator.dataset.speaker = getActiveCharacter();

    indicator.textContent =
      getActiveCharacter() === "doom"
        ? "Doctor Doom está escribiendo..."
        : "Tony Stark está escribiendo...";

    container.appendChild(indicator);
  }

  container.scrollTop = container.scrollHeight;
}

// Muestra errores
function renderError() {
  const container = document.querySelector("#chat-error");

  if (!container) return;

  container.textContent = errorMessage;
  container.hidden = !errorMessage;
}

// Controla el estado del formulario
function updateFormState() {
  const button = document.querySelector(".btn-send");
  const input = document.querySelector("#message-input");
  const recoverButton =
    document.querySelector("#recover-button");

  const state = getProtocolState();

  const canChat =
    state === PROTOCOL_STATES.NORMAL ||
    state === PROTOCOL_STATES.DOOM;

  if (input) {
    input.disabled = !canChat;
  }

  if (button) {
    button.disabled = isTyping || !canChat;

    button.textContent = isTyping
      ? "ESPERANDO..."
      : "ENVIAR →";
  }

  // No restauramos el sistema durante una petición
  if (recoverButton) {
    recoverButton.disabled = isTyping;
  }
}

// Consulta a Gemini utilizando el personaje indicado
async function sendReply(character) {
  isTyping = true;
  errorMessage = "";

  renderMessages();
  renderError();
  updateFormState();

  try {
    const reply = await requestGeminiReply(
      histories[character],
      character
    );

    histories[character].push({
      role: "model",
      text: reply,
    });

    displayMessages.push({
      role: "model",
      character,
      text: reply,
    });
  } catch (error) {
    // Retiramos del historial de Gemini el
    // mensaje que no obtuvo respuesta.
    const failedMessage = histories[character].pop();

    errorMessage =
      error.message || "Ocurrió un error inesperado.";

    // Recuperamos el texto para poder reintentarlo
    const input = document.querySelector("#message-input");

    if (input && failedMessage) {
      input.value = failedMessage.text;
    }
  } finally {
    isTyping = false;

    renderMessages();
    renderError();
    updateFormState();
  }
}

// Envía el mensaje del usuario
async function handleSubmit(event) {
  event.preventDefault();

  const state = getProtocolState();

  if (isTyping) return;

  if (
    state !== PROTOCOL_STATES.NORMAL &&
    state !== PROTOCOL_STATES.DOOM
  ) {
    return;
  }

  const input = document.querySelector("#message-input");

  if (!input) return;

  const text = normalizeMessage(input.value);

  if (!text) return;

  if (text.length > 4000) {
    errorMessage = "El mensaje supera los 4000 caracteres.";
    renderError();
    return;
  }

  const character = getActiveCharacter();

  if (histories[character].length >= 40) {
    errorMessage =
      "Se alcanzó el límite de mensajes para este personaje.";
    renderError();
    return;
  }

  // Guardamos el mensaje en pantalla
  displayMessages.push({
    role: "user",
    text,
  });

  input.value = "";
  errorMessage = "";

  // Activación automática de DOOM PROTOCOL
  if (
    state === PROTOCOL_STATES.NORMAL &&
    detectDoomReference(text)
  ) {
    // Comenzamos una conversación nueva con Doom.
    histories.doom = [
      {
        role: "user",
        text,
      },
    ];

    pendingDoomIntro = true;

    renderMessages();
    renderError();

    activateDoomProtocol();
    return;
  }

  // Conversación normal con el personaje activo
  histories[character].push({
    role: "user",
    text,
  });

  await sendReply(character);
}

// Reacciona a los cambios de DOOM PROTOCOL
document.addEventListener("protocolchange", (event) => {
  const state = event.detail.state;

  if (state === PROTOCOL_STATES.ALERT) {
    displayMessages.push({
      role: "notice",
      noticeType: "intrusion",
      text: "⚠ J.A.R.V.I.S.: Intrusión detectada. Perdiendo el control del sistema...",
    });
  }

  if (
    state === PROTOCOL_STATES.DOOM &&
    pendingDoomIntro
  ) {
    pendingDoomIntro = false;

    displayMessages.push({
      role: "notice",
      noticeType: "intrusion",
      text: "DOOM PROTOCOL ACTIVE // LATVERIA HA TOMADO EL CONTROL",
    });

    // Primera respuesta real de Doctor Doom
    void sendReply("doom");
  }

  if (state === PROTOCOL_STATES.RECOVERY) {
    displayMessages.push({
      role: "notice",
      noticeType: "recovery",
      text: "J.A.R.V.I.S.: Protocolo de recuperación iniciado. Restaurando Stark Industries...",
    });
  }

  if (
    state === PROTOCOL_STATES.NORMAL &&
    previousProtocolState === PROTOCOL_STATES.RECOVERY
  ) {
    displayMessages.push({
      role: "notice",
      noticeType: "recovery",
      text: "✓ J.A.R.V.I.S.: Sistemas restaurados. Tony Stark vuelve a estar disponible.",
    });
  }

  previousProtocolState = state;

  renderMessages();
  renderError();
  updateFormState();
});

// Inicializa la vista Chat
export function initChat() {
  const form = document.querySelector("#chat-form");

  if (!form) return;

  form.addEventListener("submit", handleSubmit);

  renderMessages();
  renderError();
  updateFormState();
}
