'use strict';

const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 24);
});

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('menu-open', isOpen);
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    });
  });
}

(function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));

  const sizes = { w: window.innerWidth, h: window.innerHeight };
  renderer.setSize(sizes.w, sizes.h);

  const camera = new THREE.PerspectiveCamera(75, sizes.w / sizes.h, 0.1, 1000);
  camera.position.z = 32;

  const count = 2600;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const scales = new Float32Array(count);

  const palette = [
    new THREE.Color('#39d0ff'),
    new THREE.Color('#ff7a18'),
    new THREE.Color('#9eff6b'),
    new THREE.Color('#ff5fa2'),
  ];

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const radius = Math.random() * 65 + 6;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const color = palette[Math.floor(Math.random() * palette.length)].clone().multiplyScalar(0.75 + Math.random() * 0.35);

    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = radius * Math.cos(phi);

    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;
    scales[i] = Math.random();
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));

  const material = new THREE.PointsMaterial({
    size: 0.16,
    vertexColors: true,
    transparent: true,
    opacity: 0.82,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  const torus = new THREE.Mesh(
    new THREE.TorusGeometry(11, 2.4, 24, 120),
    new THREE.MeshBasicMaterial({
      color: 0x39d0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    })
  );
  torus.rotation.x = Math.PI / 3.4;
  scene.add(torus);

  const torus2 = new THREE.Mesh(
    new THREE.TorusGeometry(17, 1.2, 16, 100),
    new THREE.MeshBasicMaterial({
      color: 0xff7a18,
      wireframe: true,
      transparent: true,
      opacity: 0.06,
    })
  );
  torus2.rotation.x = -Math.PI / 4;
  torus2.rotation.z = Math.PI / 6;
  scene.add(torus2);

  const dodeca = new THREE.Mesh(
    new THREE.DodecahedronGeometry(5.8, 0),
    new THREE.MeshBasicMaterial({
      color: 0x9eff6b,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    })
  );
  dodeca.position.set(-12, -5, -6);
  scene.add(dodeca);

  let mouseX = 0;
  let mouseY = 0;

  window.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / sizes.w - 0.5) * 2;
    mouseY = -(event.clientY / sizes.h - 0.5) * 2;
  });

  window.addEventListener('resize', () => {
    sizes.w = window.innerWidth;
    sizes.h = window.innerHeight;
    camera.aspect = sizes.w / sizes.h;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.w, sizes.h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
  });

  const clock = new THREE.Clock();

  function tick() {
    requestAnimationFrame(tick);
    const elapsed = clock.getElapsedTime();

    particles.rotation.y = elapsed * 0.035;
    particles.rotation.x = elapsed * 0.015;

    torus.rotation.y = elapsed * 0.14;
    torus.rotation.z = elapsed * 0.06;

    torus2.rotation.x = elapsed * -0.08;
    torus2.rotation.z = elapsed * 0.1;

    dodeca.rotation.x = elapsed * 0.18;
    dodeca.rotation.y = elapsed * -0.12;

    camera.position.x += (mouseX * 2.6 - camera.position.x) * 0.04;
    camera.position.y += (mouseY * 2.6 - camera.position.y) * 0.04;

    renderer.render(scene, camera);
  }

  tick();
})();

function initSectionCanvas(canvasId, color) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
  renderer.setPixelRatio(1);

  const camera = new THREE.PerspectiveCamera(70, 1, 0.1, 100);
  camera.position.z = 22;

  const count = 650;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 64;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 42;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 32;
  }

  const points = new THREE.Points(
    new THREE.BufferGeometry(),
    new THREE.PointsMaterial({
      size: 0.12,
      color,
      transparent: true,
      opacity: 0.45,
    })
  );
  points.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  scene.add(points);

  const ring = new THREE.Mesh(
    new THREE.RingGeometry(7, 7.3, 80),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.07,
      side: THREE.DoubleSide,
    })
  );
  ring.position.z = -8;
  scene.add(ring);

  const resize = () => {
    const parent = canvas.parentElement;
    if (!parent) return;
    renderer.setSize(parent.clientWidth, parent.clientHeight);
    camera.aspect = parent.clientWidth / parent.clientHeight;
    camera.updateProjectionMatrix();
  };

  resize();
  window.addEventListener('resize', resize);

  const clock = new THREE.Clock();
  function tick() {
    requestAnimationFrame(tick);
    const elapsed = clock.getElapsedTime();

    points.rotation.y = elapsed * 0.028;
    points.rotation.x = elapsed * 0.012;
    ring.rotation.z = elapsed * 0.08;

    renderer.render(scene, camera);
  }

  tick();
}

