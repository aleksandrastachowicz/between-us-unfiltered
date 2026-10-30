// Between Us — card question dataset
// Each question is a paired translation object. Categories map to decks.

export type Lang = "pl" | "en";

export type CategoryId =
  | "love"
  | "friendship"
  | "selfdev"
  | "passions"
  | "introspection"
  | "plus_love"
  | "plus_spice"
  | "plus_deep"
  | "plus_kinky";

export type DeckId = "basic" | "plus" | "unfiltered";

export type UnfilteredLevel = "love_spice" | "after_dark" | "no_limits";

export interface QuestionText {
  pl: string;
  en: string;
}

export interface Question extends QuestionText {
  id: string;
  category: CategoryId;
  deck: DeckId;
}

export interface CategoryMeta {
  id: CategoryId;
  deck: DeckId;
  label: QuestionText;
}

export const CATEGORY_META: Record<CategoryId, CategoryMeta> = {
  love: {
    id: "love",
    deck: "basic",
    label: { pl: "Miłość i Relacje", en: "Love & Relationships" },
  },
  friendship: {
    id: "friendship",
    deck: "basic",
    label: { pl: "Przyjaźń i Rodzina", en: "Friendship & Family" },
  },
  selfdev: {
    id: "selfdev",
    deck: "basic",
    label: { pl: "Rozwój i Zdrowie Psychiczne", en: "Self-Development & Mental Health" },
  },
  passions: {
    id: "passions",
    deck: "basic",
    label: { pl: "Pasje i Marzenia", en: "Passions & Dreams" },
  },
  introspection: {
    id: "introspection",
    deck: "basic",
    label: { pl: "Introspekcja i Emocje", en: "Introspection & Emotions" },
  },
  plus_love: {
    id: "plus_love",
    deck: "plus",
    label: { pl: "Miłość i Relacje", en: "Love & Relationships" },
  },
  plus_spice: {
    id: "plus_spice",
    deck: "plus",
    label: { pl: "Pikantne i Intymne", en: "Spicy & Intimate" },
  },
  plus_deep: {
    id: "plus_deep",
    deck: "plus",
    label: { pl: "Głęboka Więź Emocjonalna", en: "Deep & Emotional Connection" },
  },
  plus_kinky: {
    id: "plus_kinky",
    deck: "plus",
    label: { pl: "Kinky i Fantazje", en: "Kinky & Fantasy" },
  },
};


function build(category: CategoryId, deck: DeckId, items: QuestionText[]): Question[] {
  return items.map((q, i) => ({ ...q, id: `${category}-${i}`, category, deck }));
}

