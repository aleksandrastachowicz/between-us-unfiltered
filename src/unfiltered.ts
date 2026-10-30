// Between Us — Unfiltered (18+): three levels of curated, non-explicit questions.
// Level names: Iskra / Spark → Bliżej / Closer → Bez tajemnic / No Secrets.
// The template generator is gone; AI may add questions on top of this pool.
import type { QuestionText, UnfilteredLevel } from "./questions";

export interface UnfilteredQuestion extends QuestionText {
  id: string;
  level: UnfilteredLevel;
  intensity: number; // 1-5
}

export interface UnfilteredLevelMeta {
  label: QuestionText;
  description: QuestionText;
  emoji: string;
  range: [number, number];
  intensity: [number, number];
}

export const UNFILTERED_LEVELS: Record<UnfilteredLevel, UnfilteredLevelMeta> = {
  love_spice: {
    label: { pl: "Iskra", en: "Spark" },
    description: { pl: "Przyciąganie, flirt i chemia. Lekko i z uśmiechem.", en: "Attraction, flirting and chemistry. Light and playful." },
    emoji: "✨",
    range: [0, 33],
    intensity: [1, 2],
  },
  after_dark: {
    label: { pl: "Bliżej", en: "Closer" },
    description: { pl: "Bliskość, zaufanie, potrzeby i granice.", en: "Closeness, trust, needs and boundaries." },
    emoji: "🔥",
    range: [34, 66],
    intensity: [2, 4],
  },
  no_limits: {
    label: { pl: "Bez tajemnic", en: "No Secrets" },
    description: { pl: "Lęki, niewypowiedziane pragnienia i pełna szczerość.", en: "Fears, unspoken desires and complete honesty." },
    emoji: "🖤",
    range: [67, 100],
    intensity: [3, 5],
  },
};

export const LEVEL_ORDER: UnfilteredLevel[] = ["love_spice", "after_dark", "no_limits"];

/** "One Step Deeper" card: shown every `every` cards; both players must agree to level up. */
export const LEVEL_UP_CARD = {
  title: { pl: "Krok głębiej", en: "One Step Deeper" },
  body: { pl: "Oboje gotowi pójść dalej?", en: "Are you both ready to go deeper?" },
  yes: { pl: "Idziemy dalej", en: "Let's go" },
  no: { pl: "Zostańmy tu jeszcze", en: "Stay here a bit longer" },
  every: 8,
};

export function levelForProgress(progress: number): UnfilteredLevel {
  if (progress <= 33) return "love_spice";
  if (progress <= 66) return "after_dark";
  return "no_limits";
}

export function nextLevel(level: UnfilteredLevel): UnfilteredLevel | null {
  const i = LEVEL_ORDER.indexOf(level);
  return i < LEVEL_ORDER.length - 1 ? LEVEL_ORDER[i + 1] : null;
}

