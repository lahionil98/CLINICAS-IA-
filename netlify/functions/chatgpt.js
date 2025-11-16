
const OPENAI_ENDPOINT = "https://api.openai.com/v1/chat/completions";
const OPENAI_MODEL = "gpt-4.1-mini";

export default async (request) => {
  try {
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Método no permitido" }), {
        status: 405,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Falta OPENAI_API_KEY" }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    const body = await request.json();
    const userMessage = body?.message || "";

    const openaiRes = await fetch(OPENAI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          {
            role: "system",
            content: "Eres un asistente especializado en clínicas estéticas, dentales y médicas. Respondes de forma clara, profesional y orientada a resultados."
          },
          {
            role: "user",
            content: userMessage
          }
        ]
      })
    });

    const data = await openaiRes.json();
    const reply = data?.choices?.[0]?.message?.content || "No pude generar una respuesta en este momento.";

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Error interno en la Function" }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
};
