// Animasi scroll bertema Figma. Muat SETELAH script.js
(() => {
  // Aman dimuat di <head> maupun di akhir <body>: jalan setelah halaman selesai dibaca
  const start = () => {
    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => [...r.querySelectorAll(s)];
    if (!("IntersectionObserver" in window)) return;

    // ?animasi=on memaksa animasi penuh di perangkat ini (tersimpan), ?animasi=off mengembalikannya
    let forced = false;
    try {
      const q = new URLSearchParams(location.search).get("animasi");
      if (q === "on") localStorage.setItem("animasi", "on");
      if (q === "off") localStorage.removeItem("animasi");
      forced = localStorage.getItem("animasi") === "on";
    } catch {}
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches && !forced;
    if (calm) document.documentElement.classList.add("calm");

    // 1. Tentukan efek tiap elemen
    const add = (sel, ...c) => $$(sel).forEach((el) => el.classList.add("fx", ...c));
    const T = ".sec-title, .p-info h3, .contact h2, .sub";
    const F = ".sec-lead, .filters, .p-info > :not(h3), .dgroup > h3, .mail, .contact .acts, .foot";
    if (calm) {
      add([T, F, ".tl li, .cert, .tags li, .doc, .frame"].join(","), "rv");
    } else {
      $$(T).forEach((el) => {
        const text = el.textContent.trim();
        el.setAttribute("aria-label", text);
        el.textContent = "";
        text.split(/\s+/).forEach((word, i) => {
          const w = document.createElement("span");
          const s = document.createElement("span");
          w.className = "w";
          w.setAttribute("aria-hidden", "true");
          s.textContent = word;
          s.style.setProperty("--i", i);
          w.append(s);
          el.append(w, " ");
        });
      });
      add(T, "sp");
      add(F, "rv");
      add(".tl li, .cert", "rv", "rv-left");
      add(".tags li", "rv", "rv-pop");
      add(".doc", "cur");

      // Pita skill di antara Tentang dan Proyek
      const skills = $$(".tags li")
        .map((li) => li.textContent)
        .filter((t) => !/word/i.test(t));
      const strip = document.createElement("div");
      strip.className = "strip";
      strip.setAttribute("aria-hidden", "true");
      const row = (list) => {
        const d = document.createElement("div");
        d.className = "tr";
        [...list, ...list, ...list].forEach((t) => {
          const s = document.createElement("span");
          s.textContent = t;
          d.append(s);
        });
        return d;
      };
      strip.append(row(skills), row([...skills].reverse()));
      $("#proyek").before(strip);
    }

    // 2. Muncul saat masuk layar; yang masuk bersamaan dibuat berurutan
    const pending = new Set($$(".fx"));
    const show = (el, i = 0, skip = false) => {
      el.style.setProperty("--d", Math.min(i * 0.08, 0.4) + "s");
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
    const catchUp = () =>
      pending.forEach((el) => {
        if (el.getBoundingClientRect().bottom < 0) show(el, 0, true);
      });

    // 3. Efek yang mengikuti scroll
    const bar = document.createElement("div");
    bar.className = "progress";
    bar.setAttribute("aria-hidden", "true");
    document.body.prepend(bar);

    const tl = $(".tl");
    const heroText = $(".hero-text");
    const photo = $(".ph");
    const rows = $$(".strip .tr");
    const strip = $(".strip");
    const wide = matchMedia("(min-width: 901px)");
    let queued = false;

    const update = () => {
      queued = false;
      const y = scrollY;
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;

      if (tl) {
        const r = tl.getBoundingClientRect();
        tl.style.setProperty("--p", Math.min(Math.max((innerHeight * 0.75 - r.top) / r.height, 0), 1).toFixed(3));
      }
      if (!calm) {
        if (photo && wide.matches && y < innerHeight) photo.style.transform = `translateY(${(y * 0.04).toFixed(1)}px)`;
        // Teks hero ikut naik dan memudar saat mulai di-scroll
        if (heroText && y < innerHeight) {
          heroText.style.transform = `translateY(${(y * 0.1).toFixed(1)}px)`;
          heroText.style.opacity = Math.max(0, 1 - y / (innerHeight * 1.2)).toFixed(2);
        }
        // Dua baris pita skill bergeser berlawanan arah
        if (strip) {
          const r = strip.getBoundingClientRect();
          const d = r.top + r.height / 2 - innerHeight / 2;
          rows[0].style.transform = `translateX(${(d * 0.25 - 300).toFixed(1)}px)`;
          rows[1].style.transform = `translateX(${(-d * 0.25 - 1500).toFixed(1)}px)`;
        }
      }
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

    // 4. Ganti filter dokumentasi: foto yang tampil terbuka lagi berurutan
    $$(".filters button").forEach((chip) =>
      chip.addEventListener("click", () =>
        setTimeout(() => {
          $$(".dgroup:not([hidden]) .fx").forEach((el) => {
            el.classList.remove("in", "skip");
            pending.add(el);
            io.observe(el);
          });
        }, 0),
      ),
    );
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
