const content = window.siteContent;
const editStorageKey = "jessyPortfolioEditsV3";
const savedEdits = JSON.parse(localStorage.getItem(editStorageKey) || "{}");

document.querySelectorAll("[data-field]").forEach((node) => {
  const key = node.dataset.field;
  if (content[key]) node.textContent = content[key];
});

const tags = document.querySelector("#personalityTags");
if (tags) {
  content.personality.forEach((item) => {
    const tag = document.createElement("span");
    tag.textContent = item;
    tags.append(tag);
  });
}

const hotspotLayer = document.querySelector("#hotspotLayer");
if (hotspotLayer) {
  content.roomHotspots.forEach((spot) => {
    const button = document.createElement("button");
    button.className = "hotspot";
    button.type = "button";
    button.dataset.label = spot.label;
    button.style.left = `${spot.x}%`;
    button.style.top = `${spot.y}%`;
    button.setAttribute("aria-label", spot.title);
    hotspotLayer.append(button);
  });
}

const hero = document.querySelector(".hero");
const heroRoomImage = document.querySelector("#heroRoomImage");
const zoomIn = document.querySelector("#zoomIn");
const zoomOut = document.querySelector("#zoomOut");
const zoomReset = document.querySelector("#zoomReset");
let heroZoom = 1;

function setHeroZoom(nextZoom) {
  heroZoom = Math.min(1.28, Math.max(0.92, nextZoom));
  if (hero) hero.style.setProperty("--hero-zoom", heroZoom.toFixed(2));
  if (zoomReset) zoomReset.textContent = `${Math.round(heroZoom * 100)}%`;
}

if (heroRoomImage && hero) {
  setHeroZoom(0.92);
  zoomIn?.addEventListener("click", () => setHeroZoom(heroZoom + 0.08));
  zoomOut?.addEventListener("click", () => setHeroZoom(heroZoom - 0.08));
  zoomReset?.addEventListener("click", () => setHeroZoom(0.92));
  hero.addEventListener(
    "wheel",
    (event) => {
      if (Math.abs(event.deltaY) < 2) return;
      event.preventDefault();
      setHeroZoom(heroZoom + (event.deltaY > 0 ? -0.035 : 0.035));
    },
    { passive: false }
  );
}

const capabilityGrid = document.querySelector("#capabilityGrid");
if (capabilityGrid) {
  content.capabilityCards.forEach((item) => {
    const card = document.createElement("article");
    card.className = "capability-card";
    card.innerHTML = `
      <span>${item.number}</span>
      <small data-edit="capability-${item.number}-label">${item.label}</small>
      <h3 data-edit="capability-${item.number}-title">${item.title}</h3>
      <p data-edit="capability-${item.number}-meta">${item.meta}</p>
    `;
    capabilityGrid.append(card);
  });
}

const timeline = document.querySelector("#timeline");
content.timeline.forEach((item, index) => {
  const row = document.createElement("article");
  row.className = "timeline-item";
  row.dataset.index = String(index + 1).padStart(2, "0");
  const tags = (item.tags || [])
    .map((tag) => `<span data-edit="timeline-${index}-tag-${tag}">${tag}</span>`)
    .join("");
  const bullets = item.slides
    .map(
      (slide) => `
        <li data-edit="timeline-${index}-bullet-${slide.label}">${slide.text}</li>
      `
    )
    .join("");
  row.innerHTML = `
    <div class="timeline-meta">
      <div class="experience-heading">
        <div>
          <time>${item.year}</time>
          <h3 data-edit="timeline-${index}-title">${item.title}</h3>
          <strong data-edit="timeline-${index}-role">${item.role || ""}</strong>
        </div>
      </div>
      <p data-edit="timeline-${index}-text">${item.text}</p>
      <ul class="experience-points">${bullets}</ul>
      <div class="experience-tags">${tags}</div>
    </div>
  `;
  timeline.append(row);
});

const timelineItems = document.querySelectorAll(".timeline-item");
if ("IntersectionObserver" in window && timelineItems.length) {
  const timelineObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-active", entry.isIntersecting);
      });
    },
    {
      root: null,
      threshold: 0.52,
      rootMargin: "-18% 0px -18% 0px"
    }
  );

  timelineItems.forEach((item) => timelineObserver.observe(item));
}

