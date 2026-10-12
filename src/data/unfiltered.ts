// Between Us — Unfiltered (18+) progressive engine.
// Non-explicit, open-ended relationship-psychology prompts only.
import type { QuestionText, UnfilteredLevel } from "./questions";

export interface UnfilteredQuestion extends QuestionText {
  id: string;
  level: UnfilteredLevel;
  intensity: number; // 1-5
}

export const UNFILTERED_LEVELS: Record<
  UnfilteredLevel,
  { label: QuestionText; emoji: string; range: [number, number]; intensity: [number, number] }
> = {
  love_spice: {
    label: { pl: "Poziom I — Love & Spice", en: "Level I — Love & Spice" },
    emoji: "❤️",
    range: [0, 20],
    intensity: [1, 2],
  },
  after_dark: {
    label: { pl: "Poziom II — After Dark", en: "Level II — After Dark" },
    emoji: "🔥",
    range: [21, 80],
    intensity: [2, 4],
  },
  no_limits: {
    label: { pl: "Poziom III — No Limits", en: "Level III — No Limits" },
    emoji: "🖤",
    range: [81, 100],
    intensity: [3, 5],
  },
};

export function levelForProgress(progress: number): UnfilteredLevel {
  if (progress <= 20) return "love_spice";
  if (progress <= 80) return "after_dark";
  return "no_limits";
}

// Curated seed baseline (directional anchors per the spec).
const SEED: Record<UnfilteredLevel, QuestionText[]> = {
  love_spice: [
    { pl: "Jaki rodzaj uwagi sprawia, że natychmiast czujesz się pożądany/a?", en: "What kind of attention makes you feel instantly desired?" },
    { pl: "Co jest taką subtelną rzeczą, która sprawia, że ktoś staje się dla Ciebie atrakcyjny?", en: "What's something subtle that makes someone attractive to you?" },
    { pl: "Kiedy czujesz się najbardziej pewnie w towarzystwie kogoś, kto Ci się podoba?", en: "When do you feel most confident around someone you like?" },
    { pl: "Jaki rodzaj chemii między ludźmi uważasz za prawdziwy?", en: "What kind of chemistry feels real to you?" },
    { pl: "Co sprawia, że napięcie romantyczne staje się dla Ciebie ekscytujące?", en: "What makes romantic tension exciting for you?" },
  ],
  after_dark: [
    { pl: "Co pomaga Ci poczuć się całkowicie bezpiecznie, gdy otwierasz się przed drugą osobą?", en: "What helps you feel completely safe opening up to someone?" },
    { pl: "Czego się dowiedziałeś/aś o swoich własnych potrzebach intymnych w związkach?", en: "What's something you've learned about your own needs in relationships?" },
    { pl: "Co sprawia, że czujesz się naprawdę pożądany/a w relacji?", en: "What makes you feel truly desired in a relationship?" },
    { pl: "Co było dla Ciebie najtrudniejsze do skomunikowania w sferze intymnej?", en: "What's something you've found hard to communicate in intimacy?" },
    { pl: "Czym dla Ciebie jest bezpieczeństwo emocjonalne w bliskich relacjach?", en: "What does emotional safety mean to you in close relationships?" },
  ],
  no_limits: [
    { pl: "Jakie jest pragnienie, którego nigdy w pełni nie wyraziłeś/aś głośno?", en: "What's a desire you've never fully expressed?" },
    { pl: "Jak myślisz, jakich tematów ludzie najbardziej unikają w rozmowach o związkach?", en: "What's something you think people avoid talking about in relationships?" },
    { pl: "Co oznacza dla Ciebie prawdziwe dopasowanie i kompatybilność?", en: "What does true compatibility mean to you?" },
    { pl: "Jakie przekonanie na temat relacji zmieniłeś/aś wraz z upływem czasu?", en: "What's a belief about relationships you've changed over time?" },
    { pl: "Jaki rodzaj emocjonalnej szczerości przychodzi Ci z największym trudem?", en: "What kind of emotional honesty feels hardest for you?" },
  ],
};

// Procedural template fragments keep the deck infinite. Open-ended, non-explicit.
type Frag = { pl: string; en: string };

