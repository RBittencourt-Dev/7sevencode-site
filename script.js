/* ============================================================
   7 SEVENCODE — SCRIPTS
   1. Revelar seções ao rolar (fade-in)
   2. Menu do celular (abrir/fechar)
   3. Destaque do link ativo no menu
   ============================================================ */

/* ===== 1. REVELAR SEÇÕES AO ROLAR ===== */
const vigiaScroll = new IntersectionObserver(
  (entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add("visivel");
        vigiaScroll.unobserve(entrada.target); // anima só uma vez
      }
    });
  },
  { threshold: 0.2 }
);

document
  .querySelectorAll(".surgir-ao-scroll")
  .forEach((el) => vigiaScroll.observe(el));

/* ===== 2. MENU DO CELULAR ===== */
const btnHamburguer = document.querySelector(".btn-hamburguer");
const menuCelular = document.querySelector(".menu-celular");

// Pequena função pra abrir/fechar e manter o aria-expanded certo (acessibilidade)
const fecharMenu = () => {
  menuCelular.classList.remove("active");
  btnHamburguer.setAttribute("aria-expanded", "false");
};

btnHamburguer.addEventListener("click", (e) => {
  e.stopPropagation();
  const aberto = menuCelular.classList.toggle("active");
  btnHamburguer.setAttribute("aria-expanded", String(aberto));
});

// Fecha ao clicar num link
menuCelular.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", fecharMenu);
});

// Fecha ao clicar fora do menu
document.addEventListener("click", (e) => {
  if (
    menuCelular.classList.contains("active") &&
    !menuCelular.contains(e.target) &&
    !btnHamburguer.contains(e.target)
  ) {
    fecharMenu();
  }
});

/* ===== 3. DESTAQUE DO LINK ATIVO ===== */
const secoes = document.querySelectorAll("main section[id]");
const itensMenu = document.querySelectorAll(".menu-desktop li");

const vigiaSecao = new IntersectionObserver(
  (entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        const id = entrada.target.getAttribute("id");
        itensMenu.forEach((li) => {
          const link = li.querySelector("a");
          li.classList.toggle("active", link.getAttribute("href") === "#" + id);
        });
      }
    });
  },
  { threshold: 0.5 }
);

secoes.forEach((sec) => vigiaSecao.observe(sec));

/* ===== 4. MODAIS DOS PROJETOS =====
   (Espaço reservado pra você fazer os modais em JS quando for treinar.
    O CSS dos modais continua no style.css pronto pra usar.) */
