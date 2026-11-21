// Small progressive enhancements. Everything works and stays visible without this file.
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const wide = window.matchMedia("(min-width: 48rem)");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

// 1. Channel picker: place the popover under its button on wide screens; bottom sheet on phones (CSS).
document.querySelectorAll<HTMLElement>(".picker").forEach((pop) => {
  const trigger = document.querySelector<HTMLButtonElement>(`[popovertarget="${pop.id}"].picker-trigger`);
  if (!trigger) return;
  const place = () => {
    if (!wide.matches) { pop.style.removeProperty("top"); pop.style.removeProperty("left"); return; }
    const r = trigger.getBoundingClientRect();
    const width = pop.offsetWidth;
    const left = Math.min(r.left + window.scrollX, window.scrollX + document.documentElement.clientWidth - width - 16);
    pop.style.top = `${r.bottom + window.scrollY + 8}px`;
    pop.style.left = `${Math.max(16, left)}px`;
  };
  pop.addEventListener("toggle", (e) => {
    const open = (e as ToggleEvent).newState === "open";
    trigger.setAttribute("aria-expanded", String(open));
    if (open) place();
  });
  trigger.setAttribute("aria-expanded", "false");
  window.addEventListener("resize", () => { if (pop.matches(":popover-open")) place(); });
});

// 2. Copy a phone number on desktop (tel: often does nothing there). Real clipboard write, real status text.
if (finePointer.matches && navigator.clipboard) {
  document.querySelectorAll<HTMLButtonElement>("[data-copy]").forEach((btn) => {
    btn.classList.add("is-available");
    btn.addEventListener("click", async () => {
      const status = btn.closest(".picker")?.querySelector<HTMLElement>(".picker__status");
      try {
        await navigator.clipboard.writeText(btn.dataset.copy ?? "");
        if (status) status.textContent = `Номер ${btn.dataset.copy} скопійовано`;
      } catch {
        if (status) status.textContent = "Не вдалося скопіювати, наберіть номер вручну";
      }
    });
  });
}

// 3. Menu (<details>): close after choosing an anchor or pressing Escape.
const menu = document.querySelector<HTMLDetailsElement>(".menu");
if (menu) {
  menu.querySelectorAll("a[href^='#']").forEach((a) => a.addEventListener("click", () => { menu.open = false; }));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.open) { menu.open = false; menu.querySelector("summary")?.focus(); }
  });
}

// 4. Active anchor in the header nav.
const links = new Map<string, HTMLAnchorElement>();
document.querySelectorAll<HTMLAnchorElement>(".nav__link").forEach((a) => links.set(a.hash.slice(1), a));
if ("IntersectionObserver" in window && links.size) {
  const navIo = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const a = links.get(e.target.id);
      if (!a) continue;
      if (e.isIntersecting) {
        links.forEach((l) => l.removeAttribute("aria-current"));
        a.setAttribute("aria-current", "location");
      } else if (a.getAttribute("aria-current")) {
        a.removeAttribute("aria-current");
      }
    }
  }, { rootMargin: "-45% 0px -50% 0px" });
  links.forEach((_a, id) => { const s = document.getElementById(id); if (s) navIo.observe(s); });
}

// 5. Mobile bottom bar: shown once the hero has left the screen.
const bar = document.querySelector<HTMLElement>("[data-mobile-bar]");
const hero = document.getElementById("hero");
if (bar && hero && "IntersectionObserver" in window) {
  new IntersectionObserver(([e]) => { bar.classList.toggle("is-shown", !e.isIntersecting); }, { threshold: 0 }).observe(hero.querySelector(".hero__actions") ?? hero);
} else if (bar) {
  bar.classList.add("is-shown");
}

// 6. Delivery scale fills once when it enters the screen.
const scales = document.querySelectorAll<HTMLElement>("[data-scale]");
if (reduce || !("IntersectionObserver" in window)) {
  scales.forEach((el) => el.classList.add("is-in"));
} else {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
  }, { threshold: 0.4 });
  scales.forEach((el) => io.observe(el));
}

// 7. Brands list on phones: folded to the first rows, one button opens all 30.
const brands = document.querySelector<HTMLElement>("[data-brands]");
const more = document.querySelector<HTMLButtonElement>("[data-brands-toggle]");
if (brands && more) {
  const sync = () => {
    const fold = !wide.matches;
    more.hidden = !fold;
    brands.classList.toggle("is-folded", fold && more.getAttribute("aria-expanded") !== "true");
  };
  more.addEventListener("click", () => {
    const open = more.getAttribute("aria-expanded") !== "true";
    more.setAttribute("aria-expanded", String(open));
    more.textContent = open ? "Згорнути марки" : "Усі 30 марок";
    sync();
  });
  wide.addEventListener("change", sync);
  sync();
}
