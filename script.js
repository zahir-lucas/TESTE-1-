// ===== CONFIGURAÇÃO =====
// Número no formato internacional: 55 (Brasil) + 75 (DDD) + 99147-0611
const WHATSAPP = "5575991470611";

// 1) Monta os links de WhatsApp.
// Todo elemento com data-wa="mensagem" vira um link com a mensagem já preenchida.
document.querySelectorAll("[data-wa]").forEach((el) => {
  const msg = encodeURIComponent(el.dataset.wa);
  el.href = `https://wa.me/${WHATSAPP}?text=${msg}`;
  el.target = "_blank";
  el.rel = "noopener";
});

// 2) Respeita quem pediu "reduzir movimento" no aparelho: os vídeos ficam parados no cartaz.
const reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (reduzMovimento) {
  document.querySelectorAll("video").forEach((v) => { v.removeAttribute("autoplay"); v.pause(); });
}

// 3) Carrega os vídeos só quando chegam perto da tela (deixa a página leve).
const videos = document.querySelectorAll("video source[data-src]");
const carregar = (source) => {
  if (reduzMovimento) return; // sem movimento: não baixa o vídeo
  const video = source.parentElement;
  source.src = source.dataset.src;
  video.load();
  video.play().catch(() => {}); // alguns navegadores bloqueiam autoplay: sem problema
};

if ("IntersectionObserver" in window) {
  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          carregar(entrada.target.querySelector("source[data-src]"));
          observador.unobserve(entrada.target);
        }
      });
    },
    { rootMargin: "200px" }
  );
  videos.forEach((source) => observador.observe(source.parentElement));
} else {
  videos.forEach(carregar); // navegador antigo: carrega tudo
}

// 4) Ano atual no rodapé.
document.getElementById("ano").textContent = new Date().getFullYear();
