(function () {
  const config = window.TRAVEL_GUIDE_CONFIG || {};
  const supabase = {
    get isConfigured() {
      return Boolean(config.SUPABASE_URL && config.SUPABASE_ANON_KEY);
    },
    async request(path, options = {}) {
      if (!this.isConfigured) {
        throw new Error("Cloud sync is not configured. This guide works locally without Supabase.");
      }
      const response = await fetch(`${config.SUPABASE_URL.replace(/\/$/, "")}/rest/v1/${path}`, {
        ...options,
        headers: {
          apikey: config.SUPABASE_ANON_KEY,
          Authorization: `Bearer ${config.SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          ...(options.headers || {})
        }
      });
      if (!response.ok) throw new Error(`Supabase request failed (${response.status}).`);
      return response.status === 204 ? null : response.json();
    }
  };
  window.TravelGuideSupabase = supabase;
})();
