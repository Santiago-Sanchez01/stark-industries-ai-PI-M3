# ⚡ STARK INDUSTRIES AI

**Conversá con Tony Stark. Descubrí DOOM PROTOCOL. Recuperá el control con J.A.R.V.I.S.**

🌐 **[Ver aplicación en vivo](https://stark-industries-ai.vercel.app/)**

---

## 📖 Descripción del proyecto

**Stark Industries AI** es una Single Page Application (SPA) responsive desarrollada como Proyecto Integrador del Módulo 3 de Full Stack de Henry.

La aplicación permite conversar con una simulación de **Tony Stark (Iron Man)** utilizando Google Gemini AI.

Además, incorpora una experiencia interactiva llamada **DOOM PROTOCOL**, en la que Doctor Doom toma el control ficticio del sistema cuando el usuario menciona palabras relacionadas con el personaje o Latveria.

Durante este evento, la interfaz cambia completamente su identidad visual y permite conversar con Doctor Doom. El usuario puede solicitar ayuda a J.A.R.V.I.S. para recuperar el control y volver a conversar con Tony Stark.

El proyecto integra desarrollo frontend, navegación SPA, consumo de APIs, inteligencia artificial, funciones serverless, seguridad, testing y despliegue.

## 🚀 Funcionalidades principales

### 🤖 Chat con Tony Stark

- Conversaciones generadas mediante Google Gemini AI.
- Personalidad de Tony Stark definida mediante un system prompt.
- Respuestas contextualizadas según el historial.
- Diferenciación visual entre mensajes del usuario y de la IA.
- Indicador de escritura mientras se genera una respuesta.
- Envío de mensajes con Enter o mediante el botón Enviar.
- Scroll automático al último mensaje.
- Manejo de errores de conexión y de la API.
- Historial mantenido durante la sesión de la SPA.

### 🟢 DOOM PROTOCOL

DOOM PROTOCOL es una experiencia interactiva adicional que transforma la aplicación cuando el usuario menciona a Doctor Doom, Latveria o referencias relacionadas.

**Funcionamiento del evento:**

1. El usuario menciona a Doom durante una conversación.
2. El sistema detecta automáticamente la referencia.
3. Se activa una alerta de intrusión.
4. La interfaz cambia de la estética azul de J.A.R.V.I.S. a una identidad visual verde y roja.
5. Aparece la bandera de Latveria.
6. Doctor Doom toma el control ficticio del sistema.
7. Gemini comienza a responder utilizando la personalidad de Doctor Doom.
8. El usuario puede solicitar ayuda a J.A.R.V.I.S. mediante un botón.
9. Se ejecuta la recuperación y Tony Stark vuelve a controlar el chat.

Cada personaje utiliza un system prompt propio y un historial independiente, permitiendo mantener el contexto de las conversaciones.

La intrusión es completamente ficticia y forma parte de la experiencia narrativa.

### 🧭 Navegación SPA

La aplicación utiliza History API para implementar navegación sin recargar la página.

Cuenta con tres rutas:

- `/home`: página principal y presentación de la aplicación.
- `/chat`: interfaz de conversación con los personajes.
- `/about`: información del proyecto y las tecnologías.

También permite navegar correctamente utilizando los botones Atrás y Adelante del navegador.

### 📱 Diseño responsive

La interfaz fue desarrollada utilizando el enfoque Mobile-First.

Se aplicaron Flexbox, CSS Grid y media queries para adaptar el diseño a celulares, tablets y computadoras.

La aplicación fue probada exitosamente desde navegadores de escritorio y dos dispositivos móviles reales.

## 🛠️ Tecnologías utilizadas

| Tecnología | Función |
|---|---|
| HTML5 | Estructura de la aplicación |
| CSS3 | Estilos, responsive y animaciones |
| JavaScript ES6+ | Lógica y manipulación del DOM |
| Vite | Entorno de desarrollo y build |
| History API | Navegación SPA |
| Fetch API | Comunicación con el backend |
| Google Gemini AI | Generación de respuestas |
| Vercel Serverless Functions | Backend seguro |
| Vitest | Testing unitario |
| Git | Control de versiones |
| GitHub | Repositorio del proyecto |
| Vercel | Despliegue y alojamiento |

## 📂 Estructura del proyecto

```text
stark-industries-ai/
│
├── api/
│   └── functions.js
│
├── src/
│   ├── api.js
│   ├── app.js
│   ├── chat.js
│   ├── doomProtocol.js
│   ├── styles.css
│   └── utils.js
│
├── tests/
│   ├── app.test.js
│   └── utils.test.js
│
├── index.html
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── vercel.json
└── README.md
```

### Responsabilidad de los archivos

- **app.js:** renderizado de las vistas y navegación SPA.
- **chat.js:** manejo de mensajes, historial e interacción con el usuario.
- **api.js:** comunicación HTTP entre frontend y backend.
- **doomProtocol.js:** estados, activación y recuperación del protocolo.
- **utils.js:** funciones de normalización y transformación de datos.
- **api/functions.js:** función serverless que consulta Google Gemini.
- **tests/:** pruebas automatizadas mediante Vitest.

## 💻 Instalación y ejecución local

### Requisitos previos

Para ejecutar el proyecto es necesario contar con:

- Node.js y npm compatibles con las dependencias del proyecto.
- Git.
- Una cuenta de Vercel.
- Una API key válida de Google Gemini.
- Visual Studio Code u otro editor de código.

### 1. Clonar el repositorio

```bash
git clone URL_DEL_REPOSITORIO
```

Ingresar a la carpeta:

```bash
cd stark-industries-ai
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Instalar Vercel CLI

```bash
npm install -g vercel
```

### 4. Configurar las variables de entorno

La aplicación utiliza una variable privada llamada:

```env
GEMINI_API_KEY=
```

La clave puede obtenerse desde:

https://aistudio.google.com/apikey

Configurar `GEMINI_API_KEY` en el entorno Development del proyecto de Vercel.

Iniciar sesión:

```bash
vercel login
```

Vincular el proyecto:

```bash
vercel link
```

Sincronizar las variables de entorno:

```bash
vercel pull --yes --environment=development
```

**Importante:** nunca colocar la clave real en los archivos del frontend ni subirla a GitHub.

El archivo `.env.example` documenta las variables necesarias sin incluir valores sensibles.

### 5. Iniciar el proyecto

```bash
vercel dev
```

Abrir la dirección local indicada por la terminal, generalmente:

http://localhost:3000

Se utiliza `vercel dev` porque permite ejecutar tanto el frontend desarrollado con Vite como las Vercel Serverless Functions.

## 🧠 Integración con Google Gemini AI

La aplicación utiliza una arquitectura frontend-backend para proteger la API key.

**Flujo de comunicación:**

1. El usuario escribe un mensaje.
2. `chat.js` administra la conversación.
3. `api.js` realiza una petición POST al endpoint `/api/functions`.
4. La Serverless Function recibe el historial y el personaje seleccionado.
5. El backend selecciona el system prompt correspondiente.
6. La función consulta Google Gemini utilizando la API key privada.
7. Gemini genera una respuesta.
8. El backend procesa el JSON y devuelve el texto.
9. El frontend muestra la respuesta en el chat.

### Personalización de personajes

**Tony Stark**

Su personalidad se basa en inteligencia, creatividad, confianza, humor sarcástico y conocimientos de tecnología e ingeniería.

**Doctor Doom**

Su personalidad se caracteriza por autoridad, orgullo, inteligencia, arrogancia y referencias a Latveria.

Cada personaje mantiene su propio historial conversacional para evitar mezclar contextos.

El historial se conserva en memoria durante la sesión de la SPA y se reinicia al recargar completamente la aplicación.

## 🧪 Testing unitario

Se utiliza **Vitest** para verificar el funcionamiento de las funciones principales de la aplicación.

Los tests comprueban:

- Normalización de mensajes.
- Transformación de mensajes al formato de Gemini.
- Validación de roles.
- Extracción de respuestas desde JSON.
- Comunicación HTTP mediante Fetch API.
- Manejo de errores del backend.
- Selección de Tony Stark.
- Selección de Doctor Doom.

Las solicitudes HTTP se simulan utilizando mocks de `fetch`, por lo que los tests no necesitan conectarse a Gemini ni consumir cuota de la API.

### Ejecutar los tests

Para ejecutar todas las pruebas:

```bash
npm run test:run
```

Para utilizar Vitest en modo observación:

```bash
npm test
```

### Último resultado verificado

```text
✓ tests/utils.test.js (6 tests)
✓ tests/app.test.js (4 tests)

Test Files  2 passed (2)
Tests       10 passed (10)
```

Se implementaron diez tests unitarios, superando el mínimo de cuatro solicitado en la consigna.

## 📦 Build de producción

Para generar una versión optimizada de la aplicación:

```bash
npm run build
```

Vite genera los archivos de producción dentro de la carpeta `dist/`.

El build fue ejecutado y verificado correctamente durante el desarrollo.

## ☁️ Deployment en Vercel

El proyecto se encuentra desplegado en Vercel:

https://stark-industries-ai.vercel.app/

### Pasos para desplegar

1. Crear o vincular un proyecto en Vercel.
2. Seleccionar Vite como framework.
3. Configurar `npm run build` como comando de compilación.
4. Utilizar `dist` como directorio de salida.
5. Configurar `GEMINI_API_KEY` en Production.
6. Publicar la aplicación.

Para realizar un deployment manual desde la terminal:

```bash
vercel --prod
```

La configuración de `vercel.json` permite acceder directamente a las rutas de la SPA sin obtener errores 404.

La aplicación fue desplegada y probada desde la URL pública, incluyendo la comunicación con Gemini.

## 🔐 Seguridad

Se implementaron diferentes medidas de seguridad:

- API key almacenada mediante variables de entorno privadas.
- Comunicación con Gemini desde el backend.
- Validación del método HTTP.
- Validación de roles, estructura y longitud de los mensajes.
- Validación de personajes permitidos.
- Manejo de respuestas de error de Gemini.
- Exclusión de archivos privados mediante `.gitignore`.
- Inserción segura del texto de los mensajes mediante `textContent`.

El proyecto es una prueba de concepto educativa. No cuenta con autenticación de usuarios ni persistencia de conversaciones en una base de datos.

Para un uso público de mayor escala sería recomendable agregar protección adicional contra solicitudes abusivas y monitorear las cuotas de la API.

## 📸 Capturas de pantalla

**Sección pendiente de completar después de las mejoras visuales finales.**

Se incorporarán capturas de:

- Home en desktop y mobile.
- Chat con Tony Stark.
- Activación de DOOM PROTOCOL.
- Conversación con Doctor Doom.
- Recuperación del sistema mediante J.A.R.V.I.S.
- Vista About.

## 🤖 Registro del uso de inteligencia artificial

Durante el desarrollo se utilizó ChatGPT como herramienta de asistencia técnica y aprendizaje.

### Planificación

Se utilizó inteligencia artificial para analizar los requisitos del proyecto, organizar las etapas de desarrollo y definir la arquitectura inicial.

### Desarrollo frontend

Se solicitó asistencia para implementar la estructura HTML, los estilos responsive, History API, manipulación del DOM, módulos JavaScript y eventos.

### Integración con Gemini

Se utilizó IA como apoyo para comprender la comunicación frontend-backend, diseñar los system prompts de los personajes y configurar la integración segura mediante Vercel Functions.

### Desarrollo de DOOM PROTOCOL

Se trabajó con IA para diseñar la experiencia narrativa, organizar sus estados y desarrollar la lógica de activación, cambio de personaje y recuperación del sistema.

### Debugging

La IA colaboró en el análisis de diferentes problemas encontrados durante el desarrollo, incluyendo:

- Errores de importación y sintaxis.
- Un `Illegal return statement` que impedía cargar la aplicación.
- Fallos en tests después de incorporar múltiples personajes.
- Problemas de configuración de Vercel.
- Errores HTTP 403 asociados al acceso gratuito de Gemini.
- Errores HTTP 502 durante las pruebas en producción.

### Testing

Se utilizó IA para comprender Vitest, crear funciones reutilizables, implementar mocks y analizar los errores de las pruebas.

### Validación

Las sugerencias recibidas fueron evaluadas y comprobadas mediante ejecución local, tests unitarios, build de producción y pruebas manuales.

También se realizaron pruebas de funcionamiento desde dos dispositivos móviles reales.

**La inteligencia artificial fue utilizada como herramienta de apoyo al aprendizaje y desarrollo, acompañada de verificaciones técnicas y pruebas funcionales.**

## 📌 Estado del proyecto

- SPA con navegación dinámica implementada.
- Diseño responsive y Mobile-First.
- Integración funcional con Google Gemini.
- Conversaciones con Tony Stark y Doctor Doom.
- DOOM PROTOCOL y recuperación mediante J.A.R.V.I.S.
- Diez tests unitarios aprobados.
- Build de producción exitoso.
- Aplicación publicada y probada en Vercel.
- Mejoras visuales y capturas definitivas pendientes.

## 📚 Créditos y finalidad educativa

Proyecto desarrollado como parte del Proyecto Integrador del Módulo 3 de Full Stack de Henry.

Los personajes Tony Stark, Iron Man, Doctor Doom y J.A.R.V.I.S., así como sus referencias, pertenecen a sus respectivos titulares.

Este es un proyecto educativo no oficial, sin afiliación ni respaldo de Marvel o Disney.

Las respuestas de los personajes son generadas mediante inteligencia artificial y forman parte de una experiencia ficticia.
## Rediseño cinematográfico local

La vista Chat utiliza un panel de personaje y un chat con scroll interno. Desde 1100 px se distribuyen en dos columnas (aproximadamente 62/38); celulares y tablets apilan el contenido. Las pantallas bajas permiten scroll de página. Se conservan NORMAL, ALERT, DOOM y RECOVERY, los historiales y la integración serverless existente. Los efectos respetan `prefers-reduced-motion`.

### Recursos visuales y atribución

- `public/assets/latveria-flag.svg`: **Flag of Latveria**, autor **Michos (usuario Michoss)**, 25 de agosto de 2014. Fuente: https://commons.wikimedia.org/wiki/File:Flag_of_Latveria.svg . SVG original descargado sin modificaciones. Licencia elegida: **Creative Commons Attribution-ShareAlike 3.0 Unported**, https://creativecommons.org/licenses/by-sa/3.0/ . Se conserva su proporción 2:1. Las adaptaciones de este recurso deben compartirse bajo la misma licencia o una compatible; no implica respaldo del autor.
- `public/assets/doom-portrait.svg`: ilustración vectorial original creada para este rediseño mediante código SVG; no deriva de una imagen descargada. No se atribuye una licencia de terceros a esta ilustración. El personaje Doctor Doom pertenece a sus respectivos titulares.
- Reactor Arc, HUD, fondos y superficies: composición original en HTML/CSS, sin imágenes externas, fuentes remotas ni hotlinking.

Stark Industries AI es un proyecto educativo no oficial, sin afiliación ni respaldo de Marvel o Disney. Los personajes pertenecen a sus titulares. DOOM PROTOCOL es una simulación narrativa ficticia y no representa un incidente de seguridad real.

### Revisión visual pendiente

No se recibió el boceto adjunto en la sesión. Revisar manualmente `/home`, `/chat` y `/about` en 375, 393, 768, 1024, 1366, 1440 y 1920 px, incluyendo alturas 768 y 900 px. Comprobar mensajes largos, loading, errores y recuperación con el teclado y zoom. El diseño no requiere nuevas dependencias ni modificaciones de credenciales.


### Versión final Iron Man / Doom

- Cabecera unificada, reactor SVG con placas rojas/doradas, retrato cinematográfico asimétrico, contexto cartográfico decorativo y recuperación cian. El mapa es un gráfico ficticio decorativo, no cartografía oficial de Marvel.
- `src/messageView.js` construye mensajes con `data-speaker="tony|doom|user|system"`. Sus colores son constantes por autor, sin variables del protocolo. El indicador de escritura también identifica su personaje. Se conservan los formatos enviados a Gemini.
- `public/assets/doom-cinematic.jpg`: ilustración original generada con la herramienta integrada imagegen, sin descargar ilustraciones de terceros. Prompt utilizado: “Use case: stylized-concept. Create an original cinematic digital painting asset for an educational Doctor Doom web interface, NOT a UI screenshot. Wide landscape composition 3:2. Victor Von Doom fills the LEFT half, imposing chest-up three-quarter view, dark emerald hood, finely detailed sculpted gunmetal mask, dramatic emerald rim light, richly textured green fabric, engraved armor and subtle gold cloak clasps. His face is near x=28%, y=32%. RIGHT half shows a distant gothic Latverian fortress and mountains under green storm clouds, lower contrast and dark enough for HTML overlay. Premium realistic concept art, depth, atmospheric fog, intricate materials, restrained green glow. No words, no lettering, no flags, no logos, no watermark, no frames or interface controls. This is a background illustration only; the actual app supplies accessible HTML content.” Generación 1536 × 1024; JPEG optimizado de aproximadamente 409 KiB. No se presenta como recurso CC ni se concede una licencia sobre el personaje; continúan aplicando los derechos de sus titulares. El PNG maestro está en `docs/design-assets/doom-cinematic-source.png`, fuera de los recursos públicos.
- `public/assets/arc-reactor.svg` y `public/assets/iron-avatar.svg`: gráficos originales creados mediante código SVG para este proyecto. Sin licencia de terceros incorporada. Las referencias a Iron Man pertenecen a sus titulares.
- La bandera auténtica y su atribución CC BY-SA 3.0 permanecen intactas. El antiguo `doom-portrait.svg` se conserva como recurso previo, pero ya no se muestra.
- Se sustituyó la capa anterior de ajuste de altura de `styles.css`; el diseño del chat ahora se concentra en `cinematic.css`. Dos columnas desde 1100 px; tabletas con contenido apilado.
- Validación: build exitoso y 17 tests aprobados (11 anteriores + 6 casos sobre autoría y persistencia). Sin solicitudes reales a Gemini.
- El boceto final Stark/Doom fue recibido y utilizado. Se inspeccionó la ilustración generada, pero no se dispone de navegador automatizable. Pendiente: renderizado a 375/393/768/1024/1366/1440/1920 px, navegación Atrás/Adelante, zoom, teclado virtual, loading/error y controles. La revisión de código y los tests no sustituyen esa comprobación visual.

### Pulido final de presentación — 27/10/2026

Se conserva la composición y todos los recursos gráficos. Home reutiliza `arc-reactor.svg`, con iluminación y patrones HUD discretos; About conserva su contenido con tarjetas responsive. La telemetría mejora contraste y jerarquía, identifica su naturaleza ficticia y el mapa decorativo se simplifica en ventanas bajas. Los textos informativos de la capa cinematográfica tienen un mínimo de 12 px. El formulario y la recuperación siguen fuera del historial desplazable.

Los avisos visibles incorporan `noticeType` (`intrusion` o `recovery`) y el renderer lo conserva como `data-notice-type`. Intrusión usa rojo; recuperación usa azul/cian. Estos metadatos son exclusivamente de presentación y no se envían a Gemini. Los mensajes siguen identificándose por `data-speaker`; no dependen del tema activo. Se retiraron colores antiguos genéricos de avisos y el estilo obsoleto del reactor textual. El enlace activo de navegación incluye `aria-current="page"`.

Verificación: 20 tests aprobados (17 anteriores y 3 nuevos casos de tipos de aviso), build exitoso, sintaxis comprobada, IDs y rutas de recursos verificados estáticamente. Sin llamadas reales a Gemini ni cambios de backend o credenciales. No se incorporaron nuevos recursos ni licencias.

Pendiente en navegador (no disponible en esta sesión): capturas y desbordamientos a 375 × 667, 393 × 852, 768 × 1024, 1024 × 768, 1366 × 768, 1440 × 900 y 1920 × 1080; encuadre del rostro; lectura con zoom; navegación SPA y Atrás/Adelante; estados de carga/error; scroll y acceso al formulario y recuperación con teclado virtual. Los tests de estados y la revisión estática no sustituyen esta validación visual.
