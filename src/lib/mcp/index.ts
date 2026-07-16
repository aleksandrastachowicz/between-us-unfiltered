import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listDecks from "./tools/list-decks";
import drawQuestion from "./tools/draw-question";
import listQuestions from "./tools/list-questions";

// Direct Supabase auth issuer (never the .lovable.cloud proxy). Vite inlines
// VITE_SUPABASE_PROJECT_ID at build time; the fallback keeps the issuer well-formed
// during the throwaway manifest-extract eval.
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "between-us-mcp",
  title: "Between Us",
  version: "0.1.0",
  instructions:
    "Tools for Between Us — a conversation game for deep connections. Use list_decks to see decks and categories, draw_question to pull a random question, and list_questions to browse.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listDecks, drawQuestion, listQuestions],
});