const love: QuestionText[] = [
  { pl: "Jaka rada o randkowaniu przydałaby się Tobie sprzed lat?", en: "What dating advice would you give your younger self?" },
  { pl: "Jak wspominasz swoją pierwszą miłość?", en: "How do you look back on your first love?" },
  { pl: "Jakie przekonanie o miłości już Ci nie służy?", en: "What belief about love no longer serves you?" },
  { pl: "Możesz zadać jedno pytanie swojej byłej osobie i dostać w pełni szczerą odpowiedź. O co pytasz?", en: "You can ask an ex one question and get a completely honest answer. What do you ask?" },
  { pl: "Jednym słowem: jak to jest być zakochanym?", en: "In one word: what does being in love feel like?" },
  { pl: "Co teraz rozumiesz o miłości, czego nie rozumiałeś/aś wcześniej?", en: "What do you now understand about love that you didn't before?" },
  { pl: "Jaką wiadomość najbardziej chcesz teraz dostać?", en: "What message would you most like to get right now?" },
  { pl: "Czy ostatnie rozstanie masz już za sobą, czy tylko starasz się o nim nie myśleć?", en: "Are you over your last breakup, or just trying not to think about it?" },
  { pl: "Dokończ zdanie: „Wiedziałem/am, że to koniec, kiedy…”", en: "Finish the sentence: “I knew it was over when…”" },
  { pl: "Czy wciąż myślisz o kimś z przeszłości?", en: "Do you still think about someone from your past?" },
  { pl: "Jaka piosenka najlepiej opisuje uczucie złamanego serca?", en: "What song best describes the feeling of getting your heart broken?" },
  { pl: "Randkujesz, bo szukasz miłości, czy dlatego, że boisz się samotności?", en: "Are you dating to find love, or because you're afraid of being alone?" },
  { pl: "Co wybierasz: jeszcze raz przeżyć najgorsze złamane serce czy wymazać tę osobę z pamięci?", en: "Which would you choose: reliving your worst heartbreak, or erasing that person from your memory?" },
  { pl: "Co poradzisz komuś, kto właśnie wchodzi w situationship?", en: "What would you tell someone about to start a situationship?" },
  { pl: "Czy zdrada jest dla Ciebie powodem do definitywnego końca?", en: "Is cheating a dealbreaker for you?" },
  { pl: "Czy potrafisz dalej kochać kogoś, kto Cię zdradził?", en: "Could you keep loving someone who cheated on you?" },
  { pl: "Czy da się przyjaźnić z kimś, kogo się kiedyś kochało?", en: "Do you believe you can be friends with someone you loved in the past?" },
  { pl: "Opisz swoje życie randkowe w trzech słowach.", en: "Describe your dating life in three words." },
  { pl: "Co sprawia, że ktoś natychmiast staje się atrakcyjny?", en: "What instantly makes someone attractive?" },
  { pl: "Na ile dostępny/a emocjonalnie się wydaję?", en: "How emotionally available do I seem?" },
  { pl: "Czego szukasz w następnym związku?", en: "What do you want in your next relationship?" },
  { pl: "Co najbardziej cenisz u partnera?", en: "What do you value most in a partner?" },
  { pl: "Skąd wiesz, że kogoś kochasz?", en: "How do you know when you love someone?" },
  { pl: "Co w miłości Cię przeraża?", en: "What scares you about love?" },
  { pl: "Czy wierzysz, że ludzie mogą się zmienić dla kogoś, kogo kochają?", en: "Do you believe people can change for someone they love?" },
  { pl: "Skąd wiesz, że jesteś gotowy/a powiedzieć „kocham Cię”?", en: "How do you know when you're ready to say “I love you”?" },
  { pl: "Jak radzisz sobie z odrzuceniem w randkowaniu?", en: "How do you handle rejection in dating?" },
  { pl: "Jak definiujesz 'situationship'?", en: "How do you define a situationship?" },
  { pl: "Co jest według Ciebie kluczem do udanego związku?", en: "What do you think is the key to a successful relationship?" },
  { pl: "Jak radzisz sobie z konfliktami w związku?", en: "How do you handle conflicts in a relationship?" },
  { pl: "Co sądzisz o związkach na odległość?", en: "How do you feel about long-distance relationships?" },
  { pl: "Co sądzisz o publicznym okazywaniu uczuć?", en: "How do you feel about public displays of affection?" },
  { pl: "Jak radzisz sobie z zazdrością w związku?", en: "How do you handle jealousy in a relationship?" },
  { pl: "Jak ważne jest dla Ciebie posiadanie podobnych celów życiowych co partner?", en: "How important is it to you to share similar life goals with your partner?" },
  { pl: "Jak ważne jest dla Ciebie, aby partner dogadywał się z Twoimi przyjaciółmi?", en: "How important is it to you that your partner gets along with your friends?" },
  { pl: "Co sądzisz o tym, że Twój partner ma bliskich przyjaciół przeciwnej płci?", en: "How do you feel about your partner having close friends of the opposite sex?" },
  { pl: "Jaki jest Twój ulubiony sposób na flirtowanie?", en: "What's your favorite way to flirt with someone?" },
  { pl: "Jaki jest najlepszy sposób na rozpoczęcie poważnej rozmowy o związku?", en: "What's the best way to start a serious conversation about your relationship?" },
  { pl: "Z jakiej rany emocjonalnej wciąż się leczysz?", en: "What's an emotional wound you're still healing from?" },
  { pl: "Czy wierzysz w miłość od pierwszego wejrzenia?", en: "Do you believe in love at first sight?" },
  { pl: "Czy związek może przetrwać i rozkwitać bez pociągu fizycznego?", en: "Can a relationship survive and thrive without physical attraction?" },
  { pl: "Czy zazdrość może być kiedykolwiek zdrową emocją w związku?", en: "Is jealousy ever a healthy emotion in a relationship?" },
  { pl: "Czy wspólne mieszkanie przed ślubem jest konieczne?", en: "Is living together before marriage necessary?" },
  { pl: "Czy ukrywanie tajemnic przed partnerem dla zachowania spokoju jest okej?", en: "Is it okay to keep secrets from your partner to keep the peace?" },
  { pl: "Czy związki są warte wysiłku?", en: "Are relationships worth the effort?" },
  { pl: "Jeśli jesteś singlem albo singielką – jak myślisz, dlaczego?", en: "If you're single, why do you think that is?" },
  { pl: "Kiedy ostatnio naprawdę na kimś Ci zależało?", en: "When were you last really serious about someone?" },
  { pl: "Jaka jest najdziwniejsza rzecz, którą uważasz za atrakcyjną u innych?", en: "What is the weirdest thing you find attractive in a person?" },
  { pl: "Ile razy w życiu naprawdę się zakochałeś/aś?", en: "How many times have you truly fallen for someone?" },
  { pl: "Jaka była najboleśniejsza wiadomość, którą wysłałeś/aś lub otrzymałeś/aś?", en: "What's the most painful text you've ever received or sent?" },
  { pl: "Jaki typ ludzi Cię przyciąga?", en: "What kind of people are you attracted to?" },
  { pl: "Czy przyjaźnisz się ze swoimi byłymi?", en: "Do you stay friends with your exes?" },
  { pl: "Czy jest coś, co chcesz zmienić w tym, jak zaczęła się Twoja historia miłosna?", en: "If you had the chance, would you change anything about how your love story began?" },
  { pl: "Co jest najtrudniejsze w byciu w związku z Tobą?", en: "What's the hardest part about dating you?" },
  { pl: "Czego żałujesz, że nie powiedziałeś/aś swojej byłej osobie?", en: "What did you never say to your ex that you wish you had?" },
  { pl: "Czego zawsze chciałeś/aś w związku, ale nigdy nie dostałeś/aś?", en: "What's something you've always wanted in a relationship, but never got?" },
  { pl: "Czego potrzebujesz w związku, by czuć się komfortowo?", en: "What do you need in a relationship to feel comfortable?" },
  { pl: "Jak dajesz komuś znać, że jesteś nim zainteresowany/a?", en: "How do you let someone know you're interested in them?" },
  { pl: "Co było największym punktem zwrotnym w Twoim życiu randkowym?", en: "What was the biggest turning point in your dating life?" },
  { pl: "Jaki masz dealbreaker w związku, który innych by zdziwił?", en: "What's a dealbreaker of yours that others might find shocking?" },
  { pl: "Jaka była Twoja najgorsza randka w życiu?", en: "What's the worst date you've ever been on?" },
  { pl: "Jaki bagaż niesiesz z poprzednich związków?", en: "What baggage do you carry from your previous relationships?" },
  { pl: "Jak wyglądał Twój pierwszy pocałunek?", en: "How did your first kiss go?" },
  { pl: "Czy kiedykolwiek miałeś/aś złamane serce?", en: "Has your heart ever been broken?" },
];

