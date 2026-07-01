// Between Us — LLM-powered Unfiltered question generator.
// Produces open-ended, NON-EXPLICIT relationship-psychology prompts across
// three progressive intimacy levels. Bilingual (PL + EN).
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const LEVELS: Record<string, { name: string; guide: string; intensity: [number, number] }> = {
  love_spice: {
    name: "Level I — Love & Spice",
    guide:
      "Light, warm, flirtatious. About attraction, chemistry, romance, playful tension. Keep it sweet and inviting.",
    intensity: [1, 2],
  },
  after_dark: {
    name: "Level II — After Dark",
    guide:
      "Deeper emotional intimacy. About desire, safety, vulnerability, needs, trust in closeness. Sensual but never explicit.",
    intensity: [2, 4],
  },
  no_limits: {
    name: "Level III — No Limits",
    guide:
      "Most vulnerable and revealing. About unspoken desires, fears, compatibility, radical honesty. Provocative in emotional depth, still non-explicit.",
    intensity: [3, 5],
  },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { level = "love_spice", count = 6, avoid = [] } = await req.json().catch(() => ({}));
    const meta = LEVELS[level] ?? LEVELS.love_spice;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const system = `You are the question engine for "Between Us", an intimate conversation card game for couples and close connections.

Generate thought-provoking, open-ended conversation questions for: ${meta.name}.
Tone/scope for this level: ${meta.guide}

STRICT RULES:
- NEVER explicit, graphic, or pornographic. No describing sexual acts or body parts crudely.
- Emotionally intimate and psychologically insightful, not vulgar.
- Each question must be answerable in conversation, open-ended (no yes/no).
- Provide BOTH natural Polish (pl) and natural English (en) — real translations, not literal.
- Vary phrasing; avoid clichés. Do not repeat any question in the avoid list.
- Assign an "intensity" integer within [${meta.intensity[0]}, ${meta.intensity[1]}].`;

    const user = `Generate ${count} distinct questions.${
      avoid.length ? ` Avoid anything similar to: ${avoid.slice(0, 20).join(" | ")}` : ""
    }`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "emit_questions",
              description: "Return the generated bilingual questions.",
              parameters: {
                type: "object",
                properties: {
                  questions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        pl: { type: "string" },
                        en: { type: "string" },
                        intensity: { type: "integer" },
                      },
                      required: ["pl", "en", "intensity"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["questions"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "emit_questions" } },
      }),
    });

    if (resp.status === 429) {
      return new Response(JSON.stringify({ error: "rate_limited" }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (resp.status === 402) {
      return new Response(JSON.stringify({ error: "payment_required" }), {
        status: 402,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!resp.ok) {
      const txt = await resp.text();
      console.error("AI gateway error", resp.status, txt);
      return new Response(JSON.stringify({ error: "ai_error" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await resp.json();
    const call = data.choices?.[0]?.message?.tool_calls?.[0];
    let questions: Array<{ pl: string; en: string; intensity: number }> = [];
    if (call?.function?.arguments) {
      try {
        questions = JSON.parse(call.function.arguments).questions ?? [];
      } catch (_e) {
        questions = [];
      }
    }

    const [lo, hi] = meta.intensity;
    questions = questions
      .filter((q) => q?.pl && q?.en)
      .map((q, i) => ({
        id: `uf-ai-${level}-${Date.now()}-${i}`,
        pl: q.pl.trim(),
        en: q.en.trim(),
        level,
        intensity: Math.min(hi, Math.max(lo, Number(q.intensity) || lo)),
      }));

    return new Response(JSON.stringify({ questions }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-unfiltered failed", e);
    return new Response(JSON.stringify({ error: "internal" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
