console.clear();

/* --- LÓGICA DE LA CUENTA REGRESIVA INICIAL (3, 2, 1) --- */
const loaderScreen = document.getElementById("loader-screen");
const welcomeScreen = document.getElementById("welcome-screen");
const countdownNum = document.getElementById("countdown-num");

let count = 3;

const timer = setInterval(() => {
  count--;
  if (count > 0) {
    if (countdownNum) {
      countdownNum.innerText = count;
      countdownNum.style.animation = 'none';
      countdownNum.offsetHeight; // Reflow
      countdownNum.style.animation = 'pulseNumber 0.8s ease-out';
    }
  } else {
    clearInterval(timer);
    
    // Ocultar loader y revelar bienvenida
    if (loaderScreen) loaderScreen.classList.add("fade-out");
    setTimeout(() => {
      if (welcomeScreen) {
        welcomeScreen.classList.remove("hidden-welcome");
        welcomeScreen.classList.add("fade-in");
      }
    }, 400);
  }
}, 1000);

/* --- CONFIGURACIÓN DE FRASES Y CONTADOR --- */
const frases = [
  "Gracias por coincidir conmigo",
  "Sos infinitamente capaz de todo lo que te propongas",
  "Admiro tu fuerza y valentía con la que vas sanando tus heridas",
  "Sei la sorpresa più bella che la vita mi ha riservato, e ogni giorno che passa ti amo sempre di più.",
  "Nunca dudes de la fuerza y la magia que hay en vos",
  "Paso a paso vas demostrando lo gigante que es tu corazón",
  "El mundo es un lugar mucho mejor con tu energía",
  "Tu fortaleza interna es silenciosa, pero tiene el poder de mover montañas",
  "Orgulloso de ver cómo te superás",
  "Acompañar tu camino y ver cómo te superás es un regalo invaluable",
  "Saranghaee señorita bellaa<3"
];

let indiceFrase = 0;
const phraseElement = document.getElementById("phrase");
const counterNum = document.getElementById("phrase-counter-num");
const counterSubtext = document.getElementById("phrase-subtext");
const counterContainer = document.getElementById("phrase-counter-container");
const progressFill = document.getElementById("phrase-progress-fill");

function actualizarFrase() {
  if (!phraseElement) return;
  
  const actualNum = indiceFrase + 1;
  const totalNum = frases.length;

  phraseElement.innerText = frases[indiceFrase];
  phraseElement.classList.add("visible");

  if (counterNum) counterNum.innerText = `${actualNum} / ${totalNum}`;
  
  if (counterSubtext) {
    if (actualNum === totalNum) {
      counterSubtext.innerText = "Última frase (se repetirá)";
    } else {
      counterSubtext.innerText = `Faltan ${totalNum - actualNum} frase${(totalNum - actualNum) > 1 ? 's' : ''}`;
    }
  }

  if (progressFill) {
    progressFill.style.transition = 'none';
    progressFill.style.width = '0%';
    setTimeout(() => {
      progressFill.style.transition = 'width 6s linear';
      progressFill.style.width = '100%';
    }, 50);
  }

  indiceFrase = (indiceFrase + 1) % frases.length;
}

function ocultarFrase() {
  if (phraseElement) phraseElement.classList.remove("visible");
}

/* --- REPRODUCTOR DE MÚSICA Y EVENTO PRINCIPAL --- */
const audio = document.getElementById("bg-music");
const startTrigger = document.getElementById("start-trigger");
const musicPlayer = document.getElementById("music-player");
const muteBtn = document.getElementById("mute-btn");
const volumeIcon = document.getElementById("volume-icon");
const progressBar = document.getElementById("progress-bar");
const progressContainer = document.getElementById("progress-container");
const currentTimeEl = document.getElementById("current-time");
const durationTimeEl = document.getElementById("duration-time");

let tl; // GSAP Timeline global
let iniciado = false;

if (startTrigger) {
  startTrigger.addEventListener("click", () => {
    if (iniciado) return;
    iniciado = true;

    if (welcomeScreen) {
      welcomeScreen.classList.add("fade-out");
      setTimeout(() => {
        welcomeScreen.style.display = "none";
      }, 400);
    }

    if (musicPlayer) musicPlayer.classList.remove("hidden");
    if (counterContainer) counterContainer.classList.remove("hidden");
    
    if (audio) {
      audio.play().catch(e => console.log("Audio play error:", e));
    }
    
    if (tl) {
      tl.play();
    }
  });
}

// Control Mute / Unmute
let isMuted = false;
if (muteBtn) {
  muteBtn.addEventListener("click", () => {
    isMuted = !isMuted;
    if (audio) audio.muted = isMuted;
    
    if (volumeIcon) {
      if (isMuted) {
        volumeIcon.innerHTML = `<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>`;
      } else {
        volumeIcon.innerHTML = `<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>`;
      }
    }
  });
}

if (audio) {
  audio.addEventListener("timeupdate", () => {
    if (audio.duration && progressBar) {
      const progressPercent = (audio.currentTime / audio.duration) * 100;
      progressBar.style.width = `${progressPercent}%`;
      
      if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
      if (durationTimeEl) durationTimeEl.textContent = formatTime(audio.duration);
    }
  });
}

