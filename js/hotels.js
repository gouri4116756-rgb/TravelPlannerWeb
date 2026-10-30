(function () {
  const list = document.querySelector("#hotel-results");
  if (!list) return;
  const stateFilter = document.querySelector("#hotel-state");
  const search = document.querySelector("#hotel-search");
  const count = document.querySelector("#hotel-count");

  function render() {
    const state = stateFilter.value;
    const query = search.value.trim().toLowerCase();
    const hotels = window.TRAVEL_GUIDE_DATA.hotels.filter((hotel) =>
      hotel.state === state &&
      (!query || `${hotel.city} ${hotel.areas} ${hotel.state}`.toLowerCase().includes(query))
    );
    count.textContent = `${hotels.length} areas to explore in ${state}`;
    list.innerHTML = hotels.map((hotel) => `
      <article class="place-card">
        <div class="place-art" aria-hidden="true">⌂</div>
        <div class="place-body">
          <div class="place-meta"><span>${hotel.state}</span><span class="tag">Stay nearby</span></div>
          <h3>${hotel.city}</h3><p>${hotel.areas}</p>
          <div class="card-actions"><a class="card-action" href="${TravelGuide.mapsUrl(hotel.query)}" target="_blank" rel="noopener noreferrer">Search stays on Maps ↗</a></div>
        </div>
      </article>`).join("") || `<p class="empty-state">No areas match your search. Try another town or state.</p>`;
  }
  stateFilter.addEventListener("change", render);
  search.addEventListener("input", render);
  render();
})();
