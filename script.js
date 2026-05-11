const menuToggle = document.querySelector("[data-menu-toggle]");
const mobilePanel = document.querySelector("[data-mobile-panel]");
const reveals = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll("[data-counter]");
const filterButtons = document.querySelectorAll("[data-filter]");
const projectCards = document.querySelectorAll("[data-category]");
const planets = document.querySelectorAll("[data-planet]");
const planetLabel = document.querySelector("[data-planet-label]");
const planetPhrase = document.querySelector("[data-planet-phrase]");
const serviceRows = document.querySelectorAll("[data-service]");
const servicePreview = document.querySelector("[data-service-preview]");
const contactForm = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector("[data-form-status]");
const tiltCard = document.querySelector("[data-tilt]");
const heroMedia = document.querySelector(".hero-media");
const techCloud = document.querySelector(".tech-cloud");
const techChips = document.querySelectorAll(".tech-cloud span");
const projectModal = document.querySelector("[data-project-modal]");
const modalClose = document.querySelector("[data-modal-close]");
const modalMedia = document.querySelector("[data-modal-media]");
const modalType = document.querySelector("[data-modal-type]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalDescription = document.querySelector("[data-modal-description]");
const modalTools = document.querySelector("[data-modal-tools]");
const photoGallery = document.querySelector("[data-photo-gallery]");
const canvas = document.querySelector("#ambientCanvas");
const context = canvas.getContext("2d");

const services = {
  strategy: {
    label: "System architecture",
    title: "Practical systems with clean flows and measurable outcomes.",
    body: "Frontend, backend, records, dashboards, and interaction work connect into one reliable build path."
  },
  design: {
    label: "Analytics signal",
    title: "Turn activity into insight people can act on.",
    body: "Dashboards, events, and performance views reveal the signals that show where the experience can improve."
  },
  build: {
    label: "Frontend launch",
    title: "Build a fast website with clean frontend code.",
    body: "The final site is responsive, accessible, and tuned so every screen feels ready for real use."
  }
};

const planetMessages = {
  systems: {
    label: "Systems",
    phrase: "Efficient, secure, and user-friendly systems."
  },
  security: {
    label: "RBAC",
    phrase: "Controlled access for administrators, staff, and barangay personnel."
  },
  analytics: {
    label: "Data",
    phrase: "Clear records, organized documents, dashboards, and practical reporting."
  },
  growth: {
    label: "Growth",
    phrase: "Adaptable, detail-oriented, and committed to continuous learning."
  }
};

const projects = {
  mahika: {
    number: "05",
    type: "Web Project",
    title: "Mahika",
    description: "A modern web experience built for clear presentation, smooth navigation, and responsive use.",
    tools: ["HTML", "CSS", "JS", "Responsive UI"],
    mediaClass: "media-a",
    photos: [
      "Mahika admin login section for secure administrator authentication and access to the system.",
      "Employee login section for secure authentication and access to the employee portal.",
      "Product listing and ordering section for employees or cashiers to browse items, add them to an order, and process sales transactions.",
      "Product invoice section that displays selected item details, calculates the total amount, and provides checkout confirmation.",
      "Admin dashboard displaying top-selling products and sales performance insights.",
      "Employee management section for viewing the employee list and managing user accounts.",
      "duct management section for adding, updating, viewing, and organizing the product list."
    ]
  },
  "spartan-commerce": {
    number: "04",
    type: "E-commerce",
    title: "Spartan Commerce",
    description: "An online commerce project focused on product browsing, transactions, and business-ready shopping flow.",
    tools: ["PHP", "SQL", "Bootstrap", "Commerce"],
    mediaClass: "media-b",
    photos: [
      "Spartan Commerce home landing page featuring a hero section that introduces the platform and highlights its key offerings.",
      "Spartan Commerce category section for browsing products by category.",
      "Spartan Commerce main shopping section for browsing and purchasing products."
    ]
  },
  scholarship: {
    number: "02",
    type: "Management System",
    title: "Scholarship Management System",
    description: "A system for organizing scholarship records, applicants, status tracking, and administrative workflows.",
    tools: ["Laravel", "PHP", "SQL", "Admin System"],
    mediaClass: "media-c",
    photos: [
      "Login or user access screen.",
      "Sign-up page for creating an account.",
      "Home dashboard displaying scholar distribution by grantor.",
      "Home section that allows editing of semester and school year settings.",
      "Home section for editing the grantor name.",
      "Search section for finding grantee details and status.",
      "Add new grantee section for registering a new grantee and their details.",
      "Search function in the edit section to locate records for editing.",
      "Edit target grantee section for updating selected grantee information.",
      "Search function to identify which grantee record to delete.",
      "Export section for generating data files in Excel, CSV, or PDF formats.",
      "View section for displaying grantees based on their respective grantors."
    ]
  },
  webxr: {
    number: "03",
    type: "WebXR Research",
    title: "WebXR Haptics Gloves",
    description: "An immersive interaction project exploring WebXR experiences and haptic glove feedback.",
    tools: ["WebXR", "JS", "Research", "Haptics"],
    mediaClass: "media-d",
    photos: [
      "WebXR scene or environment Home preview.",
      "WebXR developer section.",
      "WebXR environment for simulation and immersive 3D visualization."
    ]
  },
  migrant: {
    number: "01",
    type: "Information System",
    title: "Migrant System",
    description: "A web-based system for managing migrant-related records, data organization, and reporting needs.",
    tools: ["PHP", "SQL", "Power BI", "Reporting"],
    mediaClass: "media-e",
    photos: [
      "Login or access screen.",
      "LGU migrant records dashboard.",
      "Migrant profile or information form.",
      "The LGU admin can view municipal migrant records per barangay.",
      "Generate migration Excel export per month.",
      "Summary statistics per year and per barangay.",
      "Account Management section for granting or denying access. ",
      "Barangay Migrant Officer management area.",
      "The barangay officer can only view the migrants in their designated barangay.",
      "The migrant officer can export migration data to Excel only for their designated barangay."
    ]
  }
};

function makePhotoSlots(projectSlug, descriptions, filenames) {
  return descriptions.map((description, index) => {
    const number = String(index + 1).padStart(2, "0");
    const filename = filenames[index];

    return {
      number,
      description,
      src: `assets/projects/${projectSlug}/${filename}`
    };
  });
}

projects.mahika.photos = makePhotoSlots("mahika", projects.mahika.photos, ["1.png", "2.png", "3.png", "4.png", "5.png", "6.png", "7.png"]);
projects["spartan-commerce"].photos = makePhotoSlots("spartan-commerce", projects["spartan-commerce"].photos, ["s1.png", "s2.png", "s3.png"]);
projects.scholarship.photos = makePhotoSlots("scholarship", projects.scholarship.photos, ["1.png", "2.png", "3.png", "4.png", "5.png", "6.png", "7.png", "8.png", "9.png", "10.png", "11.png", "12.png"]);
projects.webxr.photos = makePhotoSlots("webxr", projects.webxr.photos, ["1.png", "2.png", "3.png"]);
projects.migrant.photos = makePhotoSlots("migrant", projects.migrant.photos, ["1.png", "2.png", "3.png", "4.png", "5.png", "6.png", "7.png", "8.png", "9.png", "10.png"]);

let particles = [];
let hasCounted = false;
let pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let activeProject = null;
let activePhotoIndex = 0;

function animateCounter(counter) {
  const target = Number(counter.dataset.counter);
  const duration = 1100;
  const start = performance.now();

  function frame(time) {
    const progress = Math.min((time - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    counter.textContent = Math.round(target * eased);

    if (progress < 1) {
      requestAnimationFrame(frame);
    } else if (target === 99) {
      counter.textContent = "99+";
    }
  }

  requestAnimationFrame(frame);
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    entry.target.classList.add("visible");

    if (entry.target.classList.contains("stats-strip") && !hasCounted) {
      hasCounted = true;
      counters.forEach(animateCounter);
    }
  });
}, { threshold: 0.18 });

