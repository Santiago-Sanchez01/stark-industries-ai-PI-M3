
import {
  describe,
  test,
  expect,
  vi,
  afterEach,
} from "vitest";

import { requestGeminiReply } from "../src/api.js";

// Restauramos fetch después de cada prueba
afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Comunicación con la API", () => {

  // TEST 1: Respuesta exitosa
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages,
          character: "tony",
        }),
      })
    );
  });

  // TEST 2: Error del backend
  test("lanza un error cuando el backend falla", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      json: async () => ({
        error: "Se alcanzó el límite de solicitudes.",
      }),
    });

    vi.stubGlobal("fetch", mockFetch);

    const messages = [
      {
        role: "user",
        text: "Hola Tony",
      },
    ];

    await expect(
      requestGeminiReply(messages)
    ).rejects.toThrow(
      "Se alcanzó el límite de solicitudes."
    );

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});

describe("Selección de personaje", () => {

  // TEST 3: Doctor Doom
  test("envía doom al backend", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        reply: "Doom ha llegado.",
      }),
    });

    vi.stubGlobal("fetch", mockFetch);

    const messages = [
      {
        role: "user",
        text: "Hola Doom",
      },
    ];

    const reply = await requestGeminiReply(
      messages,
      "doom"
    );

    expect(reply).toBe("Doom ha llegado.");

    const requestOptions = mockFetch.mock.calls[0][1];
    const requestBody = JSON.parse(requestOptions.body);

    expect(requestBody.character).toBe("doom");
    expect(requestBody.messages).toEqual(messages);
  });

  // TEST 4: Tony Stark por defecto
  test("utiliza tony por defecto", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        reply: "Hola, genio.",
      }),
    });

    vi.stubGlobal("fetch", mockFetch);

    const messages = [
      {
        role: "user",
        text: "Hola",
      },
    ];

    const reply = await requestGeminiReply(messages);

    expect(reply).toBe("Hola, genio.");

    const requestOptions = mockFetch.mock.calls[0][1];
    const requestBody = JSON.parse(requestOptions.body);

    expect(requestBody.character).toBe("tony");
    expect(requestBody.messages).toEqual(messages);
  });
});