const photoLightbox = document.querySelector("#photoLightbox");
const lightboxImage = photoLightbox?.querySelector("img");
const lightboxCaption = photoLightbox?.querySelector("figcaption");
const lightboxClose = photoLightbox?.querySelector(".photo-lightbox-close");

function openPhotoLightbox(src, caption) {
  if (!photoLightbox || !lightboxImage || !lightboxCaption) return;
  lightboxImage.src = src;
  lightboxImage.alt = caption;
  lightboxCaption.textContent = caption;
  photoLightbox.classList.add("is-open");
  photoLightbox.setAttribute("aria-hidden", "false");
}

function closePhotoLightbox() {
  if (!photoLightbox) return;
  photoLightbox.classList.remove("is-open");
  photoLightbox.setAttribute("aria-hidden", "true");
}

document.querySelectorAll(".about-photo-button").forEach((button) => {
  button.addEventListener("click", () => {
    const src = button.dataset.photo || "";
    const caption = button.dataset.caption || "Photo";
    openPhotoLightbox(src, caption);
  });
});

lightboxClose?.addEventListener("click", closePhotoLightbox);
photoLightbox?.addEventListener("click", (event) => {
  if (event.target === photoLightbox) closePhotoLightbox();
});
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closePhotoLightbox();
});

const educationList = document.querySelector("#educationList");
content.education.forEach((item) => {
  const card = document.createElement("article");
  card.className = `education-chapter education-${item.tone || "red"}`;
  const logoMarkup = item.logoImage
    ? `<img src="${item.logoImage}" alt="${item.school} logo" />`
    : item.logo;
  const tags = (item.tags || [])
    .map((tag) => `<span data-edit="education-${item.chapter}-tag-${tag}">${tag}</span>`)
    .join("");
  const images = item.images || [];
  const notes = item.notes || [];
  card.innerHTML = `
    <div class="education-copy">
      <span class="education-number">${item.chapter}</span>
      <p class="education-label" data-edit="education-${item.chapter}-label">${item.label}</p>
      <h3 data-edit="education-${item.chapter}-school">${item.school}</h3>
      <p class="education-location" data-edit="education-${item.chapter}-location">${item.location}</p>
      <blockquote data-edit="education-${item.chapter}-quote">${item.quote}</blockquote>
      <p class="education-story" data-edit="education-${item.chapter}-story">${item.story}</p>
      <div class="education-tags">${tags}</div>
    </div>
    <div class="education-collage" aria-label="${item.school} visual collage">
      <div class="education-logo" data-edit="education-${item.chapter}-logo">${logoMarkup}</div>
      <figure class="edu-photo edu-photo-main">
        <img src="${images[0] || "assets/about-reference-no-header.png"}" alt="${item.school} memory" />
        <figcaption>${notes[0] || item.school}</figcaption>
      </figure>
      <figure class="edu-photo edu-photo-small">
        <img src="${images[1] || images[0] || "assets/about-reference-no-header.png"}" alt="${item.school} place detail" />
        <figcaption>${notes[5] || "Good space"}</figcaption>
      </figure>
      <figure class="edu-photo edu-photo-wide">
        <img src="${images[2] || images[0] || "assets/about-reference-no-header.png"}" alt="${item.school} city memory" />
        <figcaption>${item.tone === "blue" ? "Ideas, People, Possibilities" : "More than a university"}</figcaption>
      </figure>
      <div class="edu-sticky">${notes.slice(2, 5).join("<br />")}</div>
    </div>
  `;
  educationList.append(card);
});

document.querySelectorAll(".edu-photo").forEach((figure) => {
  const image = figure.querySelector("img");
  const caption = figure.querySelector("figcaption")?.textContent?.trim() || image?.alt || "Photo";
  if (!image) return;
  figure.tabIndex = 0;
  figure.setAttribute("role", "button");
  figure.setAttribute("aria-label", `Open ${caption} photo`);
  const open = () => openPhotoLightbox(image.currentSrc || image.src, caption);
  figure.addEventListener("click", open);
  figure.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      open();
    }
  });
});

