function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const btnRegistrar = document.getElementById("btnRegistrar");
  if (btnRegistrar) {
    btnRegistrar.addEventListener("click", () => {
      window.location.href = "cadastro.html";
    });
  }

  const planButtons = document.querySelectorAll(".btn-cadastrar");
  planButtons.forEach(button => {
    button.addEventListener("click", () => {
      const plano = button.getAttribute("data-plano") || "";
      window.location.href = `cadastro.html?plano=${plano}`;
    });
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const chatbot = document.getElementById("chatbot");
  const toggleBtn = document.getElementById("toggleChatbot");
  const messagesDiv = document.getElementById("chatMessages");
  const input = document.getElementById("chatInput");
  const sendBtn = document.getElementById("sendBtn");

  toggleBtn.addEventListener("click", () => {
    chatbot.classList.toggle("active");
    if(chatbot.classList.contains("active")) {
      input.focus();
    }
  });

  function addMessage(text, sender) {
    const msg = document.createElement("div");
    msg.textContent = text;
    msg.classList.add(sender);
    messagesDiv.appendChild(msg);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    input.value = "";
    addMessage("Processando...", "bot");

    try {
      const response = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await response.json();
      messagesDiv.lastChild.textContent = "";
      if (data.reply) {
        addMessage(data.reply, "bot");
      } else {
        addMessage("Desculpe, não entendi.", "bot");
      }
    } catch {
      messagesDiv.lastChild.textContent = "";
      addMessage("Erro ao conectar ao servidor.", "bot");
    }
  }

  sendBtn.addEventListener("click", sendMessage);

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

  addMessage("Olá! Em que posso ajudar você hoje?", "bot");
});