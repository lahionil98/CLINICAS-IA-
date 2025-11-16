
document.addEventListener("DOMContentLoaded", () => {
  // Chat IA
  const form = document.getElementById("chat-form");
  const input = document.getElementById("chat-input");
  const messages = document.getElementById("chat-messages");

  if (form && input && messages) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      addMessage("user", text);
      input.value = "";
      addMessage("bot", "Pensando con IA…");

      try {
        const res = await fetch("/.netlify/functions/chatgpt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text })
        });
        const data = await res.json();
        replaceLastBot(data.reply || "La IA no pudo responder en este momento.");
      } catch (err) {
        console.error(err);
        replaceLastBot("Hubo un error al conectar con la IA.");
      }
    });

    function addMessage(role, text) {
      const div = document.createElement("div");
      div.className = "message " + role;
      div.textContent = text;
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
    }

    function replaceLastBot(text) {
      const bots = [...messages.querySelectorAll(".message.bot")];
      const last = bots[bots.length - 1];
      if (last) last.textContent = text;
    }
  }

  // Dashboard bars
  const bars = document.querySelectorAll(".chart-bars .bar");
  bars.forEach(bar => {
    const val = Number(bar.getAttribute("data-value") || "0");
    requestAnimationFrame(() => {
      bar.style.maxWidth = val + "%";
    });
  });
});
