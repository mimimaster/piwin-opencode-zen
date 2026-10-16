/** OpenCode Zen provider. Derived from ZhiAo1120/pi-opencode-zen (MIT). */
import { streamZen } from './zen-stream.js';
import { ZEN_API, ZEN_BASE_URL } from './zen-request.js';
/** @param {Pick<import('@earendil-works/pi-coding-agent').ExtensionAPI, 'registerProvider'>} pi */
export default function registerZen(pi) {
  pi.registerProvider('opencode-zen', {
    baseUrl: ZEN_BASE_URL, apiKey: 'public', api: ZEN_API, streamSimple: streamZen,
    models: [
      { id: 'cat-jam-free', name: 'Cat Jam (free)', reasoning: true, input: ['text'], contextWindow: 262144, maxTokens: 131072, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } },
      { id: 'longcat-2.5-preview-free', name: 'LongCat 2.5 Preview (free)', reasoning: true, input: ['text'], contextWindow: 1000000, maxTokens: 131072, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } },
      { id: 'nemotron-3.5-lightning-free', name: 'Nemotron 3.5 Lightning (free)', reasoning: true, input: ['text'], contextWindow: 262144, maxTokens: 262144, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } },
    ],
  });
}
