console.clear();

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
  const actualNum = indiceFrase + 1;
  const totalNum = frases.length;

  phraseElement.innerText = frases[indiceFrase];
  phraseElement.classList.add("visible");

  counterNum.innerText = `${actualNum} / ${totalNum}`;
  
  if (actualNum === totalNum) {
    counterSubtext.innerText = "Última frase (se repetirá)";
  } else {
    counterSubtext.innerText = `Faltan ${totalNum - actualNum} frase${(totalNum - actualNum) > 1 ? 's' : ''}`;
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
  phraseElement.classList.remove("visible");
}

/* --- CONTROL DEL REPRODUCTOR DE MÚSICA Y PRESENTACIÓN --- */
const audio = document.getElementById("bg-music");
const startTrigger = document.getElementById("start-trigger");
const welcomeScreen = document.getElementById("welcome-screen");
const musicPlayer = document.getElementById("music-player");
const muteBtn = document.getElementById("mute-btn");
const volumeIcon = document.getElementById("volume-icon");
const progressBar = document.getElementById("progress-bar");
const progressContainer = document.getElementById("progress-container");
const currentTimeEl = document.getElementById("current-time");
const durationTimeEl = document.getElementById("duration-time");

// Al tocar la foto
startTrigger.addEventListener("click", () => {
  welcomeScreen.classList.add("fade-out");
  musicPlayer.classList.remove("hidden");
  counterContainer.classList.remove("hidden");
  
  if (audio) {
    audio.play().catch(e => console.log("Audio play error:", e));
  }
  
  // Respiro de 150ms a la CPU antes de arrancar GSAP
  setTimeout(() => {
    tl.play();
  }, 150);
});

// Control Mute / Unmute
let isMuted = false;
muteBtn.addEventListener("click", () => {
  isMuted = !isMuted;
  audio.muted = isMuted;
  
  if (isMuted) {
    volumeIcon.innerHTML = `<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>`;
  } else {
    volumeIcon.innerHTML = `<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>`;
  }
});

// Actualizar barra de progreso de música
audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = `${progressPercent}%`;
    
    currentTimeEl.textContent = formatTime(audio.currentTime);
    durationTimeEl.textContent = formatTime(audio.duration);
  }
});

progressContainer.addEventListener("click", (e) => {
  const width = progressContainer.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  if (duration) {
    audio.currentTime = (clickX / width) * duration;
  }
});

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

/* --- THREE.JS SCENE Y CAMERA --- */
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  5000
);
camera.position.z = 450;

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 1);
document.body.appendChild(renderer.domElement);

/* --- ANIMACIÓN GSAP --- */
let animacionInicializada = false;

const tl = gsap.timeline({
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

/* --- LECTURA DEL PATH Y CREACIÓN DE PUNTOS ADAPTATIVA --- */
const path = document.querySelector("#heart-path");
const length = path.getTotalLength();
const vertices = [];

// En celulares (<768px) incrementa el paso para reducir la carga de partículas
const pasoPuntos = window.innerWidth < 768 ? 0.16 : 0.08;

for (let i = 0; i < length; i += pasoPuntos) {
  const point = path.getPointAtLength(i);
  const vector = new THREE.Vector3(point.x, -point.y, 0);

  vector.x += (Math.random() - 0.5) * 25;
  vector.y += (Math.random() - 0.5) * 25;
  vector.z += (Math.random() - 0.5) * 60;
  vertices.push(vector);

  tl.from(vector, {
      x: 600 / 2,
      y: -552 / 2,
      z: 0,
      ease: "power2.inOut",
      duration: "random(2, 5)"
    },
    i * 0.002
  );
}

const geometry = new THREE.BufferGeometry().setFromPoints(vertices);

/* --- SHADER MATERIAL --- */
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
    gl_PointSize = 4.2 * (450.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  varying vec3 vPosition;
  uniform sampler2D pointTexture;
  
  void main() {
    vec3 colorRosa = vec3(1.0, 0.35, 0.68);
    vec3 colorMorado = vec3(0.52, 0.0, 0.85);
    
    float mixFactor = clamp((vPosition.y + 200.0) / 400.0, 0.0, 1.0);
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
particles.position.x -= 600 / 2;
particles.position.y += 552 / 2;
scene.add(particles);

/* --- ANIMACIONES ADICIONALES --- */
gsap.to(scene.rotation, {
  y: Math.PI * 2,
  repeat: -1,
  duration: 25,
  ease: 'none'
});

gsap.to("#text-container", {
  y: "-=10",
  repeat: -1,
  yoyo: true,
  duration: 2.5,
  ease: "sine.inOut"
});

/* --- RENDER LOOP OPTIMIZADO SIN RECREACIÓN DE GEOMETRÍA --- */
function render() {
  requestAnimationFrame(render);
  
  const positions = geometry.attributes.position.array;
  for (let i = 0; i < vertices.length; i++) {
    positions[i * 3]     = vertices[i].x;
    positions[i * 3 + 1] = vertices[i].y;
    positions[i * 3 + 2] = vertices[i].z;
  }
  geometry.attributes.position.needsUpdate = true;
  
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onWindowResize, false);
requestAnimationFrame(render);