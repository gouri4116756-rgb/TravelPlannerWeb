const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (request.method !== "POST") {
    return json({ error: "Method not allowed." }, 405);
  }

  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) {
    console.error("OPENAI_API_KEY is not configured for this function.");
    return json({ error: "The AI itinerary service is not configured." }, 503);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Request body must be valid JSON." }, 400);
  }

  if (!body || typeof body !== "object") {
    return json({ error: "Invalid itinerary request." }, 400);
  }
  const input = body as Record<string, unknown>;
  if (
    typeof input.state !== "string" ||
    input.state.length > 80 ||
    typeof input.days !== "number" ||
    !Number.isInteger(input.days) ||
    input.days < 1 ||
    input.days > 14 ||
    !Array.isArray(input.places) ||
    input.places.length > 40
  ) {
    return json({ error: "Provide a state, 1–14 days and up to 40 saved places." }, 400);
  }

  const placeNames = input.places.map((place) => {
    if (!place || typeof place !== "object" || !("name" in place) || typeof place.name !== "string") {
      return null;
    }
    return place.name.slice(0, 120);
  });
  if (placeNames.some((name) => name === null)) {
    return json({ error: "Each saved place must include a name." }, 400);
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: Deno.env.get("OPENAI_MODEL") || "gpt-4.1-mini",
        input: [
          "Create a practical, relaxed day-by-day travel itinerary in India. Do not invent opening times or guarantee availability.",
          `State: ${input.state}`,
          `Days: ${input.days}`,
          `Saved places: ${placeNames.join(", ") || "Suggest a balanced local itinerary."}`,
          "Mention that travellers should verify current opening hours, routes and access locally.",
        ].join("\n"),
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error("OpenAI itinerary request failed:", response.status, detail);
      return json({ error: "The AI itinerary service could not complete the request." }, 502);
    }

    const result = await response.json();
    const output = Array.isArray(result.output) ? result.output : [];
    const itinerary = output.flatMap((item: { content?: Array<{ type?: string; text?: string }> }) =>
      (item.content || [])
        .filter((content) => content.type === "output_text")
        .map((content) => content.text || "")
    ).join("\n");
    if (!itinerary.trim()) {
      return json({ error: "The AI itinerary service returned an empty result." }, 502);
    }

    return json({ itinerary: itinerary.trim() }, 200);
  } catch (error) {
    console.error("AI itinerary request failed:", error);
    return json({ error: "The AI itinerary service is temporarily unavailable." }, 502);
  }
});

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