reveals.forEach((element) => revealObserver.observe(element));

menuToggle.addEventListener("click", () => {
  mobilePanel.classList.toggle("open");
  document.body.classList.toggle("menu-open", mobilePanel.classList.contains("open"));
});

mobilePanel.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobilePanel.classList.remove("open");
    document.body.classList.remove("menu-open");
  });
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    projectCards.forEach((card) => {
      card.classList.toggle("is-hidden", filter !== "all" && card.dataset.category !== filter);
    });
  });
});

planets.forEach((planet) => {
  planet.addEventListener("click", () => {
    const message = planetMessages[planet.dataset.planet];
    if (!message) return;

    planets.forEach((item) => item.classList.remove("active"));
    planet.classList.add("active");

    if (planetLabel && planetPhrase) {
      planetLabel.textContent = message.label;
      planetPhrase.textContent = message.phrase;
    }
  });
});

projectCards.forEach((card) => {
  card.addEventListener("click", () => {
    const project = projects[card.dataset.project];
    if (!project || !projectModal) return;

    activeProject = project;
    activePhotoIndex = 0;
    modalType.textContent = project.type;
    modalTitle.textContent = project.title;
    modalTools.innerHTML = project.tools.map((tool) => `<span>${tool}</span>`).join("");
    renderProjectPhoto();
    projectModal.showModal();
  });
});

