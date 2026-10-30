(function () {
  const list = document.querySelector("#food-results");
  if (!list) return;
  const stateFilter = document.querySelector("#food-state");
  const search = document.querySelector("#food-search");
  const count = document.querySelector("#food-count");

  function render() {
    const state = stateFilter.value;
    const query = search.value.trim().toLowerCase();
    const foods = window.TRAVEL_GUIDE_DATA.foods.filter((food) =>
      food.state === state &&
      (!query || `${food.name} ${food.city} ${food.type} ${food.description}`.toLowerCase().includes(query))
    );
    count.textContent = `${foods.length} food ${foods.length === 1 ? "stop" : "stops"} for ${state}`;
    list.innerHTML = foods.map((food) => `
      <article class="place-card">
        <div class="place-art" aria-hidden="true">✳</div>
        <div class="place-body">
          <div class="place-meta"><span>${food.city} · ${food.state}</span><span class="tag">${food.type}</span></div>
          <h3>${food.name}</h3><p>${food.description}</p>
          <div class="card-actions"><a class="card-action" href="${TravelGuide.mapsUrl(food.query)}" target="_blank" rel="noopener noreferrer">Find nearby on Maps ↗</a></div>
        </div>
      </article>`).join("") || `<p class="empty-state">No food suggestions match that search. Try another town or state.</p>`;
  }
  stateFilter.addEventListener("change", render);
  search.addEventListener("input", render);
  render();
})();
