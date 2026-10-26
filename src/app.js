import "./styles.css";

import { initDoomProtocol } from "./doomProtocol.js";

import { initChat } from "./chat.js";

// Contenedor principal de la aplicación
const app = document.querySelector("#app");

// Guardamos las tres vistas de la aplicación
const routes = {
  "/home": renderHome,
  "/chat": renderChat,
  "/about": renderAbout,
};

// Cabecera compartida por todas las vistas
function renderHeader() {
  return `
    <header class="header">
      <a href="/home" data-link class="logo">
        <span class="logo-symbol">◈</span>
        STARK <span class="accent">INDUSTRIES AI</span>
      </a>

      <nav class="nav" aria-label="Navegación principal">
        <a href="/home" data-link>Home</a>
        <a href="/chat" data-link>Chat</a>
        <a href="/about" data-link>About</a>
      </nav>
    </header>
  `;
}

// Vista de inicio
function renderHome() {
  return `
    <section class="hero">
      <div class="reactor" aria-hidden="true">
        <div class="reactor-core">◈</div>
      </div>

      <p class="eyebrow">STARK INDUSTRIES // AI SYSTEM</p>

      <h1>EL FUTURO COMIENZA <span>ACÁ.</span></h1>

      <p class="hero-description">
        ¿Alguna vez quisiste hablar con Tony Stark?
        Accedé a una simulación de su inteligencia,
        ingenio y característico sarcasmo.
      </p>

      <a href="/chat" data-link class="btn-primary">
        INICIAR CONVERSACIÓN →
      </a>

      <p class="system-status">
        <span class="status-dot"></span>
        SISTEMA OPERATIVO
      </p>
    </section>
  `;
}

// Vista del chat (versión visual inicial)
function renderChat() {
  return `
    <section class="chat-layout">
      <div class="chat-heading">
        <p class="eyebrow">COMUNICACIÓN ENCRIPTADA</p>
        <h1>CANAL STARK</h1>
        <p>Conectado con la simulación de Tony Stark.</p>
      </div>


       
  <div
      id="protocol-banner"
      class="protocol-banner"
      role="status"
      hidden
     ></div>

      <div id="latveria-panel" class="latveria-panel" hidden>
      <div class="latveria-flag" aria-hidden="true">
     <span></span>
     <span></span>
     <span></span>
  </div>

  <div>
    <strong>LATVERIA</strong>
    <p>DOOM PROTOCOL // SISTEMA COMPROMETIDO</p>
  </div>
</div>

      <div class="chat-panel">
        <div class="chat-topbar">
          <span class="status-dot"></span>
         <strong id="protocol-status">TONY STARK</strong>
          <span class="online-label">EN LÍNEA</span>
        </div>

        <div
          class="messages"
          id="messages"
          aria-live="polite">
          </div>
          
          <div
           id="chat-error"
            class="chat-error"
            role="alert"
            hidden>
          </div>

           <form class="chat-form" id="chat-form"> 
          <input
            id="message-input"
            type="text"
            placeholder="Escribí tu mensaje..."
            aria-label="Escribí tu mensaje"
            autocomplete="off"
          />
          <button type="submit" class="btn-send">
            ENVIAR →
          </button>
        </form>

        
           <button
            id="recover-button"
            class="recover-button"
            type="button"
           hidden
           >
            SOLICITAR AYUDA A J.A.R.V.I.S.
           </button>

      </div>
    </section>
  `;
}

// Vista de información
function renderAbout() {
  return `
    <section class="about-section">
      <p class="eyebrow">INFORMACIÓN DEL SISTEMA</p>
      <h1>ACERCA DEL <span>PROYECTO</span></h1>

      <div class="info-card">
        <h2>STARK INDUSTRIES AI</h2>
        <p>
          Una aplicación web educativa desarrollada
          como Proyecto Integrador del Módulo 3.
        </p>
        <p>
          Su objetivo es permitir conversaciones con
          una simulación ficticia de Tony Stark,
          utilizando Google Gemini AI.
        </p>
      </div>

      <div class="info-card">
        <h2>TECNOLOGÍAS</h2>
        <p>
          HTML, CSS, JavaScript, History API,
          Google Gemini, Vercel Functions y Vitest.
        </p>
      </div>

      <p class="disclaimer">
        Proyecto educativo no oficial, sin afiliación
        con Marvel. Las respuestas serán generadas por IA.
      </p>
    </section>
  `;
}

// Renderiza la vista correspondiente a la URL

function render() {
  const path = window.location.pathname;
  const view = routes[path] || renderHome;

  app.innerHTML = `
    ${renderHeader()}
    <main>${view()}</main>
    <footer class="footer">
      STARK INDUSTRIES AI // PROYECTO INTEGRADOR M3
    </footer>
  `;

  // Si estamos en la vista Chat, inicializamos el chat
  if (path === "/chat") {
  initChat();
  initDoomProtocol();
}
}

// Cambia la URL sin recargar el documento
function navigate(path) {
  window.history.pushState({}, "", path);
  render();
}

// Intercepta los clics de navegación
document.addEventListener("click", (event) => {
  const link = event.target.closest("a[data-link]");

  if (!link) return;

  // Permitimos acciones normales como Ctrl + clic
  if (
    event.button !== 0 ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }

  event.preventDefault();
  navigate(link.getAttribute("href"));
});

// Permite usar Atrás y Adelante del navegador
window.addEventListener("popstate", render);

// Mostramos la pantalla inicial
render();
