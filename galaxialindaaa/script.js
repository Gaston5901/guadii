/**
 * Debug
 */
const gui = new dat.GUI({ closed: true, width: 350 });

const isMobileLike = window.matchMedia("(max-width: 768px), (pointer: coarse)").matches;
const maxPixelRatio = isMobileLike ? 1 : 2;

const parameters = {
  count: isMobileLike ? 70000 : 250000,
  radius: 5,
  branches: 5,
  spin: 1,
  randomness: 0.8,
  randomnessPower: 4,
  insideColor: "#ec5300",
  outsideColor: "#2fb4fc" };

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");
const introScreen = document.getElementById("introScreen");
const enterButton = document.getElementById("enterButton");
const backgroundAudio = document.getElementById("backgroundAudio");
const galaxyMessage = document.getElementById("galaxyMessage");

backgroundAudio.loop = true;
backgroundAudio.addEventListener("ended", () => {
  backgroundAudio.currentTime = 0;
  backgroundAudio.play().catch(() => {});
});

// Scene
const scene = new THREE.Scene();

// TextureLoader
const createStarTexture = () => {
  const canvasTexture = document.createElement("canvas");
  canvasTexture.width = 64;
  canvasTexture.height = 64;

  const context = canvasTexture.getContext("2d");
  const gradient = context.createRadialGradient(
    32,
    32,
    0,
    32,
    32,
    32
  );

  gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
  gradient.addColorStop(0.2, "rgba(255, 255, 255, 0.9)");
  gradient.addColorStop(0.4, "rgba(255, 255, 255, 0.4)");
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

  context.fillStyle = gradient;
  context.fillRect(0, 0, 64, 64);

  const texture = new THREE.CanvasTexture(canvasTexture);
  texture.needsUpdate = true;
  return texture;
};

const starTexture = createStarTexture();

/**
 * Object
 */
let geometry = null;
let material = null;
let points = null;

const generateGalaxy = () => {
  if (points !== null) {
    geometry.dispose();
    material.dispose();
    scene.remove(points);
  }

  /**
   * Geometry
   */
  geometry = new THREE.BufferGeometry();

  const positions = new Float32Array(parameters.count * 3);
  const colors = new Float32Array(parameters.count * 3);
  const scales = new Float32Array(parameters.count);
  const randomness = new Float32Array(parameters.count * 3);
  const insideColor = new THREE.Color(parameters.insideColor);
  const outsideColor = new THREE.Color(parameters.outsideColor);

  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3;

    // Position
    const radius = Math.random() * parameters.radius;

    const branchAngle =
    i % parameters.branches / parameters.branches * Math.PI * 2;

    const randomX =
    Math.pow(Math.random(), parameters.randomnessPower) * (
    Math.random() < 0.5 ? 1 : -1) *
    parameters.randomness *
    radius;
    const randomY =
    Math.pow(Math.random(), parameters.randomnessPower) * (
    Math.random() < 0.5 ? 1 : -1) *
    parameters.randomness *
    radius;
    const randomZ =
    Math.pow(Math.random(), parameters.randomnessPower) * (
    Math.random() < 0.5 ? 1 : -1) *
    parameters.randomness *
    radius;

    positions[i3] = Math.cos(branchAngle) * radius;
    positions[i3 + 1] = 0;
    positions[i3 + 2] = Math.sin(branchAngle) * radius;

    // Randomness
    randomness[i3] = randomX;
    randomness[i3 + 1] = randomY;
    randomness[i3 + 2] = randomZ;

    // Color
    const mixedColor = insideColor.clone();
    mixedColor.lerp(outsideColor, radius / parameters.radius);

    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;

    // Scales
    scales[i] = Math.random();
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
  geometry.setAttribute(
  "aRandomness",
  new THREE.BufferAttribute(randomness, 3));

  // console.log(new THREE.)
  /**
   * Material
   */
  material = new THREE.ShaderMaterial({
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    vertexShader: document.getElementById("vertexShader").textContent,
    fragmentShader: document.getElementById("fragmentShader").textContent,
    transparent: true,
    uniforms: {
      uTime: { value: 0 },
      uSize: { value: 30 * renderer.getPixelRatio() },
      uHoleSize: { value: 0.15 },
      uTexture: { value: starTexture },
      size: { value: 1.0 } } });



  /**
   * Points
   */
  points = new THREE.Points(geometry, material);
  scene.add(points);
};

gui.
add(parameters, "count").
min(100).
max(1000000).
step(100).
onFinishChange(generateGalaxy).
name("Star count");
gui.
add(parameters, "radius").
min(0.01).
max(20).
step(0.01).
onFinishChange(generateGalaxy).
name("Galaxy radius");
gui.
add(parameters, "branches").
min(2).
max(20).
step(1).
onFinishChange(generateGalaxy).
name("Galaxy branches");
gui.
add(parameters, "randomness").
min(0).
max(2).
step(0.001).
onFinishChange(generateGalaxy).
name("Randomness position");
gui.
add(parameters, "randomnessPower").
min(1).
max(10).
step(0.001).
onFinishChange(generateGalaxy).
name("Randomness power");
gui.
addColor(parameters, "insideColor").
onFinishChange(generateGalaxy).
name("Galaxy inside color");
gui.
addColor(parameters, "outsideColor").
onFinishChange(generateGalaxy).
name("Galaxy outside color");

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight };


window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
75,
sizes.width / sizes.height,
0.1,
100);

camera.position.x = 3;
camera.position.y = 3;
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new THREE.OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  powerPreference: "low-power"
});

renderer.setClearColor(0x000000);
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));

let galaxyReady = false;
let animationStarted = false;

generateGalaxy();
galaxyReady = true;

let audioContext = null;
let masterGain = null;
let backgroundAudioNode = null;

const startBackgroundSound = async () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioContext.createGain();
    masterGain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.08, audioContext.currentTime + 0.8);
    masterGain.connect(audioContext.destination);
  }

  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }

  if (!backgroundAudioNode) {
    backgroundAudioNode = audioContext.createMediaElementSource(backgroundAudio);
    backgroundAudioNode.connect(masterGain);
  }

  backgroundAudio.currentTime = 0;
  await backgroundAudio.play();
};

const showGalaxyMessage = (message) => {
  if (!galaxyMessage) {
    return;
  }

  galaxyMessage.textContent = message;
  galaxyMessage.classList.add("is-visible");

  window.clearTimeout(showGalaxyMessage.hideTimeout);
  showGalaxyMessage.hideTimeout = window.setTimeout(() => {
    galaxyMessage.classList.remove("is-visible");
  }, 4200);
};

enterButton.addEventListener("click", async () => {
  introScreen.classList.add("is-hidden");
  canvas.classList.remove("is-hidden");
  canvas.style.opacity = "1";
  showGalaxyMessage("Tus ojos belloss brillan como una galaxiaa.");
  if (!galaxyReady) {
    generateGalaxy();
    galaxyReady = true;
  }
  if (!animationStarted) {
    animationStarted = true;
    tick();
  }
  await startBackgroundSound();
});

gui.
add(material.uniforms.uSize, "value").
min(1).
max(100).
step(0.001).
name("Point size").
onChange(() => {
  material.uniforms.uSize.value =
  material.uniforms.uSize.value * renderer.getPixelRatio();
});

gui.
add(material.uniforms.uHoleSize, "value").
min(0).
max(1).
step(0.001).
name("Black hole size");

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  material.uniforms.uTime.value = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};