function renderProjectPhoto() {
  if (!activeProject) return;

  const photo = activeProject.photos[activePhotoIndex];
  const hasPrevious = activePhotoIndex > 0;
  const hasNext = activePhotoIndex < activeProject.photos.length - 1;

  modalDescription.textContent = photo.description;
  modalMedia.className = `modal-media ${activeProject.mediaClass}`;
  modalMedia.innerHTML = `
    <img src="${photo.src}" alt="${activeProject.title} screenshot ${photo.number}">
    ${hasPrevious ? `<button class="modal-nav prev" type="button" data-photo-index="${activePhotoIndex - 1}" aria-label="Previous image" title="Previous image">‹</button>` : ""}
    ${hasNext ? `<button class="modal-nav next" type="button" data-photo-index="${activePhotoIndex + 1}" aria-label="Next image" title="Next image">›</button>` : ""}
  `;

  photoGallery.innerHTML = "";
}

projectModal.addEventListener("click", (event) => {
  const target = event.target.closest("[data-photo-index]");
  if (!target || !activeProject) return;

  activePhotoIndex = Number(target.dataset.photoIndex);
  renderProjectPhoto();
});

if (modalClose && projectModal) {
  modalClose.addEventListener("click", () => projectModal.close());

  projectModal.addEventListener("click", (event) => {
    if (event.target === projectModal) {
      projectModal.close();
    }
  });
}

serviceRows.forEach((row) => {
  row.addEventListener("click", () => {
    const service = services[row.dataset.service];

    serviceRows.forEach((item) => item.classList.remove("active"));
    row.classList.add("active");

    servicePreview.innerHTML = `
      <p>${service.label}</p>
      <h3>${service.title}</h3>
      <span>${service.body}</span>
    `;
  });
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(contactForm);
  const name = data.get("name").trim();
  const email = data.get("email").trim();
  const type = data.get("type");
  const message = data.get("message").trim();
  const subject = encodeURIComponent(`Project inquiry from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nProject type: ${type}\n\n${message}`);

  formStatus.textContent = "Opening your email app with a ready-to-send draft.";
  window.location.href = `mailto:jhonchesterguijoba186@gmail.com?subject=${subject}&body=${body}`;
});

