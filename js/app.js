(function () {
  const isInPages = window.location.pathname.toLowerCase().includes("/pages/");
  const base = isInPages ? "../" : "./";
  const links = [
    ["Explore", "index.html", "index.html"],
    ["Places & map", "pages/map.html", "map.html"],
    ["Street food", "pages/foods.html", "foods.html"],
    ["Stay", "pages/hotels.html", "hotels.html"],
    ["Itinerary", "pages/itinerary.html", "itinerary.html"]
  ];
  const currentFile = window.location.pathname.split("/").pop() || "index.html";

  const header = document.querySelector("#site-header");
  if (header) {
    header.className = "site-header";
    header.innerHTML = `<a class="brand" href="${base}index.html" aria-label="Yatra home">yatra<span class="brand-mark">.</span></a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation">Menu</button>
      <nav class="nav-links" id="primary-navigation" aria-label="Main navigation">
        ${links.map(([label, rootPath, pagePath]) => `<a href="${base}${rootPath}"${currentFile === pagePath ? ' aria-current="page"' : ""}>${label}</a>`).join("")}
      </nav>`;
    const toggle = header.querySelector(".menu-toggle");
    const nav = header.querySelector(".nav-links");
    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      nav.classList.toggle("is-open", !isOpen);
    });
  }

  const footer = document.querySelector("#site-footer");
  if (footer) {
    footer.innerHTML = `<div class="footer-inner"><span>Yatra — a slower way to discover India.</span><span>Check current timings, access rules and local guidance before travelling.</span><a href="${base}README.md">About this guide</a></div>`;
  }

  window.TravelGuide = {
    mapsUrl(query) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    },
    addToItinerary(place) {
      const itinerary = this.getItinerary();
      if (itinerary.some((item) => item.id === place.id)) return false;
      itinerary.push({ id: place.id, name: place.name, city: place.city, state: place.state, category: place.category });
      localStorage.setItem("yatra-itinerary", JSON.stringify(itinerary));
      return true;
    },
    getItinerary() {
      try {
        const saved = JSON.parse(localStorage.getItem("yatra-itinerary") || "[]");
        if (!Array.isArray(saved)) return [];
        return saved
          .filter((item) => item && typeof item.id === "string")
          .map((item) => window.TRAVEL_GUIDE_DATA.places.find((place) => place.id === item.id))
          .filter(Boolean)
          .filter((place, index, places) => places.findIndex((item) => item.id === place.id) === index)
          .map(({ id, name, city, state, category }) => ({ id, name, city, state, category }));
      } catch {
        return [];
      }
    },
    clearItinerary() {
      localStorage.removeItem("yatra-itinerary");
    }
  };
})();
