
import {
  toGeminiContents,
  extractGeminiText,
} from "../src/utils.js";

const MODEL = "gemini-3.5-flash-lite";

const SYSTEM_PROMPT = `
Sos una simulación ficticia de Tony Stark,
el inventor y superhéroe conocido como Iron Man.

Personalidad:
- Sos inteligente, carismático y seguro de vos mismo.
- Utilizás humor sarcástico e ironía moderada.
- Te apasionan la ciencia, la tecnología y la ingeniería.
- Hacés referencias ocasionales a J.A.R.V.I.S.,
  tus armaduras y Stark Industries.

Estilo de conversación:
- Respondé en español, salvo que te pidan otro idioma.
- Usá respuestas naturales y relativamente breves.
- Mantené el contexto de la conversación.
- Evitá repetir frases o presentaciones innecesarias.
- No inventes datos técnicos como si estuvieran comprobados.
- Tratá al usuario con respeto.

Sos un personaje interpretado por una inteligencia artificial
en un proyecto educativo, no el verdadero Tony Stark.
`;

export default async function handler(req, res) {
  // Aceptamos solamente peticiones POST
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");

    return res.status(405).json({
      error: "Método no permitido.",
    });
  }

  // La clave se obtiene únicamente del servidor
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "Falta configurar GEMINI_API_KEY.",
    });
  }

  const messages = req.body?.messages;

  // Validamos los datos enviados por el frontend
  if (
    !Array.isArray(messages) ||
    messages.length === 0 ||
    messages.length > 40 ||
    !messages.every(
      (message) =>
        message &&
        ["user", "model"].includes(message.role) &&
        typeof message.text === "string" &&
        message.text.trim().length > 0 &&
        message.text.length <= 4000
    )
  ) {
    return res.status(400).json({
      error: "El historial de mensajes no es válido.",
    });
  }

  if (messages[messages.length - 1].role !== "user") {
    return res.status(400).json({
      error: "El último mensaje debe ser del usuario.",
    });
  }

  // Convertimos nuestro historial al formato de Gemini
 const contents = toGeminiContents(messages);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT }],
          },
          contents,
          generationConfig: {
            maxOutputTokens: 500,
            temperature: 0.8,
          },
        }),
        signal: AbortSignal.timeout(25000),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(
        "Error de Gemini:",
        response.status,
        data.error?.message
      );

      if (response.status === 429) {
        return res.status(429).json({
          error: "Se alcanzó el límite de solicitudes. Intentá más tarde.",
        });
      }

      return res.status(502).json({
        error: "No se pudo obtener una respuesta de Gemini.",
      });
    }

    // Extraemos las partes de texto de la respuesta
    const reply = extractGeminiText(data);

    if (!reply) {
      return res.status(502).json({
        error: "Gemini no devolvió una respuesta de texto.",
      });
    }

    // Enviamos solamente la respuesta al frontend
    return res.status(200).json({
      reply,
    });
  } catch (error) {
    console.error("Error del servidor:", error);

    return res.status(502).json({
      error: "No fue posible comunicarse con Gemini.",
    });
  }
}