if (tiltCard) {
  tiltCard.addEventListener("pointermove", (event) => {
    const rect = tiltCard.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    tiltCard.style.transform = `rotateX(${y * -8}deg) rotateY(${x * 10}deg) translateY(-4px)`;
  });

  tiltCard.addEventListener("pointerleave", () => {
    tiltCard.style.transform = "rotateX(0deg) rotateY(0deg) translateY(0)";
  });
}

projectCards.forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    card.style.setProperty("--card-x", `${x}%`);
    card.style.setProperty("--card-y", `${y}%`);
  });
});

if (techCloud && heroMedia) {
  let techCloudFrame = null;

  function moveTechChipsAway(pointerX, pointerY) {
    techChips.forEach((chip) => {
      const rect = chip.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = centerX - pointerX;
      const dy = centerY - pointerY;
      const distance = Math.hypot(dx, dy);
      const radius = 175;

      if (distance < radius) {
        const force = Math.pow((radius - distance) / radius, 1.35);
        const angle = Math.atan2(dy, dx);
        const move = force * 64;

        chip.style.setProperty("--repel-x", `${Math.cos(angle) * move}px`);
        chip.style.setProperty("--repel-y", `${Math.sin(angle) * move}px`);
      } else {
        chip.style.setProperty("--repel-x", "0px");
        chip.style.setProperty("--repel-y", "0px");
      }
    });
  }

  heroMedia.addEventListener("pointermove", (event) => {
    const pointerX = event.clientX;
    const pointerY = event.clientY;

    if (techCloudFrame) {
      cancelAnimationFrame(techCloudFrame);
    }

    techCloudFrame = requestAnimationFrame(() => {
      moveTechChipsAway(pointerX, pointerY);
      techCloudFrame = null;
    });
  });

  heroMedia.addEventListener("pointerleave", () => {
    if (techCloudFrame) {
      cancelAnimationFrame(techCloudFrame);
      techCloudFrame = null;
    }

    techChips.forEach((chip) => {
      chip.style.setProperty("--repel-x", "0px");
      chip.style.setProperty("--repel-y", "0px");
    });
  });
}

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.floor(window.innerWidth * ratio);
  canvas.height = Math.floor(window.innerHeight * ratio);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);

  particles = Array.from({ length: Math.min(90, Math.floor(window.innerWidth / 18)) }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.42,
    vy: (Math.random() - 0.5) * 0.42,
    size: Math.random() * 2 + 0.8
  }));
}

function drawParticles() {
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);

  particles.forEach((particle, index) => {
    particle.x += particle.vx;
    particle.y += particle.vy;

    if (particle.x < 0 || particle.x > window.innerWidth) particle.vx *= -1;
    if (particle.y < 0 || particle.y > window.innerHeight) particle.vy *= -1;

    const dx = pointer.x - particle.x;
    const dy = pointer.y - particle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 130) {
      particle.x -= dx * 0.004;
      particle.y -= dy * 0.004;
    }

    context.beginPath();
    context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    context.fillStyle = index % 3 === 0 ? "rgba(85, 214, 190, 0.8)" : "rgba(255, 184, 107, 0.58)";
    context.fill();

    particles.slice(index + 1).forEach((other) => {
      const lineDx = other.x - particle.x;
      const lineDy = other.y - particle.y;
      const lineDistance = Math.sqrt(lineDx * lineDx + lineDy * lineDy);

      if (lineDistance < 105) {
        context.beginPath();
        context.moveTo(particle.x, particle.y);
        context.lineTo(other.x, other.y);
        context.strokeStyle = `rgba(245, 242, 234, ${0.12 - lineDistance / 1000})`;
        context.stroke();
      }
    });
  });

  requestAnimationFrame(drawParticles);
}

window.addEventListener("pointermove", (event) => {
  pointer = { x: event.clientX, y: event.clientY };
});

window.addEventListener("resize", resizeCanvas);

resizeCanvas();
drawParticles();
