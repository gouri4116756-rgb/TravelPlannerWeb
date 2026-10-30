(function () {
  const form = document.querySelector("#discover-search");
  const results = document.querySelector("#place-results");
  if (!form || !results) return;

  const stateFilter = document.querySelector("#state-filter");
  const search = document.querySelector("#search-query");
  const categoryFilters = document.querySelector("#category-filters");
  const count = document.querySelector("#results-count");
  const categories = ["All", "Architecture", "Temple", "Viewpoint", "Street food"];
  let selectedCategory = "All";

  categoryFilters.innerHTML = categories.map((name) =>
    `<button class="filter-chip" type="button" aria-pressed="${name === selectedCategory}" data-category="${name}">${name}</button>`
  ).join("");

  categoryFilters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    selectedCategory = button.dataset.category;
    categoryFilters.querySelectorAll("[data-category]").forEach((chip) =>
      chip.setAttribute("aria-pressed", String(chip === button))
    );
    render();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    render();
  });
  search.addEventListener("input", render);
  stateFilter.addEventListener("change", render);

  function render() {
    const state = stateFilter.value;
    const query = search.value.trim().toLowerCase();
    const matches = window.TRAVEL_GUIDE_DATA.places.filter((place) => {
      const text = `${place.name} ${place.city} ${place.state} ${place.category} ${place.description}`.toLowerCase();
      return place.state === state &&
        (selectedCategory === "All" || place.category === selectedCategory) &&
        (!query || text.includes(query));
    });

    count.textContent = `${matches.length} ${matches.length === 1 ? "place" : "places"} in ${state}`;
    results.innerHTML = matches.map((place) => `
      <article class="place-card">
        <div class="place-art" aria-hidden="true">${place.symbol}</div>
        <div class="place-body">
          <div class="place-meta"><span>${place.city} · ${place.state}</span><span class="tag">${place.category}</span></div>
          <h3>${place.name}</h3>
          <p>${place.description}</p>
          <div class="card-actions">
            <a class="card-action" href="${TravelGuide.mapsUrl(place.query)}" target="_blank" rel="noopener noreferrer">Open in Google Maps ↗</a>
            <button class="card-action" type="button" data-add="${place.id}">＋ Add to trip</button>
          </div>
        </div>
      </article>`).join("") || `<p class="empty-state">No matches yet. Try another category or search term.</p>`;
  }

  results.addEventListener("click", (event) => {
    const button = event.target.closest("[data-add]");
    if (!button) return;
    const place = window.TRAVEL_GUIDE_DATA.places.find((item) => item.id === button.dataset.add);
    if (!place) return;
    const added = TravelGuide.addToItinerary(place);
    button.textContent = added ? "✓ Added" : "✓ Already on your trip";
  });

  const requestedCategory = new URLSearchParams(location.search).get("category");
  if (categories.includes(requestedCategory)) {
    selectedCategory = requestedCategory;
    categoryFilters.querySelectorAll("[data-category]").forEach((chip) =>
      chip.setAttribute("aria-pressed", String(chip.dataset.category === selectedCategory))
    );
  }
  render();
})();