const educationChapters = document.querySelectorAll(".education-chapter");
if ("IntersectionObserver" in window && educationChapters.length) {
  const educationObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-visible", entry.isIntersecting);
      });
    },
    {
      threshold: 0.28,
      rootMargin: "-10% 0px -12% 0px"
    }
  );

  educationChapters.forEach((chapter) => educationObserver.observe(chapter));
}

const skillsList = document.querySelector("#skillsList");
if (skillsList) {
  content.skills.forEach((skill) => {
    const card = document.createElement("article");
    card.className = "credential-card";
    card.innerHTML = `
      <h3 data-edit="skill-${skill.group}-group">${skill.group}</h3>
      <p data-edit="skill-${skill.group}-items">${skill.items}</p>
    `;
    skillsList.append(card);
  });
}

const skillPopover = document.querySelector("#skillPopover");
const skillPopoverClose = skillPopover?.querySelector(".skill-popover-close");
const skillPopoverKicker = skillPopover?.querySelector("p");
const skillPopoverTitle = skillPopover?.querySelector("h3");
const skillPopoverTags = skillPopover?.querySelector("div");

function closeSkillPopover() {
  if (!skillPopover) return;
  skillPopover.classList.remove("is-open");
  skillPopover.setAttribute("aria-hidden", "true");
}

document.querySelectorAll(".skill-hotspot").forEach((button) => {
  button.addEventListener("click", () => {
    const skill = content.skills[Number(button.dataset.skillIndex || 0)];
    if (!skillPopover || !skill || !skillPopoverKicker || !skillPopoverTitle || !skillPopoverTags) return;
    const rect = button.getBoundingClientRect();
    skillPopoverKicker.textContent = "Skills / Capability Notes";
    skillPopoverTitle.textContent = skill.group;
    skillPopoverTags.innerHTML = skill.items
      .split(",")
      .map((item) => `<span>${item.trim()}</span>`)
      .join("");
    skillPopover.style.left = `${Math.min(window.innerWidth - 340, Math.max(18, rect.left + rect.width * 0.12))}px`;
    skillPopover.style.top = `${Math.min(window.innerHeight - 250, Math.max(88, rect.top + rect.height * 0.18))}px`;
    skillPopover.classList.add("is-open");
    skillPopover.setAttribute("aria-hidden", "false");
  });
});

skillPopoverClose?.addEventListener("click", closeSkillPopover);
document.addEventListener("click", (event) => {
  if (!skillPopover?.classList.contains("is-open")) return;
  const target = event.target;
  if (target instanceof Element && (target.closest("#skillPopover") || target.closest(".skill-hotspot"))) return;
  closeSkillPopover();
});

const interestsGrid = document.querySelector("#interestsGrid");
if (interestsGrid) {
  content.interests.forEach((interest, index) => {
    const card = document.createElement("article");
    card.className = "interest-card";
    card.innerHTML = `
      <span>${String(index + 1).padStart(2, "0")}</span>
      <h3 data-edit="interest-${index}-title">${interest.title}</h3>
      <p data-edit="interest-${index}-text">${interest.text}</p>
    `;
    interestsGrid.append(card);
  });
}

const projectGrid = document.querySelector("#projectGrid");
if (projectGrid) {
  content.projects.forEach((project) => {
    const card = document.createElement("article");
    card.className = "project-card";
    card.innerHTML = `
      <div class="project-band">
        <small data-edit="project-${project.title}-band-tag">${project.tag}</small>
        <strong data-edit="project-${project.title}-band-title">${project.title}</strong>
      </div>
      <div class="project-content">
        <img src="${project.image}" alt="${project.title}" />
        <div class="project-body">
          <span class="tag" data-edit="project-${project.title}-tag">${project.tag}</span>
          <h3 data-edit="project-${project.title}-title">${project.title}</h3>
          <p data-edit="project-${project.title}-text">${project.text}</p>
        </div>
      </div>
    `;
    projectGrid.append(card);
  });
}

