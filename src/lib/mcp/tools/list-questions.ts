import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { QUESTIONS, type CategoryId, type DeckId } from "@/data/questions";

export default defineTool({
  name: "list_questions",
  title: "List questions",
  description:
    "List Between Us questions with optional filters. Returns paginated results with { items, nextOffset, total }.",
  inputSchema: {
    lang: z.enum(["pl", "en"]).default("en"),
    deck: z.enum(["basic", "plus", "unfiltered"]).optional(),
    category: z.string().optional(),
    limit: z.number().int().min(1).max(100).default(20),
    offset: z.number().int().min(0).default(0),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ lang, deck, category, limit, offset }) => {
    let pool = QUESTIONS;
    if (deck) pool = pool.filter((q) => q.deck === (deck as DeckId));
    if (category) pool = pool.filter((q) => q.category === (category as CategoryId));
    const items = pool.slice(offset, offset + limit).map((q) => ({
      id: q.id,
      deck: q.deck,
      category: q.category,
      question: q[lang],
    }));
    const nextOffset = offset + items.length < pool.length ? offset + items.length : null;
    const payload = { items, total: pool.length, nextOffset };
    return {
      content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
      structuredContent: payload,
    };
  },
});