if (progressContainer) {
  progressContainer.addEventListener("click", (e) => {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    if (audio && audio.duration) {
      audio.currentTime = (clickX / width) * audio.duration;
    }
  });
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

/* --- INICIALIZACIÓN DE THREE.JS Y CORAZÓN DE PARTÍCULAS --- */
function initThree() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    5000
  );
  camera.position.z = 400;

  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 1);
  
  renderer.domElement.style.position = "fixed";
  renderer.domElement.style.top = "0";
  renderer.domElement.style.left = "0";
  renderer.domElement.style.zIndex = "1";
  renderer.domElement.style.pointerEvents = "none";
  
  document.body.appendChild(renderer.domElement);

  /* --- ANIMACIÓN GSAP --- */
  let animacionInicializada = false;

  tl = gsap.timeline({
    repeat: -1,
    yoyo: true,
    paused: true,
    onUpdate: function () {
      const progreso = this.progress();

      if (progreso > 0.75 && !animacionInicializada) {
        actualizarFrase();
        animacionInicializada = true;
      } else if (progreso < 0.4 && animacionInicializada) {
        ocultarFrase();
        animacionInicializada = false;
      }
    }
  });

  /* --- GENERACIÓN DE VÉRTICES (FÓRMULA MATEMÁTICA DEL CORAZÓN 3D) --- */
  const targetVertices = [];
  const currentVertices = [];
  const totalPoints = window.innerWidth < 768 ? 2000 : 3500;

  const path = document.querySelector("#heart-path");

  if (path && path.getTotalLength) {
    const length = path.getTotalLength();
    const step = length / totalPoints;

    for (let i = 0; i < length; i += step) {
      const pt = path.getPointAtLength(i);
      
      const tx = (pt.x - 300) * 1.2 + (Math.random() - 0.5) * 15;
      const ty = (-pt.y + 276) * 1.2 + (Math.random() - 0.5) * 15;
      const tz = (Math.random() - 0.5) * 50;

      targetVertices.push(tx, ty, tz);
      currentVertices.push(0, 0, 0); // Empiezan agrupadas al centro y se expanden
    }
  } else {
    // Generación matemática de respaldo si el SVG no está presente en el HTML
    for (let i = 0; i < totalPoints; i++) {
      const t = Math.PI * 2 * (i / totalPoints);
      
      // Ecuación paramétrica de corazón
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
      
      const scale = 12;
      const tx = x * scale + (Math.random() - 0.5) * 15;
      const ty = y * scale + (Math.random() - 0.5) * 15;
      const tz = (Math.random() - 0.5) * 50;

      targetVertices.push(tx, ty, tz);
      currentVertices.push(0, 0, 0);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(currentVertices, 3));

  // Animación de dispersión a forma final con GSAP
  for (let i = 0; i < targetVertices.length; i += 3) {
    const ptObj = { x: 0, y: 0, z: 0 };
    
    tl.to(ptObj, {
      x: targetVertices[i],
      y: targetVertices[i + 1],
      z: targetVertices[i + 2],
      ease: "power2.inOut",
      duration: 2 + Math.random() * 2.5,
      onUpdate: function() {
        const positions = geometry.attributes.position.array;
        positions[i] = ptObj.x;
        positions[i + 1] = ptObj.y;
        positions[i + 2] = ptObj.z;
        geometry.attributes.position.needsUpdate = true;
      }
    }, (i / 3) * 0.0005);
  }

  /* --- TEXTURA Y MATERIAL DE SHADER --- */
  const createDotTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.2, 'rgba(255,255,255,0.8)');
    gradient.addColorStop(0.5, 'rgba(255,255,255,0.2)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
  };

  const vertexShader = `
    varying vec3 vPosition;
    void main() {
      vPosition = position;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = 4.5 * (400.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    varying vec3 vPosition;
    uniform sampler2D pointTexture;
    
    void main() {
      vec3 colorRosa = vec3(1.0, 0.35, 0.68);
      vec3 colorMorado = vec3(0.52, 0.0, 0.85);
      
      float mixFactor = clamp((vPosition.y + 150.0) / 300.0, 0.0, 1.0);
      vec3 finalColor = mix(colorMorado, colorRosa, mixFactor);
      
      gl_FragColor = vec4(finalColor, 1.0) * texture2D(pointTexture, gl_PointCoord);
      if (gl_FragColor.a < 0.05) discard;
    }
  `;

  const material = new THREE.ShaderMaterial({
    uniforms: {
      pointTexture: { value: createDotTexture() }
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    transparent: true
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  /* --- ROTACIÓN CONTINUA --- */
  gsap.to(particles.rotation, {
    y: Math.PI * 2,
    repeat: -1,
    duration: 20,
    ease: 'none'
  });

  const textContainer = document.getElementById("text-container");
  if (textContainer) {
    gsap.to(textContainer, {
      y: "-=10",
      repeat: -1,
      yoyo: true,
      duration: 2.5,
      ease: "sine.inOut"
    });
  }

  /* --- RENDER LOOP --- */
  function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener("resize", onWindowResize, false);
  requestAnimationFrame(render);

  if (iniciado) {
    tl.play();
  }
}

// Inicialización
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initThree);
} else {
  initThree();
}