const lifeCarouselItems = [
  {
    number: "01",
    title: "Travel",
    eyebrow: "EXPLORE",
    image: "assets/london-tower-bridge.jpg",
    text: "Exploring new places, cultures and perspectives.",
    subtitle: "A wider world, a braver me ♡"
  },
  {
    number: "02",
    title: "Photography",
    eyebrow: "CAPTURE",
    image: "assets/london-big-ben.jpg",
    text: "Capturing beautiful moments in ordinary days.",
    subtitle: "Same scenes, different stories ♡"
  },
  {
    number: "03",
    title: "Books",
    eyebrow: "READ",
    image: "assets/life-books.jpg",
    text: "A good book gives me a new way of seeing the world.",
    subtitle: "A quieter mind, a kinder me ♡"
  },
  {
    number: "04",
    title: "Food & Coffee",
    eyebrow: "TASTE",
    image: "assets/life-food-coffee.jpg",
    text: "Good food, great coffee and even better conversations.",
    subtitle: "Good food. Good mood ♡"
  },
  {
    number: "05",
    title: "Pets",
    eyebrow: "LOVE",
    image: "assets/cat-gray.jpg",
    text: "My little companions bring comfort, joy and unconditional love.",
    subtitle: "Small happiness ♡"
  },
  {
    number: "06",
    title: "Movies & Music",
    eyebrow: "FEEL",
    image: "assets/life-movies-music.jpg",
    text: "Stories, sounds and emotions that make life feel deeper.",
    subtitle: "Different stories. Same emotions ♡"
  },
  {
    number: "07",
    title: "City Walks",
    eyebrow: "WANDER",
    image: "assets/life-city-walks.jpg",
    text: "Wandering through cities, discovering hidden corners and unexpected beauty.",
    subtitle: "Walk more. See more. Feel more ♡"
  },
  {
    number: "08",
    title: "Wellness",
    eyebrow: "RESET",
    image: "assets/studio-room.png",
    text: "Pilates, movement, good sleep and a clear mind help me become a better version of myself.",
    subtitle: "Better than yesterday ♡"
  }
];

const lifeCarousel = document.querySelector(".life-carousel");
const lifeCarouselStage = document.querySelector("#lifeCarouselStage");
const lifeCarouselIndicators = document.querySelector("#lifeCarouselIndicators");
const lifeCarouselCounter = document.querySelector("#lifeCarouselCounter");
const lifePrev = document.querySelector(".life-carousel-prev");
const lifeNext = document.querySelector(".life-carousel-next");
let activeLifeIndex = 0;

function getLifeOffset(index) {
  let offset = index - activeLifeIndex;
  if (offset > lifeCarouselItems.length / 2) offset -= lifeCarouselItems.length;
  if (offset < -lifeCarouselItems.length / 2) offset += lifeCarouselItems.length;
  return offset;
}

function renderLifeCarousel() {
  if (!lifeCarouselStage || !lifeCarouselIndicators || !lifeCarouselCounter || !lifeCarousel) return;

  lifeCarouselStage.innerHTML = "";
  lifeCarouselItems.forEach((item, index) => {
    const offset = getLifeOffset(index);
    const absOffset = Math.abs(offset);
    if (absOffset > 3) return;

    const card = document.createElement("article");
    card.className = `life-carousel-card${offset === 0 ? " is-active" : ""}`;
    card.style.setProperty("--offset", offset);
    card.style.setProperty("--abs-offset", absOffset);
    card.style.zIndex = String(20 - absOffset);
    card.tabIndex = offset === 0 ? 0 : -1;
    card.setAttribute("aria-label", `${item.number}. ${item.title}`);
    card.innerHTML = `
      <img class="life-carousel-card-image" src="${item.image}" alt="${item.title}" draggable="false" />
      <div class="life-carousel-card-overlay"></div>
      <div class="life-carousel-paper-frame"></div>
      <div class="life-carousel-card-number">${item.number}</div>
      <div class="life-carousel-card-eyebrow">${item.eyebrow}</div>
      <div class="life-carousel-card-content">
        <h3>${item.title}</h3>
        <p>${item.text}</p>
        <span>${item.subtitle}</span>
      </div>
    `;
    card.addEventListener("click", () => setLifeIndex(index));
    lifeCarouselStage.append(card);
  });

  lifeCarouselIndicators.innerHTML = "";
  lifeCarouselItems.forEach((item, index) => {
    const button = document.createElement("button");
    button.className = `life-carousel-indicator${index === activeLifeIndex ? " is-active" : ""}`;
    button.type = "button";
    button.setAttribute("aria-label", `Go to ${item.title}`);
    button.addEventListener("click", () => setLifeIndex(index));
    lifeCarouselIndicators.append(button);
  });

  lifeCarouselCounter.textContent = `${String(activeLifeIndex + 1).padStart(2, "0")} / ${String(lifeCarouselItems.length).padStart(2, "0")}`;
  lifeCarousel.dataset.active = String(activeLifeIndex);
}

