import { postApi } from './config.js';

/**
 * AI chat. Backend uses configurable provider (openai/anthropic) via env.
 */
export async function sendChat(messages, subject, systemPrompt, imageBase64) {
  const data = await postApi('/ai/chat', {
    messages,
    subject: subject || undefined,
    systemPrompt: systemPrompt || undefined,
    imageBase64: imageBase64 || undefined,
  });
  return data.reply;
}
