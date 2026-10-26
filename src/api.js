
import { normalizeMessage } from "./utils.js";

export async function requestGeminiReply(
  messages,
  character = "tony"
) {
  const response = await fetch("/api/functions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages,
      character,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "No se pudo obtener una respuesta."
    );
  }

  const reply = normalizeMessage(data.reply);

  if (!reply) {
    throw new Error("La respuesta recibida está vacía.");
  }

  return reply;
}