const TOPICS: Record<UnfilteredLevel, Frag[]> = {
  love_spice: [
    { pl: "pierwsze iskry przyciągania", en: "the first sparks of attraction" },
    { pl: "flirtowanie, które wydaje się szczere", en: "flirting that feels genuine" },
    { pl: "moment, gdy poczułeś/aś prawdziwą chemię", en: "the moment you felt real chemistry" },
    { pl: "subtelne gesty, które Cię urzekają", en: "the subtle gestures that win you over" },
    { pl: "napięcie tuż przed pierwszym pocałunkiem", en: "the tension right before a first kiss" },
    { pl: "rodzaj uwagi, który sprawia, że tajesz", en: "the kind of attention that makes you melt" },
  ],
  after_dark: [
    { pl: "poczucie bezpieczeństwa przy drugiej osobie", en: "feeling safe with another person" },
    { pl: "komunikowanie swoich potrzeb intymnych", en: "communicating your intimate needs" },
    { pl: "granice, które są dla Ciebie ważne", en: "the boundaries that matter to you" },
    { pl: "to, co sprawia, że czujesz się pożądany/a", en: "what makes you feel truly desired" },
    { pl: "zaufanie, które buduje bliskość", en: "the trust that builds closeness" },
    { pl: "pragnienia, o których trudno mówić", en: "desires that are hard to talk about" },
  ],
  no_limits: [
    { pl: "Twoja najgłębsza emocjonalna prawda", en: "your deepest emotional truth" },
    { pl: "prawdziwa kompatybilność na dłuższą metę", en: "real long-term compatibility" },
    { pl: "lęki, które ukrywasz w związkach", en: "the fears you hide in relationships" },
    { pl: "wartości, których nigdy byś nie poświęcił/a", en: "values you would never compromise" },
    { pl: "wrażliwość, którą rzadko komuś pokazujesz", en: "the vulnerability you rarely show" },
    { pl: "szczerość, która przychodzi z największym trudem", en: "the honesty that comes hardest" },
  ],
};

const FRAMES: Frag[] = [
  { pl: "Co {topic} mówi o tym, czego naprawdę szukasz?", en: "What does {topic} reveal about what you're really looking for?" },
  { pl: "Opowiedz o chwili, kiedy {topic} całkowicie Cię zaskoczyło.", en: "Tell me about a time {topic} caught you completely off guard." },
  { pl: "Jak zmieniło się Twoje podejście do tego, czym jest {topic}?", en: "How has your understanding of {topic} changed over time?" },
  { pl: "Czego chciałbyś/ałabyś, żeby druga osoba zrozumiała o {topic} w Twoim przypadku?", en: "What do you wish a partner understood about {topic} for you?" },
  { pl: "Kiedy ostatnio naprawdę poczułeś/aś {topic}?", en: "When did you last truly feel {topic}?" },
  { pl: "Co sprawia, że {topic} jest dla Ciebie bezpieczne i ekscytujące zarazem?", en: "What makes {topic} feel both safe and exciting for you?" },
];

function fill(tmpl: Frag, topic: Frag): Frag {
  return {
    pl: tmpl.pl.replace("{topic}", topic.pl),
    en: tmpl.en.replace("{topic}", topic.en),
  };
}

let counter = 0;

/** Returns a fresh Unfiltered question for the given progress. Never runs out. */
export function generateUnfiltered(progress: number): UnfilteredQuestion {
  const level = levelForProgress(progress);
  const meta = UNFILTERED_LEVELS[level];
  const intensity =
    meta.intensity[0] +
    Math.floor(Math.random() * (meta.intensity[1] - meta.intensity[0] + 1));

  // Mix in seeds early, then lean on procedural variation.
  const seeds = SEED[level];
  if (Math.random() < 0.35) {
    const s = seeds[Math.floor(Math.random() * seeds.length)];
    counter += 1;
    return { ...s, id: `uf-seed-${level}-${counter}`, level, intensity };
  }

  const topics = TOPICS[level];
  const topic = topics[Math.floor(Math.random() * topics.length)];
  const frame = FRAMES[Math.floor(Math.random() * FRAMES.length)];
  const q = fill(frame, topic);
  counter += 1;
  return { ...q, id: `uf-gen-${level}-${counter}`, level, intensity };
}