function setLifeIndex(index) {
  activeLifeIndex = (index + lifeCarouselItems.length) % lifeCarouselItems.length;
  renderLifeCarousel();
}

if (lifeCarouselStage) {
  renderLifeCarousel();
  lifePrev?.addEventListener("click", () => setLifeIndex(activeLifeIndex - 1));
  lifeNext?.addEventListener("click", () => setLifeIndex(activeLifeIndex + 1));
  lifeCarousel?.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setLifeIndex(activeLifeIndex - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      setLifeIndex(activeLifeIndex + 1);
    }
  });
}

const lifePopover = document.querySelector("#lifePopover");
const lifePopoverClose = lifePopover?.querySelector(".life-popover-close");
const lifePopoverKicker = lifePopover?.querySelector("p");
const lifePopoverTitle = lifePopover?.querySelector("h3");
const lifePopoverText = lifePopover?.querySelector("span");
const collectedLifeMoments = new Set();

function closeLifePopover() {
  if (!lifePopover) return;
  lifePopover.classList.remove("is-open");
  lifePopover.setAttribute("aria-hidden", "true");
}

document.querySelectorAll(".life-hotspot").forEach((button) => {
  button.addEventListener("click", () => {
    if (!lifePopover || !lifePopoverKicker || !lifePopoverTitle || !lifePopoverText) return;
    const rect = button.getBoundingClientRect();
    collectedLifeMoments.add(button.dataset.lifeTitle || "");
    button.classList.add("is-collected");
    lifePopoverKicker.textContent = `Life Beyond Work / ${collectedLifeMoments.size} of 7`;
    lifePopoverTitle.textContent = button.dataset.lifeTitle || "Life";
    lifePopoverText.textContent = button.dataset.lifeText || "";
    lifePopover.style.left = `${Math.min(window.innerWidth - 330, Math.max(18, rect.left + rect.width * 0.2))}px`;
    lifePopover.style.top = `${Math.min(window.innerHeight - 230, Math.max(88, rect.top + rect.height * 0.15))}px`;
    lifePopover.classList.add("is-open");
    lifePopover.setAttribute("aria-hidden", "false");
  });
});

lifePopoverClose?.addEventListener("click", closeLifePopover);
document.addEventListener("click", (event) => {
  if (!lifePopover?.classList.contains("is-open")) return;
  const target = event.target;
  if (target instanceof Element && (target.closest("#lifePopover") || target.closest(".life-hotspot"))) return;
  closeLifePopover();
});

const canvaGrid = document.querySelector("#canvaGrid");
if (canvaGrid) {
  content.canva.assetPlan.forEach((asset) => {
    const card = document.createElement("article");
    card.className = "canva-card";
    card.innerHTML = `
      <h3>${asset.name}</h3>
      <code>${asset.file}</code>
      <p><strong>${asset.size}</strong></p>
      <p>${asset.usage}</p>
    `;
    canvaGrid.append(card);
  });
}

Object.entries(content.contacts).forEach(([key, value]) => {
  const link = document.querySelector(`[data-contact="${key}"]`);
  if (!link) return;
  link.textContent = value;
  link.href = key === "email" ? `mailto:${value}` : "#";
});

