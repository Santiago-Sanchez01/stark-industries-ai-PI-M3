
import { normalizeMessage } from "./utils.js";

/**
 * Solicita una respuesta de Tony Stark
 * mediante nuestra Vercel Serverless Function.
 */
export async function requestGeminiReply(messages) {
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

  const reply = normalizeMessage(data.reply);

  if (!reply) {
    throw new Error("La respuesta recibida está vacía.");
  }

  return reply;
}
