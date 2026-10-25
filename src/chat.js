
const WELCOME_MESSAGE = {
  role: "model",
  text: "Bueno, bueno... Parece que alguien logró acceder a mi sistema. Soy Tony Stark. ¿Qué necesitás, genio?",
};

// Historial mantenido durante la sesión de la SPA
const messages = [];

let isTyping = false;
let errorMessage = "";

// Construye visualmente un mensaje
function createMessageElement(message) {
  const messageDiv = document.createElement("div");

  messageDiv.classList.add("message");

  messageDiv.classList.add(
    message.role === "user"
      ? "user-message"
      : "ai-message"
  );

  const author = document.createElement("span");
  author.className = "message-author";
  author.textContent =
    message.role === "user" ? "VOS" : "TONY STARK";

  const content = document.createElement("p");
  content.textContent = message.text;

  messageDiv.append(author, content);

  return messageDiv;
}

// Renderiza todo el historial de conversación
function renderMessages() {
  const container = document.querySelector("#messages");

  if (!container) return;

  container.replaceChildren();

  // Mensaje inicial, solamente visual
  container.appendChild(
    createMessageElement(WELCOME_MESSAGE)
  );

  messages.forEach((message) => {
    container.appendChild(
      createMessageElement(message)
    );
  });

  if (isTyping) {
    const indicator = document.createElement("div");

    indicator.className = "message ai-message typing";
    indicator.textContent = "Tony Stark está escribiendo...";
    indicator.setAttribute("role", "status");

    container.appendChild(indicator);
  }

  container.scrollTop = container.scrollHeight;
}

// Muestra errores sin agregarlos al historial de Gemini
function renderError() {
  const container = document.querySelector("#chat-error");

  if (!container) return;

  container.textContent = errorMessage;
  container.hidden = !errorMessage;
}

// Actualiza el estado del botón
function updateFormState() {
  const button = document.querySelector(".btn-send");

  if (button) {
    button.disabled = isTyping;
    button.textContent = isTyping
      ? "ESPERANDO..."
      : "ENVIAR →";
  }
}

// Envía el historial a nuestro backend
async function requestGeminiReply() {
  const response = await fetch("/api/functions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "No se pudo conectar con Tony Stark."
    );
  }

  if (typeof data.reply !== "string" || !data.reply.trim()) {
    throw new Error("La respuesta recibida está vacía.");
  }

  return data.reply.trim();
}

// Maneja el envío de cada mensaje
async function handleSubmit(event) {
  event.preventDefault();

  if (isTyping) return;

  const input = document.querySelector("#message-input");

  if (!input) return;

  const text = input.value.trim();

  if (!text) return;

  if (messages.length >= 40) {
    errorMessage =
      "Se alcanzó el límite de esta conversación. Recargá la página para comenzar otra.";
    renderError();
    return;
  }

  messages.push({
    role: "user",
    text,
  });

  input.value = "";
  isTyping = true;
  errorMessage = "";

  renderMessages();
  renderError();
  updateFormState();

  try {
    const reply = await requestGeminiReply();

    messages.push({
      role: "model",
      text: reply,
    });
  } catch (error) {
    // Quitamos el mensaje fallido del historial
    // para permitir reintentar correctamente.
    messages.pop();

    errorMessage =
      error.message || "Ocurrió un error inesperado.";

    // Recuperamos el mensaje original para reintentarlo
    const currentInput =
      document.querySelector("#message-input");

    if (currentInput) {
      currentInput.value = text;
    }
  } finally {
    isTyping = false;

    renderMessages();
    renderError();
    updateFormState();
  }
}

// Se ejecuta al ingresar en la vista Chat
export function initChat() {
  const form = document.querySelector("#chat-form");

  if (!form) return;

  form.addEventListener("submit", handleSubmit);

  renderMessages();
  renderError();
  updateFormState();
}

