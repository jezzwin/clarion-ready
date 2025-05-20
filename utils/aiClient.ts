import fetch from 'node-fetch';

const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models/google/flan-t5-base';
const HUGGINGFACE_API_KEY = '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';

async function callHuggingFace(prompt: string): Promise<string> {
  const response = await fetch(HUGGINGFACE_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ inputs: prompt }),
  });

  if (!response.ok) {
    throw new Error(`Hugging Face API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data[0]?.generated_text || 'No response generated.';
}

export async function clarifyTask(story: string): Promise<string> {
  const prompt = `Explain clearly for a junior developer: ${story}`;
  return await callHuggingFace(prompt);
}

export async function suggestResources(topic: string): Promise<string> {
  const prompt = `List beginner resources (videos, tutorials) for: ${topic}`;
  return await callHuggingFace(prompt);
}

export async function extractReusableCode(codeSnippet: string): Promise<string> {
  const prompt = `Find reusable parts and explain: ${codeSnippet}`;
  return await callHuggingFace(prompt);
}