initSectionCanvas('leadership-canvas', 0x39d0ff);
initSectionCanvas('cert-canvas', 0x9eff6b);
initSectionCanvas('awards-canvas', 0xff7a18);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.14, rootMargin: '0px 0px -50px 0px' }
);

document.querySelectorAll('.reveal').forEach((element, index) => {
  element.style.transitionDelay = `${(index % 4) * 90}ms`;
  revealObserver.observe(element);
});

function animateCounter(element) {
  const target = Number.parseInt(element.dataset.target, 10);
  const duration = 1800;
  const start = performance.now();

  function update(timestamp) {
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    element.textContent = Math.round(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('.stat-number').forEach((item) => counterObserver.observe(item));

const aboutCard = document.getElementById('about-card');
if (aboutCard && window.matchMedia('(pointer: fine)').matches) {
  aboutCard.addEventListener('mousemove', (event) => {
    const rect = aboutCard.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateY = ((event.clientX - centerX) / (rect.width / 2)) * 14;
    const rotateX = ((centerY - event.clientY) / (rect.height / 2)) * 14;
    aboutCard.style.transform = `perspective(800px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
  });

  aboutCard.addEventListener('mouseleave', () => {
    aboutCard.style.transition = 'transform 0.45s ease';
    aboutCard.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg)';
  });

  aboutCard.addEventListener('mouseenter', () => {
    aboutCard.style.transition = 'none';
  });
}

document.querySelectorAll('.leadership-card, .award-card, .conf-card, .cert-category, .student-card, .hero-panels, .hero-mini-board').forEach((card) => {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  card.addEventListener('mousemove', (event) => {
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateY = ((event.clientX - centerX) / (rect.width / 2)) * 4;
    const rotateX = ((centerY - event.clientY) / (rect.height / 2)) * 4;
    card.style.transform = `translateY(-6px) perspective(900px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

(function createAurora() {
  const hero = document.getElementById('hero');
  if (!hero) return;

  const blobs = [
    { w: '520px', h: '520px', top: '4%', left: '-6%', bg: 'rgba(57, 208, 255, 0.12)' },
    { w: '420px', h: '420px', top: '40%', right: '0%', bg: 'rgba(255, 122, 24, 0.1)' },
    { w: '360px', h: '360px', bottom: '8%', left: '34%', bg: 'rgba(158, 255, 107, 0.08)' },
  ];

  blobs.forEach((config, index) => {
    const blob = document.createElement('div');
    blob.className = 'aurora-blob';
    blob.style.cssText = `
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      pointer-events: none;
      z-index: 0;
      animation: auroraFloat ${12 + index * 4}s ease-in-out infinite alternate;
      animation-delay: ${index * -2.5}s;
    `;
    Object.assign(blob.style, config);
    hero.appendChild(blob);
  });

  const style = document.createElement('style');
  style.textContent = `
    @keyframes auroraFloat {
      0% { transform: translate3d(0, 0, 0) scale(1); }
      35% { transform: translate3d(28px, -32px, 0) scale(1.08); }
      70% { transform: translate3d(-18px, 18px, 0) scale(0.96); }
      100% { transform: translate3d(34px, -12px, 0) scale(1.04); }
    }
  `;
  document.head.appendChild(style);
})();

const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navItems.forEach((link) => link.classList.remove('active'));
      const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (activeLink) activeLink.classList.add('active');
    });
  },
  { rootMargin: '-45% 0px -45% 0px' }
);

sections.forEach((section) => navObserver.observe(section));

if (window.matchMedia('(pointer: fine)').matches) {
  const cursorGlow = document.createElement('div');
  cursorGlow.id = 'cursor-glow';
  cursorGlow.style.cssText = `
    position: fixed;
    width: 280px;
    height: 280px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(57, 208, 255, 0.08), rgba(57, 208, 255, 0) 70%);
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    mix-blend-mode: screen;
    transition: opacity 0.25s ease;
  `;
  document.body.appendChild(cursorGlow);

  window.addEventListener('mousemove', (event) => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  });
}

let lastScrollY = window.scrollY;
window.addEventListener('scroll', () => {
  const delta = Math.abs(window.scrollY - lastScrollY);
  if (delta > 20) {
    spawnScrollParticle();
    lastScrollY = window.scrollY;
  }
});

function spawnScrollParticle() {
  if (Math.random() > 0.35) return;

  const particle = document.createElement('div');
  const colors = ['#39d0ff', '#ff7a18', '#9eff6b', '#ff5fa2'];
  const color = colors[Math.floor(Math.random() * colors.length)];

  particle.style.cssText = `
    position: fixed;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: ${color};
    box-shadow: 0 0 10px ${color};
    pointer-events: none;
    z-index: 9998;
    left: ${Math.random() * window.innerWidth}px;
    top: ${Math.random() * window.innerHeight}px;
    animation: sparkFade 0.9s ease forwards;
  `;

  document.body.appendChild(particle);
  setTimeout(() => particle.remove(), 900);
}

(function initTypedSubtitle() {
  const subtitle = document.querySelector('.hero-subtitle');
  if (!subtitle) return;

  const texts = [
    'Building tech that feels useful, human, and a little bit futuristic.',
    'Student leader, hackathon participant, and builder with a strong campus-first mindset.',
    'Turning curiosity into code, and code into visible impact.',
  ];

  let textIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function type() {
    const current = texts[textIndex];

    if (deleting) {
      charIndex -= 1;
      subtitle.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        textIndex = (textIndex + 1) % texts.length;
      }
    } else {
      charIndex += 1;
      subtitle.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(type, 1800);
        return;
      }
    }

    setTimeout(type, deleting ? 32 : 48);
  }

  setTimeout(type, 1200);
})();