const friendship: QuestionText[] = [
  { pl: "Opowiedz o swojej najlepszej przyjaciółce albo najlepszym przyjacielu: jak ma na imię i za co go/ją cenisz?", en: "Tell me about your best friend: what's their name, and what do you love about them?" },
  { pl: "Który dzień naszej przyjaźni chcesz przeżyć jeszcze raz?", en: "Which day of our friendship would you love to relive?" },
  { pl: "Kto ma dobry wpływ na Twoje zdrowie psychiczne? Wyślij tej osobie wiadomość.", en: "Who has a positive effect on your mental health? Send them a message." },
  { pl: "Przy kim czujesz się najlepiej?", en: "Who do you feel your best around?" },
  { pl: "Z kim chcesz spędzać więcej czasu?", en: "Who do you want to spend more time with?" },
  { pl: "Kto jest pierwszą osobą, z którą chcesz dzielić się dobrą wiadomością?", en: "Who's the first person you want to share good news with?" },
  { pl: "Do kogo idziesz po poradę życiową? Dlaczego do tej osoby?", en: "Who do you go to for life advice? Why them?" },
  { pl: "Kto sprawia, że czujesz się kochany/a, nawet gdy czujesz, że nie zasługujesz?", en: "Who makes you feel loved, even when you feel you don't deserve it?" },
  { pl: "Przez rok możesz utrzymywać kontakt tylko z trzema osobami. Kto to będzie i dlaczego?", en: "For a year, you can only stay in touch with three people. Who are they, and why?" },
  { pl: "Jaki macie z przyjaciółmi żart, który rozumiecie tylko wy?", en: "What's an inside joke you share with your friends?" },
  { pl: "Kto ostatnio był dla Ciebie naprawdę dobry?", en: "Who's been really good to you lately?" },
  { pl: "Czy czujesz, że przy mnie jesteś całkowicie sobą?", en: "Do you feel like you are completely yourself around me?" },
  { pl: "Kto jest osobą, której mówisz o wszystkim?", en: "Who is one person you tell everything to?" },
  { pl: "Zapytaj mnie o coś, o co zawsze chciałeś/aś zapytać.", en: "Ask me something you've always wanted to ask." },
  { pl: "Jakie wspomnienie z tego roku sprawia, że uśmiechasz się na samą myśl?", en: "What's a memory from this year that makes you smile just thinking about it?" },
  { pl: "Szczerze: czy myślisz, że mamy na siebie dobry wpływ?", en: "Honestly, do you think we're good for each other?" },
  { pl: "Jak mogę zapracować na więcej Twojego zaufania?", en: "How can I earn more of your trust?" },
  { pl: "Jakie cechy kojarzysz z dobrym słuchaczem?", en: "What qualities do you associate with a good listener?" },
  { pl: "Jaka jest Twoja wstydliwa przyjemność – coś, co lubisz, choć się tym nie chwalisz?", en: "What's a guilty pleasure of yours?" },
  { pl: "Jakie masz relacje ze swoją rodziną?", en: "What sort of relationship do you have with your family?" },
  { pl: "Kto Cię wspierał, gdy najbardziej tego potrzebowałeś/aś?", en: "Who had your back when you needed it most?" },
  { pl: "Jakie niespełnione oczekiwania wobec innych zraniły Cię najbardziej?", en: "Which unmet expectations of others have hurt you most?" },
  { pl: "Co było najlepszą rzeczą w tym, jak wychowali Cię rodzice?", en: "What was the best thing about how your parents raised you?" },
  { pl: "Z którym rodzicem masz bliższą relację?", en: "Which parent are you closer to?" },
  { pl: "Kto był ostatnią osobą, z którą odbyłeś/aś głęboką rozmowę?", en: "Who was the last person you had a deep conversation with?" },
  { pl: "Kogo chcesz mieć przy sobie, kiedy przesadzisz z alkoholem?", en: "Who would you want looking after you if you'd had too much to drink?" },
  { pl: "Czy ważne jest dla Ciebie wspólne jedzenie posiłków z rodziną?", en: "Is it important to you to sit down and eat together as a family?" },
  { pl: "Jakie masz granice, o których inni powinni wiedzieć?", en: "What boundaries do you want other people to know about?" },
  { pl: "Kto był najbardziej toksyczną osobą, jaką znałeś/aś?", en: "Who was the most toxic person you've known?" },
  { pl: "Czy jest coś, co zawsze chciałeś/aś mi powiedzieć, ale jeszcze tego nie zrobiłeś/aś?", en: "Is there something you've always wanted to tell me but haven't yet?" },
  { pl: "Jaka jest najzabawniejsza rzecz, którą ktoś Ci wyznał pod wpływem alkoholu?", en: "What's the funniest thing someone has confessed to you while drunk?" },
  { pl: "Jakie są trzy najważniejsze cechy, których szukasz u przyjaciela?", en: "What are the top three qualities you look for in a friend?" },
];

