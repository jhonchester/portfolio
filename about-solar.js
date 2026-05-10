import * as THREE from "https://unpkg.com/three@0.183.2/build/three.module.js";

const canvas = document.querySelector("#aboutSolarCanvas");
const nameElement = document.querySelector("[data-solar-name]");
const textElement = document.querySelector("[data-solar-text]");
const indexElement = document.querySelector("[data-solar-index]");
const previousButton = document.querySelector("[data-solar-prev]");
const nextButton = document.querySelector("[data-solar-next]");
const textureBase = "assets/planet textures/";

const planets = [
  {
    name: "Mercury",
    text: "Fresh IT Graduate passionate about system development",
    color: 0xb8a391,
    textureUrl: `${textureBase}2k_mercury.jpg`,
    texture: "rock",
    palette: ["#5f554d", "#8f8274", "#c7b7a3", "#332f2d"],
    size: 0.62,
    orbit: 2.5
  },
  {
    name: "Venus",
    text: "Skilled in Laravel, Bootstrap, and database design",
    color: 0xd8a657,
    textureUrl: `${textureBase}2k_venus_surface.jpg`,
    texture: "cloud",
    palette: ["#8c5f2d", "#d8a657", "#f2d19b", "#6f4a2a"],
    size: 0.78,
    orbit: 3.25
  },
  {
    name: "Earth",
    text: "Developed Migrant Information System with RBAC for Municipality of Malvar",
    color: 0x245cff,
    textureUrl: `${textureBase}2k_earth_daymap.jpg`,
    nightUrl: `${textureBase}2k_earth_nightmap.jpg`,
    normalUrl: "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg",
    specularUrl: "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg",
    texture: "earth",
    palette: ["#123d8f", "#245cff", "#55d6be", "#2f7d44", "#f5f2ea"],
    size: 0.86,
    orbit: 4
  },
  {
    name: "Mars",
    text: "Built Scholarship Management System with secure role-based access",
    color: 0xee6f57,
    textureUrl: `${textureBase}2k_mars.jpg`,
    texture: "rock",
    palette: ["#5f2e22", "#a04732", "#ee6f57", "#d4976f"],
    size: 0.76,
    orbit: 4.85
  },
  {
    name: "Jupiter",
    text: "Experienced in system architecture, data encoding, and IT support",
    color: 0xd2b48c,
    textureUrl: `${textureBase}2k_jupiter.jpg`,
    texture: "bands",
    palette: ["#6c4a35", "#b0835f", "#d2b48c", "#f0d8ac", "#8f6045"],
    size: 1.24,
    orbit: 5.9
  },
  {
    name: "Saturn",
    text: "Capstone: WebXR with Haptic Gloves for immersive interaction",
    color: 0xf0c879,
    textureUrl: `${textureBase}2k_saturn.jpg`,
    ringUrl: `${textureBase}2k_saturn_ring_alpha.png`,
    texture: "bands",
    palette: ["#7b5d34", "#c49a50", "#f0c879", "#f7df9e", "#a67c41"],
    size: 1.05,
    orbit: 7
  },
  {
    name: "Uranus",
    text: "Detail-oriented, adaptable, and fast learner",
    color: 0x55d6be,
    textureUrl: `${textureBase}2k_uranus.jpg`,
    texture: "ice",
    palette: ["#1f8f9b", "#55d6be", "#a9f4e6", "#d8fff7"],
    size: 0.94,
    orbit: 8.05
  },
  {
    name: "Neptune",
    text: "Aspiring developer eager to build impactful solutions",
    color: 0x7b2dff,
    textureUrl: `${textureBase}2k_neptune.jpg`,
    texture: "storm",
    palette: ["#151d6e", "#245cff", "#7b2dff", "#a58cff"],
    size: 0.96,
    orbit: 9.1
  }
];

