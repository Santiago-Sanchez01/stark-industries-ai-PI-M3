
const messages = [
  {
    role: "model",
    text: "Bueno, bueno... Parece que alguien logró acceder a mi sistema. Soy Tony Stark. ¿Qué necesitás, genio?",
  },
];

let isTyping = false;

// Devuelve una respuesta simulada de Tony Stark
function getMockResponse() {
  const responses = [
    "Interesante pregunta. Normalmente cobraría por una respuesta así.",
    "Soy Tony Stark. Resolver problemas imposibles es prácticamente mi pasatiempo.",
    "J.A.R.V.I.S. probablemente ya tendría una respuesta. Pero hoy estoy de buen humor.",
    "La tecnología es increíble. Especialmente cuando yo la diseño.",
    "¿Sabés qué necesita esa idea? Un reactor Arc y un poco de genialidad.",
  ];

  const randomIndex = Math.floor(
    Math.random() * responses.length
  );

  return responses[randomIndex];
}

// Crea un elemento HTML para mostrar un mensaje
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

// Dibuja la conversación en pantalla
function renderMessages() {
  const container = document.querySelector("#messages");

  if (!container) return;

  container.replaceChildren();

  messages.forEach((message) => {
    const element = createMessageElement(message);
    container.appendChild(element);
  });

  if (isTyping) {
    const indicator = document.createElement("div");
    indicator.className = "message ai-message typing";
    indicator.textContent = "Tony Stark está escribiendo...";
    indicator.setAttribute("role", "status");

    container.appendChild(indicator);
  }

  // Desplazamos el chat al último mensaje
  container.scrollTop = container.scrollHeight;
}

// Simula una petición asíncrona a una IA
function simulateAIResponse() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getMockResponse());
    }, 1200);
  });
}

// Maneja el envío de un mensaje
async function handleSubmit(event) {
  event.preventDefault();

  if (isTyping) return;

  const input = document.querySelector("#message-input");

  if (!input) return;

  const text = input.value.trim();

  // No permitimos enviar mensajes vacíos
  if (!text) return;

  messages.push({
    role: "user",
    text: text,
  });

  input.value = "";
  isTyping = true;

  renderMessages();
  updateFormState();

  try {
    const response = await simulateAIResponse();

    messages.push({
      role: "model",
      text: response,
    });
  } catch (error) {
    console.error("Error en el chat:", error);

    messages.push({
      role: "model",
      text: "Parece que mi sistema tuvo un problema. Intentemos nuevamente.",
    });
  } finally {
    isTyping = false;
    renderMessages();
    updateFormState();
  }
}

// Evita enviar mensajes mientras llega una respuesta
function updateFormState() {
  const button = document.querySelector(".btn-send");

  if (button) {
    button.disabled = isTyping;
  }
}

// Inicializa el chat cuando entramos a /chat
export function initChat() {
  const form = document.querySelector("#chat-form");

  if (!form) return;

  form.addEventListener("submit", handleSubmit);

  renderMessages();
  updateFormState();
}
