// ===== SISTEMA DE PARTÍCULAS INTERATIVAS =====
// Este sistema cria um background animado com partículas que respondem ao movimento do cursor
// Cor: #0479da (azul 7 Seven Code)
// Comportamento: As partículas se movem lentamente e se repelem quando o cursor se aproxima

/**
 * Classe Particle
 * Representa uma partícula individual no sistema
 * - Movimento contínuo lento
 * - Se repele quando o cursor se aproxima (até 150px)
 * - Conecta-se com outras partículas próximas
 */
class Particle {
  constructor(x, y, canvas) {
    this.x = x;
    this.y = y;
    this.canvas = canvas;
    this.size = Math.random() * 2 + 1;
    this.speedX = (Math.random() - 0.5) * 0.4; // Movimento muito lento
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.5 + 0.3;
    this.maxOpacity = this.opacity;
  }

  // Atualiza a posição da partícula e a interação com o cursor
  update(mouseX, mouseY) {
    // Movimento base (muito lento)
    this.x += this.speedX;
    this.y += this.speedY;

    // Repulsão forte do cursor
    const dx = this.x - mouseX;
    const dy = this.y - mouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const repelDistance = 150; // Distância de interação

    if (distance < repelDistance) {
      const angle = Math.atan2(dy, dx);
      const force = (repelDistance - distance) / repelDistance;
      this.x += Math.cos(angle) * force * 7; // Força de repulsão forte
      this.y += Math.sin(angle) * force * 7;
      this.opacity = this.maxOpacity * 1.5; // Fica mais visível
    } else {
      this.opacity = this.maxOpacity;
    }

    // Bordas com wrap-around (partículas reaparecem do outro lado)
    if (this.x < 0) this.x = this.canvas.width;
    if (this.x > this.canvas.width) this.x = 0;
    if (this.y < 0) this.y = this.canvas.height;
    if (this.y > this.canvas.height) this.y = 0;
  }

  // Desenha a partícula no canvas
  draw(ctx) {
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = "#0479da"; // Cor azul tech
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

/**
 * Classe ParticleSystem
 * Gerencia o sistema completo de partículas
 * - Cria e anima as partículas
 * - Rastreia posição do cursor
 * - Desenha conexões entre partículas próximas
 */
class ParticleSystem {
  constructor() {
    this.canvas = document.getElementById("particleCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.particles = [];
    this.mouseX = window.innerWidth / 2;
    this.mouseY = window.innerHeight / 2;

    this.setCanvasSize();
    this.createParticles();
    this.setupEventListeners();
    this.animate();
  }

  // Ajusta o tamanho do canvas para a viewport
  setCanvasSize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  // Cria as partículas distribuídas aleatoriamente pela tela
  createParticles() {
    const particleCount = Math.floor(
      (window.innerWidth * window.innerHeight) / 10000,
    );
    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
      this.particles.push(new Particle(x, y, this.canvas));
    }
  }

  // Configura os listeners para mouse e resize
  setupEventListeners() {
    // Rastreia posição do cursor
    document.addEventListener("mousemove", (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });

    // Redimensiona canvas quando a janela muda
    window.addEventListener("resize", () => {
      this.setCanvasSize();
      // Recria as partículas com as novas dimensões
      this.particles = [];
      this.createParticles();
    });

    // Reseta posição do cursor quando sai da tela
    document.addEventListener("mouseleave", () => {
      this.mouseX = window.innerWidth / 2;
      this.mouseY = window.innerHeight / 2;
    });
  }

  // Loop de animação principal
  animate() {
    // Limpar canvas com fundo escuro sólido
    this.ctx.fillStyle = "#17191f";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Atualizar e desenhar partículas
    for (let particle of this.particles) {
      particle.update(this.mouseX, this.mouseY);
      particle.draw(this.ctx);
    }

    // Desenhar conexões entre partículas próximas
    this.drawConnections();

    requestAnimationFrame(() => this.animate());
  }

  // Desenha linhas conectando partículas próximas (efeito de rede)
  drawConnections() {
    const maxDistance = 100;
    this.ctx.strokeStyle = "#0479da";
    this.ctx.globalAlpha = 0.2;

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }

    this.ctx.globalAlpha = 1;
  }
}

// ===== INICIALIZAÇÃO DO SISTEMA =====
// Inicia o sistema de partículas quando o documento estiver pronto
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    new ParticleSystem();
  });
} else {
  new ParticleSystem();
}


// ===== FIM DO SISTEMA DE PARTÍCULAS =====






// ===== Abrir e fechar Menu =====
const btnHamburguer = document.querySelector(".btn-hamburguer");
const menuCelular = document.querySelector(".menu-celular");
const linksMenu = document.querySelectorAll(".menu-celular a");

const toggleMenu = () => {
  menuCelular.classList.toggle("active");
  btnHamburguer.classList.toggle("active");
  return;
};

linksMenu.forEach((link) => {
  link.addEventListener("click", () => {
    menuCelular.classList.remove("active");
  });
});

btnHamburguer.addEventListener("click", toggleMenu);

// fechar clicando fora do menu

document.addEventListener("click", (event) => {
  if (menuCelular.classList.contains("active")) {
    if (
      !menuCelular.contains(event.target) &&
      !btnHamburguer.contain(event.target)
    ) {
      menuCelular.classList.remove("active");
    }
  }
});




// ===== Animação ao Rolar a Página  ( Scroll ) =====

// 1. Trecho do código q é o "vigia" (Observer)

const vigiaDoScroll = new IntersectionObserver((elements) => {
  elements.forEach((element1) => {
    if (element1.isIntersecting) {
      element1.target.classList.add("visivel");
      vigiaDoScroll.unobserve(element1.target);
    }
  });

}, {
  threshold: 0.25
});

// 2. Selecionar todos os elementos que têm a classe de surgir
const  elementsForAnimation = document.querySelectorAll('.surgir-ao-scroll');

// 3. Mandar o vigia observar cada um deles
elementsForAnimation.forEach(element2 => {
  vigiaDoScroll.observe(element2)
});




