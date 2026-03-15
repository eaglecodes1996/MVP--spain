/**
 * AI engine: uses OpenAI by default (OPENAI_API_KEY required).
 * Set AI_PROVIDER=anthropic and ANTHROPIC_API_KEY to use Claude instead.
 */
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

const provider = (process.env.AI_PROVIDER || 'openai').toLowerCase();

function getOpenAI() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY not set');
  return new OpenAI({ apiKey: key });
}

function getAnthropic() {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error('ANTHROPIC_API_KEY not set');
  return new Anthropic({ apiKey: key });
}

/**
 * @param {Array<{ role: 'user'|'assistant'|'system', content: string|Array }>} messages - content can be string or vision array
 * @param {string} [systemPrompt]
 * @param {number} [maxTokens]
 * @returns {Promise<string>}
 */
export async function chat(messages, systemPrompt = '', maxTokens = 500) {
  const sys = systemPrompt ? [{ role: 'system', content: systemPrompt }] : [];
  const all = [...sys, ...messages];

  if (provider === 'anthropic') {
    const anthropic = getAnthropic();
    const model = process.env.ANTHROPIC_MODEL || 'claude-3-haiku-20240307';
    const system = all.find((m) => m.role === 'system')?.content || '';
    const msgs = all.filter((m) => m.role !== 'system').map((m) => ({
      role: m.role,
      content: Array.isArray(m.content) ? m.content.find((p) => p.type === 'text')?.text || '' : m.content,
    }));
    const res = await anthropic.messages.create({
      model,
      max_tokens: maxTokens,
      system,
      messages: msgs,
    });
    const text = res.content?.find((c) => c.type === 'text');
    return text?.text || '';
  }

  const openai = getOpenAI();
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  const res = await openai.chat.completions.create({
    model,
    max_tokens: maxTokens,
    messages: all.map((m) => ({ role: m.role, content: m.content })),
  });
  return res.choices?.[0]?.message?.content?.trim() || '';
}

export function getProviderName() {
  return provider;
}
