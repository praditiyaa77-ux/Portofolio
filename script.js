/*
  Alfan Portfolio
  Vanilla JavaScript — no build step.
*/

// ==============================
// EASY IMAGE REPLACEMENT
// ==============================
// Paste your direct image URL between the quotes.
// Example: const PROFILE_IMAGE_URL = "https://example.com/photo.jpg";
const PROFILE_IMAGE_URL = "https://www.image2url.com/r2/default/images/1790615031401-92095ce4-6911-412b-86c3-64eddaa16cc1.jpg";

document.addEventListener("DOMContentLoaded", () => {
  const preloader = document.getElementById("preloader");
  const profileImage = document.getElementById("profileImage");
  const imageFallback = document.getElementById("imageFallback");
  const currentYear = document.getElementById("currentYear");
  const backToTop = document.getElementById("backToTop");

  // Preloader: do not wait for third-party assets or remote images.
  // The portfolio content is usable as soon as the document is ready.
  const hidePreloader = () => {
    if (!preloader) return;
    preloader.classList.add("is-hidden");
    window.setTimeout(() => preloader.remove(), 800);
  };
  window.setTimeout(hidePreloader, 1200);
  window.requestAnimationFrame(() => window.setTimeout(hidePreloader, 450));

  // Profile image
  if (PROFILE_IMAGE_URL && profileImage) {
    profileImage.src = PROFILE_IMAGE_URL;
    profileImage.addEventListener("load", () => {
      if (imageFallback) imageFallback.style.display = "none";
    });
    profileImage.addEventListener("error", () => {
      profileImage.style.display = "none";
      if (imageFallback) imageFallback.style.display = "grid";
    });
  } else if (profileImage) {
    profileImage.style.display = "none";
  }

  // Year
  if (currentYear) currentYear.textContent = new Date().getFullYear();

  // AOS
  if (window.AOS) {
    AOS.init({
      once: false,
      duration: 750,
      easing: "ease-out-cubic",
      offset: 55,
    });
  }

  // Back to top
  const toggleBackTop = () => {
    backToTop?.classList.toggle("show", window.scrollY > 650);
  };
  window.addEventListener("scroll", toggleBackTop, { passive: true });
  toggleBackTop();

  backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Smooth anchor navigation (fallback/enhancement)
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Bento pointer glow + desktop tilt + touch feedback.
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  document.querySelectorAll(".interactive-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${((event.clientX - rect.left) / rect.width) * 100}%`);
      card.style.setProperty("--my", `${((event.clientY - rect.top) / rect.height) * 100}%`);

      if (canHover && card.classList.contains("skill-card")) {
        const rx = (((event.clientY - rect.top) / rect.height) - .5) * -2.4;
        const ry = (((event.clientX - rect.left) / rect.width) - .5) * 2.4;
        card.style.transform = `perspective(850px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-3px)`;
      }
    });
    card.addEventListener("pointerleave", () => card.style.transform = "");
    card.addEventListener("pointerdown", () => {
      card.classList.add("is-touched", "tap-pulse");
      setTimeout(() => card.classList.remove("tap-pulse"), 360);
    });
    card.addEventListener("pointerup", () => setTimeout(() => card.classList.remove("is-touched"), 160));
    card.addEventListener("pointercancel", () => card.classList.remove("is-touched"));
  });

  document.querySelectorAll(".ripple-target, .interactive-card").forEach((target) => {
    target.addEventListener("pointerdown", (event) => {
      const rect = target.getBoundingClientRect();
      const ripple = document.createElement("span");
      const size = Math.max(rect.width, rect.height) * .55;
      ripple.className = "touch-ripple";
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
      target.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    });
  });

  if (canHover) {
    document.querySelectorAll(".magnetic").forEach((el) => {
      el.addEventListener("mousemove", (event) => {
        const rect = el.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) * .10;
        const y = (event.clientY - rect.top - rect.height / 2) * .10;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
      el.addEventListener("mouseleave", () => el.style.transform = "");
    });
  }

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle("section-active", entry.isIntersecting));
    }, { threshold: .25 });
    document.querySelectorAll("main section[id]").forEach((section) => sectionObserver.observe(section));
  }

});
