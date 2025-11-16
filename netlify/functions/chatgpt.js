const OpenAI = require("openai");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Método no permitido" })
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Sos una IA especializada en automatización para clínicas." },
        { role: "user", content: body.message }
      ]
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        reply: completion.choices[0].message.content
      })
    };

  } catch (error) {
    console.error("ERROR EN FUNCIÓN:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message || "Error interno del servidor"
      })
    };
  }
};
