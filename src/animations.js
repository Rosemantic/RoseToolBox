"use strict";

(() => {
  if (!window.gsap || !window.ScrollTrigger) {
    document.documentElement.dataset.motionStatus = "library-missing";
    return;
  }

  const { gsap, ScrollTrigger } = window;
  const MOTION_STORAGE_KEY = "rosetools-motion";
  const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const sectionAnimations = [];
  let initialized = false;
  let resultTween = null;
  let introTimeline = null;

  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.dataset.gsapVersion = gsap.version;

  function readMotionPreference() {
    try {
      return localStorage.getItem(MOTION_STORAGE_KEY) || "system";
    } catch (_) {
      return "system";
    }
  }

  function motionEnabled() {
    const preference = readMotionPreference();
    if (preference === "full") return true;
    if (preference === "reduced") return false;
    return !reduceMotionQuery.matches;
  }

  function applyMotionState() {
    const preference = readMotionPreference();
    document.documentElement.dataset.motionPreference = preference;
    document.documentElement.dataset.motion = motionEnabled() ? "ready" : "reduced";
  }

  function updateMotionControl() {
    const button = document.querySelector("#motion-toggle");
    const label = document.querySelector("#motion-label");
    const hint = document.querySelector("#motion-hint");
    if (!button || !label || !hint) return;

    const enabled = motionEnabled();
    const preference = readMotionPreference();
    button.setAttribute("aria-pressed", String(enabled));
    button.title = enabled ? "点击使用精简动效" : "点击开启完整动效";
    label.textContent = enabled ? "动效：已开启" : "动效：精简（点击开启）";

    if (preference === "system") {
      hint.textContent = reduceMotionQuery.matches
        ? "系统正在减少动态效果，可点击开启完整动效"
        : "当前跟随系统设置";
    } else {
      hint.textContent = "当前使用网站内的手动设置";
    }
  }

  function toggleMotion() {
    const next = motionEnabled() ? "reduced" : "full";
    try {
      localStorage.setItem(MOTION_STORAGE_KEY, next);
    } catch (_) {}
    window.location.reload();
  }

  applyMotionState();

  function initializeAnimations() {
    updateMotionControl();
    document.querySelector("#motion-toggle")?.addEventListener("click", toggleMotion);

    if (!motionEnabled()) {
      document.documentElement.dataset.motion = "reduced";
      document.documentElement.dataset.motionStatus = "reduced";
      return;
    }

    initialized = true;
    document.documentElement.dataset.motionStatus = "running";
    introTimeline = gsap.timeline({
      defaults: { duration: 0.54, ease: "power3.out" },
      onComplete: () => {
        document.documentElement.dataset.motion = "complete";
        gsap.set([
          ".hero .eyebrow",
          ".hero h1 span",
          ".hero-copy > p",
          ".search-panel",
          ".popular-tags",
        ], { clearProps: "transform,opacity,visibility" });
        document.documentElement.dataset.motionStatus = "complete";
      },
    });

    introTimeline
      .to(".hero .eyebrow", { autoAlpha: 1, y: 0, duration: 0.36 })
      .to(".hero h1 span", { autoAlpha: 1, y: 0, stagger: 0.08 }, "-=0.22")
      .to(".hero-copy > p", { autoAlpha: 1, y: 0 }, "-=0.31")
      .to(".search-panel", { autoAlpha: 1, y: 0 }, "-=0.42")
      .to(".popular-tags", { autoAlpha: 1, y: 0, duration: 0.4 }, "-=0.28");

    setupSectionAnimations();
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }

  function setupSectionAnimations() {
    sectionAnimations.splice(0).forEach((animation) => {
      animation.scrollTrigger?.kill();
      animation.kill();
    });

    document.querySelectorAll("#homepage-sections .content-section").forEach((section) => {
      const heading = section.querySelector(".section-heading");
      const cards = [...section.querySelectorAll(".site-card, .collection-card")].slice(0, 8);
      const targets = [heading, ...cards].filter(Boolean);
      if (!targets.length) return;

      gsap.set(targets, { autoAlpha: 0, y: 18 });
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "clamp(top 86%)",
          once: true,
        },
        defaults: { ease: "power2.out" },
      });
      if (heading) timeline.to(heading, { autoAlpha: 1, y: 0, duration: 0.42 });
      if (cards.length) {
        timeline.to(cards, {
          autoAlpha: 1,
          y: 0,
          duration: 0.42,
          stagger: 0.045,
          clearProps: "transform,opacity,visibility",
        }, "-=0.24");
      }
      sectionAnimations.push(timeline);
    });
  }

  function resultsChanged(container) {
    if (!initialized || !motionEnabled() || !container) return;
    if (resultTween) resultTween.kill();
    const cards = [...container.querySelectorAll(".site-card")].slice(0, 12);
    if (!cards.length) {
      requestAnimationFrame(() => ScrollTrigger.refresh());
      return;
    }
    gsap.killTweensOf(cards);
    resultTween = gsap.fromTo(
      cards,
      { autoAlpha: 0, y: 12 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.3,
        stagger: 0.025,
        ease: "power2.out",
        overwrite: "auto",
        clearProps: "transform,opacity,visibility",
      },
    );
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }

  function favoriteChanged(buttons, countElement, added) {
    if (!motionEnabled()) return;
    const targets = [...buttons];
    gsap.killTweensOf(targets);
    gsap.fromTo(
      targets,
      { scale: 0.76 },
      { scale: 1, duration: 0.38, ease: added ? "back.out(2.2)" : "power2.out", clearProps: "transform" },
    );
    if (countElement) {
      gsap.fromTo(countElement, { scale: 1.28 }, { scale: 1, duration: 0.34, ease: "back.out(2)", clearProps: "transform" });
    }
  }

  function drawerOpened(sidebar, overlay) {
    if (!motionEnabled()) return;
    gsap.fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2, ease: "power1.out", clearProps: "opacity,visibility" });
    const entries = sidebar.querySelectorAll(".category-nav-button");
    gsap.fromTo(entries, { autoAlpha: 0, x: -8 }, {
      autoAlpha: 1,
      x: 0,
      duration: 0.24,
      stagger: 0.018,
      ease: "power2.out",
      clearProps: "transform,opacity,visibility",
    });
  }

  function detailOpened(dialog, sheet) {
    if (!motionEnabled()) return;
    const backdrop = dialog.querySelector(".detail-backdrop");
    const mobile = window.innerWidth <= 600;
    gsap.killTweensOf([backdrop, sheet]);
    gsap.fromTo(backdrop, { autoAlpha: 0 }, {
      autoAlpha: 1,
      duration: 0.22,
      ease: "power1.out",
      clearProps: "opacity,visibility",
    });
    gsap.fromTo(sheet, mobile ? { yPercent: 100 } : { xPercent: 100 }, {
      xPercent: 0,
      yPercent: 0,
      duration: 0.42,
      ease: "power3.out",
      clearProps: "transform",
    });
  }

  function detailClosed(dialog, sheet, onComplete) {
    const backdrop = dialog.querySelector(".detail-backdrop");
    if (!motionEnabled()) {
      onComplete();
      return;
    }
    const mobile = window.innerWidth <= 600;
    gsap.killTweensOf([backdrop, sheet]);
    gsap.to(backdrop, { autoAlpha: 0, duration: 0.18, ease: "power1.in" });
    gsap.to(sheet, {
      xPercent: mobile ? 0 : 100,
      yPercent: mobile ? 100 : 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete,
    });
  }

  function detailContentChanged(content) {
    if (!motionEnabled()) return;
    gsap.killTweensOf(content);
    gsap.fromTo(content, { autoAlpha: 0, y: 8 }, {
      autoAlpha: 1,
      y: 0,
      duration: 0.24,
      ease: "power2.out",
      clearProps: "transform,opacity,visibility",
    });
  }

  function backToTopChanged(button, visible, onHidden) {
    gsap.killTweensOf(button);
    if (!motionEnabled()) {
      button.hidden = !visible;
      if (!visible) onHidden?.();
      return;
    }
    if (visible) {
      button.hidden = false;
      gsap.fromTo(button, { autoAlpha: 0, scale: 0.82, y: 8 }, {
        autoAlpha: 1,
        scale: 1,
        y: 0,
        duration: 0.28,
        ease: "back.out(1.8)",
        clearProps: "transform,opacity,visibility",
      });
    } else {
      gsap.to(button, {
        autoAlpha: 0,
        scale: 0.86,
        y: 6,
        duration: 0.18,
        ease: "power1.in",
        onComplete: () => {
          button.hidden = true;
          gsap.set(button, { clearProps: "transform,opacity,visibility" });
          onHidden?.();
        },
      });
    }
  }

  function themeChanged(button) {
    if (!motionEnabled()) return;
    const icon = button.querySelector("svg");
    gsap.fromTo(icon, { rotation: -70, scale: 0.72 }, {
      rotation: 0,
      scale: 1,
      duration: 0.42,
      ease: "back.out(2)",
      clearProps: "transform",
    });
  }

  function toastIn(toast) {
    if (!motionEnabled()) return;
    gsap.fromTo(toast, { autoAlpha: 0, y: 10, scale: 0.97 }, {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      duration: 0.24,
      ease: "power2.out",
      clearProps: "transform,opacity,visibility",
    });
  }

  function toastOut(toast, onComplete) {
    if (!motionEnabled()) {
      onComplete();
      return;
    }
    gsap.to(toast, {
      autoAlpha: 0,
      y: 8,
      duration: 0.18,
      ease: "power1.in",
      onComplete: () => {
        gsap.set(toast, { clearProps: "transform,opacity,visibility" });
        onComplete();
      },
    });
  }

  reduceMotionQuery.addEventListener("change", () => {
    if (readMotionPreference() === "system") window.location.reload();
  });

  window.RoseToolsAnimations = {
    resultsChanged,
    favoriteChanged,
    drawerOpened,
    detailOpened,
    detailClosed,
    detailContentChanged,
    backToTopChanged,
    themeChanged,
    toastIn,
    toastOut,
    toggleMotion,
    getStatus: () => ({
      enabled: motionEnabled(),
      initialized,
      preference: readMotionPreference(),
      systemReduced: reduceMotionQuery.matches,
      status: document.documentElement.dataset.motionStatus || "waiting",
      version: gsap.version,
    }),
  };

  document.addEventListener("DOMContentLoaded", initializeAnimations);
})();
