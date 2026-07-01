// Client-side buffered fetcher for LLM-powered Unfiltered questions.
// Keeps a per-level queue topped up from the edge function; falls back to the
// local procedural generator when the AI is unavailable / rate-limited.
import { supabase } from "@/integrations/supabase/client";
import type { UnfilteredLevel } from "@/data/questions";
import {
  generateUnfiltered as generateLocal,
  levelForProgress,
  type UnfilteredQuestion,
} from "@/data/unfiltered";

const BUFFER: Record<UnfilteredLevel, UnfilteredQuestion[]> = {
  love_spice: [],
  after_dark: [],
  no_limits: [],
};
const inflight: Partial<Record<UnfilteredLevel, Promise<void>>> = {};
const recent: string[] = [];

const LOW_WATER = 2;
const BATCH = 6;

function remember(q: UnfilteredQuestion) {
  recent.push(q.en);
  if (recent.length > 40) recent.shift();
}

async function refill(level: UnfilteredLevel): Promise<void> {
  if (inflight[level]) return inflight[level];
  const task = (async () => {
    try {
      const { data, error } = await supabase.functions.invoke("generate-unfiltered", {
        body: { level, count: BATCH, avoid: recent.slice(-20) },
      });
      if (error) throw error;
      const questions = (data?.questions ?? []) as UnfilteredQuestion[];
      if (Array.isArray(questions) && questions.length) {
        BUFFER[level].push(...questions);
      }
    } catch (e) {
      // silent: local fallback covers the draw
      console.warn("Unfiltered AI refill failed, using local generator", e);
    } finally {
      delete inflight[level];
    }
  })();
  inflight[level] = task;
  return task;
}

/** Warm the buffer for the level a given progress maps to. */
export function primeUnfiltered(progress: number) {
  const level = levelForProgress(progress);
  if (BUFFER[level].length < LOW_WATER) void refill(level);
}

/**
 * Returns an Unfiltered question for the given progress. Prefers AI-generated
 * content from the buffer; always resolves instantly via local fallback and
 * kicks off a background refill when the buffer runs low.
 */
export function nextUnfiltered(progress: number): UnfilteredQuestion {
  const level = levelForProgress(progress);
  if (BUFFER[level].length <= LOW_WATER) void refill(level);

  const q = BUFFER[level].shift();
  if (q) {
    remember(q);
    return q;
  }
  const local = generateLocal(progress);
  remember(local);
  return local;
}
