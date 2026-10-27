
import "./styles.css";

import { initDoomProtocol } from "./doomProtocol.js";
import { initChat } from "./chat.js";

// Contenedor principal de la aplicación
const app = document.querySelector("#app");

// Rutas disponibles
const routes = {
  "/home": renderHome,
  "/chat": renderChat,
  "/about": renderAbout,
};

// Cabecera compartida
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

// Vista Home
function renderHome() {
  return `
    <section class="hero">
      <div class="reactor" aria-hidden="true">
        <div class="reactor-core">◈</div>
      </div>

      <p class="eyebrow">
        STARK INDUSTRIES // AI SYSTEM
      </p>

      <h1>
        EL FUTURO COMIENZA <span>ACÁ.</span>
      </h1>

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

// Vista Chat
function renderChat() {
  return `
    <section class="chat-layout">

      <div class="chat-heading">
        <p
          class="eyebrow"
          id="chat-eyebrow"
        >
          COMUNICACIÓN ENCRIPTADA
        </p>

        <h1 id="chat-title">
          CANAL STARK
        </h1>

        <p id="chat-description">
          Conectado con la simulación de Tony Stark.
        </p>
      </div>

      <!-- Alerta de intrusión -->
      <div
        id="protocol-banner"
        class="protocol-banner"
        role="status"
        aria-live="polite"
        hidden
      ></div>

      <!-- Panel de Latveria -->
      <div
        id="latveria-panel"
        class="latveria-panel"
        hidden
      >
        <div
          class="latveria-flag"
          aria-hidden="true"
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div>
          <strong>LATVERIA</strong>
          <p>
            DOOM PROTOCOL // SISTEMA COMPROMETIDO
          </p>
        </div>
      </div>

      <!-- Panel de conversación -->
      <div class="chat-panel">

        <div class="chat-topbar">
          <span
            class="status-dot"
            aria-hidden="true"
          ></span>

          <strong id="protocol-status">
            TONY STARK
          </strong>

          <span
            class="online-label"
            id="chat-online-label"
          >
            EN LÍNEA
          </span>
        </div>

        <!-- Historial -->
        <div
          class="messages"
          id="messages"
          aria-live="polite"
          aria-label="Historial de conversación"
        ></div>

        <!-- Errores -->
        <div
          id="chat-error"
          class="chat-error"
          role="alert"
          hidden
        ></div>

        <!-- Formulario -->
        <form
          class="chat-form"
          id="chat-form"
        >
          <input
            id="message-input"
            type="text"
            placeholder="Escribí tu mensaje..."
            aria-label="Escribí tu mensaje"
            autocomplete="off"
          />

          <button
            type="submit"
            class="btn-send"
            id="chat-send-button"
          >
            ENVIAR →
          </button>
        </form>

        <!-- Recuperación J.A.R.V.I.S. -->
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

// Vista About
function renderAbout() {
  return `
    <section class="about-section">
      <p class="eyebrow">
        INFORMACIÓN DEL SISTEMA
      </p>

      <h1>
        ACERCA DEL <span>PROYECTO</span>
      </h1>

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

// Renderizado de la ruta actual
function render() {
  const path = window.location.pathname;
  const view = routes[path] || renderHome;

  app.innerHTML = `
    ${renderHeader()}

    <main>
      ${view()}
    </main>

    <footer class="footer">
      STARK INDUSTRIES AI // PROYECTO INTEGRADOR M3
    </footer>
  `;

  // Inicialización exclusiva de Chat
  if (path === "/chat") {
    initChat();
    initDoomProtocol();
  }
}

// Navegación sin recargar la página
function navigate(path) {
  window.history.pushState({}, "", path);
  render();
}

// Interceptar enlaces internos
document.addEventListener("click", (event) => {
  const link = event.target.closest("a[data-link]");

  if (!link) return;

  // Respetar apertura en nueva pestaña
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

// Botones Atrás y Adelante
window.addEventListener("popstate", render);

// Renderizado inicial
render();