export const UNFILTERED_POOL: Record<UnfilteredLevel, QuestionText[]> = {
  love_spice: [
    { pl: "Jaki rodzaj uwagi sprawia, że natychmiast czujesz się pożądany/a?", en: "What kind of attention makes you feel instantly desired?" },
    { pl: "Jaki drobny szczegół sprawia, że ktoś zaczyna Ci się podobać?", en: "What's something subtle that makes someone attractive to you?" },
    { pl: "Kiedy czujesz się najbardziej pewnie w towarzystwie kogoś, kto Ci się podoba?", en: "When do you feel most confident around someone you like?" },
    { pl: "Po czym poznajesz, że chemia między ludźmi jest prawdziwa?", en: "How can you tell when chemistry between people is real?" },
    { pl: "Co sprawia, że napięcie romantyczne staje się dla Ciebie ekscytujące?", en: "What makes romantic tension exciting for you?" },
    { pl: "Po czym poznajesz, że ktoś z Tobą flirtuje?", en: "How can you tell someone is flirting with you?" },
    { pl: "Jaki komplement działa na Ciebie najmocniej?", en: "What compliment works on you every time?" },
    { pl: "Co jako pierwsze przyciąga Twoją uwagę u drugiej osoby?", en: "What's the first thing that catches your attention in someone?" },
    { pl: "Jaki drobny gest potrafi Cię oczarować?", en: "What small gesture can completely charm you?" },
    { pl: "Jak wygląda Twoja idealna pierwsza randka?", en: "What does your perfect first date look like?" },
    { pl: "Co sprawia, że rozmowa z kimś nagle zaczyna iskrzyć?", en: "What makes a conversation suddenly start to spark?" },
    { pl: "Wolisz flirt przez wiadomości czy na żywo? Dlaczego?", en: "Do you prefer flirting by text or in person? Why?" },
    { pl: "Jaki zapach kojarzy Ci się z kimś, kto Ci się podobał?", en: "What scent reminds you of someone you were into?" },
    { pl: "Jaki film lub serial ma według Ciebie najlepszą scenę napięcia między dwojgiem ludzi?", en: "What film or series has the best scene of tension between two people?" },
    { pl: "Co Cię rozbraja w drugiej osobie?", en: "What disarms you in another person?" },
    { pl: "Kiedy ostatnio ktoś sprawił, że się zarumieniłeś/aś?", en: "When did someone last make you blush?" },
    { pl: "Jaki był najlepszy sposób na podryw, jaki ktoś na Tobie wypróbował?", en: "What's the best move anyone has tried on you?" },
    { pl: "Co w spojrzeniu drugiej osoby mówi Ci, że jest zainteresowana?", en: "What in someone's look tells you they're interested?" },
    { pl: "Jakie miejsce na randkę uważasz za najbardziej romantyczne?", en: "What's the most romantic place for a date?" },
    { pl: "Bardziej pociąga Cię pewność siebie czy lekka nieśmiałość?", en: "Are you more drawn to confidence or a little shyness?" },
    { pl: "Jaka cecha charakteru jest dla Ciebie bardziej pociągająca niż wygląd?", en: "What personality trait is more attractive to you than looks?" },
    { pl: "Co sprawia, że czekanie na czyjąś wiadomość jest ekscytujące?", en: "What makes waiting for someone's message exciting?" },
    { pl: "Zakochujesz się od pierwszego wejrzenia czy powoli?", en: "Do you fall for people at first sight or slowly?" },
    { pl: "Jaki był najbardziej romantyczny moment w Twoim życiu?", en: "What's the most romantic moment of your life?" },
    { pl: "Po czym poznajesz, że randka idzie naprawdę dobrze?", en: "How can you tell a date is going really well?" },
    { pl: "W czym czujesz się najbardziej atrakcyjnie?", en: "What do you feel most attractive wearing?" },
    { pl: "Jaki jest najbardziej uroczy sposób, żeby pokazać komuś zainteresowanie?", en: "What's the sweetest way to show someone you're interested?" },
    { pl: "Jaka niespodzianka zrobiłaby na Tobie największe wrażenie?", en: "What surprise would impress you the most?" },
    { pl: "Co jest dla Ciebie seksowne, choć nie ma nic wspólnego z wyglądem?", en: "What's sexy to you that has nothing to do with looks?" },
    { pl: "Jak flirtujesz, kiedy ktoś naprawdę Ci się podoba?", en: "How do you flirt when you really like someone?" },
    { pl: "Pierwszy pocałunek: lepiej zaplanowany czy całkowicie spontaniczny?", en: "First kiss: better planned or totally spontaneous?" },
    { pl: "Jaka wspólna aktywność najszybciej buduje między ludźmi chemię?", en: "What shared activity builds chemistry the fastest?" },
    { pl: "Co sprawia, że po pierwszej rozmowie chcesz kogoś lepiej poznać?", en: "What makes you want to know someone better after a first conversation?" },
    { pl: "Jakiej cesze drugiej osoby nie potrafisz się oprzeć?", en: "What trait in another person can't you resist?" },
  ],
  after_dark: [
    { pl: "Co pomaga Ci poczuć się całkowicie bezpiecznie, gdy otwierasz się przed drugą osobą?", en: "What helps you feel completely safe opening up to someone?" },
    { pl: "Czego dowiedziałeś/aś się o swoich potrzebach w intymności?", en: "What have you learned about your needs for intimacy in relationships?" },
    { pl: "O czym w intymności najtrudniej Ci mówić?", en: "What's hardest for you to talk about when it comes to intimacy?" },
    { pl: "Czym dla Ciebie jest bezpieczeństwo emocjonalne w bliskich relacjach?", en: "What does emotional safety mean to you in close relationships?" },
    { pl: "Co pomaga Ci całkowicie rozluźnić się przy drugiej osobie?", en: "What helps you fully relax around someone?" },
    { pl: "Jaki dotyk daje Ci największe poczucie bezpieczeństwa?", en: "What kind of touch makes you feel safest?" },
    { pl: "Jak bez słów pokazujesz komuś, że go pragniesz?", en: "How do you show someone you want them without words?" },
    { pl: "Czym dla Ciebie różni się bliskość od intymności?", en: "What's the difference between closeness and intimacy for you?" },
    { pl: "Czego potrzebujesz, żeby powiedzieć „nie” bez poczucia winy?", en: "What do you need to be able to say “no” without guilt?" },
    { pl: "Wolisz rozmawiać o granicach zanim coś się wydarzy, czy w trakcie?", en: "Do you prefer talking about boundaries before something happens or in the moment?" },
    { pl: "Co sprawia, że czujesz się naprawdę widziany/a przez partnera?", en: "What makes you feel truly seen by a partner?" },
    { pl: "Jaki moment czułości został z Tobą na długo?", en: "What tender moment has stayed with you?" },
    { pl: "Jak przez lata zmieniały się Twoje potrzeby w bliskości?", en: "How have your needs for closeness changed over the years?" },
    { pl: "Co sprawia, że zaufanie w związku rośnie, a co je niszczy?", en: "What makes trust grow in a relationship, and what destroys it?" },
    { pl: "Jak reagujesz, kiedy druga osoba potrzebuje więcej bliskości niż Ty?", en: "How do you react when your partner needs more closeness than you do?" },
    { pl: "A kiedy to Ty potrzebujesz więcej bliskości – jak o nią prosisz?", en: "And when you need more closeness, how do you ask for it?" },
    { pl: "Jakie słowa najbardziej Cię uspokajają?", en: "What words calm you the most?" },
    { pl: "Co jest dla Ciebie najbardziej intymne, choć nie ma nic wspólnego z seksem?", en: "What feels most intimate to you that has nothing to do with sex?" },
    { pl: "O co wstydzisz się prosić w związku?", en: "What are you embarrassed to ask for in a relationship?" },
    { pl: "Jak wygląda Twój idealny leniwy poranek we dwoje?", en: "What does your ideal lazy morning together look like?" },
    { pl: "Co sprawia, że czujesz się atrakcyjnie we własnym ciele?", en: "What makes you feel attractive in your own body?" },
    { pl: "Kiedy ostatnio poczułeś/aś, że ktoś naprawdę o Ciebie zadbał?", en: "When did you last feel truly cared for?" },
    { pl: "Jaką potrzebę w związku długo ignorowałeś/aś?", en: "What need in a relationship did you ignore for a long time?" },
    { pl: "Co pomaga Ci wrócić do bliskości po kłótni?", en: "What helps you reconnect after an argument?" },
    { pl: "Po czym poznajesz, że druga osoba czuje się przy Tobie bezpiecznie?", en: "How can you tell someone feels safe with you?" },
    { pl: "Co oznacza dla Ciebie zgoda – poza samym „tak”?", en: "What does consent mean to you beyond just a “yes”?" },
    { pl: "Jaki wspólny rytuał najbardziej zbliża ludzi?", en: "What shared ritual brings people closest together?" },
    { pl: "O czym łatwiej Ci mówić po ciemku?", en: "What's easier for you to talk about in the dark?" },
    { pl: "Jak odróżniasz pożądanie od miłości?", en: "How do you tell desire from love?" },
    { pl: "Czego chcesz więcej w życiu intymnym: spontaniczności czy rytuałów?", en: "What do you want more of in your intimate life: spontaneity or rituals?" },
    { pl: "Co sprawia, że pocałunek jest naprawdę dobry?", en: "What makes a kiss really good?" },
    { pl: "Jak chcesz, żeby partner reagował, kiedy masz gorszy dzień?", en: "How do you want a partner to respond when you're having a bad day?" },
    { pl: "Jakie wspomnienie z drugą osobą wciąż przyprawia Cię o dreszcze?", en: "What memory with someone still gives you shivers?" },
    { pl: "Jak wygląda dla Ciebie idealny wieczór tylko we dwoje?", en: "What does a perfect evening for just the two of you look like?" },
  ],
  no_limits: [
    { pl: "Jakiego pragnienia nigdy nie wypowiedziałeś/aś na głos?", en: "What's a desire you've never fully expressed out loud?" },
    { pl: "Jak myślisz, jakich tematów ludzie najbardziej unikają w rozmowach o związkach?", en: "Which topics do you think people avoid most when talking about relationships?" },
    { pl: "Co dla Ciebie znaczy, że dwoje ludzi naprawdę do siebie pasuje?", en: "What does true compatibility mean to you?" },
    { pl: "Jakie przekonanie o związkach z czasem zmieniłeś/aś?", en: "What's a belief about relationships you've changed over time?" },
    { pl: "W czym najtrudniej Ci być całkowicie szczerym/szczerą?", en: "What's the hardest thing for you to be completely honest about?" },
    { pl: "Czego najbardziej boisz się pokazać w związku?", en: "What are you most afraid to show in a relationship?" },
    { pl: "Jakie słowa od partnera znaczyłyby dla Ciebie najwięcej, choć nigdy o nie nie poprosisz?", en: "What words from a partner would mean the most to you, though you'd never ask for them?" },
    { pl: "Na jaki kompromis nie pójdziesz nawet z miłości?", en: "What would you never compromise on, even for love?" },
    { pl: "Jaka prawda o Tobie mogłaby kogoś zaskoczyć?", en: "What truth about you might surprise someone?" },
    { pl: "Kiedy ostatnio udawałeś/aś, że wszystko jest w porządku?", en: "When did you last pretend everything was fine?" },
    { pl: "Jaki lęk najczęściej sabotuje Twoje związki?", en: "What fear most often sabotages your relationships?" },
    { pl: "Gdyby w Twoim związku przez tydzień obowiązywała pełna szczerość – co by się zmieniło?", en: "If you had to be completely honest in your relationship for a week, what would change?" },
    { pl: "Jaki wzorzec z domu rodzinnego powtarzasz w miłości?", en: "What pattern from your family do you repeat in love?" },
    { pl: "Czego wciąż nie umiesz sobie wybaczyć w relacjach?", en: "What can't you forgive yourself for in relationships?" },
    { pl: "Czego potrzebujesz najbardziej, a boisz się, że to „za dużo”?", en: "What do you need most but fear is “too much”?" },
    { pl: "Jaką część siebie ukrywasz na początku znajomości?", en: "What part of yourself do you hide early on?" },
    { pl: "Co znaczy dla Ciebie wierność – poza fizycznością?", en: "What does faithfulness mean to you beyond the physical?" },
    { pl: "Czy jest coś, czego zazdrościsz innym parom?", en: "Is there anything you envy about other couples?" },
    { pl: "Jakiego pytania boisz się, że ktoś Ci kiedyś zada?", en: "What question are you afraid someone will ask you?" },
    { pl: "Kiedy ostatnio poczułeś/aś się odrzucony/a i co wtedy zrobiłeś/aś?", en: "When did you last feel rejected, and what did you do?" },
    { pl: "Jak wygląda związek, w którym nie musisz niczego udawać?", en: "What does a relationship look like where you don't have to pretend?" },
    { pl: "Czego najtrudniejsze rozstanie nauczyło Cię o Tobie?", en: "What did your hardest breakup teach you about yourself?" },
    { pl: "Które Twoje pragnienie najbardziej zmieniło się przez ostatnie lata?", en: "Which of your desires has changed the most in recent years?" },
    { pl: "Kiedy w związku czujesz się najbardziej samotny/a?", en: "When do you feel loneliest in a relationship?" },
    { pl: "Co partner powinien o Tobie wiedzieć, zanim się zaangażuje?", en: "What should a partner know about you before getting serious?" },
    { pl: "Jak reagujesz, kiedy ktoś zbliża się do Ciebie za szybko?", en: "How do you react when someone gets close too fast?" },
    { pl: "Co trudniej Ci przyjąć: krytykę czy czułość?", en: "What's harder for you to receive: criticism or tenderness?" },
    { pl: "Jakiej obietnicy w związku najtrudniej było Ci dotrzymać?", en: "What relationship promise was hardest for you to keep?" },
    { pl: "Jakie najbardziej osobiste wyznanie komuś zrobiłeś/aś?", en: "What's the most vulnerable thing you've ever confessed to someone?" },
    { pl: "Co sprawia, że wycofujesz się z bliskości?", en: "What makes you pull away from closeness?" },
    { pl: "Jakiej rozmowy w związku unikasz najdłużej?", en: "What relationship conversation have you avoided the longest?" },
    { pl: "Co oznacza dla Ciebie być naprawdę kochanym/ą, a nie tylko pożądanym/ą?", en: "What does it mean to be truly loved, not just desired?" },
    { pl: "O jakiej wspólnej przyszłości marzysz, ale boisz się to powiedzieć?", en: "What future together do you dream of but are afraid to say out loud?" },
    { pl: "Czego chcesz nauczyć się o miłości w tym roku?", en: "What do you want to learn about love this year?" },
    { pl: "Jakie pytanie chcesz mi teraz zadać, ale się wahasz?", en: "What question do you want to ask me right now, but hesitate to?" },
  ],
};

const recent: string[] = [];
const RECENT_LIMIT = 40;

/** Returns a curated Unfiltered question for the given progress, avoiding recent repeats. */
export function generateUnfiltered(progress: number): UnfilteredQuestion {
  const level = levelForProgress(progress);
  const meta = UNFILTERED_LEVELS[level];
  const pool = UNFILTERED_POOL[level];
  const fresh = pool.map((q, i) => ({ q, i })).filter(({ i }) => !recent.includes(`${level}-${i}`));
  const choices = fresh.length ? fresh : pool.map((q, i) => ({ q, i }));
  const pick = choices[Math.floor(Math.random() * choices.length)];
  const key = `${level}-${pick.i}`;
  recent.push(key);
  if (recent.length > RECENT_LIMIT) recent.shift();
  const intensity =
    meta.intensity[0] + Math.floor(Math.random() * (meta.intensity[1] - meta.intensity[0] + 1));
  return { ...pick.q, id: `uf-${key}`, level, intensity };
}
