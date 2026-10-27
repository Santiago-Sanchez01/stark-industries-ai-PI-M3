import { afterEach, expect, test, vi } from 'vitest';
import { activateDoomProtocol, restoreJarvisControl, getProtocolState, initDoomProtocol } from '../src/doomProtocol.js';

afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });

test('sincroniza los cuatro estados, la bandera y la recuperación sin peticiones HTTP', () => {
  vi.useFakeTimers();
  const elements = new Map();
  const select = (selector) => {
    if (!elements.has(selector)) elements.set(selector, { hidden: false, addEventListener: vi.fn() });
    return elements.get(selector);
  };
  const dispatchEvent = vi.fn();
  vi.stubGlobal('document', { body: { dataset: {} }, querySelector: select, dispatchEvent });
  vi.stubGlobal('CustomEvent', class { constructor(type, options) { this.type = type; this.detail = options.detail; } });
  initDoomProtocol();
  expect(select('#latveria-panel').hidden).toBe(true);
  expect(select('#recover-button').hidden).toBe(true);
  expect(activateDoomProtocol()).toBe(true);
  expect(getProtocolState()).toBe('alert');
  expect(select('#message-input').disabled).toBe(true);
  expect(activateDoomProtocol()).toBe(false);
  vi.advanceTimersByTime(1800);
  expect(getProtocolState()).toBe('doom');
  expect(select('#latveria-panel').hidden).toBe(false);
  expect(select('#recover-button').hidden).toBe(false);
  expect(restoreJarvisControl()).toBe(true);
  expect(getProtocolState()).toBe('recovery');
  expect(select('#message-input').disabled).toBe(true);
  vi.advanceTimersByTime(1800);
  expect(getProtocolState()).toBe('normal');
  expect(select('#message-input').disabled).toBe(false);
  expect(select('#recover-button').hidden).toBe(true);
  expect(select('#protocol-banner').hidden).toBe(true);
  expect(dispatchEvent.mock.calls.map(([event]) => event.detail.state)).toEqual(['normal', 'alert', 'doom', 'recovery', 'normal']);
});
