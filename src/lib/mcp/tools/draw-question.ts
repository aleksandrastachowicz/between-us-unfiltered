import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { CATEGORY_META, QUESTIONS, type CategoryId, type DeckId } from "@/data/questions";

export default defineTool({
  name: "draw_question",
  title: "Draw a question",
  description:
    "Draw one random question from the Between Us deck. Optionally filter by deck or category, and pick a language.",
  inputSchema: {
    lang: z.enum(["pl", "en"]).default("en").describe("Language for the question text."),
    deck: z.enum(["basic", "plus", "unfiltered"]).optional().describe("Restrict to a single deck."),
    category: z.string().optional().describe("Restrict to a single category id (see list_decks)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: false, openWorldHint: false },
  handler: ({ lang, deck, category }) => {
    let pool = QUESTIONS;
    if (deck) pool = pool.filter((q) => q.deck === (deck as DeckId));
    if (category) {
      if (!(category in CATEGORY_META)) {
        return { content: [{ type: "text", text: `Unknown category: ${category}` }], isError: true };
      }
      pool = pool.filter((q) => q.category === (category as CategoryId));
    }
    if (pool.length === 0) {
      return { content: [{ type: "text", text: "No questions match that filter." }], isError: true };
    }
    const pick = pool[Math.floor(Math.random() * pool.length)];
    const payload = {
      id: pick.id,
      deck: pick.deck,
      category: pick.category,
      categoryLabel: CATEGORY_META[pick.category].label[lang],
      question: pick[lang],
    };
    return {
      content: [{ type: "text", text: payload.question }],
      structuredContent: payload,
    };
  },
});