const selfdev: QuestionText[] = [
  { pl: "Jak definiujesz szczęście? Bądź konkretny/a.", en: "How do you define happiness? Get specific." },
  { pl: "Jakiej trudnej rozmowy z samym/samą sobą unikasz?", en: "What hard conversation with yourself are you avoiding?" },
  { pl: "Co oznacza dla Ciebie kochanie samego/samej siebie?", en: "What does self-love mean to you?" },
  { pl: "Za co chcesz przestać przepraszać?", en: "What do you want to stop apologizing for?" },
  { pl: "Z jakiego „nie”, powiedzianego ostatnio, jesteś najbardziej dumny/a?", en: "What recent “no” are you proudest of?" },
  { pl: "Gdyby obecny etap Twojego zdrowia psychicznego był rozdziałem książki, jaki miałby tytuł?", en: "If this chapter of your mental health journey had a title, what would it be?" },
  { pl: "Za co musisz przeprosić samego/samą siebie?", en: "What do you need to apologize to yourself for?" },
  { pl: "Jakie uczucie ostatnio u Ciebie dominuje?", en: "What feeling has been taking up the most space lately?" },
  { pl: "Czy zdarza Ci się być tą toksyczną osobą? Kiedy?", en: "Have you ever been the toxic one? When?" },
  { pl: "Czym ostatnio przejmujesz się bardziej, niż to warte?", en: "What have you been taking more seriously than it deserves?" },
  { pl: "Jakiego uczucia ostatnio do siebie nie dopuszczasz?", en: "What feeling have you been holding back lately?" },
  { pl: "Czego nigdy nie chciałbyś/ałabyś w sobie zmieniać?", en: "What would you never want to change about yourself?" },
  { pl: "Jaką obietnicę chcesz złożyć sobie w tym roku?", en: "What promise do you want to make to yourself this year?" },
  { pl: "O czym teraz za dużo myślisz?", en: "What are you overthinking right now?" },
  { pl: "Jaka rada najbardziej zapadła Ci w pamięć?", en: "What's a piece of advice that really stuck with you?" },
  { pl: "Nad czym obecnie pracujesz, czego inni nie widzą?", en: "What are you working on right now that others don't see?" },
  { pl: "Jaka jest najlepsza rzecz, którą zrobiłeś/aś ostatnio dla swojego zdrowia psychicznego?", en: "What is the best thing you've done for your mental health recently?" },
  { pl: "Jaka jest Twoja największa siła?", en: "What's your biggest strength?" },
  { pl: "Kiedy ostatnio pomyślałeś/aś: „dobrze, że jestem sobą”?", en: "When was the last time you felt lucky to be you?" },
  { pl: "O co bardzo mocno się starałeś/aś, ale ostatecznie tego nie dostałeś/aś?", en: "What's something you worked really hard for, but didn't end up getting?" },
  { pl: "Kiedy czułeś/aś się najbardziej spełniony/a w życiu?", en: "When have you felt most fulfilled in life?" },
  { pl: "Co wciąż starasz się sobie udowodnić?", en: "What are you still trying to prove to yourself?" },
  { pl: "Co rozczarowałoby w Tobie młodszą wersję Ciebie?", en: "What would disappoint your younger self about you today?" },
  { pl: "Zapytaj mnie o to, o czym ostatnio myślę.", en: "Ask me about what's been on my mind lately." },
  { pl: "Co musisz teraz usłyszeć?", en: "What do you need to hear right now?" },
  { pl: "Co Cię teraz boli w życiu?", en: "What about life hurts right now?" },
  { pl: "Na czym głęboko Ci zależy?", en: "What do you care about deeply?" },
  { pl: "Jakie osobiste przekonanie ostatnio poddałeś/aś w wątpliwość?", en: "What's a personal belief you've questioned recently?" },
  { pl: "Jak radzisz sobie z negatywnym wewnętrznym dialogiem?", en: "How do you deal with negative self-talk?" },
  { pl: "Jak priorytetyzujesz dbanie o siebie?", en: "How do you prioritize self-care?" },
  { pl: "Jaki lęk pokonałeś/aś?", en: "What's a fear you've conquered?" },
  { pl: "Z jakimi aspektami swojej osobowości wciąż się zmagasz?", en: "Which parts of your personality do you still struggle with?" },
  { pl: "Jak dbasz o własne zdrowie psychiczne, wspierając innych?", en: "How do you support your own mental health while also supporting others?" },
  { pl: "Co chciałbyś/ałabyś wiedzieć o zdrowiu psychicznym, będąc młodszym/ą?", en: "What's one thing you wish you'd known about mental health when you were younger?" },
  { pl: "Co było punktem zwrotnym w Twojej drodze do zdrowia psychicznego?", en: "What's a turning point in your mental health journey?" },
  { pl: "Jak bardzo zmieniłeś/aś się przez ostatnie pięć lat?", en: "How much have you changed over the last five years?" },
  { pl: "Jakie rzeczy wnoszą wartość do Twojego życia?", en: "What are the things that bring value to your life?" },
  { pl: "Czy uważasz, że masz silne zasady moralne i wartości? Jeśli tak, jakie?", en: "Would you say that you have strong morals and values? If so, what are they?" },
  { pl: "Czy łatwo czy trudno jest Ci odpuszczać rzeczy i ludzi?", en: "Do you find it easy or difficult to let go of things and people?" },
  { pl: "Jak dobrze potrafisz czytać emocje innych?", en: "How well do you think you can read others' emotions?" },
  { pl: "Jaki Twój nawyk irytuje innych ludzi?", en: "What habit do you have that annoys other people?" },
  { pl: "Jaki masz nietypowy nawyk?", en: "What's an unusual habit you have?" },
  { pl: "Na co najbardziej czekasz w kontekście starzenia się?", en: "What do you most look forward to about getting old?" },
  { pl: "Jak często Twój mózg działa na autopilocie?", en: "How often is your brain on autopilot?" },
  { pl: "Jakie słowo opisuje Cię lepiej niż jakiekolwiek inne?", en: "What word describes you better than any other word?" },
];

