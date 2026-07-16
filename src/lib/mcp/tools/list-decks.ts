import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { CATEGORY_META, EDITION_META, QUESTIONS, type DeckId } from "@/data/questions";

const DECKS: DeckId[] = ["basic", "plus", "unfiltered"];

export default defineTool({
  name: "list_decks",
  title: "List decks",
  description:
    "List the available Between Us question decks (basic, plus, unfiltered) with their categories and question counts.",
  inputSchema: {
    lang: z.enum(["pl", "en"]).default("en").describe("Language for deck/category labels."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ lang }) => {
    const decks = DECKS.map((deck) => {
      const categories = Object.values(CATEGORY_META)
        .filter((c) => c.deck === deck)
        .map((c) => ({
          id: c.id,
          label: c.label[lang],
          questionCount: QUESTIONS.filter((q) => q.category === c.id).length,
        }));
      return {
        id: deck,
        label: EDITION_META[deck][lang],
        questionCount: QUESTIONS.filter((q) => q.deck === deck).length,
        categories,
      };
    });
    return {
      content: [{ type: "text", text: JSON.stringify(decks, null, 2) }],
      structuredContent: { decks },
    };
  },
});