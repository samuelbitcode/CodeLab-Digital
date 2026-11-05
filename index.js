

// Número do WhatsApp atualizado
const WHATSAPP_NUMBER = "5562994481404";

// Tela de Carregamento (Loader)
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (loader) {
    setTimeout(() => {
      loader.classList.add("fade-out");
    }, 400); // Meio segundo de delay suave
  }
});

// Banner de Cookies
const cookieBanner = document.getElementById("cookieBanner");
const acceptCookiesBtn = document.getElementById("acceptCookies");

if (localStorage.getItem("codelab_cookies_accepted")) {
  if (cookieBanner) cookieBanner.style.display = "none";
}

if (acceptCookiesBtn && cookieBanner) {
  acceptCookiesBtn.addEventListener("click", () => {
    localStorage.setItem("codelab_cookies_accepted", "true");
    cookieBanner.classList.add("hidden");
  });
}

// Links do WhatsApp com mensagem personalizada por botão
document.querySelectorAll(".js-whatsapp").forEach((el) => {
  const msg = el.dataset.msg || "Olá! Gostaria de mais informações.";
  el.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  el.target = "_blank";
  el.rel = "noopener";
});

// Header com borda ao rolar
const header = document.getElementById("header");
window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 10);
});

// Menu mobile
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => nav.classList.toggle("open"));
  nav.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => nav.classList.remove("open"))
  );
}

// Animação de entrada ao rolar
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// Ano automático no rodapé
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Máscara automática de WhatsApp no input (XX) XXXXX-XXXX
const inputTelefone = document.getElementById("leadTelefone");
if (inputTelefone) {
  inputTelefone.addEventListener("input", (e) => {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length > 11) v = v.slice(0, 11);
    
    if (v.length > 6) {
      v = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
    } else if (v.length > 2) {
      v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
    } else if (v.length > 0) {
      v = `(${v}`;
    }
    e.target.value = v;
  });
}

// Manipulação do Formulário de Leads (Envia direto para o Firestore)
const leadForm = document.getElementById("leadForm");
const formMsg = document.getElementById("formMsg");
const btnEnviar = document.getElementById("btnEnviar");

if (leadForm) {
  leadForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    btnEnviar.disabled = true;
    btnEnviar.innerText = "Enviando...";

    const nome = document.getElementById("leadNome").value.trim();
    const telefone = document.getElementById("leadTelefone").value.trim();
    const plano = document.getElementById("leadPlano").value;

    try {
      await db.collection("leads_codelab").add({
        nome: nome,
        telefone: telefone,
        plano: plano,
        criadoEm: firebase.firestore.FieldValue.serverTimestamp()
      });

      formMsg.className = "form-msg sucesso";
      formMsg.innerText = "✨ Orçamento solicitado com sucesso! Entraremos em contato em breve.";
      leadForm.reset();
    } catch (error) {
      console.error("Erro ao salvar lead:", error);
      formMsg.className = "form-msg erro";
      formMsg.innerText = "❌ Ocorreu um erro ao enviar. Tente novamente ou nos chame no WhatsApp.";
    } finally {
      btnEnviar.disabled = false;
      btnEnviar.innerText = "Garantir Meu Orçamento 🚀";
    }
  });
}