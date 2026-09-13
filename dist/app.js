import {
  createDisclosure,
  enhanceImages,
  installScrollProgress,
  revealState,
} from "./lib/motion.js";
import { installObservability } from "./lib/observability.js";
import { connectSentry } from "./lib/sentry.js";
import monitoringConfig from "./monitoring-config.js";

const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const menuButton = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector("#mobile-nav");
const motionButton = document.querySelector("#motion-toggle");
let paused = false;
const motionSubscribers = [];
const motionAllowed = () => !paused && !reducedMotion.matches;

const setMenuVisible = createDisclosure(mobileNav, motionAllowed);
function closeMenu(keyboard = false) {
  setMenuVisible(false, keyboard);
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Abrir menu");
}
menuButton.addEventListener("click", (event) => {
  const open = menuButton.getAttribute("aria-expanded") !== "true";
  setMenuVisible(open, event.detail === 0);
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
});
mobileNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", (event) => closeMenu(event.detail === 0));
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !mobileNav.hidden) {
    closeMenu(true);
    menuButton.focus();
  }
});

const filters = [...document.querySelectorAll("[data-filter]")];
const groups = [...document.querySelectorAll(".menu-group")];
const categoryPhotos = {
  combinados: ["barca-premium.webp", "Barca especial do Joy"],
  sushis: ["sashimi-premium.webp", "Sushis e sashimis do Joy"],
  temakis: ["temaki-premium.webp", "Temaki de salmão do Joy"],
  entradas: ["shimeji-premium.webp", "Shimeji do Joy"],
  quentes: [
    "yakisoba-joy-preto.webp",
    "Yakisoba do Joy com camarão, carnes e legumes",
  ],
  bebidas: null,
};
let categoryAnimation;
function chooseCategory(category, scroll = false, keyboard = false) {
  const selected = filters.find((button) => button.dataset.filter === category);
  if (!selected) return;
  filters.forEach((button) => {
    button.setAttribute("aria-pressed", String(button === selected));
  });
  let first = true,
    count = 0;
  groups.forEach((group) => {
    group.hidden = group.dataset.group !== category;
    if (!group.hidden) {
      group.open = first;
      first = false;
      count += group.querySelectorAll(".menu-item").length;
    }
  });
  document.querySelector("#menu-status").textContent =
    `${selected.children[1].textContent} · ${count} opções`;
  const photo = document.querySelector("#category-photo");
  const entry = categoryPhotos[category];
  photo.parentElement.hidden = !entry;
  if (entry) {
    photo.src = `assets/${entry[0]}`;
    photo.alt = entry[1];
  }
  categoryAnimation?.cancel();
  const content = document.querySelector(".menu-content");
  if (motionAllowed() && !keyboard && content.animate) {
    categoryAnimation = content.animate(
      [
        { opacity: 0.35, transform: "translateY(8px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      { duration: 220, easing: "cubic-bezier(.22,1,.36,1)" },
    );
  }
  if (scroll) {
    document.querySelector("#cardapio").scrollIntoView({
      behavior: motionAllowed() && !keyboard ? "smooth" : "instant",
    });
    selected.focus({ preventScroll: true });
  }
}
filters.forEach((button) => {
  button.addEventListener("click", (event) =>
    chooseCategory(button.dataset.filter, false, event.detail === 0),
  );
});
document.querySelectorAll("[data-jump]").forEach((button) => {
  button.addEventListener("click", (event) =>
    chooseCategory(button.dataset.jump, true, event.detail === 0),
  );
});

chooseCategory("combinados", false, true);

const hero = document.querySelector(".hero");
const slideButtons = [...document.querySelectorAll("[data-slide]")];
const heroPhotos = [...document.querySelectorAll(".hero-art")];
const slideName = document.querySelector(".slide-name");
const slideLabels = [
  "Barcas especiais",
  "Sushis & sashimis",
  "Peças maçaricadas",
];
let currentSlide = 0,
  slideTimer,
  hoverPaused = false;
function showSlide(index, manual = false) {
  currentSlide = index;
  slideName.setAttribute("aria-live", manual ? "polite" : "off");
  slideName.textContent = slideLabels[index];
  slideButtons.forEach((button, i) => {
    button.classList.toggle("active", i === index);
    button.setAttribute("aria-pressed", String(i === index));
  });
  heroPhotos.forEach((photo, i) => {
    photo.classList.toggle("active", i === index);
    photo.setAttribute("aria-hidden", String(i !== index));
  });
}
function syncSlideshow() {
  clearInterval(slideTimer);
  if (
    motionAllowed() &&
    !document.hidden &&
    !hoverPaused &&
    !hero.contains(document.activeElement)
  ) {
    slideTimer = setInterval(
      () => showSlide((currentSlide + 1) % heroPhotos.length),
      7000,
    );
  }
}
slideButtons.forEach((button, i) => {
  button.addEventListener("click", () => {
    showSlide(i, true);
    syncSlideshow();
  });
});
hero.addEventListener("mouseenter", () => {
  hoverPaused = true;
  syncSlideshow();
});
hero.addEventListener("mouseleave", () => {
  hoverPaused = false;
  syncSlideshow();
});
hero.addEventListener("focusin", syncSlideshow);
hero.addEventListener("focusout", () => setTimeout(syncSlideshow, 0));
document.addEventListener("visibilitychange", syncSlideshow);
function syncMotion() {
  const stopped = !motionAllowed();
  document.body.classList.toggle("motion-paused", stopped);
  motionButton.disabled = reducedMotion.matches;
  motionButton.setAttribute("aria-pressed", String(stopped));
  const label = reducedMotion.matches
    ? "Animações desativadas pela preferência de movimento reduzido"
    : paused
      ? "Retomar animações"
      : "Pausar animações";
  motionButton.setAttribute("aria-label", label);
  motionButton.title = label;
  motionButton.querySelector("span").textContent = stopped ? "▶" : "Ⅱ";
  if (stopped) {
    categoryAnimation?.cancel();
    document.getAnimations?.().forEach((animation) => {
      animation.cancel();
    });
    document.querySelectorAll(".reveal-ready").forEach((element) => {
      element.classList.remove("reveal-ready");
      element.classList.add("in-view");
    });
  }
  syncSlideshow();
  motionSubscribers.forEach((update) => {
    update();
  });
}
motionButton.addEventListener("click", () => {
  paused = !paused;
  syncMotion();
});
reducedMotion.addEventListener("change", syncMotion);
syncMotion();

// Keep observing so entrances repeat after leaving either edge of the viewport.
if ("IntersectionObserver" in window) {
  const elements = [...document.querySelectorAll(".reveal")];
  function updateReveal(element, rect = element.getBoundingClientRect()) {
    const { ready, offset } = revealState(
      rect,
      innerHeight,
      motionAllowed(),
      element.contains(document.activeElement),
    );
    element.style.setProperty("--reveal-offset", offset);
    element.classList.toggle("reveal-ready", ready);
    element.classList.toggle("in-view", !ready);
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        updateReveal(entry.target, entry.boundingClientRect);
      });
    },
    { threshold: [0, 0.08] },
  );
  elements.forEach((element) => {
    updateReveal(element);
    observer.observe(element);
    element.addEventListener("focusin", () => updateReveal(element));
  });
  motionSubscribers.push(() =>
    elements.forEach((element) => {
      updateReveal(element);
    }),
  );
}

