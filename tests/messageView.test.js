import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { createMessageElement } from '../src/messageView.js';
import { activateDoomProtocol, restoreJarvisControl, initDoomProtocol, getProtocolState } from '../src/doomProtocol.js';

// Minimal DOM adapter: exercises the production renderer without a new dependency.
function element() {
  const node = { className: '', dataset: {}, children: [], textContent: '', attributes: {}, hidden: false,
    append(...children) { this.children.push(...children); },
    setAttribute(name, value) { this.attributes[name] = value; },
    addEventListener: vi.fn(),
  };
  node.classList = { add(...names) { node.className += ` ${names.join(' ')}`; } };
  return node;
}
let nodes;
beforeEach(() => {
  vi.useFakeTimers();
  nodes = new Map();
  vi.stubGlobal('document', {
    body: { dataset: {} }, createElement: element,
    querySelector(selector) { if (!nodes.has(selector)) nodes.set(selector, element()); return nodes.get(selector); },
    dispatchEvent: vi.fn(),
  });
  vi.stubGlobal('CustomEvent', class { constructor(type, options) { this.type = type; this.detail = options.detail; } });
});
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });

describe('Identidad visual persistente por autor', () => {
  test.each(['intrusion', 'recovery'])('fija el tipo %s del aviso sin consultar el protocolo', (noticeType) => {
    const message = { role: 'notice', noticeType, text: 'Aviso del sistema' };
    for (const state of ['normal', 'alert', 'doom', 'recovery']) {
      document.body.dataset.protocol = state;
      const node = createMessageElement(message);
      expect(node.dataset).toEqual({ speaker: 'system', noticeType });
      expect(node.className).toBe('protocol-notice');
      expect(node.textContent).toBe(message.text);
    }
  });

  test('los avisos sin tipo usan la identidad cian del sistema', () => {
    expect(createMessageElement({ role: 'notice', text: 'J.A.R.V.I.S.' }).dataset.noticeType).toBe('recovery');
  });
  test.each([
    [{ role: 'model', character: 'tony', text: 'Stark' }, 'tony'],
    [{ role: 'model', character: 'doom', text: 'Doom' }, 'doom'],
    [{ role: 'user', text: 'Hola' }, 'user'],
    [{ role: 'notice', text: 'J.A.R.V.I.S.' }, 'system'],
  ])('identifica al autor de %j', (message, speaker) => {
    const node = createMessageElement(message);
    expect(node.dataset.speaker).toBe(speaker);
    if (speaker === 'tony' || speaker === 'doom') {
      expect(node.children[0].className).toBe('message-avatar');
      expect(node.children[0].alt).toBe('');
      expect(node.children.at(-1).textContent).toBe(message.text);
    } else expect(node.children.some(child => child.className === 'message-avatar')).toBe(false);
  });

  test('conserva atributos y clases al pasar NORMAL → ALERT → DOOM → RECOVERY → NORMAL y al renderizar otra vez', () => {
    const messages = [
      { role: 'model', character: 'tony', text: 'Tony sigue siendo Tony' },
      { role: 'model', character: 'doom', text: 'Doom sigue siendo Doom' },
      { role: 'user', text: 'Usuario' },
      { role: 'notice', text: 'Sistema' },
      { role: 'notice', noticeType: 'intrusion', text: 'Intrusión' },
      { role: 'notice', noticeType: 'recovery', text: 'Recuperación' },
    ];
    const rendered = messages.map(createMessageElement);
    const identity = node => [node.dataset.speaker, node.dataset.noticeType, node.className];
    const initial = rendered.map(identity);
    const check = () => {
      expect(rendered.map(identity)).toEqual(initial);
      expect(messages.map(createMessageElement).map(identity)).toEqual(initial);
    };
    initDoomProtocol(); check();
    activateDoomProtocol(); expect(getProtocolState()).toBe('alert'); check();
    vi.advanceTimersByTime(1800); expect(getProtocolState()).toBe('doom'); check();
    restoreJarvisControl(); expect(getProtocolState()).toBe('recovery'); check();
    vi.advanceTimersByTime(1800); expect(getProtocolState()).toBe('normal'); check();
  });

  test('el tema global no contiene reglas que repinten autores o burbujas', () => {
    const styles = ['styles.css', 'cinematic.css'].map(file => readFileSync(new URL(`../src/${file}`, import.meta.url), 'utf8')).join('\n');
    const selectors = [...styles.matchAll(/([^{}]+)\{/g)].map(match => match[1]);
    expect(selectors.filter(selector => selector.includes('data-protocol') && /\.(?:ai-message|doom-message|user-message|message-author)\b|\[data-speaker/.test(selector))).toEqual([]);
  });
});
