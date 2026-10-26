
/**
 * Limpia los espacios al principio y al final
 * de un mensaje.
 */
export function normalizeMessage(text) {
  if (typeof text !== "string") {
    return "";
  }

  return text.trim();
}

/**
 * Convierte el historial al formato
 * que espera Google Gemini.
 */
export function toGeminiContents(messages) {
  if (!Array.isArray(messages)) {
    throw new Error("El historial debe ser un array.");
  }

  return messages.map((message) => {
    if (
      !message ||
      !["user", "model"].includes(message.role) ||
      typeof message.text !== "string" ||
      !message.text.trim()
    ) {
      throw new Error("Mensaje inválido.");
    }

    return {
      role: message.role,
      parts: [
        {
          text: message.text,
        },
      ],
    };
  });
}

/**
 * Extrae el texto generado por Gemini
 * desde la respuesta de la API.
 */
export function extractGeminiText(data) {
  const parts = data?.candidates?.[0]?.content?.parts;

  if (!Array.isArray(parts)) {
    return "";
  }

  return parts
    .filter((part) => typeof part?.text === "string")
    .map((part) => part.text)
    .join("\n")
    .trim();
}


export function detectDoomReference(text) {
  if (typeof text !== "string") return false;

  const normalized = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const references =
    /\b(doom|latveria|latveriano|latveriana|latverianos|latverianas|victor von doom|doctor muerte|dr\.?\s+muerte)\b/;

  return references.test(normalized);
}