const passions: QuestionText[] = [
  { pl: "Jakie 5 piosenek najlepiej opisuje Twoją osobowość?", en: "If you had to pick five songs that capture your personality, what would they be?" },
  { pl: "Nad jakim pasjonującym projektem pracujesz?", en: "What's a passion project you're working on?" },
  { pl: "Gdyby wszystko w Twoim domu musiało być jednego koloru, jaki by to był?", en: "If everything in your house had to be one color, what color would you choose?" },
  { pl: "Czym się pasjonujesz?", en: "What are you passionate about?" },
  { pl: "Jakie rzeczy sprawiają, że czujesz, że żyjesz?", en: "What things make you feel alive?" },
  { pl: "Gdybyś mógł/mogła zachować tylko jedno wspomnienie, co by to było?", en: "If you could keep only one memory, what would it be?" },
  { pl: "Jaki tekst piosenki przychodzi Ci teraz do głowy?", en: "What song lyrics come to mind right now?" },
  { pl: "Co podnosi Cię na duchu, gdy życie Cię przytłacza?", en: "What lifts your spirits when life gets you down?" },
  { pl: "Jakiej piosenki powinienem/powinnam posłuchać w drodze do domu?", en: "What song should I listen to on the way home?" },
  { pl: "Jaka piosenka wprawia Cię w romantyczny nastrój?", en: "What's a song that puts you in a romantic mood?" },
  { pl: "Utknęliśmy w windzie. O co mnie pytasz?", en: "We're stuck in an elevator. What do you ask me?" },
  { pl: "Co jest najbliższe prawdziwej magii?", en: "What's the closest thing to real magic?" },
  { pl: "Jaki komplement, który otrzymałeś/aś, najbardziej zapadł Ci w pamięć?", en: "What's a compliment you've received that's stuck with you?" },
  { pl: "Co Twoim zdaniem jest najtrudniejsze w mojej pracy?", en: "What do you think is the hardest part of my job?" },
  { pl: "O co byś poprosił/a, gdybyś wiedział/a, że odpowiedź brzmi „tak”?", en: "What would you ask for if you knew the answer was „yes”?" },
  { pl: "Czego nikt nie może Ci odebrać?", en: "What's something no one can take away from you?" },
  { pl: "Jaka jest najbardziej szalona rzecz, którą chcesz zrobić?", en: "What's the craziest thing you want to do?" },
  { pl: "Gdzie byś pojechał/a, gdyby pieniądze nie miały znaczenia?", en: "Where would you go if money didn't matter?" },
  { pl: "Jakie jest najpiękniejsze miejsce, w którym byłeś/aś?", en: "What's the most beautiful place you've ever been?" },
  { pl: "Jaka jest najszaleńsza rzecz, jaką kiedykolwiek zrobiłeś/aś?", en: "What's the craziest thing you've ever done?" },
  { pl: "Co odróżnia Cię od większości ludzi?", en: "What makes you different from most people?" },
  { pl: "Jaka mała rzecz może natychmiast wywołać u Ciebie uśmiech?", en: "What small thing can instantly make you smile?" },
  { pl: "Gdybyś rzucił/a wszystko i pojechał/a w trasę, gdzie byś się udał/a?", en: "If you dropped everything and went on a road trip, where would you go?" },
  { pl: "Gdybyś zamknął/zamknęła oczy, jak wyglądałoby Twoje „szczęśliwe miejsce”?", en: "If you closed your eyes, what would your happy place look like?" },
  { pl: "Jaki był najpiękniejszy zachód słońca, jaki widziałeś/aś?", en: "What's the most beautiful sunset you've ever seen?" },
  { pl: "Gdybyś mógł/mogła wybrać sobie imię, jak by brzmiało?", en: "If you could pick your own name, what would it be?" },
  { pl: "Jaka jest Twoja najbardziej imponująca umiejętność?", en: "What's the most impressive skill you have?" },
  { pl: "Gdybyś dołączył/a do cyrku, jaki byłby Twój występ?", en: "If you joined the circus, what would your circus act be?" },
  { pl: "Co wybierasz: być najpopularniejszą czy najmądrzejszą osobą w szkole?", en: "Would you rather be the most popular or the smartest kid in school?" },
  { pl: "Utknięcie w windzie, jedna piosenka na pętli. Którą wybierasz?", en: "Stuck in an elevator with one song on repeat. Which one?" },
];

