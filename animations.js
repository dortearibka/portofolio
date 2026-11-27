// Animasi scroll tambahan. Muat SETELAH script.js
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // Pengunjung yang mematikan animasi di perangkatnya tidak akan melihat efek apa pun
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;

  // 1. Tentukan elemen dan arah munculnya
  const mark = (sel, dir) =>
    $$(sel).forEach((el) => {
      el.classList.add("rv");
      if (dir) el.classList.add("rv-" + dir);
    });
  mark(".sec-title, .sec-lead, .filters, .dgroup > h3, .sub, .p-info > *, .contact h2, .mail, .contact .acts, .foot");
  mark(".tl li, .cert", "left");
  mark(".tags li, .doc", "scale");
  mark(".frame", "right");

  // 2. Muncul saat masuk layar; yang masuk bersamaan dibuat berurutan
  const pending = new Set($$(".rv"));
  const show = (el, i = 0, skip = false) => {
    el.style.setProperty("--d", Math.min(i * 0.09, 0.45) + "s");
    el.classList.add("in");
    el.classList.toggle("skip", skip);
    io.unobserve(el);
    pending.delete(el);
  };
  const io = new IntersectionObserver(
    (items) =>
      items
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left)
        .forEach((e, i) => show(e.target, i)),
    { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
  );
  pending.forEach((el) => io.observe(el));

  // Elemen yang terlewat (misalnya klik menu lalu langsung loncat) langsung ditampilkan tanpa animasi
  const catchUp = () =>
    pending.forEach((el) => {
      if (el.getBoundingClientRect().bottom < 0) show(el, 0, true);
    });

  // 3. Elemen yang bergerak mengikuti scroll
  const bar = document.createElement("div");
  bar.className = "progress";
  bar.setAttribute("aria-hidden", "true");
  document.body.prepend(bar);

  const tl = $(".tl");
  const photo = $(".ph");
  const wide = matchMedia("(min-width: 901px)");
  let queued = false;

  const update = () => {
    queued = false;
    const y = scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;

    if (tl) {
      const r = tl.getBoundingClientRect();
      const p = Math.min(Math.max((innerHeight * 0.75 - r.top) / r.height, 0), 1);
      tl.style.setProperty("--p", p.toFixed(3));
    }
    if (photo && wide.matches && y < innerHeight) photo.style.transform = `translateY(${(y * 0.06).toFixed(1)}px)`;

    catchUp();
  };
  const onScroll = () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(update);
    }
  };
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);
  addEventListener("load", update);
  update();

  // 4. Ganti filter dokumentasi: foto yang tampil muncul lagi berurutan
  $$(".filters button").forEach((chip) =>
    chip.addEventListener("click", () =>
      setTimeout(() => {
        $$(".dgroup:not([hidden]) .rv").forEach((el) => {
          el.classList.remove("in", "skip");
          pending.add(el);
          io.observe(el);
        });
      }, 0),
    ),
  );
})();
