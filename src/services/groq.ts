// =============================================================================
// Groq provider — mismo patrón que src/services/aiProviders/groqProvider.ts en
// NADA-AMORES-Y-TRAICIONES: tier gratuito, sin tarjeta de crédito.
// La key se lee de import.meta.env, que Vite inyecta en el bundle del cliente.
// Bien para uso local/desktop, no para un deploy público (ver README).
// =============================================================================

const IS_DEV_BROWSER =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const GROQ_API_URL = IS_DEV_BROWSER
  ? '/api/groq/openai/v1/chat/completions'
  : 'https://api.groq.com/openai/v1/chat/completions';

function getApiKey(): string {
  return import.meta.env.VITE_GROQ_API_KEY || '';
}

function getModel(): string {
  return import.meta.env.VITE_GROQ_MODEL || 'llama-3.3-70b-versatile';
}

export function isAiAvailable(): boolean {
  return Boolean(getApiKey());
}

/**
 * Genera un mensaje corto y directo, estilo entrenador de película (Rocky /
 * The Pursuit of Happyness), para sacarte del scroll y ponerte a trabajar.
 * Devuelve null si no hay API key configurada o si falla la llamada, para
 * que el que llama pueda usar una frase de película como respaldo.
 */
export async function generatePepTalk(
  awayMinutes: number,
  taskHint: string,
): Promise<string | null> {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  const prompt = `Actúa como un entrenador motivacional estilo Rocky Balboa o Chris Gardner (The Pursuit of Happyness). La persona acaba de pasar ${awayMinutes} minutos haciendo scroll en redes sociales (TikTok, Instagram, etc.) en vez de trabajar. ${
    taskHint ? `Dice que ahora quiere enfocarse en: "${taskHint}".` : ''
  } Escríbele en español, en 2 o 3 frases cortas, un mensaje directo y motivador (sin regañarla de forma agresiva) que la empuje a dejar el celular y arrancar esa tarea ya. No uses comillas ni markdown, solo el texto del mensaje.`;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: getModel(),
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      console.warn(`[NADA][Groq] API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const content: string = data.choices?.[0]?.message?.content?.trim() ?? '';
    return content || null;
  } catch (e) {
    console.warn('[NADA][Groq] Pep talk error:', e);
    return null;
  }
}