if (canvas) {
  const loader = new THREE.TextureLoader();
  loader.setCrossOrigin("anonymous");

  function loadRealTexture(url, onLoad) {
    if (!url) return;

    loader.load(
      url,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.anisotropy = 8;
        onLoad(texture);
      },
      undefined,
      () => {}
    );
  }

  function makePlanetTexture(planet, bump = false) {
    const textureCanvas = document.createElement("canvas");
    const size = 512;
    textureCanvas.width = size;
    textureCanvas.height = size;
    const ctx = textureCanvas.getContext("2d");
    const palette = planet.palette;

    ctx.fillStyle = palette[0];
    ctx.fillRect(0, 0, size, size);

    if (planet.texture === "bands") {
      for (let y = 0; y < size; y += 1) {
        const wave = Math.sin(y * 0.045) * 10 + Math.sin(y * 0.013) * 18;
        const band = Math.floor((y + wave) / 38) % palette.length;
        ctx.fillStyle = palette[Math.abs(band)];
        ctx.globalAlpha = bump ? 0.45 : 0.86;
        ctx.fillRect(0, y, size, 1);
      }
      for (let i = 0; i < 44; i += 1) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const radius = Math.random() * 26 + 8;
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, "rgba(255,255,255,0.22)");
        gradient.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
      }
    } else if (planet.texture === "earth") {
      const ocean = ctx.createLinearGradient(0, 0, size, size);
      ocean.addColorStop(0, palette[0]);
      ocean.addColorStop(0.48, palette[1]);
      ocean.addColorStop(1, "#071b4f");
      ctx.fillStyle = ocean;
      ctx.fillRect(0, 0, size, size);

      for (let i = 0; i < 34; i += 1) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const width = Math.random() * 150 + 40;
        const height = Math.random() * 70 + 24;
        ctx.fillStyle = i % 3 === 0 ? palette[2] : palette[3];
        ctx.globalAlpha = bump ? 0.45 : 0.72;
        ctx.beginPath();
        ctx.ellipse(x, y, width, height, Math.random() * Math.PI, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = bump ? 0.3 : 0.38;
      ctx.fillStyle = palette[4];
      for (let i = 0; i < 42; i += 1) {
        ctx.beginPath();
        ctx.ellipse(Math.random() * size, Math.random() * size, Math.random() * 80 + 24, Math.random() * 13 + 5, Math.random() * Math.PI, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      const gradient = ctx.createLinearGradient(0, 0, size, size);
      palette.forEach((color, index) => gradient.addColorStop(index / Math.max(1, palette.length - 1), color));
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);

      const marks = planet.texture === "ice" ? 90 : 150;
      for (let i = 0; i < marks; i += 1) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const radius = Math.random() * (planet.texture === "cloud" ? 34 : 18) + 4;
        ctx.globalAlpha = bump ? 0.34 : Math.random() * 0.24 + 0.08;
        ctx.fillStyle = palette[Math.floor(Math.random() * palette.length)];
        ctx.beginPath();
        ctx.ellipse(x, y, radius * 1.8, radius, Math.random() * Math.PI, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.globalAlpha = 1;
    const shade = ctx.createLinearGradient(0, 0, size, 0);
    shade.addColorStop(0, "rgba(0,0,0,0.22)");
    shade.addColorStop(0.5, "rgba(255,255,255,0.08)");
    shade.addColorStop(1, "rgba(0,0,0,0.36)");
    ctx.fillStyle = shade;
    ctx.fillRect(0, 0, size, size);

    const texture = new THREE.CanvasTexture(textureCanvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.anisotropy = 4;
    return texture;
  }

  function makeRingTexture() {
    const textureCanvas = document.createElement("canvas");
    textureCanvas.width = 512;
    textureCanvas.height = 64;
    const ctx = textureCanvas.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 512, 0);
    gradient.addColorStop(0, "rgba(255,255,255,0)");
    gradient.addColorStop(0.18, "rgba(245,242,234,0.18)");
    gradient.addColorStop(0.36, "rgba(240,200,121,0.46)");
    gradient.addColorStop(0.52, "rgba(255,255,255,0.12)");
    gradient.addColorStop(0.74, "rgba(240,200,121,0.36)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 64);
    const texture = new THREE.CanvasTexture(textureCanvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const targetCamera = new THREE.Vector3();
  const targetLookAt = new THREE.Vector3();
  const currentLookAt = new THREE.Vector3();
  const planetMeshes = [];
  const planetGroup = new THREE.Group();
  const orbitGroup = new THREE.Group();

  let activeIndex = 0;
  let hoveredPlanet = null;

  scene.add(orbitGroup);
  scene.add(planetGroup);

  const ambientLight = new THREE.AmbientLight(0x9fb5ff, 0.34);
  const sunLight = new THREE.PointLight(0xffffff, 6.5, 48);
  sunLight.position.set(0, 0, 0);
  const rimLight = new THREE.DirectionalLight(0x9bb7ff, 1.4);
  rimLight.position.set(-8, 7, 10);
  scene.add(ambientLight, sunLight, rimLight);

  const sunMaterial = new THREE.MeshStandardMaterial({
    color: 0xffb86b,
    emissive: 0xff8a1f,
    emissiveIntensity: 1.9,
    roughness: 0.42
  });
  loadRealTexture(`${textureBase}2k_sun.jpg`, (texture) => {
    sunMaterial.map = texture;
    sunMaterial.emissiveMap = texture;
    sunMaterial.needsUpdate = true;
  });
  const sun = new THREE.Mesh(new THREE.SphereGeometry(0.86, 48, 48), sunMaterial);
  scene.add(sun);

  const galaxy = new THREE.Mesh(
    new THREE.SphereGeometry(24, 48, 48),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.42
    })
  );
  loadRealTexture(`${textureBase}2k_stars_milky_way.jpg`, (texture) => {
    galaxy.material.map = texture;
    galaxy.material.needsUpdate = true;
  });
  scene.add(galaxy);

  function makeAtmosphere(radius, color, opacity = 0.22) {
    return new THREE.Mesh(
      new THREE.SphereGeometry(radius, 64, 64),
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        uniforms: {
          glowColor: { value: new THREE.Color(color) },
          opacity: { value: opacity }
        },
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 glowColor;
          uniform float opacity;
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.72 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
            gl_FragColor = vec4(glowColor, intensity * opacity);
          }
        `
      })
    );
  }

  const starGeometry = new THREE.BufferGeometry();
  const starPositions = [];
  for (let index = 0; index < 700; index += 1) {
    starPositions.push(
      (Math.random() - 0.5) * 44,
      (Math.random() - 0.5) * 30,
      (Math.random() - 0.5) * 34
    );
  }
  starGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starPositions, 3));
  const stars = new THREE.Points(
    starGeometry,
    new THREE.PointsMaterial({
      color: 0xf5f2ea,
      size: 0.035,
      transparent: true,
      opacity: 0.72
    })
  );
  scene.add(stars);

  planets.forEach((planet, index) => {
    const angle = (index / planets.length) * Math.PI * 2 - Math.PI * 0.35;
    const x = Math.cos(angle) * planet.orbit;
    const z = Math.sin(angle) * planet.orbit;

    const orbit = new THREE.Mesh(
      new THREE.RingGeometry(planet.orbit - 0.006, planet.orbit + 0.006, 160),
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.13,
        side: THREE.DoubleSide
      })
    );
    orbit.rotation.x = Math.PI / 2;
    orbitGroup.add(orbit);

    const map = makePlanetTexture(planet);
    const bumpMap = makePlanetTexture(planet, true);
    const material = new THREE.MeshStandardMaterial({
      map,
      bumpMap,
      bumpScale: planet.texture === "bands" ? 0.018 : 0.045,
      emissive: planet.color,
      emissiveIntensity: 0.08,
      roughness: planet.texture === "ice" ? 0.22 : planet.name === "Earth" ? 0.5 : 0.62,
      metalness: 0.02
    });
    loadRealTexture(planet.textureUrl, (texture) => {
      material.map = texture;
      material.needsUpdate = true;
    });
    loadRealTexture(planet.normalUrl, (texture) => {
      material.normalMap = texture;
      material.normalScale = new THREE.Vector2(0.42, 0.42);
      material.needsUpdate = true;
    });
    loadRealTexture(planet.specularUrl, (texture) => {
      material.roughnessMap = texture;
      material.needsUpdate = true;
    });
    loadRealTexture(planet.nightUrl, (texture) => {
      material.emissiveMap = texture;
      material.emissive = new THREE.Color(0x9bb7ff);
      material.emissiveIntensity = 0.32;
      material.needsUpdate = true;
    });
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(planet.size, 48, 48), material);
    mesh.position.set(x, 0, z);
    mesh.userData = { index, baseSize: planet.size, basePosition: mesh.position.clone() };
    planetGroup.add(mesh);

    if (planet.name === "Saturn") {
      const ringMaterial = new THREE.MeshBasicMaterial({
        map: makeRingTexture(),
        transparent: true,
        opacity: 0.78,
        side: THREE.DoubleSide
      });
      loadRealTexture(planet.ringUrl, (texture) => {
        ringMaterial.map = texture;
        ringMaterial.needsUpdate = true;
      });
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(planet.size * 1.3, planet.size * 1.9, 96),
        ringMaterial
      );
      ring.rotation.x = Math.PI * 0.58;
      mesh.add(ring);
    }

    if (planet.cloudUrl) {
      const cloudMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: planet.name === "Venus" ? 0.34 : 0.28,
        depthWrite: false,
        roughness: 0.72,
        metalness: 0
      });
      loadRealTexture(planet.cloudUrl, (texture) => {
        cloudMaterial.map = texture;
        cloudMaterial.alphaMap = texture;
        cloudMaterial.needsUpdate = true;
      });
      const cloudLayer = new THREE.Mesh(
        new THREE.SphereGeometry(planet.size * 1.018, 48, 48),
        cloudMaterial
      );
      cloudLayer.userData = { rotationSpeed: planet.name === "Venus" ? 0.0028 : 0.0038 };
      mesh.add(cloudLayer);
    }

    const atmosphereColor = planet.name === "Earth" ? 0x55d6ff : planet.name === "Venus" ? 0xffd79b : planet.color;
    const atmosphere = makeAtmosphere(planet.size * 1.08, atmosphereColor, planet.name === "Earth" || planet.name === "Venus" ? 0.38 : 0.16);
    mesh.add(atmosphere);

    planetMeshes.push(mesh);
  });

  function updateText() {
    const planet = planets[activeIndex];
    if (!planet || !nameElement || !textElement || !indexElement) return;

    nameElement.textContent = planet.name;
    textElement.textContent = planet.text;
    indexElement.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(planets.length).padStart(2, "0")}`;
  }

  function focusPlanet(index) {
    activeIndex = (index + planets.length) % planets.length;
    const mesh = planetMeshes[activeIndex];
    const planetPosition = mesh.position;
    const direction = planetPosition.clone().normalize();
    const side = new THREE.Vector3(-direction.z, 0.24, direction.x).normalize();

    targetLookAt.copy(planetPosition);
    targetCamera.copy(planetPosition)
      .add(direction.multiplyScalar(3.45))
      .add(side.multiplyScalar(1.15))
      .add(new THREE.Vector3(0, 1.15, 0));

    updateText();
  }

  function setRendererSize() {
    const bounds = canvas.parentElement.getBoundingClientRect();
    const width = Math.max(280, Math.floor(bounds.width));
    const height = Math.max(320, Math.floor(bounds.height));
    const ratio = Math.min(window.devicePixelRatio || 1, 2);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(ratio);
    renderer.setSize(width, height, false);
  }

  function pickPlanet(event) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);

    const hits = raycaster.intersectObjects(planetMeshes, false);
    hoveredPlanet = hits[0]?.object || null;
    canvas.style.cursor = hoveredPlanet ? "pointer" : "default";
  }

  previousButton?.addEventListener("click", () => focusPlanet(activeIndex - 1));
  nextButton?.addEventListener("click", () => focusPlanet(activeIndex + 1));
  canvas.addEventListener("pointermove", pickPlanet);
  canvas.addEventListener("pointerleave", () => {
    hoveredPlanet = null;
    canvas.style.cursor = "default";
  });
  canvas.addEventListener("click", () => {
    if (hoveredPlanet) {
      focusPlanet(hoveredPlanet.userData.index);
    }
  });

  window.addEventListener("resize", setRendererSize);

  camera.position.set(0, 4.2, 9.2);
  targetCamera.copy(camera.position);
  currentLookAt.set(0, 0, 0);
  focusPlanet(0);
  setRendererSize();

  function animate(time) {
    const seconds = time * 0.001;

    sun.rotation.y += 0.006;
    stars.rotation.y += 0.00035;
    orbitGroup.rotation.y += 0.00045;

    planetMeshes.forEach((mesh, index) => {
      const isActive = index === activeIndex;
      const isHovered = mesh === hoveredPlanet;
      const base = mesh.userData.basePosition;
      const float = Math.sin(seconds * 1.4 + index) * 0.08;
      const targetScale = isActive ? 1.34 : isHovered ? 1.14 : 1;

      mesh.position.y = float;
      mesh.rotation.y += 0.006 + index * 0.0008;
      mesh.children.forEach((child) => {
        if (child.userData.rotationSpeed) {
          child.rotation.y += child.userData.rotationSpeed;
        }
      });
      mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);
      mesh.material.emissiveIntensity = THREE.MathUtils.lerp(
        mesh.material.emissiveIntensity,
        isActive ? 0.46 : isHovered ? 0.28 : 0.13,
        0.08
      );

      if (!isActive) {
        mesh.position.x = THREE.MathUtils.lerp(mesh.position.x, base.x, 0.03);
        mesh.position.z = THREE.MathUtils.lerp(mesh.position.z, base.z, 0.03);
      }
    });

    camera.position.lerp(targetCamera, 0.045);
    currentLookAt.lerp(targetLookAt, 0.07);
    camera.lookAt(currentLookAt);

    renderer.render(scene, camera);
  }

  renderer.setAnimationLoop(animate);
}
