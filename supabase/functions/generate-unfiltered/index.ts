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

const LEVELS: Record<string, { name: string; guide: string; intensity: [number, number]; examples: string[] }> = {
  love_spice: {
    name: "Level I — Iskra / Spark",
    guide:
      "Light, warm, flirtatious. Attraction, chemistry, first dates, compliments, playful tension. Fun to answer in the first minutes of a game.",
    intensity: [1, 2],
    examples: ["Po czym poznajesz, że ktoś z Tobą flirtuje?", "Jaki komplement działa na Ciebie najmocniej?", "Co jako pierwsze przyciąga Twoją uwagę u drugiej osoby?", "Jaki drobny gest potrafi Cię oczarować?", "Jak wygląda Twoja idealna pierwsza randka?", "Co sprawia, że rozmowa z kimś nagle zaczyna iskrzyć?", "Wolisz flirt przez wiadomości czy na żywo? Dlaczego?", "Jaki zapach kojarzy Ci się z kimś, kto Ci się podobał?"],
  },
  after_dark: {
    name: "Level II — Bliżej / Closer",
    guide:
      "Emotional and physical closeness, trust, tenderness, needs, boundaries and consent. Sensual but never explicit.",
    intensity: [2, 4],
    examples: ["Jaki dotyk daje Ci największe poczucie bezpieczeństwa?", "Jak bez słów pokazujesz komuś, że go pragniesz?", "Czym dla Ciebie różni się bliskość od intymności?", "Czego potrzebujesz, żeby powiedzieć „nie” bez poczucia winy?", "Wolisz rozmawiać o granicach zanim coś się wydarzy, czy w trakcie?", "Co sprawia, że czujesz się naprawdę widziany/a przez partnera?", "Jaki moment czułości został z Tobą na długo?", "Jak przez lata zmieniały się Twoje potrzeby w bliskości?"],
  },
  no_limits: {
    name: "Level III — Bez tajemnic / No Secrets",
    guide:
      "Most vulnerable: fears, secrets, regrets, unspoken desires, jealousy, what love means. Deep emotional honesty, still non-explicit.",
    intensity: [3, 5],
    examples: ["Czego najbardziej boisz się pokazać w związku?", "Jakie słowa od partnera znaczyłyby dla Ciebie najwięcej, choć nigdy o nie nie poprosisz?", "Na jaki kompromis nie pójdziesz nawet z miłości?", "Jaka prawda o Tobie mogłaby kogoś zaskoczyć?", "Kiedy ostatnio udawałeś/aś, że wszystko jest w porządku?", "Jaki lęk najczęściej sabotuje Twoje związki?", "Gdyby w Twoim związku przez tydzień obowiązywała pełna szczerość – co by się zmieniło?", "Jaki wzorzec z domu rodzinnego powtarzasz w miłości?"],
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

Style examples of good Polish questions for this level (match their tone, do NOT copy them):
${meta.examples.map((e) => "- " + e).join("\n")}

STRICT RULES:
- NEVER explicit, graphic, or pornographic. No describing sexual acts or body parts.
- Emotionally intimate and psychologically insightful, never vulgar.
- Open-ended, answerable in conversation (no yes/no). One question per card, max 120 characters.
- Polish (pl) is the primary language: natural, everyday Polish, NOT a translation from English.
  Address the player as "Ty" with capital letters (Ty, Ci, Cię, Twój).
  Prefer gender-neutral phrasing (e.g. "Co sprawia, że…", "Jak…", "Kiedy ostatnio…"); if a gendered verb is unavoidable, write "zrobiłeś/aś", "pewien/pewna".
  No calques from English (e.g. avoid "podróż", "wewnętrzny żart", "być poważnym wobec kogoś").
- English (en) is a natural translation of the meaning, not word-for-word.
- Vary topics and phrasing; avoid clichés. Do not repeat or closely paraphrase anything in the avoid list.
- Assign an "intensity" integer within [${meta.intensity[0]}, ${meta.intensity[1]}].`;

    const user = `Generate ${count} distinct questions.${
      avoid.length ? ` Avoid anything similar to: ${avoid.slice(0, 40).join(" | ")}` : ""
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
