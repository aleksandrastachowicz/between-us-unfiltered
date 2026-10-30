// Between Us — Unfiltered (18+): three levels of curated, non-explicit questions.
// Level names: Iskra / Spark → Bliżej / Closer → Bez tajemnic / No Secrets.
// AI generates fresh questions (see supabase/functions/generate-unfiltered); this curated
// pool (~60 per level) is the fallback and the style reference sent to the AI.
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
    { pl: "Jaki był Twój najdziwniejszy, ale udany flirt?", en: "What was your strangest flirt that actually worked?" },
    { pl: "Co sprawia, że ktoś staje się nieodparty w rozmowie?", en: "What makes someone irresistible in conversation?" },
    { pl: "Jakie pierwsze wrażenie robisz na osobach, które Ci się podobają?", en: "What first impression do you make on people you're into?" },
    { pl: "Jak reagujesz, kiedy ktoś Cię komplementuje?", en: "How do you react when someone compliments you?" },
    { pl: "Wolisz zrobić pierwszy krok czy czekać, aż ktoś go zrobi?", en: "Do you prefer making the first move or waiting for it?" },
    { pl: "Jaki był Twój najbardziej nieudany podryw?", en: "What was your most failed attempt at flirting?" },
    { pl: "Jaki romantyczny gest z filmów działa też w prawdziwym życiu?", en: "What romantic movie gesture actually works in real life?" },
    { pl: "Jak długo czekasz na odpowiedź, zanim zaczniesz się zastanawiać?", en: "How long can you wait for a reply before you start overthinking?" },
    { pl: "Co jest Twoją tajną bronią we flircie?", en: "What's your secret weapon when flirting?" },
    { pl: "Taniec, wspólne gotowanie czy długi spacer: co najlepiej buduje napięcie?", en: "Dancing, cooking together or a long walk: what builds tension best?" },
    { pl: "Jaki jest Twój ulubiony moment randki?", en: "What's your favorite moment of a date?" },
    { pl: "Po czym poznajesz, że ktoś o Tobie myśli, kiedy nie jesteście razem?", en: "How can you tell someone's thinking of you when you're apart?" },
    { pl: "Co w czyimś głosie Cię przyciąga?", en: "What draws you to someone's voice?" },
    { pl: "Jaki drobiazg od kogoś, kto Ci się podobał, masz do dziś?", en: "What small keepsake from someone you liked do you still have?" },
    { pl: "Jaka wiadomość od kogoś potrafi wywołać u Ciebie uśmiech na cały dzień?", en: "What message from someone can make you smile all day?" },
    { pl: "Wolisz randkę zaplanowaną co do minuty czy pełną niespodzianek?", en: "Do you prefer a date planned to the minute or full of surprises?" },
    { pl: "Jak wygląda Twój idealny pocałunek na dobranoc?", en: "What does your ideal goodnight kiss look like?" },
    { pl: "Co możesz robić godzinami z osobą, która Ci się podoba?", en: "What could you do for hours with someone you like?" },
    { pl: "Kiedy ostatnio czułeś/aś motyle w brzuchu?", en: "When did you last get butterflies?" },
    { pl: "Jakie zdanie od drugiej osoby potrafi Cię rozbroić?", en: "What sentence from someone can completely disarm you?" },
    { pl: "Wolisz być adorowany/a czy adorować?", en: "Do you prefer being adored or adoring someone?" },
    { pl: "Jaki emotikon wysyłasz, kiedy flirtujesz?", en: "What emoji do you send when you're flirting?" },
    { pl: "Kiedy ostatnio nie chciałeś/aś, żeby randka się skończyła?", en: "When did you last not want a date to end?" },
    { pl: "Jak się zachowujesz, kiedy jesteś zauroczony/a?", en: "How do you act when you have a crush?" },
    { pl: "Co jest bardziej uwodzicielskie: spojrzenie czy dotyk dłoni?", en: "What's more seductive: a look or a touch of the hand?" },
    { pl: "Jaki komplement chcesz dziś usłyszeć?", en: "What compliment do you want to hear tonight?" },
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
    { pl: "Co sprawia, że przy kimś czujesz się jak w domu?", en: "What makes you feel at home with someone?" },
    { pl: "Jak lubisz być przytulany/a?", en: "How do you like to be held?" },
    { pl: "Jaki gest czułości wydaje Ci się najbardziej intymny?", en: "What tender gesture feels most intimate to you?" },
    { pl: "Kiedy łatwiej Ci okazać czułość: rano czy wieczorem?", en: "When is it easier for you to show affection: morning or night?" },
    { pl: "Co pomaga Ci zaufać komuś w bliskości fizycznej?", en: "What helps you trust someone physically?" },
    { pl: "Jak mówisz o swoich potrzebach, nie raniąc drugiej osoby?", en: "How do you say what you need without hurting the other person?" },
    { pl: "Jakie słowa chcesz słyszeć częściej?", en: "What words do you want to hear more often?" },
    { pl: "Po trudnym dniu: wolisz się przytulić czy pobyć w ciszy?", en: "After a hard day: do you want a hug or some quiet?" },
    { pl: "Jak wygląda bliskość, kiedy brakuje czasu i energii?", en: "What does closeness look like when there's no time or energy?" },
    { pl: "Jaki zapach kojarzy Ci się z bezpieczeństwem?", en: "What scent feels like safety to you?" },
    { pl: "Co najbardziej Cię rozczula w drugiej osobie?", en: "What melts your heart about another person?" },
    { pl: "Kiedy ostatnio poczułeś/aś się pożądany/a bez ani jednego słowa?", en: "When did you last feel desired without a single word?" },
    { pl: "Czego nauczyła Cię o Tobie bliskość z drugą osobą?", en: "What has closeness with someone taught you about yourself?" },
    { pl: "Jak dajesz znać, że potrzebujesz przestrzeni?", en: "How do you let someone know you need space?" },
    { pl: "Którą swoją cechę partner powinien doceniać bardziej?", en: "What quality of yours do you wish a partner appreciated more?" },
    { pl: "Jak zmienia się Twoja potrzeba bliskości, kiedy jesteś zestresowany/a?", en: "How does your need for closeness change when you're stressed?" },
    { pl: "Czym jest dla Ciebie prawdziwa czułość?", en: "What does real tenderness mean to you?" },
    { pl: "Jakie niepisane zasady masz w związku?", en: "What unspoken rules do you have in a relationship?" },
    { pl: "Co jest przyjemnego w dzieleniu z kimś łóżka – poza seksem?", en: "What's nice about sharing a bed with someone, beyond sex?" },
    { pl: "Jaki moment bliskości chcesz powtórzyć?", en: "What moment of closeness would you love to repeat?" },
    { pl: "Przy kim możesz być całkowicie bezbronny/a?", en: "Who can you be completely vulnerable with?" },
    { pl: "Co jest ważniejsze w bliskości: słowa czy cisza?", en: "What matters more in closeness: words or silence?" },
    { pl: "Jak dbać o bliskość w długim związku?", en: "How do you keep closeness alive in a long relationship?" },
    { pl: "Jak okazujesz miłość, kiedy brakuje Ci słów?", en: "How do you show love when you run out of words?" },
    { pl: "Co zaskoczyło Cię w Twoich własnych potrzebach w ostatnim związku?", en: "What surprised you about your own needs in your last relationship?" },
    { pl: "O co chcesz mnie zapytać, jeśli chodzi o bliskość?", en: "What do you want to ask me about intimacy?" },
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
    { pl: "Czego nigdy nikomu nie powiedziałeś/aś o swoim pierwszym związku?", en: "What have you never told anyone about your first relationship?" },
    { pl: "Jaki sekret nosisz w sobie najdłużej?", en: "What's the secret you've kept the longest?" },
    { pl: "Czego wstydzisz się w sobie, kiedy jesteś zakochany/a?", en: "What are you ashamed of in yourself when you're in love?" },
    { pl: "Czy kiedyś pokochałeś/aś kogoś, kogo nie powinieneś/powinnaś?", en: "Have you ever loved someone you shouldn't have?" },
    { pl: "Jakie kłamstwo w związku powiedziałeś/aś, żeby kogoś chronić?", en: "What lie have you told in a relationship to protect someone?" },
    { pl: "Kiedy ostatnio płakałeś/aś z miłości?", en: "When did you last cry because of love?" },
    { pl: "Co w Tobie jest najtrudniejsze do pokochania?", en: "What part of you is hardest to love?" },
    { pl: "Jaki byłby Twój związek, gdyby nikt Cię nie oceniał?", en: "What would your relationship look like if no one judged you?" },
    { pl: "Jakie pragnienie uważasz za takie, którego „nie wypada” mieć?", en: "What desire of yours feels “not okay” to admit?" },
    { pl: "Czego najbardziej żałujesz w swoim życiu uczuciowym?", en: "What do you regret most in your love life?" },
    { pl: "Jak naprawdę reagujesz na zazdrość, kiedy nikt nie patrzy?", en: "How do you really react to jealousy when no one is watching?" },
    { pl: "Do kogo z przeszłości wciąż porównujesz innych?", en: "Who from your past do you still compare others to?" },
    { pl: "Czego boisz się, że nigdy nie dostaniesz w miłości?", en: "What are you afraid you'll never get in love?" },
    { pl: "Która część Twojej przeszłości wciąż budzi w Tobie wstyd?", en: "What part of your past still makes you feel ashamed?" },
    { pl: "Co chcesz, żebym wiedział/a, ale boisz się to powiedzieć?", en: "What do you want me to know but are afraid to say?" },
    { pl: "Kiedy ostatnio świadomie zraniłeś/aś kogoś bliskiego?", en: "When did you last knowingly hurt someone close to you?" },
    { pl: "Czy kiedyś zostałeś/aś w związku za długo? Dlaczego?", en: "Have you ever stayed in a relationship too long? Why?" },
    { pl: "Gdzie dla Ciebie zaczyna się zdrada?", en: "Where does cheating begin for you?" },
    { pl: "Jaka myśl o miłości nie daje Ci spać?", en: "What thought about love keeps you up at night?" },
    { pl: "Czego potrzebujesz, żeby na co dzień czuć się kochany/a?", en: "What do you need to feel loved every day?" },
    { pl: "Którą swoją potrzebę uważasz za słabość?", en: "Which of your needs do you see as a weakness?" },
    { pl: "Co ukrywasz, żeby wydawać się silniejszy/a?", en: "What do you hide to seem stronger?" },
    { pl: "Jak zmieniłoby się Twoje życie, gdybyś przestał/a bać się odrzucenia?", en: "How would your life change if you stopped fearing rejection?" },
    { pl: "Jakie pytanie o nas chodzi Ci ostatnio po głowie?", en: "What question about us has been on your mind lately?" },
    { pl: "Co chcesz zmienić w tym, jak kochasz?", en: "What do you want to change about the way you love?" },
    { pl: "Jaka szczerość mogłaby nas do siebie zbliżyć?", en: "What kind of honesty could bring us closer?" },
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