const introspection: QuestionText[] = [
  { pl: "Czego jesteś teraz absolutnie pewien/pewna?", en: "What's one thing you're completely sure of right now?" },
  { pl: "Jaki był największy ból psychiczny, jakiego doświadczyłeś/aś?", en: "What's the deepest emotional pain you've experienced?" },
  { pl: "Czy tęsknisz teraz za kimś? Czy myślisz, że ta osoba też tęskni za Tobą?", en: "Are you missing anyone right now? Do you think they're missing you too?" },
  { pl: "Co było pierwszą rzeczą, którą we mnie zauważyłeś/aś, gdy spotkaliśmy się osobiście?", en: "What was the first thing you noticed about me when we met in person?" },
  { pl: "Czego nowego o sobie się ostatnio dowiedziałeś/aś?", en: "What is something new you've learned about yourself recently?" },
  { pl: "Co we mnie jest dla Ciebie najtrudniejsze do zrozumienia?", en: "What about me is hardest for you to understand?" },
  { pl: "Jak bardzo zależy Ci na tym, żeby wszyscy Cię lubili? Dlaczego?", en: "How much do you need everyone to like you, and why?" },
  { pl: "Czego mi nie mówisz?", en: "What are you not telling me?" },
  { pl: "Jak jednym słowem opiszesz swoją relację z samym/samą sobą?", en: "How would you describe your relationship with yourself in one word?" },
  { pl: "Która część Twojego życia działa dobrze, a która boli?", en: "Which part of your life is going well, and which part hurts?" },
  { pl: "Jaka była najmilsza rzecz, jaką kiedykolwiek zrobił dla Ciebie przyjaciel?", en: "What's the nicest thing a friend has ever done for you?" },
  { pl: "Jaki był najmilszy moment dzisiejszego dnia?", en: "What was the nicest moment today?" },
  { pl: "Co według Ciebie jest moją słabością?", en: "What do you think my weakness is?" },
  { pl: "Co musisz z siebie wyrzucić?", en: "What do you need to get off your chest?" },
  { pl: "Jakie wspomnienia zostawiły w Tobie trwały ślad?", en: "What memories have left a lasting mark on you?" },
  { pl: "Co według Ciebie jest moją supermocą?", en: "What do you think my superpower is?" },
  { pl: "Zapytaj mnie o moje marzenia.", en: "Ask me something about my dreams." },
  { pl: "Jaki koszmar senny powtarza się u Ciebie najczęściej?", en: "Which nightmare do you have most often?" },
  { pl: "Wolisz pisać czy rozmawiać przez telefon?", en: "Do you prefer to text or talk on the phone?" },
  { pl: "O czym starasz się teraz nie myśleć?", en: "What are you trying not to think about right now?" },
  { pl: "Czego pragniesz najbardziej?", en: "What do you want the most?" },
  { pl: "Co najbardziej lubisz w byciu w domu?", en: "What's your favorite thing about being home?" },
  { pl: "Czego chciałbyś/ałabyś się ode mnie nauczyć?", en: "What would you like to learn from me?" },
  { pl: "Jaki film był tak smutny, że już nigdy go nie obejrzysz?", en: "What movie was so sad that you will never watch it again?" },
  { pl: "Co porusza Cię bardziej, niż byś chciał/a?", en: "What gets you more emotional than you'd like?" },
  { pl: "Co Cię stresuje?", en: "What makes you nervous?" },
  { pl: "Co doprowadza Cię do większej złości, niż powinno?", en: "What makes you angrier than it probably should?" },
  { pl: "Co w Tobie przeraża Cię najbardziej?", en: "What about you scares you the most?" },
  { pl: "Kiedy jesteś najbardziej sobą?", en: "When are you most yourself?" },
  { pl: "Jakie wydarzenie z przeszłości wciąż do Ciebie powraca?", en: "What event in your past keeps coming back to you?" },
  { pl: "Gdybyś mógł/mogła cofnąć się i zmienić tylko jedną decyzję, co by to było?", en: "If you could go back and change just one decision you made, what decision would you change?" },
  { pl: "Jaki był Twój największy błąd, który ostatecznie przyniósł coś dobrego?", en: "What's the biggest mistake you've made that led to something good?" },
  { pl: "Jaka była najmądrzejsza rzecz, jaką zrobiłeś/aś jako dziecko?", en: "What was the cleverest thing you did as a child?" },
  { pl: "Jaka jest najdziwniejsza rzecz, jaką widziałeś/aś w pracy?", en: "What's the strangest thing you've seen happen at a job you've had?" },
  { pl: "Co uważasz za zabawne, czego większość ludzi nie rozumie?", en: "What do you find funny that most people don't get?" },
  { pl: "Kogo trudno jest Ci traktować poważnie?", en: "Who do you have a hard time taking seriously?" },
  { pl: "Kiedy ostatnio próba wyglądania na wyluzowanego/ą skończyła się wstydem?", en: "When did trying to look cool last end in embarrassment?" },
  { pl: "Jaka dziwna rzecz jest warta spróbowania przez każdego chociaż raz?", en: "What's something unusual that everyone should try at least once?" },
  { pl: "Jakie słowo brzmi według Ciebie najgorzej?", en: "What do you think is the most unpleasant-sounding word?" },
];

const plusLove: QuestionText[] = [
  { pl: "Jak ważna jest dla Ciebie intymność fizyczna w związku?", en: "How important is physical intimacy in a relationship for you?" },
  { pl: "Jaki mały, codzienny akt miłości znaczy dla Ciebie najwięcej?", en: "What's a small, everyday act of love that means the most to you?" },
  { pl: "Czy miłość powinna być zawsze łatwa, czy walka o nią ją wzmacnia?", en: "Do you think love should always be easy, or does struggle make it stronger?" },
  { pl: "Czy kiedykolwiek zakochałeś/aś się niespodziewanie? Co się stało?", en: "Have you ever fallen for someone unexpectedly? What happened?" },
  { pl: "Jaką lekcję z poprzednich związków wykorzystujesz dziś?", en: "What lesson from past relationships do you still use today?" },
  { pl: "Co jest ważniejsze: głęboka więź emocjonalna czy wspólny styl życia?", en: "What's more important: a deep emotional connection or a similar lifestyle?" },
  { pl: "Jaki jest jeden sposób okazywania miłości, którego inni by się nie spodziewali?", en: "What's one unexpected way you show love?" },
  { pl: "Czy kiedyś zmieniłeś/aś zdanie na temat miłości? Co to sprawiło?", en: "Have you ever changed your mind about love? What made you change your mind?" },
  { pl: "Wolisz historię miłosną, która jest intensywna i krótka, czy stabilną i długą?", en: "Would you rather have a love story that's intense and short or steady and long-lasting?" },
  { pl: "Co sądzisz o mówieniu „kocham Cię” jako pierwsza osoba? Czy kiedyś tego żałowałeś/aś?", en: "How do you feel about saying 'I love you' first? Have you ever regretted it?" },
  { pl: "Co sprawia, że dana osoba staje się dla Ciebie niezapomniana?", en: "What's one thing that makes a person unforgettable to you?" },
  { pl: "Wolisz świetną chemię przy różnych wartościach, czy te same wartości bez iskry?", en: "Would you rather have great chemistry but different values, or the same values but no spark?" },
  { pl: "Czy chcesz jeszcze raz przeżyć swoją pierwszą miłość?", en: "If you could experience your first love again, would you?" },
  { pl: "Co takiego ludzie romantyzują w związkach, co w rzeczywistości nie jest wcale takie wspaniałe?", en: "What's one thing about relationships that people romanticize but isn't actually that great?" },
];

