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

/* ============================================================
   EQUIPE VINDA DO PAINEL

   Os cards da seção Equipe são escritos no painel interno, não aqui. Este
   trecho busca a lista e substitui o HTML de reserva que está no index.html.

   POR QUE É SEGURO TER ESTA CHAVE AQUI
   A chave abaixo é a `publishable` do Supabase (a antiga `anon`), e ela é PÚBLICA por definição — é a
   mesma que qualquer aplicativo web entrega ao navegador. Quem protege os
   dados é a RLS do banco, não o segredo da chave.

   E o que ela alcança aqui é uma VIEW, `sv_equipe_publica`, que só tem nome,
   função, cargo e foto. Desde 14/09/2026 o banco é o da 7SevenCode, não mais
   o do Porthon, e a proteção é por COLUNA: esta chave só tem permissão de ler
   as colunas do card. E-mail e permissões dão "permission denied".

   Se este trecho falhar por qualquer motivo, os cards escritos à mão no
   index.html continuam na tela. O site não depende do banco para funcionar.
   ============================================================ */

(function equipeDoPainel() {
  var lista = document.querySelector("[data-equipe]");
  if (!lista) return;

  var URL_BASE = "https://bepqsgynsuipgpuolzjo.supabase.co";
  var CHAVE = "sb_publishable_Zv1BzllCxVUiS0alqFsnRA_nelpleND";

  var consulta =
    "/rest/v1/sv_equipe_publica?select=nome,funcao,cargo,foto_url&order=ordem";

  function escapar(texto) {
    // O nome e o cargo vêm do banco, digitados por alguém do painel. Montar
    // HTML com eles sem escapar seria confiar em quem digita — e a regra é
    // não confiar em dado, mesmo quando ele vem de casa.
    return String(texto == null ? "" : texto).replace(/[&<>"']/g, function (c) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[c];
    });
  }

  fetch(URL_BASE + consulta, {
    headers: { apikey: CHAVE, Authorization: "Bearer " + CHAVE },
  })
    .then(function (r) {
      return r.ok ? r.json() : null;
    })
    .then(function (pessoas) {
      // Lista vazia também não substitui: seção vazia é pior que
      // desatualizada, e "veio vazio" quase sempre é erro de configuração.
      if (!Array.isArray(pessoas) || pessoas.length === 0) return;

      lista.innerHTML = pessoas
        .map(function (p) {
          var nome = escapar(p.nome);
          var funcao = escapar(p.funcao);
          var cargo = escapar(p.cargo);
          var foto = escapar(p.foto_url);
          var alt = nome + (cargo ? ", " + cargo : "") + " da 7 SevenCode";

          return (
            '<article class="dev">' +
            (foto
              ? '<img class="dev-foto" src="' +
                foto +
                '" alt="' +
                alt +
                '" width="240" height="240" loading="lazy" />'
              : "") +
            "<h4>" +
            nome +
            "</h4>" +
            (funcao ? "<p>" + funcao + "</p>" : "") +
            (cargo ? '<span class="dev-cargo">' + cargo + "</span>" : "") +
            "</article>"
          );
        })
        .join("");
    })
    .catch(function () {
      // Silêncio de propósito: o visitante não tem o que fazer com um erro de
      // banco, e os cards de reserva já estão na tela.
    });
})();

/* ============================================================
   O BOTÃO "ENTRAR" SABE ONDE ELE ESTÁ

   O painel mora em painel.7sevencode.com.br quando publicado, e em
   localhost:3001 na máquina de quem desenvolve. O link no HTML aponta para o
   endereço de produção — que é o certo para o mundo, e o errado para testar.

   Este trecho conserta só o caso local: se a página está sendo servida de
   localhost, de 127.0.0.1 ou de um IP da rede de casa (o celular abrindo pelo
   wi-fi), ele reescreve o link para o painel rodando na MESMA máquina, na
   porta 3001.

   Em produção nada acontece: o hostname não bate com nenhum desses casos e o
   link continua exatamente como está no HTML. Ou seja, não há como este
   arquivo mandar um visitante para um localhost que não existe para ele.

   Por que não deixar o link como localhost e trocar na hora de publicar:
   porque isso depende de alguém lembrar, e um dia ninguém lembra — e aí o
   site no ar manda o cliente para a máquina dele mesmo.
   ============================================================ */

(function entrarSabeOndeEsta() {
  var host = location.hostname;
  var local =
    host === "localhost" ||
    host === "127.0.0.1" ||
    /^192\.168\./.test(host) ||
    /^10\./.test(host);

  if (!local) return;

  var destino = location.protocol + "//" + host + ":3001";

  document.querySelectorAll('.nav-entrar a, a.entrar-celular').forEach(
    function (a) {
      a.href = destino;
      a.title = "Modo local: abrindo " + destino;
    }
  );
})();
