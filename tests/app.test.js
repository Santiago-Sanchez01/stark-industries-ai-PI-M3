
import {
  describe,
  test,
  expect,
  vi,
  afterEach,
} from "vitest";

import { requestGeminiReply } from "../src/api.js";

// Restauramos los mocks después de cada prueba
afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Comunicación con la API", () => {

  // TEST 7
  test("devuelve una respuesta correcta del backend", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        reply: "Soy Tony Stark, genio.",
      }),
    });

    vi.stubGlobal("fetch", mockFetch);

    const messages = [
      {
        role: "user",
        text: "Hola Tony",
      },
    ];

    const reply = await requestGeminiReply(messages);

    expect(reply).toBe("Soy Tony Stark, genio.");

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/functions",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ messages }),
      })
    );
  });

  // TEST 8
  test("lanza un error cuando el backend falla", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      json: async () => ({
        error: "Se alcanzó el límite de solicitudes.",
      }),
    });

    vi.stubGlobal("fetch", mockFetch);

    await expect(
      requestGeminiReply([
        {
          role: "user",
          text: "Hola Tony",
        },
      ])
    ).rejects.toThrow(
      "Se alcanzó el límite de solicitudes."
    );
  });

});
