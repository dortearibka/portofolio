const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;

// 1. Muncul pelan saat di-scroll
const reveal = new IntersectionObserver(
  (items) =>
    items.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        reveal.unobserve(e.target);
      }
    }),
  { threshold: 0.12 },
);
$$(".reveal").forEach((el) => reveal.observe(el));

// 2. Menu aktif mengikuti posisi scroll
const links = $$("#dock a:not(.cta)");
const spy = new IntersectionObserver(
  (items) =>
    items.forEach((e) => {
      if (e.isIntersecting) links.forEach((a) => a.classList.toggle("on", a.hash === "#" + e.target.id));
    }),
  { rootMargin: "-45% 0px -50% 0px" },
);
$$("main > section[id]:not(#kontak)").forEach((s) => spy.observe(s));

// 3. Tab di setiap proyek
$$(".frame").forEach((frame) => {
  const tabs = $$("[role=tab]", frame);
  const panels = $$(".panel", frame);
  tabs.forEach((tab) =>
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.setAttribute("aria-selected", t === tab));
      panels.forEach((p) => p.classList.toggle("on", p.id === tab.dataset.t));
    }),
  );

  // Frame miring tipis mengikuti mouse
  if (calm) return;
  frame.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    const r = frame.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    frame.style.transform = `perspective(1100px) rotateY(${x * 3}deg) rotateX(${-y * 3}deg)`;
  });
  frame.addEventListener("pointerleave", () => (frame.style.transform = ""));
});

// 4. Filter dokumentasi
const chips = $$(".filters button");
chips.forEach((chip) =>
  chip.addEventListener("click", () => {
    chips.forEach((c) => c.classList.toggle("on", c === chip));
    $$(".dgroup").forEach((g) => (g.hidden = chip.dataset.f !== "all" && g.dataset.cat !== chip.dataset.f));
  }),
);

// 5. Lightbox untuk foto dan sertifikat
const lb = $("#lb");
const lbImg = $("img", lb);
const lbCap = $("#lbCap");
const closeLb = () => {
  lb.classList.remove("open");
  lb.setAttribute("aria-hidden", "true");
};
$$("[data-lb]").forEach((btn) =>
  btn.addEventListener("click", () => {
    lbImg.src = btn.dataset.src;
    lbImg.alt = lbCap.textContent = btn.dataset.cap;
    lb.classList.add("open");
    lb.setAttribute("aria-hidden", "false");
    $("#lbClose").focus();
  }),
);
$("#lbClose").addEventListener("click", closeLb);
lb.addEventListener("click", (e) => e.target === lb && closeLb());
addEventListener("keydown", (e) => e.key === "Escape" && closeLb());

// 6. Salin email
const copyBtn = $("#copyEmail");
copyBtn.addEventListener("click", async () => {
  const label = copyBtn.textContent;
  try {
    await navigator.clipboard.writeText(copyBtn.dataset.email);
    copyBtn.textContent = "Email tersalin";
  } catch {
    location.href = "mailto:" + copyBtn.dataset.email;
  }
  setTimeout(() => (copyBtn.textContent = label), 1800);
});
