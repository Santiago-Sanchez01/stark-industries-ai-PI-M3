
import { requestGeminiReply } from "./api.js";
import { normalizeMessage } from "./utils.js";

// Mensaje inicial de Tony Stark
const WELCOME_MESSAGE = {
  role: "model",
  text: "Bueno, bueno... Parece que alguien logró acceder a mi sistema. Soy Tony Stark. ¿Qué necesitás, genio?",
};

// Historial de conversación en memoria
const messages = [];

// Estados del chat
let isTyping = false;
let errorMessage = "";

// Crea visualmente un mensaje
function createMessageElement(message) {
  const messageDiv = document.createElement("div");

  messageDiv.classList.add("message");

  if (message.role === "user") {
    messageDiv.classList.add("user-message");
  } else {
    messageDiv.classList.add("ai-message");
  }

  const author = document.createElement("span");
  author.classList.add("message-author");

  author.textContent =
    message.role === "user" ? "VOS" : "TONY STARK";

  const content = document.createElement("p");
  content.textContent = message.text;

  messageDiv.append(author, content);

  return messageDiv;
}

// Muestra los mensajes en pantalla
function renderMessages() {
  const container = document.querySelector("#messages");

  if (!container) return;

  container.replaceChildren();

  // Mensaje de bienvenida
  container.appendChild(
    createMessageElement(WELCOME_MESSAGE)
  );

  // Historial de conversación
  messages.forEach((message) => {
    const element = createMessageElement(message);
    container.appendChild(element);
  });

  // Indicador de escritura
  if (isTyping) {
    const indicator = document.createElement("div");

    indicator.className = "message ai-message typing";
    indicator.textContent = "Tony Stark está escribiendo...";
    indicator.setAttribute("role", "status");

    container.appendChild(indicator);
  }

  // Scroll automático
  container.scrollTop = container.scrollHeight;
}

// Muestra los errores en pantalla
function renderError() {
  const container = document.querySelector("#chat-error");

  if (!container) return;

  container.textContent = errorMessage;
  container.hidden = !errorMessage;
}

// Actualiza el botón de enviar
function updateFormState() {
  const button = document.querySelector(".btn-send");

  if (!button) return;

  button.disabled = isTyping;

  button.textContent = isTyping
    ? "ESPERANDO..."
    : "ENVIAR →";
}

// Maneja el envío de mensajes
async function handleSubmit(event) {
  event.preventDefault();

  // Evitamos solicitudes simultáneas
  if (isTyping) return;

  const input = document.querySelector("#message-input");

  if (!input) return;

  const text = normalizeMessage(input.value);

  // Evitamos mensajes vacíos
  if (!text) return;

  // Validamos la longitud del mensaje
  if (text.length > 4000) {
    errorMessage =
      "El mensaje no puede superar los 4000 caracteres.";

    renderError();
    return;
  }

  // Límite de mensajes por conversación
  if (messages.length >= 40) {
    errorMessage =
      "Se alcanzó el límite de esta conversación. Recargá la página para comenzar otra.";

    renderError();
    return;
  }

  // Guardamos el mensaje del usuario
  messages.push({
    role: "user",
    text,
  });

  // Limpiamos el formulario
  input.value = "";

  // Activamos el estado de carga
  isTyping = true;
  errorMessage = "";

  renderMessages();
  renderError();
  updateFormState();

  try {
    // Solicitamos la respuesta real de Gemini
    const reply = await requestGeminiReply(messages);

    // Guardamos la respuesta de Tony Stark
    messages.push({
      role: "model",
      text: reply,
    });
  } catch (error) {
    // Quitamos el mensaje fallido del historial
    messages.pop();

    errorMessage =
      error.message || "Ocurrió un error inesperado.";

    // Recuperamos el mensaje para reintentarlo
    const currentInput =
      document.querySelector("#message-input");

    if (currentInput) {
      currentInput.value = text;
    }
  } finally {
    // Finalizamos el estado de carga
    isTyping = false;

    renderMessages();
    renderError();
    updateFormState();
  }
}

// Inicializa el chat
export function initChat() {
  const form = document.querySelector("#chat-form");

  if (!form) return;

  form.addEventListener("submit", handleSubmit);

  renderMessages();
  renderError();
  updateFormState();
}