(function initLoader() {
  const loader = document.createElement('div');
  loader.id = 'loader';
  loader.innerHTML = `
    <div class="loader-inner">
      <div class="loader-logo">LS<span>.</span></div>
      <div class="loader-copy">Loading student universe</div>
      <div class="loader-bar"><div class="loader-fill"></div></div>
    </div>
  `;

  loader.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 99999;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #04101a;
    transition: opacity 0.45s ease;
  `;

  const style = document.createElement('style');
  style.textContent = `
    .loader-inner { text-align: center; }
    .loader-logo {
      font-family: 'Outfit', sans-serif;
      font-size: 3rem;
      font-weight: 900;
      letter-spacing: -0.06em;
      margin-bottom: 10px;
      background: linear-gradient(135deg, #39d0ff, #9eff6b);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .loader-logo span {
      color: #ff7a18;
      -webkit-text-fill-color: #ff7a18;
    }
    .loader-copy {
      font-family: 'JetBrains Mono', monospace;
      color: #8fa7b8;
      font-size: 0.72rem;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      margin-bottom: 16px;
    }
    .loader-bar {
      width: 220px;
      height: 4px;
      border-radius: 999px;
      overflow: hidden;
      background: rgba(255, 255, 255, 0.08);
    }
    .loader-fill {
      height: 100%;
      width: 0%;
      background: linear-gradient(90deg, #39d0ff, #ff7a18, #9eff6b);
      animation: loadFill 1.45s ease forwards;
    }
    @keyframes loadFill {
      to { width: 100%; }
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(loader);

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.style.opacity = '0';
      setTimeout(() => loader.remove(), 450);
    }, 1050);
  });
})();
