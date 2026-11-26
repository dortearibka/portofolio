// 1. Navigasi Menu Utama
const navTabs = document.querySelectorAll(".nav-tab");
const stageSections = document.querySelectorAll(".stage-section");
const projectIndexList = document.getElementById("projectIndexList");

navTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.getAttribute("data-section");

    navTabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    stageSections.forEach((sec) => {
      sec.classList.toggle("active", sec.id === `sec-${target}`);
    });

    projectIndexList.classList.toggle("hidden", target !== "works");
  });
});

// 2. Navigasi Daftar Proyek (01 - 03)
const indexRows = document.querySelectorAll(".index-row");
const projectViews = document.querySelectorAll(".project-view");

indexRows.forEach((row) => {
  row.addEventListener("click", () => {
    const projId = row.getAttribute("data-project");

    indexRows.forEach((r) => r.classList.remove("active"));
    row.classList.add("active");

    projectViews.forEach((view) => {
      view.classList.toggle("active", view.id === `proj-${projId}`);
    });
  });
});

// 3. Switch Mockup vs Design System
document.querySelectorAll(".artboard-frame").forEach((frame) => {
  const pills = frame.querySelectorAll(".screen-pill");
  const panels = frame.querySelectorAll(".screen-panel");

  pills.forEach((pill) => {
    pill.addEventListener("click", () => {
      const targetId = pill.getAttribute("data-target");

      pills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");

      panels.forEach((panel) => {
        panel.classList.toggle("active", panel.id === targetId);
      });
    });
  });
});

// 4. Filter Kategori Dokumentasi
const filterChips = document.querySelectorAll(".filter-chip");
const docCards = document.querySelectorAll(".doc-card");

filterChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    const filter = chip.getAttribute("data-filter");

    filterChips.forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");

    docCards.forEach((card) => {
      const match = filter === "all" || card.getAttribute("data-category") === filter;
      card.classList.toggle("hidden", !match);
    });
  });
});

// 5. Lightbox Foto Dokumentasi
const docLightbox = document.getElementById("docLightbox");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxBody = document.getElementById("lightboxBody");
const closeLightboxBtn = document.getElementById("closeLightboxBtn");

document.querySelectorAll(".doc-thumb").forEach((thumb) => {
  thumb.addEventListener("click", () => {
    const imgEl = thumb.querySelector("img");
    const fullSrc = thumb.getAttribute("data-full") || (imgEl ? imgEl.src : "");
    const caption = thumb.getAttribute("data-caption") || "";

    lightboxCaption.textContent = caption;
    lightboxBody.innerHTML = fullSrc ? `<img src="${fullSrc}" alt="${caption}" />` : `<p>Simpan foto dokumentasi di folder <code>assets/</code> lalu pasang di <code>index.html</code>.</p>`;

    docLightbox.hidden = false;
  });
});

if (closeLightboxBtn) {
  closeLightboxBtn.addEventListener("click", () => {
    docLightbox.hidden = true;
  });
}

// 6. Pratinjau Sertifikat
const certData = {
  techofest: {
    title: "UI/UX Designer di Techofest 2024",
    image: "assets/UIUX Designer.jpg",
  },
  msib: {
    title: "Web Development & UI/UX, MSIB Studi Independen 2024",
    image: "assets/Stupen.jpg",
  },
  lokatana: {
    title: "Volunteer Lokatana 2025",
    image: "assets/Volunteer.jpg",
  },
};

const certPreviewBox = document.getElementById("certPreviewBox");
const certTitle = document.getElementById("certTitle");
const certBody = document.getElementById("certBody");
const closeCertBtn = document.getElementById("closeCertBtn");

document.querySelectorAll(".cert-row").forEach((row) => {
  row.addEventListener("click", () => {
    const key = row.getAttribute("data-cert");
    const item = certData[key];
    if (!item) return;

    certTitle.textContent = item.title;
    certBody.innerHTML = item.image ? `<img src="${item.image}" alt="${item.title}" />` : `<p>Simpan gambar sertifikat di folder <code>assets/</code> lalu isi path-nya di <code>script.js</code>.</p>`;

    certPreviewBox.hidden = false;
  });
});

if (closeCertBtn) {
  closeCertBtn.addEventListener("click", () => {
    certPreviewBox.hidden = true;
  });
}

// 7. Salin Email
const copyEmailBtn = document.getElementById("copyEmailBtn");
if (copyEmailBtn) {
  copyEmailBtn.addEventListener("click", () => {
    const email = copyEmailBtn.getAttribute("data-email");
    navigator.clipboard?.writeText(email);
    const prev = copyEmailBtn.textContent;
    copyEmailBtn.textContent = "Email tersalin!";
    setTimeout(() => {
      copyEmailBtn.textContent = prev;
    }, 1500);
  });
}