const plusSpice: QuestionText[] = [
  { pl: "Czego najbardziej boisz się w relacji typu friends with benefits?", en: "What scares you most about becoming friends with benefits?" },
  { pl: "Jak najlepiej zakończyć relację typu friends with benefits?", en: "What's the best way to end a friends-with-benefits relationship?" },
  { pl: "W jakim najbardziej szalonym miejscu zdarzyło Ci się uprawiać seks?", en: "What's the wildest place you've had sex?" },
  { pl: "Co pomaga Ci czuć bliskość z drugą osobą podczas seksu?", en: "What helps you feel close to your partner during sex?" },
  { pl: "Co sądzisz o sekstowaniu w związku?", en: "How do you feel about sexting in a relationship?" },
  { pl: "Co sądzisz o przygodach na jedną noc?", en: "What are your thoughts on one-night stands?" },
  { pl: "Co jest dla Ciebie najważniejsze w grze wstępnej?", en: "What's the most important thing to you during foreplay?" },
  { pl: "Co nieoczywistego Cię podnieca?", en: "What's your most unexpected turn-on?" },
  { pl: "Wolisz namiętny, spontaniczny seks czy powolne, zmysłowe budowanie napięcia?", en: "Do you prefer passionate, spontaneous sex or slow, sensual build-up?" },
  { pl: "Jaka jest najseksowniejsza rzecz, jaką partner kiedykolwiek Ci powiedział?", en: "What's the sexiest thing a partner has ever said to you?" },
  { pl: "Jaka jest Twoja sekretna fantazja, o której nikomu nie mówiłeś/aś?", en: "What's a secret fantasy you've never told anyone about?" },
  { pl: "Wolisz być uwodzony/a słowami czy czynami?", en: "Would you rather be seduced with words or with actions?" },
  { pl: "Jaki ruch w grze wstępnej zawsze na Ciebie działa?", en: "What's a foreplay move that always works for you?" },
  { pl: "W jakim nietypowym miejscu chcesz kiedyś uprawiać seks?", en: "What's an unusual place where you'd like to have sex?" },
  { pl: "Czy kiedykolwiek wysłałeś/aś ryzykowną wiadomość i żałowałeś/aś? Co się stało?", en: "Have you ever sent a risky text and regretted it? What happened?" },
  { pl: "Czy friends with benefits może naprawdę działać?", en: "Can friends with benefits ever really work?" },
  { pl: "Gdyby partner miał kink, który Cię nie kręci, spróbowałbyś/ałabyś tego dla niego?", en: "If your partner had a kink that you weren't into, would you try it for them?" },
  { pl: "Czego nigdy nie próbowałeś/aś w łóżku, a co Cię ciekawi?", en: "What's something you've never tried in bed but are curious about?" },
  { pl: "Co Cię najbardziej odpycha w sypialni?", en: "What turns you off the most in the bedroom?" },
  { pl: "Czemu partnerzy powinni poświęcać więcej uwagi podczas seksu?", en: "What should partners pay more attention to during sex?" },
  { pl: "Co sądzisz o dominacji i uległości w sypialni?", en: "How do you feel about dominance and submission in the bedroom?" },
  { pl: "Wolisz partnera bardziej doświadczonego czy takiego, który uczy się razem z Tobą?", en: "Would you rather have a partner who's more experienced than you or one who learns with you?" },
  { pl: "Co sądzisz o spontanicznym, nieplanowanym seksie w porównaniu do starannie przygotowanych momentów?", en: "How do you feel about spontaneous sex compared with carefully planned intimate moments?" },
  { pl: "Jaka niefizyczna rzecz, którą robię, działa na Ciebie najbardziej pociągająco?", en: "What non-physical thing that I do turns you on the most?" },
  { pl: "Gdybyśmy mieli spróbować czegoś zupełnie nowego w sypialni bez żadnego oceniania, co by to było?", en: "If we were to try something completely new in the bedroom with zero judgment, what would it be?" },
  { pl: "Jaki rodzaj dotyku sprawia, że natychmiast czujesz ze mną głęboką bliskość?", en: "What kind of touch makes you feel deeply close to me right away?" },
  { pl: "O jakiej fantazji z moim udziałem myślisz najczęściej, gdy nie jesteśmy razem?", en: "What fantasy involving me do you think about most often when we are apart?" },
  { pl: "Jakie słowa szeptane podczas bliskości elektryzują Cię najbardziej?", en: "What whispered words excite you most during intimate moments?" },
  { pl: "Co według Ciebie buduje największe napięcie i pożądanie między nami w ciągu dnia?", en: "What builds the most tension and desire between us during the day?" },
  { pl: "Jaki moment naszej wspólnej intymności zapamiętasz na zawsze i dlaczego?", en: "Which intimate moment together will you remember forever, and why?" },
  { pl: "Co sprawia, że najbardziej czujesz się przy mnie pożądany/a?", en: "What makes you feel most desired by me?" },
  { pl: "Jaki gest z mojej strony w środku dnia potrafi Cię rozgrzać na wieczór?", en: "What could I do during the day to get you in the mood for the evening?" },
  { pl: "Jakie spojrzenie ode mnie mówi Ci więcej niż jakiekolwiek słowa?", en: "What kind of look from me tells you more than any words could?" },
  { pl: "Co chciałbyś/ałabyś, żebym częściej robił/a, kiedy jesteśmy sami?", en: "What do you wish I did more often when we are alone?" },
  { pl: "Kiedy ostatnio poczułeś/aś między nami autentyczne, elektryzujące napięcie?", en: "When did you last feel a real spark of tension between us?" },
];

