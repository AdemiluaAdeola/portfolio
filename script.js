// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Custom Cursor Implementation
const cursorDot = document.createElement("div");
cursorDot.classList.add("cursor-dot");
document.body.appendChild(cursorDot);

const cursorOutline = document.createElement("div");
cursorOutline.classList.add("cursor-outline");
document.body.appendChild(cursorOutline);

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let outlineX = mouseX;
let outlineY = mouseY;
let isMobile = window.innerWidth <= 768;

window.addEventListener("resize", () => {
  isMobile = window.innerWidth <= 768;
});

window.addEventListener("mousemove", (e) => {
  if (isMobile) return;
  mouseX = e.clientX;
  mouseY = e.clientY;

  // Dot follows immediately
  cursorDot.style.left = `${mouseX}px`;
  cursorDot.style.top = `${mouseY}px`;
});

// Animate outline with delay for smooth trailing effect
function animateCursor() {
  if (!isMobile) {
    let dx = mouseX - outlineX;
    let dy = mouseY - outlineY;

    outlineX += dx * 0.15;
    outlineY += dy * 0.15;

    cursorOutline.style.left = `${outlineX}px`;
    cursorOutline.style.top = `${outlineY}px`;
  }
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Add hover effects for interactable elements to expand the cursor
function setupHoverEffects() {
  const interactables = document.querySelectorAll(
    "a, button, .project-card, .timeline-item, .glass-card, input, textarea",
  );
  interactables.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      if (isMobile) return;
      cursorDot.style.transform = "translate(-50%, -50%) scale(1.5)";
      cursorDot.style.backgroundColor = "transparent";
      cursorDot.style.border = "1px solid var(--color-primary)";
      cursorOutline.style.transform = "translate(-50%, -50%) scale(1.5)";
      cursorOutline.style.backgroundColor = "rgba(0, 242, 254, 0.1)";
      cursorOutline.style.borderColor = "transparent";
    });

    el.addEventListener("mouseleave", () => {
      if (isMobile) return;
      cursorDot.style.transform = "translate(-50%, -50%) scale(1)";
      cursorDot.style.backgroundColor = "var(--color-primary)";
      cursorDot.style.border = "none";
      cursorOutline.style.transform = "translate(-50%, -50%) scale(1)";
      cursorOutline.style.backgroundColor = "transparent";
      cursorOutline.style.borderColor = "rgba(0, 242, 254, 0.5)";
    });
  });
}
// Run once on load
setupHoverEffects();

// GSAP Scroll Animations
window.addEventListener("load", () => {
  // Hero section elements staggered load
  gsap.from(".hero-content-anim", {
    y: 50,
    opacity: 0,
    duration: 1,
    stagger: 0.15,
    ease: "power3.out",
    delay: 0.2,
  });

  gsap.from(".hero-badge-anim", {
    scale: 0.8,
    opacity: 0,
    duration: 0.8,
    ease: "back.out(1.7)",
    delay: 0.1,
  });

  // Code block hero load
  gsap.from(".hero-code-anim", {
    x: 50,
    opacity: 0,
    duration: 1.2,
    ease: "power3.out",
    delay: 0.5,
  });

  // Generic Reveal Up elements
  const revealElements = document.querySelectorAll(".reveal-up");
  revealElements.forEach((el, index) => {
    gsap.fromTo(
      el,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      },
    );
  });

  // Timeline staggered reveal
  const timelineItems = document.querySelectorAll(".timeline-item");
  if (timelineItems.length > 0) {
    gsap.fromTo(
      timelineItems,
      { x: -50, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".timeline-container",
          start: "top 80%",
        },
      },
    );
  }
});

// Mobile Menu Toggle logic
window.toggleMobileMenu = function () {
  const menu = document.getElementById("mobileMenu");
  menu.classList.toggle("hidden");
  // Animate menu links gracefully
  if (!menu.classList.contains("hidden")) {
    gsap.fromTo(
      "#mobileMenu a",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, duration: 0.4, ease: "power2.out" },
    );
  }
};

// Smooth scroll implementation
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const targetAttr = this.getAttribute("href");
    if (targetAttr === "#") return;

    const target = document.querySelector(targetAttr);
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      // Close mobile menu if it is currently open
      document.getElementById("mobileMenu").classList.add("hidden");
    }
  });
});

// Active link highlighting on scroll processing
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
  let current = "";
  const scrollY = window.pageYOffset;

  sections.forEach((section) => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 150;

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    link.classList.remove("text-primary"); // removing old tailwind class if present
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
      link.classList.add("text-primary");
    }
  });
});

// Year assignment for footer
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