// The second gallery starts when visible and shares the site's motion preference.
(() => {
  const gallery = document.querySelector(".experience-slider");
  if (!gallery) return;
  const photos = [...gallery.querySelectorAll(".experience-slide")];
  const dots = [...gallery.querySelectorAll("[data-experience-slide]")];
  const pauseButton = gallery.querySelector(".experience-pause");
  let current = 0,
    timer,
    localPaused = false,
    hovered = false;
  let visible = !("IntersectionObserver" in window);
  function show(index) {
    current = index;
    photos.forEach((photo, i) => {
      photo.classList.toggle("active", i === index);
      photo.setAttribute("aria-hidden", String(i !== index));
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
      dot.setAttribute("aria-pressed", String(i === index));
    });
  }
  function sync() {
    clearInterval(timer);
    const blocked = !motionAllowed();
    pauseButton.disabled = blocked;
    pauseButton.setAttribute("aria-pressed", String(blocked || localPaused));
    pauseButton.setAttribute(
      "aria-label",
      blocked
        ? "Fotos pausadas pela preferência de animação"
        : localPaused
          ? "Retomar fotos do Joy"
          : "Pausar fotos do Joy",
    );
    pauseButton.querySelector("span").textContent =
      blocked || localPaused ? "▶" : "Ⅱ";
    if (
      !blocked &&
      !localPaused &&
      !hovered &&
      visible &&
      !document.hidden &&
      !gallery.contains(document.activeElement)
    ) {
      timer = setInterval(() => show((current + 1) % photos.length), 5000);
    }
  }
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      show(i);
      sync();
    });
  });
  pauseButton.addEventListener("click", () => {
    localPaused = !localPaused;
    sync();
  });
  gallery.addEventListener("mouseenter", () => {
    hovered = true;
    sync();
  });
  gallery.addEventListener("mouseleave", () => {
    hovered = false;
    sync();
  });
  gallery.addEventListener("focusin", sync);
  gallery.addEventListener("focusout", () => setTimeout(sync, 0));
  document.addEventListener("visibilitychange", sync);
  motionSubscribers.push(sync);
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting;
        sync();
      },
      { threshold: 0.15 },
    );
    observer.observe(gallery);
  }
  sync();
})();

// Loading reflects real image requests; page progress reflects actual scroll position.
enhanceImages();
installScrollProgress();
installObservability(monitoringConfig);
void connectSentry(monitoringConfig);

// Animate disclosure content without delaying keyboard navigation or hiding semantics.
document.querySelectorAll(".menu-group").forEach((group) => {
  const summary = group.querySelector("summary");
  let animation;
  let revision = 0;
  let targetOpen = group.open;
  summary.addEventListener("click", async (event) => {
    if (event.detail === 0 || !motionAllowed() || !group.animate) {
      revision++;
      animation?.cancel();
      animation = undefined;
      return;
    }
    event.preventDefault();
    const ticket = ++revision;
    const opening = animation ? !targetOpen : !group.open;
    targetOpen = opening;
    animation?.cancel();
    if (opening) group.open = true;
    animation = group.animate(
      opening
        ? [
            { opacity: 0.45, transform: "translateY(6px)" },
            { opacity: 1, transform: "translateY(0)" },
          ]
        : [{ opacity: 1 }, { opacity: 0.6 }],
      { duration: opening ? 240 : 120, easing: "cubic-bezier(.22,1,.36,1)" },
    );
    try {
      await animation.finished;
    } catch {
      /* superseded */
    }
    if (ticket === revision) {
      group.open = opening;
      animation = undefined;
    }
  });
});