const plusDeep: QuestionText[] = [
  { pl: "Kiedy ostatnio poczułeś/aś się przy mnie w pełni zrozumiany/a?", en: "When did you last feel completely understood by me?" },
  { pl: "Jaka emocja jest dla Ciebie najtrudniejsza do pokazania drugiej osobie?", en: "Which emotion is hardest for you to show another person?" },
  { pl: "Co sprawia, że czujesz się przy kimś naprawdę bezpiecznie?", en: "What makes you feel truly safe with someone?" },
  { pl: "Jakiej formy bliskości brakuje Ci najbardziej?", en: "What kind of closeness do you miss the most?" },
  { pl: "Co chciałbyś/ałabyś, żebym rozumiał/a o Twoich lękach?", en: "What do you wish I understood about your fears?" },
  { pl: "Kiedy czujesz się najbardziej kochany/a?", en: "When do you feel the most loved?" },
  { pl: "Jaka rana z przeszłości wciąż wpływa na to, jak kochasz?", en: "What past wound still shapes how you love?" },
  { pl: "Co znaczy dla Ciebie prawdziwe zaufanie w związku?", en: "What does real trust mean to you in a relationship?" },
  { pl: "Czego nigdy nie powiedziałeś/aś na głos o naszej relacji?", en: "What have you never said out loud about our relationship?" },
  { pl: "Jak prosisz o wsparcie, kiedy go potrzebujesz?", en: "How do you ask for support?" },
  { pl: "Co pomaga Ci otworzyć się, gdy jest Ci trudno?", en: "What helps you open up when things feel hard?" },
  { pl: "Jaka wspólna chwila zbliżyła nas najbardziej?", en: "What shared moment brought us closest together?" },
];

const plusKinky: QuestionText[] = [
  { pl: "Jaką fantazję chciałbyś/ałabyś kiedyś wspólnie eksplorować?", en: "What's a fantasy you'd love to explore together someday?" },
  { pl: "Co Cię intryguje, choć nigdy tego nie próbowałeś/aś?", en: "What intrigues you even though you've never tried it?" },
  { pl: "Wolisz przejmować kontrolę czy ją oddawać?", en: "Do you prefer taking control or giving it up?" },
  { pl: "Jakie budowanie napięcia najbardziej Cię podnieca?", en: "What kind of tension-building excites you most?" },
  { pl: "Jak lubisz komunikować swoje granice i zgodę?", en: "How do you like to communicate boundaries and consent?" },
  { pl: "Co sprawia, że napięcie staje się ekscytujące, a nie krępujące?", en: "What makes tension exciting rather than awkward for you?" },
  { pl: "Jaka scena z filmu lub książki wydała Ci się nieoczekiwanie gorąca?", en: "What scene from a film or book felt unexpectedly hot to you?" },
  { pl: "Co chciałbyś/ałabyś, żeby partner odważył się zaproponować?", en: "What do you wish a partner would be bold enough to suggest?" },
  { pl: "Jaki rodzaj zabawy i śmiechu lubisz w intymnych chwilach?", en: "What kind of playfulness and laughter do you enjoy during intimate moments?" },
  { pl: "Co dodaje Ci pewności, by wyrazić swoje pragnienia?", en: "What gives you confidence to express your desires?" },
  { pl: "Jaka niespodzianka od partnera wprawiłaby Cię w zachwyt?", en: "What kind of surprise from a partner would thrill you?" },
  { pl: "Gdzie leży granica między ekscytacją a strefą komfortu dla Ciebie?", en: "Where do you draw the line between what excites you and what feels comfortable?" },
];

export const QUESTIONS: Question[] = [
  ...build("love", "basic", love),
  ...build("friendship", "basic", friendship),
  ...build("selfdev", "basic", selfdev),
  ...build("passions", "basic", passions),
  ...build("introspection", "basic", introspection),
  ...build("plus_love", "plus", plusLove),
  ...build("plus_spice", "plus", plusSpice),
  ...build("plus_deep", "plus", plusDeep),
  ...build("plus_kinky", "plus", plusKinky),
];

export const BASIC_CATEGORIES: CategoryId[] = [
  "love",
  "friendship",
  "selfdev",
  "passions",
  "introspection",
];

export const PLUS_CATEGORIES: CategoryId[] = [
  "plus_love",
  "plus_spice",
  "plus_deep",
  "plus_kinky",
];

/** Short, display-friendly edition names per deck. */
export const EDITION_META: Record<DeckId, QuestionText> = {
  basic: { pl: "Podstawowa", en: "Basic" },
  plus: { pl: "Plus", en: "Plus" },
  unfiltered: { pl: "Unfiltered", en: "Unfiltered" },
};

export function editionForCategory(category: CategoryId | "unfiltered"): DeckId {
  return category === "unfiltered" ? "unfiltered" : CATEGORY_META[category].deck;
}
