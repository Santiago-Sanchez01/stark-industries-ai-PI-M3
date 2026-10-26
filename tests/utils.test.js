
import { describe, test, expect } from "vitest";

import {
  normalizeMessage,
  toGeminiContents,
  extractGeminiText,
} from "../src/utils.js";

describe("Funciones utilitarias", () => {

  // TEST 1
  test("elimina espacios sobrantes", () => {
    const result = normalizeMessage("  Hola Tony!  ");

    expect(result).toBe("Hola Tony!");
  });

  // TEST 2
  test("convierte un valor no textual en texto vacío", () => {
    const result = normalizeMessage(null);

    expect(result).toBe("");
  });

  // TEST 3
  test("transforma mensajes al formato de Gemini", () => {
    const messages = [
      {
        role: "user",
        text: "Hola Tony",
      },
      {
        role: "model",
        text: "Hola, genio.",
      },
    ];

    const result = toGeminiContents(messages);

    expect(result).toEqual([
      {
        role: "user",
        parts: [{ text: "Hola Tony" }],
      },
      {
        role: "model",
        parts: [{ text: "Hola, genio." }],
      },
    ]);
  });

  // TEST 4
  test("rechaza un historial con roles inválidos", () => {
    const messages = [
      {
        role: "admin",
        text: "Hola",
      },
    ];

    expect(() => toGeminiContents(messages))
      .toThrow("Mensaje inválido.");
  });

  // TEST 5
  test("extrae texto de una respuesta de Gemini", () => {
    const response = {
      candidates: [
        {
          content: {
            parts: [
              { text: "Hola, " },
              { text: "soy Tony Stark." },
            ],
          },
        },
      ],
    };

    const result = extractGeminiText(response);

    expect(result).toBe("Hola, \nsoy Tony Stark.");
  });

  // TEST 6
  test("devuelve texto vacío si Gemini no responde", () => {
    const result = extractGeminiText({ candidates: [] });

    expect(result).toBe("");
  });

});