function applySavedEdits() {
  document.querySelectorAll("[data-edit]").forEach((node) => {
    const key = node.dataset.edit;
    if (savedEdits[key] === "Jess is Creative Studio") return;
    if (savedEdits[key]) node.textContent = savedEdits[key];
  });
}

function setEditMode(enabled) {
  document.body.classList.toggle("is-editing", enabled);
  document.querySelectorAll("[data-edit]").forEach((node) => {
    node.contentEditable = enabled ? "true" : "false";
    node.spellcheck = enabled;
  });
  editToggle.textContent = enabled ? "Save" : "Edit";
  if (!enabled) {
    const edits = {};
    document.querySelectorAll("[data-edit]").forEach((node) => {
      edits[node.dataset.edit] = node.textContent.trim();
    });
    localStorage.setItem(editStorageKey, JSON.stringify(edits));
  }
}

const editToggle = document.querySelector("#editToggle");
const resetEdits = document.querySelector("#resetEdits");
applySavedEdits();
editToggle.addEventListener("click", () => {
  setEditMode(!document.body.classList.contains("is-editing"));
});
resetEdits.addEventListener("click", () => {
  localStorage.removeItem(editStorageKey);
  window.location.reload();
});

function alignHashTarget(hash) {
  const target = document.querySelector(hash);
  if (!target) return;
  const headerHeight = document.querySelector(".site-header")?.offsetHeight || 0;
  window.scrollTo({
    top: window.scrollY + target.getBoundingClientRect().top - headerHeight + 48,
    behavior: "auto"
  });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const hash = link.getAttribute("href");
    if (!hash || hash === "#") return;
    const target = document.querySelector(hash);
    if (!target) return;
    event.preventDefault();
    history.pushState(null, "", hash);
    alignHashTarget(hash);
  });
});

window.addEventListener("load", () => {
  if (!document.querySelector(window.location.hash)) return;
  [80, 400, 900].forEach((delay) => {
    window.setTimeout(() => {
      alignHashTarget(window.location.hash);
    }, delay);
  });
});

function setupGsapMotion() {
  const gsap = window.gsap;
  if (!gsap || !window.ScrollTrigger || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  gsap.registerPlugin(window.ScrollTrigger);

  const aboutSection = document.querySelector(".about-gsap-motion");
  const aboutImage = aboutSection?.querySelector("img");
  if (aboutSection && aboutImage) {
    gsap.fromTo(
      aboutImage,
      { scale: 1.08, xPercent: 4, y: 26, filter: "saturate(0.96) contrast(0.98)" },
      {
        scale: 1,
        xPercent: 0,
        y: 0,
        filter: "saturate(1.04) contrast(1.02)",
        ease: "power2.out",
        scrollTrigger: {
          trigger: aboutSection,
          start: "top 78%",
          end: "center 42%",
          scrub: 0.7
        }
      }
    );

    gsap.fromTo(
      ".about-photo-button",
      { opacity: 0, scale: 0.88 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.55,
        stagger: 0.08,
        ease: "back.out(1.8)",
        scrollTrigger: {
          trigger: aboutSection,
          start: "top 46%",
          once: true
        }
      }
    );
  }

  gsap.utils.toArray(".skills-image-section").forEach((section) => {
    const image = section.querySelector("img");
    if (!image) return;
    gsap.fromTo(
      image,
      { y: 42, scale: 0.965, filter: "saturate(0.94) contrast(0.98)" },
      {
        y: 0,
        scale: 1,
        filter: "saturate(1.04) contrast(1.015)",
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 84%",
          end: "center 45%",
          scrub: 0.75
        }
      }
    );
  });

  document.querySelectorAll(".about-photo-button, .skill-hotspot, .life-hotspot").forEach((button) => {
    button.addEventListener("mouseenter", () => {
      gsap.to(button, { scale: 1.025, duration: 0.22, ease: "power2.out" });
    });
    button.addEventListener("mouseleave", () => {
      gsap.to(button, { scale: 1, duration: 0.22, ease: "power2.out" });
    });
    button.addEventListener("click", () => {
      gsap.fromTo(button, { scale: 0.96 }, { scale: 1.03, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out" });
    });
  });
}

window.addEventListener("load", setupGsapMotion);
