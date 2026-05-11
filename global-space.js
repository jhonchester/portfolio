import * as THREE from "https://unpkg.com/three@0.183.2/build/three.module.js";

const canvas = document.querySelector("#spaceCanvas");

if (canvas) {
  const textureBase = "assets/planet textures/";
  const sectionOrder = ["hero", "about", "skills", "projects", "process", "contact"];
  const sectionFocus = {
    hero: "sun",
    about: "sun",
    skills: "mercury",
    projects: "neptune",
    process: "mars",
    contact: "uranus"
  };
  const planetConfigs = [
    {
      key: "mercury",
      texture: `${textureBase}2k_mercury.jpg`,
      color: 0x9db3c9,
      atmosphere: 0x8fb4ff,
      radius: 3.8,
      size: 0.42,
      speed: 0.62,
      section: "skills",
      mechanical: true
    },
    {
      key: "venus",
      texture: `${textureBase}2k_venus_surface.jpg`,
      color: 0xffb86b,
      atmosphere: 0xffd49b,
      radius: 5.1,
      size: 0.62,
      speed: 0.46
    },
    {
      key: "earth",
      texture: `${textureBase}2k_earth_daymap.jpg`,
      night: `${textureBase}2k_earth_nightmap.jpg`,
      color: 0x55d6ff,
      atmosphere: 0x55d6ff,
      radius: 6.7,
      size: 0.66,
      speed: 0.36,
      moon: true
    },
    {
      key: "mars",
      texture: `${textureBase}2k_mars.jpg`,
      color: 0xff7a66,
      atmosphere: 0xff8b6d,
      radius: 8.35,
      size: 0.54,
      speed: 0.29,
      section: "process",
      moons: 2
    },
    {
      key: "jupiter",
      texture: `${textureBase}2k_jupiter.jpg`,
      color: 0xffb86b,
      atmosphere: 0xffcc8e,
      radius: 10.65,
      size: 1.28,
      speed: 0.2,
      moons: 4
    },
    {
      key: "saturn",
      texture: `${textureBase}2k_saturn.jpg`,
      ring: `${textureBase}2k_saturn_ring_alpha.png`,
      color: 0xf0c879,
      atmosphere: 0xffdf9d,
      radius: 13.2,
      size: 1.08,
      speed: 0.16,
      moons: 3
    },
    {
      key: "uranus",
      texture: `${textureBase}2k_uranus.jpg`,
      color: 0x55d6be,
      atmosphere: 0x9df8e9,
      radius: 15.45,
      size: 0.86,
      speed: 0.12,
      section: "contact",
      rings: true
    },
    {
      key: "neptune",
      texture: `${textureBase}2k_neptune.jpg`,
      color: 0x8f5cff,
      atmosphere: 0xa58cff,
      radius: 17.45,
      size: 0.88,
      speed: 0.1,
      section: "projects",
      cyber: true
    }
  ];

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.matchMedia("(max-width: 720px)").matches;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(43, window.innerWidth / window.innerHeight, 0.1, 120);
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: !isMobile,
    powerPreference: "high-performance"
  });
  const loader = new THREE.TextureLoader();
  const solarSystem = new THREE.Group();
  const orbitPlane = new THREE.Group();
  const planetMap = new Map();
  const hoverState = new Map();
  const pointer = new THREE.Vector2();
  const pointerEase = new THREE.Vector2();
  const targetCamera = new THREE.Vector3();
  const targetLook = new THREE.Vector3();
  const currentLook = new THREE.Vector3();
  const activeObjectPosition = new THREE.Vector3();
  const sunPosition = new THREE.Vector3(0, 0, 0);

  let activeSection = "hero";
  let scrollVelocity = 0;
  let scrollProgress = 0;
  let lastScrollY = window.scrollY;

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  scene.add(solarSystem);
  solarSystem.add(orbitPlane);

  scene.add(new THREE.AmbientLight(0x8fa6ff, 0.38));

  const sunLight = new THREE.PointLight(0xffe0ac, 12, 72);
  sunLight.position.copy(sunPosition);
  const rimLight = new THREE.DirectionalLight(0x78dcff, 2.2);
  rimLight.position.set(-6, 6, 8);
  scene.add(sunLight, rimLight);

  function loadTexture(url, onLoad) {
    loader.load(
      url,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = 8;
        onLoad(texture);
      },
      undefined,
      () => {}
    );
  }

  function makeAtmosphere(radius, color, strength = 0.75) {
    return new THREE.Mesh(
      new THREE.SphereGeometry(radius, 64, 64),
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        uniforms: {
          glowColor: { value: new THREE.Color(color) },
          strength: { value: strength }
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
          uniform float strength;
          varying vec3 vNormal;
          void main() {
            float rim = pow(0.72 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
            gl_FragColor = vec4(glowColor, rim * strength);
          }
        `
      })
    );
  }

  function makeSoftRing(color) {
    const ringCanvas = document.createElement("canvas");
    ringCanvas.width = 512;
    ringCanvas.height = 64;
    const ctx = ringCanvas.getContext("2d");
    const hex = `#${color.toString(16).padStart(6, "0")}`;
    const gradient = ctx.createLinearGradient(0, 0, 512, 0);
    gradient.addColorStop(0, "rgba(255,255,255,0)");
    gradient.addColorStop(0.2, `${hex}44`);
    gradient.addColorStop(0.48, "rgba(255,255,255,0.2)");
    gradient.addColorStop(0.72, `${hex}66`);
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 64);

    const texture = new THREE.CanvasTexture(ringCanvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  function makeParticleOrbit(count, radius, color) {
    const group = new THREE.Group();
    const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.78 });

    for (let index = 0; index < count; index += 1) {
      const dot = new THREE.Mesh(new THREE.SphereGeometry(index % 6 === 0 ? 0.035 : 0.018, 8, 8), material);
      const angle = (index / count) * Math.PI * 2;
      dot.userData = {
        angle,
        radius,
        speed: 0.1 + (index % 8) * 0.012
      };
      dot.position.set(Math.cos(angle) * radius, Math.sin(angle * 1.7) * 0.08, Math.sin(angle) * radius);
      group.add(dot);
    }

    group.userData.particleOrbit = true;
    return group;
  }

  function makeMoon(distance, size, speed, phase) {
    const pivot = new THREE.Group();
    const moon = new THREE.Mesh(
      new THREE.SphereGeometry(size, 20, 20),
      new THREE.MeshStandardMaterial({
        color: 0xdfe8ff,
        roughness: 0.75,
        emissive: 0x7e9cff,
        emissiveIntensity: 0.04
      })
    );
    moon.position.x = distance;
    pivot.userData = { moonOrbit: true, speed, phase };
    pivot.add(moon);
    return pivot;
  }

  const sunMaterial = new THREE.MeshStandardMaterial({
    color: 0xffb86b,
    emissive: 0xff8a1f,
    emissiveIntensity: 2.4,
    roughness: 0.38
  });
  loadTexture(`${textureBase}2k_sun.jpg`, (texture) => {
    sunMaterial.map = texture;
    sunMaterial.emissiveMap = texture;
    sunMaterial.needsUpdate = true;
  });

  const sun = new THREE.Mesh(new THREE.SphereGeometry(1.45, 80, 80), sunMaterial);
  sun.userData = { key: "sun", baseSize: 1.45 };
  orbitPlane.add(sun);

  const sunGlow = makeAtmosphere(1.82, 0xffb86b, 1.05);
  sun.add(sunGlow);
  const corona = makeParticleOrbit(110, 2.12, 0xffc06b);
  sun.add(corona);

  const galaxy = new THREE.Mesh(
    new THREE.SphereGeometry(60, 64, 64),
    new THREE.MeshBasicMaterial({
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.48
    })
  );
  loadTexture(`${textureBase}2k_stars_milky_way.jpg`, (texture) => {
    galaxy.material.map = texture;
    galaxy.material.needsUpdate = true;
  });
  scene.add(galaxy);

  planetConfigs.forEach((config, index) => {
    const pivot = new THREE.Group();
    pivot.rotation.y = index * 0.72;
    pivot.userData = {
      baseAngle: index * 0.72,
      speed: config.speed,
      radius: config.radius
    };
    orbitPlane.add(pivot);

    const orbit = new THREE.Mesh(
      new THREE.RingGeometry(config.radius - 0.008, config.radius + 0.008, 192),
      new THREE.MeshBasicMaterial({
        color: 0xdfe8ff,
        transparent: true,
        opacity: index % 2 === 0 ? 0.13 : 0.08,
        side: THREE.DoubleSide,
        depthWrite: false
      })
    );
    orbit.rotation.x = Math.PI / 2;
    orbitPlane.add(orbit);

    const group = new THREE.Group();
    group.position.x = config.radius;
    pivot.add(group);

    const material = new THREE.MeshStandardMaterial({
      color: config.color,
      emissive: config.color,
      emissiveIntensity: config.cyber ? 0.28 : 0.12,
      roughness: config.mechanical ? 0.32 : 0.6,
      metalness: config.mechanical || config.cyber ? 0.26 : 0.03
    });

    loadTexture(config.texture, (texture) => {
      material.map = texture;
      material.needsUpdate = true;
    });

    if (config.night) {
      loadTexture(config.night, (texture) => {
        material.emissiveMap = texture;
        material.emissive = new THREE.Color(0x78dcff);
        material.emissiveIntensity = 0.34;
        material.needsUpdate = true;
      });
    }

    const planet = new THREE.Mesh(new THREE.SphereGeometry(config.size, 64, 64), material);
    planet.userData = {
      key: config.key,
      rotationSpeed: 0.0022 + index * 0.00045
    };
    group.add(planet);
    group.add(makeAtmosphere(config.size * 1.1, config.atmosphere, 0.56));

    if (config.ring || config.rings) {
      const ringMaterial = new THREE.MeshBasicMaterial({
        map: makeSoftRing(config.color),
        transparent: true,
        opacity: 0.64,
        side: THREE.DoubleSide,
        depthWrite: false
      });

      if (config.ring) {
        loadTexture(config.ring, (texture) => {
          ringMaterial.map = texture;
          ringMaterial.needsUpdate = true;
        });
      }

      const ring = new THREE.Mesh(
        new THREE.RingGeometry(config.size * 1.35, config.size * 2.08, 160),
        ringMaterial
      );
      ring.rotation.x = Math.PI * 0.6;
      ring.rotation.z = 0.2;
      group.add(ring);
    }

    if (config.mechanical) {
      const wire = new THREE.Mesh(
        new THREE.IcosahedronGeometry(config.size * 1.14, 2),
        new THREE.MeshBasicMaterial({
          color: config.atmosphere,
          wireframe: true,
          transparent: true,
          opacity: 0.22
        })
      );
      wire.userData.wire = true;
      group.add(wire);
      group.add(makeParticleOrbit(42, config.size * 1.95, config.atmosphere));
    }

    if (config.cyber) {
      group.add(makeParticleOrbit(72, config.size * 2.05, config.atmosphere));
    }

    const moonCount = config.moons || (config.moon ? 1 : 0);
    for (let moonIndex = 0; moonIndex < moonCount; moonIndex += 1) {
      group.add(makeMoon(
        config.size * (1.65 + moonIndex * 0.28),
        0.055 + moonIndex * 0.012,
        0.52 + moonIndex * 0.18,
        moonIndex * 1.5
      ));
    }

    planetMap.set(config.key, { pivot, group, planet, config });
    hoverState.set(config.section || config.key, 0);
  });

  const starGeometry = new THREE.BufferGeometry();
  const starCount = isMobile ? 850 : 1700;
  const starPositions = [];
  const starColors = [];
  const palette = [
    new THREE.Color(0xf5f2ea),
    new THREE.Color(0x9edfff),
    new THREE.Color(0xa58cff),
    new THREE.Color(0xffd2a1)
  ];

  for (let i = 0; i < starCount; i += 1) {
    starPositions.push(
      (Math.random() - 0.5) * 70,
      (Math.random() - 0.5) * 42,
      (Math.random() - 0.5) * 70
    );
    const color = palette[i % palette.length];
    starColors.push(color.r, color.g, color.b);
  }

  starGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starPositions, 3));
  starGeometry.setAttribute("color", new THREE.Float32BufferAttribute(starColors, 3));
  const stars = new THREE.Points(
    starGeometry,
    new THREE.PointsMaterial({
      size: 0.026,
      vertexColors: true,
      transparent: true,
      opacity: 0.78,
      depthWrite: false
    })
  );
  scene.add(stars);

  const nebula = new THREE.Mesh(
    new THREE.PlaneGeometry(54, 24),
    new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        time: { value: 0 },
        pointer: { value: new THREE.Vector2() }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform float time;
        uniform vec2 pointer;
        float wave(vec2 p, float s) {
          return sin(p.x * s + time * 0.16) * cos(p.y * (s * 0.68) - time * 0.13);
        }
        void main() {
          vec2 p = vUv - 0.5 + pointer * 0.025;
          float mist = wave(p, 6.0) + wave(p + 0.18, 12.0) * 0.5;
          float glow = smoothstep(0.72, 0.04, length(p * vec2(1.2, 0.7)));
          vec3 color = mix(vec3(0.08, 0.16, 0.42), vec3(0.32, 0.88, 0.78), mist * 0.5 + 0.5);
          color = mix(color, vec3(0.58, 0.34, 1.0), smoothstep(0.2, 0.9, p.x + p.y + 0.55));
          gl_FragColor = vec4(color, glow * 0.16);
        }
      `
    })
  );
  nebula.position.set(0, 0, -24);
  scene.add(nebula);

  function getPageProgress() {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    return THREE.MathUtils.clamp(window.scrollY / maxScroll, 0, 1);
  }

  function setActiveSection(section) {
    activeSection = sectionOrder.includes(section) ? section : "hero";
    document.body.dataset.activePlanet = activeSection;
  }

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 1.8);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(ratio);
    renderer.setSize(window.innerWidth, window.innerHeight, false);
  }

  const sectionObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visible?.target?.dataset.cosmicSection) {
      setActiveSection(visible.target.dataset.cosmicSection);
    }
  }, {
    rootMargin: "-30% 0px -36% 0px",
    threshold: [0.16, 0.32, 0.48, 0.64]
  });

  document.querySelectorAll("[data-cosmic-section]").forEach((section) => sectionObserver.observe(section));

  document.querySelectorAll("[data-planet-hover]").forEach((element) => {
    const key = element.dataset.planetHover;
    element.addEventListener("pointerenter", () => hoverState.set(key, 1));
    element.addEventListener("pointerleave", () => hoverState.set(key, 0));
    element.addEventListener("focusin", () => hoverState.set(key, 1));
    element.addEventListener("focusout", () => hoverState.set(key, 0));
  });

  window.addEventListener("pointermove", (event) => {
    pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
    pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  window.addEventListener("scroll", () => {
    const delta = window.scrollY - lastScrollY;
    scrollVelocity = THREE.MathUtils.clamp(delta * 0.005, -1.15, 1.15);
    lastScrollY = window.scrollY;
    scrollProgress = getPageProgress();
  }, { passive: true });

  window.addEventListener("resize", resize);

  scrollProgress = getPageProgress();
  resize();
  setActiveSection("hero");
  camera.position.set(0.2, 2.25, 9.6);
  targetCamera.copy(camera.position);
  targetLook.set(0, 0, 0);
  currentLook.copy(targetLook);

  function updateCameraTarget() {
    const focusKey = sectionFocus[activeSection] || "sun";
    const active = focusKey === "sun" ? null : planetMap.get(focusKey);
    const sectionIndex = Math.max(0, sectionOrder.indexOf(activeSection));
    const mobilePullback = isMobile ? 2.1 : 0;

    if (active) {
      active.group.getWorldPosition(activeObjectPosition);
    } else {
      activeObjectPosition.copy(sunPosition);
    }

    const travelY = THREE.MathUtils.lerp(1.35, -5.85, scrollProgress);
    const side = sectionIndex % 2 === 0 ? 1 : -1;
    const distance = focusKey === "sun" ? 8.7 + mobilePullback : 7.2 + mobilePullback;
    const height = focusKey === "sun" ? 2.15 : 1.45;

    targetLook.copy(activeObjectPosition).add(new THREE.Vector3(0, focusKey === "sun" ? 0.05 : 0.12, 0));
    targetCamera.set(
      activeObjectPosition.x + side * (1.85 + pointerEase.x * 0.4),
      activeObjectPosition.y + height + travelY * 0.15,
      activeObjectPosition.z + distance
    );
  }

  function animate() {
    const elapsed = performance.now() * 0.001;
    const orbitTime = prefersReducedMotion ? scrollProgress * Math.PI * 2 : elapsed * 0.18 + scrollProgress * Math.PI * 2.35;
    const cameraEase = prefersReducedMotion ? 0.12 : 0.045;
    const lookEase = prefersReducedMotion ? 0.14 : 0.06;

    pointerEase.lerp(pointer, 0.06);
    scrollVelocity = THREE.MathUtils.lerp(scrollVelocity, 0, 0.06);

    nebula.material.uniforms.time.value = elapsed;
    nebula.material.uniforms.pointer.value.copy(pointerEase);
    stars.rotation.y = elapsed * 0.006 + pointerEase.x * 0.015;
    stars.rotation.x = pointerEase.y * 0.01;
    galaxy.rotation.y = elapsed * 0.004;

    solarSystem.position.y = THREE.MathUtils.lerp(1.2, -6.2, scrollProgress) + scrollVelocity * 0.16;
    solarSystem.rotation.x = -0.58 + pointerEase.y * -0.022;
    solarSystem.rotation.z = 0.1 + pointerEase.x * 0.028 + scrollVelocity * 0.018;

    sun.rotation.y += prefersReducedMotion ? 0.0004 : 0.0026;
    const sunTargetScale = activeSection === "hero" || activeSection === "about" ? 1.18 : 0.74;
    sun.scale.lerp(new THREE.Vector3(sunTargetScale, sunTargetScale, sunTargetScale), 0.045);
    sun.material.emissiveIntensity = THREE.MathUtils.lerp(
      sun.material.emissiveIntensity,
      activeSection === "hero" || activeSection === "about" ? 2.85 : 2.15,
      0.05
    );

    planetMap.forEach(({ pivot, group, planet, config }, key) => {
      const hover = hoverState.get(config.section || key) || 0;
      const isActive = sectionFocus[activeSection] === key;
      const targetScale = isActive ? 1.48 + hover * 0.12 : 1 + hover * 0.08;

      pivot.rotation.y = pivot.userData.baseAngle + orbitTime * config.speed;
      group.position.y = Math.sin(elapsed * 0.62 + config.radius) * 0.16 + scrollVelocity * 0.1;
      group.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.055);
      planet.rotation.y += prefersReducedMotion ? 0.00035 : planet.userData.rotationSpeed + hover * 0.0012;
      planet.rotation.x = Math.sin(elapsed * 0.22 + config.radius) * 0.035;
      planet.material.emissiveIntensity = THREE.MathUtils.lerp(
        planet.material.emissiveIntensity,
        (config.cyber ? 0.28 : 0.12) + (isActive ? 0.18 : 0) + hover * 0.18,
        0.06
      );

      group.children.forEach((child) => {
        if (child.userData.wire) {
          child.rotation.y -= 0.003;
          child.rotation.z += 0.002;
        }

        if (child.userData.particleOrbit) {
          child.rotation.y += 0.002 + hover * 0.001;
          child.children.forEach((dot) => {
            const angle = dot.userData.angle + elapsed * dot.userData.speed;
            dot.position.x = Math.cos(angle) * dot.userData.radius;
            dot.position.z = Math.sin(angle) * dot.userData.radius;
            dot.position.y = Math.sin(angle * 1.7) * 0.08;
          });
        }

        if (child.userData.moonOrbit) {
          child.rotation.y = child.userData.phase + elapsed * child.userData.speed;
        }
      });
    });

    updateCameraTarget();
    const parallax = new THREE.Vector3(pointerEase.x * 0.28, pointerEase.y * -0.2, scrollVelocity * 0.3);
    camera.position.lerp(targetCamera.clone().add(parallax), cameraEase);
    currentLook.lerp(targetLook, lookEase);
    camera.lookAt(currentLook);

    renderer.render(scene, camera);
  }

  renderer.setAnimationLoop(animate);
}
