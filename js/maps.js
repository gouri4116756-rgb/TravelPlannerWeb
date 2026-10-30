(function () {
  const frame = document.querySelector("#destination-map");
  const frameWrap = document.querySelector(".map-frame-wrap");
  const list = document.querySelector("#map-results");
  if (!frame || !list) return;

  const stateFilter = document.querySelector("#map-state");
  const categoryFilter = document.querySelector("#map-category");
  const search = document.querySelector("#map-search");
  let places = window.TRAVEL_GUIDE_DATA.places;

  const requestedCategory = new URLSearchParams(location.search).get("category");
  if (requestedCategory && Array.from(categoryFilter.options).some((option) => option.value === requestedCategory)) {
    categoryFilter.value = requestedCategory;
  }

  function render() {
    const state = stateFilter.value;
    const category = categoryFilter.value;
    const query = search.value.trim().toLowerCase();
    places = window.TRAVEL_GUIDE_DATA.places.filter((place) =>
      place.state === state &&
      (!category || place.category === category) &&
      (!query || `${place.name} ${place.city} ${place.description}`.toLowerCase().includes(query))
    );
    list.innerHTML = places.map((place, index) => `
      <article class="map-result">
        <h3>${place.name}</h3><p>${place.category} · ${place.city}</p>
        <p>${place.description}</p>
        <a class="card-action" href="${TravelGuide.mapsUrl(place.query)}" target="_blank" rel="noopener noreferrer">Directions ↗</a>
        <button class="card-action" type="button" data-map-index="${index}">Show on map</button>
      </article>`).join("") || `<p class="empty-state">No places found. Change your filters to explore more.</p>`;

    if (places.length) showPlace(places[0]);
    else {
      frame.src = "";
      frame.title = "Map will appear when a place is selected";
      frameWrap.classList.remove("has-map");
    }
  }

  function showPlace(place) {
    frame.title = `Map search for ${place.name}, ${place.city}`;
    frame.src = `https://maps.google.com/maps?q=${encodeURIComponent(place.query)}&output=embed`;
    frameWrap.classList.add("has-map");
  }

  list.addEventListener("click", (event) => {
    const button = event.target.closest("[data-map-index]");
    if (button) showPlace(places[Number(button.dataset.mapIndex)]);
  });
  stateFilter.addEventListener("change", render);
  categoryFilter.addEventListener("change", render);
  search.addEventListener("input", render);
  render();
})();
