(function () {
  window.TravelGuideAI = {
    async makeItinerary({ state, days, places }) {
      const config = window.TRAVEL_GUIDE_CONFIG || {};
      if (!config.SUPABASE_URL || !config.SUPABASE_ANON_KEY) {
        return null;
      }
      const response = await fetch(`${config.SUPABASE_URL.replace(/\/$/, "")}/functions/v1/plan-itinerary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: config.SUPABASE_ANON_KEY,
          Authorization: `Bearer ${config.SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ state, days, places })
      });
      if (!response.ok) throw new Error(`AI planner request failed (${response.status}).`);
      return response.json();
    }
  };
})();
