(function () {
  const savedPlaces = document.querySelector("#saved-places");
  if (!savedPlaces) return;
  const stateSelect = document.querySelector("#trip-state");
  const daysSelect = document.querySelector("#trip-days");
  const output = document.querySelector("#itinerary-output");
  const notice = document.querySelector("#itinerary-notice");

  function renderSaved() {
    const items = TravelGuide.getItinerary();
    savedPlaces.innerHTML = items.length
      ? items.map((item, index) => `<div class="saved-item"><span><strong>${item.name}</strong><br><small>${item.city}, ${item.state} · ${item.category}</small></span><button class="card-action" type="button" data-remove="${index}">Remove</button></div>`).join("")
      : `<p class="empty-state">No stops saved yet. Browse <a href="../index.html#explore">the Karnataka guide</a> and add a few places to your trip.</p>`;
  }

  savedPlaces.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove]");
    if (!button) return;
    const items = TravelGuide.getItinerary();
    items.splice(Number(button.dataset.remove), 1);
    localStorage.setItem("yatra-itinerary", JSON.stringify(items));
    renderSaved();
  });

  document.querySelector("#clear-itinerary").addEventListener("click", () => {
    TravelGuide.clearItinerary();
    output.innerHTML = "";
    renderSaved();
    notice.textContent = "Your saved stops have been cleared.";
  });

  function distribute(items, days) {
    return Array.from({ length: days }, (_, index) => ({
      number: index + 1,
      places: items.filter((_, placeIndex) => placeIndex % days === index)
    }));
  }

  document.querySelector("#build-itinerary").addEventListener("click", () => {
    const state = stateSelect.value;
    const days = Number(daysSelect.value);
    const selected = TravelGuide.getItinerary().filter((place) => place.state === state);
    const suggested = window.TRAVEL_GUIDE_DATA.places.filter((place) => place.state === state);
    const stops = selected.length ? selected : suggested.slice(0, Math.min(days * 2, 6));
    if (!selected.length && stops.length) {
      notice.textContent = `No saved stops for ${state} yet, so we added a few local suggestions. Add your own places from Explore whenever you like.`;
      stops.forEach((place) => TravelGuide.addToItinerary(place));
      renderSaved();
    }
    output.innerHTML = `<h2>Your ${days}-day ${state} starter plan</h2>${distribute(stops, days).map((day) => {
      const names = day.places.length ? day.places.map((place) => place.name).join(" → ") : "Keep this day flexible; explore at your own pace";
      return `<article class="itinerary-day"><h3>Day ${day.number}</h3><p>${names}. Leave time between stops for meals, travel and local discoveries.</p></article>`;
    }).join("")}<p class="notice">A rough idea, not a timed route. Check travel distances, current opening hours, local access rules and weather before you go.</p>`;
  });

  document.querySelector("#ai-itinerary").addEventListener("click", async (event) => {
    const button = event.currentTarget;
    if (!TravelGuideSupabase.isConfigured) {
      notice.textContent = "AI planning isn't configured yet. Add your Supabase project URL and public anon key to a local js/config.js, deploy the plan-itinerary Edge Function, and keep AI provider secrets on the server. Your local itinerary works without it.";
      return;
    }
    button.disabled = true;
    notice.textContent = "Asking your itinerary assistant…";
    try {
      const result = await TravelGuideAI.makeItinerary({
        state: stateSelect.value,
        days: Number(daysSelect.value),
        places: TravelGuide.getItinerary()
      });
      output.textContent = result.itinerary || "The AI planner returned no itinerary.";
      notice.textContent = "Your AI itinerary is ready.";
    } catch (error) {
      notice.textContent = error instanceof Error ? error.message : "The AI planner could not be reached.";
    } finally {
      button.disabled = false;
    }
  });

  renderSaved();
})();
