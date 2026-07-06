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
  { pl: "Jaką radę dotyczącą randkowania dałbyś/dałabyś młodszej wersji siebie?", en: "What dating advice would you give your younger self?" },
  { pl: "Jak poradziłeś/aś sobie z pierwszą miłością?", en: "How did you get over your first love?" },
  { pl: "Jaką historię o miłości sobie opowiadasz, która już Ci nie służy?", en: "What story about love have you been telling yourself that no longer serves you?" },
  { pl: "Gdybyś mógł/mogła zapytać swojego ex o jedną rzecz i dostać szczerą odpowiedź, co by to było?", en: "If you could ask your ex one thing and get a completely honest answer, what would it be?" },
  { pl: "Jak opisałbyś/abyś uczucie bycia zakochanym w jednym słowie?", en: "How would you describe the feeling of being in love in one word?" },
  { pl: "Co teraz rozumiesz o miłości, czego nie rozumiałeś/aś wcześniej?", en: "What do you now understand about love that you didn't before?" },
  { pl: "Wiadomość o jakiej treści chciałbyś/chciałabyś teraz otrzymać?", en: "What text do you wish you would get right now?" },
  { pl: "Czy jesteś wyleczony/a, czy po prostu starasz się o tym nie myśleć?", en: "Are you healed or just trying not to think about it?" },
  { pl: "Wiedziałem/am, że to koniec, kiedy…", en: "I knew it was over when …" },
  { pl: "Czy wciąż o nich myślisz?", en: "Do you still think about them?" },
  { pl: "Jaka piosenka najlepiej opisuje uczucie złamanego serca?", en: "What song best describes the feeling of getting your heart broken?" },
  { pl: "Randkujesz, bo chcesz znaleźć miłość, czy dlatego, że boisz się bycia samemu/samej?", en: "Are you dating because you want to find love or because you're just afraid of being alone?" },
  { pl: "Wolałbyś/abyś przeżyć jeszcze raz swoje najgorsze złamane serce czy wymazać tę osobę z pamięci?", en: "Would you rather relive your worst heartbreak or erase the person from your memory?" },
  { pl: "Jaka jest Twoja rada dla kogoś, kto rozważa wejście w 'situationship'?", en: "What's your advice for someone considering entering a situationship?" },
  { pl: "Czy zdrada jest dla Ciebie powodem do definitywnego końca?", en: "Is cheating a dealbreaker for you?" },
  { pl: "Czy byłbyś/abyś w stanie kochać kogoś po tym, jak był niewierny?", en: "Would you still be able to love someone after they've been unfaithful?" },
  { pl: "Czy wierzysz, że można być przyjaciółmi z kimś, kogo się kochało?", en: "Do you believe you can be friends with someone you loved in the past?" },
  { pl: "Opisz swoje życie randkowe w trzech słowach.", en: "Describe your dating life in three words." },
  { pl: "Co sprawia, że ktoś natychmiast staje się atrakcyjny?", en: "What instantly makes someone hot?" },
  { pl: "Na ile dostępny/a emocjonalnie się wydaję?", en: "How emotionally available do I seem?" },
  { pl: "Czego szukasz w następnym związku?", en: "What do you want in your next relationship?" },
  { pl: "Co najbardziej cenisz u partnera?", en: "What do you value most in a partner?" },
  { pl: "Jak definiujesz szczęście? Bądź konkretny/a.", en: "How do you define happiness? Get specific." },
  { pl: "Jaka jest jedna rzecz, której jesteś teraz pewien/pewna?", en: "What is one thing right now that you are sure of?" },
  { pl: "Skąd wiesz, że kogoś kochasz?", en: "How do you know when you love someone?" },
  { pl: "Jaka jedna rzecz w miłości Cię przeraża?", en: "What's one thing about love that scares you?" },
  { pl: "Czy wierzysz, że ludzie mogą się zmienić dla kogoś, kogo kochają?", en: "Do you believe people can change if they love someone?" },
  { pl: "Skąd wiesz, że jesteś gotowy/a powiedzieć „kocham Cię”?", en: "How do you know when you're ready to say \u201cI love you\u201d?" },
  { pl: "Jak radzisz sobie z odrzuceniem w randkowaniu?", en: "How do you handle rejection in dating?" },
  { pl: "Jak definiujesz 'situationship'?", en: "How do you define a situationship?" },
  { pl: "Jaki jest Twój największy lęk przed wejściem w relację FWB?", en: "What's your biggest fear about entering an FWB (friends with benefits) relationship?" },
  { pl: "Co sądzisz o próbowaniu nowych rzeczy w sypialni?", en: "How do you feel about trying new things in the bedroom?" },
  { pl: "Jaki jest najlepszy sposób na zakończenie relacji fwb?", en: "What's the best way to end an fwb relationship if needed?" },
  { pl: "Co jest według Ciebie kluczem do udanego związku?", en: "What do you think is the key to a successful relationship?" },
  { pl: "Jak ważna jest dla Ciebie intymność fizyczna w związku?", en: "How important is physical intimacy in a relationship for you?" },
  { pl: "Jak radzisz sobie z konfliktami w związku?", en: "How do you handle conflicts in a relationship?" },
  { pl: "Co sądzisz o związkach na odległość?", en: "How do you feel about long-distance relationships?" },
  { pl: "Co sądzisz o publicznym okazywaniu uczuć?", en: "How do you feel about public displays of affection?" },
  { pl: "Jak radzisz sobie z zazdrością w związku?", en: "How do you handle jealousy in a relationship?" },
  { pl: "Jak ważne jest dla Ciebie posiadanie podobnych celów życiowych co partner?", en: "How important is it for you to have similar life goals as your partner?" },
  { pl: "Jak ważne jest dla Ciebie, aby partner dogadywał się z Twoimi przyjaciółmi?", en: "How important is it to you that your partner gets along with your friends?" },
  { pl: "Co sądzisz o tym, że Twój partner ma bliskich przyjaciół przeciwnej płci?", en: "How do you feel about your partner having close friends of the opposite sex?" },
  { pl: "Jakie jest najbardziej odważne miejsce, w którym uprawiałeś/aś seks?", en: "What's the most adventurous place you've had sex?" },
  { pl: "Jak dbasz o silną więź podczas seksu?", en: "How do you keep the connection strong during sex?" },
  { pl: "Jaki jest Twój ulubiony sposób na flirtowanie?", en: "What's your favorite way to flirt with someone?" },
  { pl: "Co sądzisz o sekstowaniu w związku?", en: "How do you feel about sexting in a relationship?" },
  { pl: "Jaki jest najlepszy sposób na rozpoczęcie poważnej rozmowy o związku?", en: "What's the best way to initiate a serious relationship talk?" },
  { pl: "Co sądzisz o przygodach na jedną noc?", en: "What are your thoughts on one-night stands?" },
  { pl: "Co jest dla Ciebie najważniejsze podczas gry wstępnej?", en: "What's the most important thing to you during foreplay?" },
  { pl: "Z jakiej rany emocjonalnej wciąż się leczysz?", en: "What's an emotional wound you're still healing from?" },
  { pl: "Czy wierzysz w miłość od pierwszego wejrzenia?", en: "Do you believe in love at first sight?" },
  { pl: "Czy związek może przetrwać i rozkwitać bez pociągu fizycznego?", en: "Can a relationship survive and thrive without physical attraction?" },
  { pl: "Czy zazdrość może być kiedykolwiek zdrową emocją w związku?", en: "Is jealousy ever a healthy emotion in a relationship?" },
  { pl: "Czy wspólne mieszkanie przed ślubem jest konieczne?", en: "Is it necessary for a couple to live together before getting married or making a long-term commitment?" },
  { pl: "Czy ukrywanie tajemnic przed partnerem dla zachowania spokoju jest okej?", en: "Is it okay for partners to keep secrets from each other for the sake of maintaining peace?" },
  { pl: "Czy związki są kiedykolwiek tego warte?", en: "Are relationships ever worth it?" },
  { pl: "Dlaczego jesteś singlem / singielką?", en: "Why are you single?" },
  { pl: "Kiedy ostatni raz byłeś/aś wobec kogoś poważny/a?", en: "When was the last time you were serious about somebody?" },
  { pl: "Jaka jest najdziwniejsza rzecz, którą uważasz za atrakcyjną u innych?", en: "What is the weirdest thing you find attractive in a person?" },
  { pl: "Do ilu osób żywiłeś/aś prawdziwe uczucia?", en: "How many people have you had true feelings for?" },
  { pl: "Jaka była najboleśniejsza wiadomość, którą wysłałeś/aś lub otrzymałeś/aś?", en: "What's the most painful text you've ever received or sent?" },
  { pl: "Jaki typ ludzi Cię przyciąga?", en: "What kind of people are you attracted to?" },
];

const friendship: QuestionText[] = [
  { pl: "Jak ma na imię Twój najlepszy przyjaciel i jedna rzecz o nim?", en: "What's your best friend's name and one thing about them?" },
  { pl: "Gdybyś mógł/mogła przeżyć jeszcze raz jeden kultowy dzień z naszej przyjaźni, co by to było?", en: "If you could relive an iconic day in our friendship, what would it be?" },
  { pl: "Kto ma dobry wpływ na Twoje zdrowie psychiczne? Wyślij tej osobie wiadomość.", en: "Who's been good for your mental health? Send them a thank-you message." },
  { pl: "Z kim jesteś, kiedy czujesz się najlepiej?", en: "Who are you with when you feel your best?" },
  { pl: "Z kim chcesz spędzać więcej czasu?", en: "Who do you want to spend more time with?" },
  { pl: "Zapytaj mnie o coś.", en: "Ask me something." },
  { pl: "Kto jest pierwszą osobą, z którą chcesz dzielić się dobrą wiadomością?", en: "Who's the first person you want to share good news with?" },
  { pl: "Do kogo idziesz po poradę życiową? Dlaczego do tej osoby?", en: "Who do you go to for life advice? Why them?" },
  { pl: "Kto sprawia, że czujesz się kochany/a, nawet gdy czujesz, że nie zasługujesz?", en: "Who makes you feel loved, even when you don't feel lovable?" },
  { pl: "Gdybyś mógł/mogła kontaktować się tylko z trzema osobami przez rok, kto by to był i dlaczego?", en: "If you could contact only three people for the next year, who would they be and why?" },
  { pl: "Jaki wewnętrzny żart masz ze swoimi przyjaciółmi?", en: "What's an inner joke you have with your friends?" },
  { pl: "Kto ostatnio traktuje Cię naprawdę dobrze?", en: "Who's been treating you right lately?" },
  { pl: "Gdybyś miał/a wybrać 5 piosenek tworzących Twoją osobowość, co by to było?", en: "If you had to pick 5 songs that make up your personality, what would they be?" },
  { pl: "Czy czujesz, że przy mnie jesteś całkowicie sobą?", en: "Do you feel like you are completely yourself around me?" },
  { pl: "Kto jest osobą, której mówisz o wszystkim?", en: "Who is one person you tell everything to?" },
  { pl: "Czy zostajesz w przyjaźni ze swoimi ex?", en: "Do you stay friends with your exes?" },
  { pl: "Zapytaj mnie o coś, o co zawsze chciałeś/aś zapytać.", en: "Ask me something you wanted to ask." },
  { pl: "Gdybyś miał/a szansę, czy zmieniłbyś/abyś coś w tym, jak zaczęła się Twoja historia miłosna?", en: "If you had the chance would you change anything about how your love story began?" },
  { pl: "Jakie wspomnienie z tego roku sprawia, że uśmiechasz się na samą myśl?", en: "What's memory from this year that makes you smile just thinking about it?" },
  { pl: "Czy uważasz, że szczerze mamy na siebie dobry wpływ?", en: "Do you think we're good for each other, honestly?" },
  { pl: "Jak mogę zapracować na więcej Twojego zaufania?", en: "How can I earn more of your trust?" },
  { pl: "Jakie cechy kojarzysz z dobrym słuchaczem?", en: "What qualities do you associate with a good listener?" },
  { pl: "Jaka jest Twoja 'grzeszna przyjemność' (guilty pleasure)?", en: "What's guilty pleasure you have?" },
  { pl: "Jakie masz relacje ze swoją rodziną?", en: "What sort of relationship do you have with your family?" },
  { pl: "Kto Cię wspierał, gdy najbardziej tego potrzebowałeś/aś?", en: "Who had your back when you needed it most?" },
  { pl: "Jakie oczekiwania wobec kogoś ranią Cię najbardziej?", en: "What's expectations have I set on someone that has been hurting me the most?" },
  { pl: "Czy unikasz trudnych rozmów z samym/samą sobą?", en: "Are you avoiding any hard conversations with yourself?" },
  { pl: "Co było najlepszą rzeczą w tym, jak wychowali Cię rodzice?", en: "What was the best thing about how your parents raised you?" },
  { pl: "Z którym rodzicem masz bliższą relację?", en: "Which parent are you closer to?" },
  { pl: "Kto był ostatnią osobą, z którą odbyłeś/aś głęboką rozmowę?", en: "Who was the last person you had a deep conversation with?" },
  { pl: "Gdybyś był/a pijany/a, kto byłby pierwszą osobą, którą chciałbyś/abyś, by się Tobą zajęła?", en: "If you were drunk, who would be the first person you'd want to take care of you?" },
  { pl: "Czy ważne jest dla Ciebie wspólne jedzenie posiłków z rodziną?", en: "Is it important to you to sit down and eat together as a family?" },
  { pl: "Czy masz granice, o których ważne jest, byś komunikował/a?", en: "Do you have any boundaries or limits that are important for you to communicate?" },
  { pl: "Kto był najbardziej toksyczną osobą, jaką znałeś/aś?", en: "Who was the most toxic person you've known?" },
  { pl: "Czy jest coś, co zawsze chciałeś/aś mi powiedzieć, ale jeszcze tego nie zrobiłeś/aś?", en: "Is there something you've always wanted to tell me but haven't yet?" },
];

const selfdev: QuestionText[] = [
  { pl: "Co oznacza dla mnie pokochanie samego siebie?", en: "What does self-love mean to me?" },
  { pl: "Za co chcesz przestać przepraszać?", en: "What do you want to stop apologizing for?" },
  { pl: "Z czego, za co ostatnio powiedziałeś/aś „nie”, jesteś najbardziej dumny/a?", en: "What are you proudest of yourself for saying 'no' to recently?" },
  { pl: "Jaki tytuł nadałbyś/abyś obecnemu rozdziałowi swojej podróży ze zdrowiem psychicznym?", en: "What title would you give this chapter of your mental health journey?" },
  { pl: "Za co musisz przeprosić samego/samą siebie?", en: "What do you need to apologize to yourself for?" },
  { pl: "Czego ostatnio czujesz bardzo dużo?", en: "What are you feeling a lot of lately?" },
  { pl: "Czy to Ty jesteś tą toksyczną osobą?", en: "Are you the toxic one?" },
  { pl: "A co jeśli to nie byłoby aż tak poważne?", en: "What if it wasn't that serious?" },
  { pl: "A co gdybyś pozwolił/a sobie to poczuć?", en: "What if you let yourself feel it?" },
  { pl: "Czego nigdy nie chciałbyś/ałabyś w sobie zmieniać?", en: "What would you never want to change about yourself?" },
  { pl: "Co jest najtrudniejszą częścią randkowania z Tobą?", en: "What's the hardest part about dating you?" },
  { pl: "Jaką obietnicę chcesz złożyć sobie w tym roku?", en: "What promise do you want to keep to yourself this year?" },
  { pl: "O czym teraz za dużo myślisz?", en: "What are you overthinking right now?" },
  { pl: "Jaka rada najbardziej zapadła Ci w pamięć?", en: "What's a piece of advice that really stuck with you?" },
  { pl: "Nad czym obecnie pracujesz, czego inni nie widzą?", en: "What are you currently working through that others don't see?" },
  { pl: "Jaka jest najlepsza rzecz, którą zrobiłeś/aś ostatnio dla swojego zdrowia psychicznego?", en: "What is the best thing you've done for your mental health recently?" },
  { pl: "Jaka jest Twoja największa siła?", en: "What's your biggest strength?" },
  { pl: "Kiedy ostatni raz czułeś/aś się szczęściarzem, że jesteś sobą?", en: "When was the last time you felt lucky to be you?" },
  { pl: "O co bardzo mocno się starałeś/aś, ale ostatecznie tego nie dostałeś/aś?", en: "What's something you worked really hard for, but didn't end up getting?" },
  { pl: "Kiedy czułeś/aś się najbardziej spełniony/a w życiu?", en: "When did you feel the most accomplished in your life?" },
  { pl: "Co wciąż starasz się sobie udowodnić?", en: "What are you still trying to prove to yourself?" },
  { pl: "Czym Twoja młodsza wersja byłaby w Tobie rozczarowana?", en: "What would your younger self be disappointed in you for?" },
  { pl: "Zapytaj mnie o coś dotyczącego moich myśli.", en: "Ask me something about my thoughts." },
  { pl: "Co musisz teraz usłyszeć?", en: "What do you need to hear right now?" },
  { pl: "Co Cię teraz boli w życiu?", en: "What about life hurts right now?" },
  { pl: "Na czym głęboko Ci zależy?", en: "What do you care about deeply?" },
  { pl: "Jakie osobiste przekonanie ostatnio poddałeś/aś w wątpliwość?", en: "What's a personal belief you've questioned recently?" },
  { pl: "Jak radzisz sobie z negatywnym wewnętrznym dialogiem?", en: "How do you deal with negative self-talk?" },
  { pl: "Jak priorytetyzujesz dbanie o siebie?", en: "How do you prioritize self-care?" },
  { pl: "Nad jakim pasjonującym projektem pracujesz?", en: "What's a passion project you're working on?" },
  { pl: "Jaki lęk pokonałeś/aś?", en: "What's a fear you've conquered?" },
  { pl: "Z jakimi aspektami swojej osobowości wciąż się zmagasz?", en: "What aspects of your personality do you still struggle to understand?" },
  { pl: "Jak dbasz o własne zdrowie psychiczne, wspierając innych?", en: "How do you support your own mental health while also supporting others?" },
  { pl: "Co chciałbyś/ałabyś wiedzieć o zdrowiu psychicznym, będąc młodszym/ą?", en: "What's one thing you wish you'd known about mental health when you were younger?" },
  { pl: "Co było punktem zwrotnym w Twojej drodze do zdrowia psychicznego?", en: "What's a turning point in your mental health journey?" },
  { pl: "Jak bardzo zmieniłeś/aś się przez ostatnie pięć lat?", en: "How much have you changed in five years?" },
  { pl: "Jakie rzeczy wnoszą wartość do Twojego życia?", en: "What are the things that bring value to your life?" },
  { pl: "Czy uważasz, że masz silne zasady moralne i wartości? Jeśli tak, jakie?", en: "Would you say that you have strong morals and values? If so, what are they?" },
  { pl: "Czy łatwo czy trudno jest Ci odpuszczać rzeczy i ludzi?", en: "Do you find it easy or difficult to let things and people go?" },
  { pl: "Jak dobrze potrafisz czytać emocje innych?", en: "How well do you think you can read others' emotions?" },
  { pl: "Jaki Twój nawyk irytuje innych ludzi?", en: "What habit do you have that annoys other people?" },
  { pl: "Jaki masz nawyk, którego według Ciebie nie ma wielu innych ludzi?", en: "What habit do you have that you think not many other people have?" },
  { pl: "Na co najbardziej czekasz w kontekście starzenia się?", en: "What do you most look forward to about getting old?" },
  { pl: "Jaka jest najzabawniejsza rzecz, którą ktoś Ci wyznał pod wpływem alkoholu?", en: "What's the funniest or strangest thing that someone has drunkenly confessed to you?" },
  { pl: "Jak często Twój mózg działa na autopilocie?", en: "How often is your brain on autopilot?" },
  { pl: "Jakie słowo opisuje Cię lepiej niż jakiekolwiek inne?", en: "What word describes you better than any other word?" },
  { pl: "Gdyby wszystko w Twoim domu musiało być jednego koloru, jaki by to był?", en: "If everything in your house had to be one color, what color would you choose?" },
];

const passions: QuestionText[] = [
  { pl: "Czym się pasjonujesz?", en: "What are you passionate about?" },
  { pl: "Jakie rzeczy sprawiają, że czujesz, że żyjesz?", en: "What things make you feel alive?" },
  { pl: "Gdybyś mógł/mogła zachować tylko jedno wspomnienie, co by to było?", en: "If you could keep only one memory, what would it be?" },
  { pl: "Jaki tekst piosenki przychodzi Ci teraz do głowy?", en: "What's your favorite song lyrics you can think off the top of your head?" },
  { pl: "Co podnosi Cię na duchu, gdy życie Cię przytłacza?", en: "What lifts your spirits when life gets you down?" },
  { pl: "Czego nigdy nie powiedziałeś/aś swojemu ex (a chciałbyś/ałabyś)?", en: "What's one thing you never said to your ex (but wish you did)?" },
  { pl: "Jakiej piosenki powinienem/powinnam posłuchać w drodze do domu?", en: "What song should I listen to on the way home?" },
  { pl: "Jaka piosenka wprawia Cię w romantyczny nastrój?", en: "What's a song that puts you in a romantic mood?" },
  { pl: "Gdybyśmy utknęli w windzie, o jaką jedną rzecz chciałbyś/ałabyś mnie zapytać?", en: "If we were stuck in an elevator together, what's one thing you'd want to know about me?" },
  { pl: "Jakie są trzy najważniejsze cechy, których szukasz u przyjaciela?", en: "What are the top three qualities you look for in a friend?" },
  { pl: "Co jest najbliższe prawdziwej magii?", en: "What's the closest thing to real magic?" },
  { pl: "Jaki komplement, który otrzymałeś/aś, najbardziej zapadł Ci w pamięć?", en: "What's a compliment you've received that's stuck with you?" },
  { pl: "Czego zawsze chciałeś/aś w związku, ale nigdy nie dostałeś/aś?", en: "What's something you've always wanted in relationship, but never gotten?" },
  { pl: "Co według Ciebie jest najtrudniejszą częścią tego, czym zajmuję się zawodowo?", en: "What do you think is the hardest part of what I do for living?" },
  { pl: "O co byś poprosił/a, gdybyś wiedział/a, że odpowiedź brzmi „tak”?", en: "What would you ask for if you knew the answer was \u201eyes\u201d?" },
  { pl: "Czego potrzebujesz w związku, by czuć się komfortowo?", en: "What do you need in a relationship to feel comfortable?" },
  { pl: "Czego nikt nie może Ci odebrać?", en: "What's something no one can take away from you?" },
  { pl: "Jaka jest najbardziej szalona rzecz, którą chcesz zrobić?", en: "What's the craziest thing you want to do?" },
  { pl: "Gdzie byś pojechał/a, gdyby pieniądze nie miały znaczenia?", en: "What place would you like to go if money didn't matter?" },
  { pl: "Jakie jest najpiękniejsze miejsce, w którym byłeś/aś?", en: "What's the most beautiful place you've ever been?" },
  { pl: "Jaka jest najszaleńsza rzecz, jaką kiedykolwiek zrobiłeś/aś?", en: "What's the craziest thing you've ever done?" },
  { pl: "Co odróżnia Cię od większości ludzi?", en: "What makes you different from most people?" },
  { pl: "Jaki był największy ból, jakiego doświadczyłeś/aś, który nie był fizyczny?", en: "What's the most pain you've ever been in that wasn't physical?" },
  { pl: "Jaka mała rzecz może natychmiast wywołać u Ciebie uśmiech?", en: "What's something small that someone can do to instantly make you smile?" },
  { pl: "Gdybyś rzucił/a wszystko i pojechał/a w trasę, gdzie byś się udał/a?", en: "If you dropped everything and went on a road trip, where would you go?" },
  { pl: "Gdybyś zamknął/zamknęła oczy, jak wyglądałoby Twoje „szczęśliwe miejsce”?", en: "If you could close your eyes, what would your happy place look like?" },
  { pl: "Jaka jest fantazja, którą zawsze chciałeś/aś zgłębić, ale nie miałeś/aś okazji?", en: "What's a fantasy you've always wanted to explore but haven't had the chance to yet?" },
  { pl: "Jaki był najpiękniejszy zachód słońca, jaki widziałeś/aś?", en: "What was your favorite sunset you have ever seen?" },
  { pl: "Gdybyś mógł/mogła wybrać sobie imię, jak by brzmiało?", en: "If you could pick your own name, what would it be?" },
  { pl: "Jaka jest Twoja najbardziej imponująca umiejętność?", en: "What's the most impressive skill you have?" },
  { pl: "Gdybyś dołączył/a do cyrku, jaki byłby Twój występ?", en: "If you joined the circus, what would your circus act be?" },
  { pl: "Wolałbyś/ałabyś być najpopularniejszą osobą w szkole czy najmądrzejszą?", en: "Would you rather be the most popular kid in school or the smartest kid in school?" },
  { pl: "Gdybyś utknął/utknęła w windzie i musiał/a słuchać tylko jednej piosenki, co by to było?", en: "If you got stuck in an elevator and were forced to listen to only one song, what would it be?" },
];

const introspection: QuestionText[] = [
  { pl: "Czy tęsknisz teraz za kimś? Czy myślisz, że ta osoba też tęskni za Tobą?", en: "Are you missing anyone right now? Do you think they're missing you too?" },
  { pl: "Co było pierwszą rzeczą, którą we mnie zauważyłeś/aś, gdy spotkaliśmy się osobiście?", en: "What was the first thing you noticed about me when we met in person?" },
  { pl: "Czego nowego o sobie się ostatnio dowiedziałeś/aś?", en: "What is something new you've learned about yourself recently?" },
  { pl: "Co we mnie jest dla Ciebie najtrudniejsze do zrozumienia?", en: "What about me is hardest for you to understand?" },
  { pl: "Dlaczego potrzebujesz, żeby wszyscy Cię lubili?", en: "Why do you need everyone to like you?" },
  { pl: "Czego mi nie mówisz?", en: "What are you not telling me?" },
  { pl: "Jak jednym słowem opisałbyś/abyś swoją relację ze samym/samą sobą?", en: "How would you describe your relationship with yourself in one word?" },
  { pl: "Która część Twojego życia działa dobrze, a która boli?", en: "What part of your life works? What part of your life hurts?" },
  { pl: "Jaka była najmilsza rzecz, jaką kiedykolwiek zrobił dla Ciebie przyjaciel?", en: "What's the nicest thing a friend has ever done for you?" },
  { pl: "Jaki był najmilszy moment dzisiejszego dnia?", en: "What was the nicest moment today?" },
  { pl: "Co według Ciebie jest moją słabością?", en: "What do you think my weakness is?" },
  { pl: "Jak dajesz komuś znać, że jesteś nim zainteresowany/a?", en: "How do you let someone know you're interested in them?" },
  { pl: "Co musisz z siebie wyrzucić?", en: "What do you need to get off your chest?" },
  { pl: "Co było największym punktem zwrotnym w Twoim życiu randkowym?", en: "What was the biggest turning point in your dating life?" },
  { pl: "Jaka bariera w związku, którą posiadasz, mogłaby zszokować innych?", en: "What is a relationship barrier for you that others might find shocking?" },
  { pl: "Jaka była Twoja najgorsza randka w życiu?", en: "What's the worst date you've ever been on?" },
  { pl: "Jakie wspomnienia zostawiły w Tobie trwały ślad?", en: "What memories have scarred you for life?" },
  { pl: "Co według Ciebie jest moją supermocą?", en: "What do you think my superpower is?" },
  { pl: "Zapytaj mnie o moje sny/marzenia.", en: "Ask me something about my dreams." },
  { pl: "Jaki koszmar senny powtarza się u Ciebie najczęściej?", en: "What's a reoccurring nightmare you've had?" },
  { pl: "Jaki bagaż niesiesz z poprzednich związków?", en: "What baggage do you carry from your previous relationships?" },
  { pl: "Wolisz pisać czy rozmawiać przez telefon?", en: "Do you prefer to text or talk on the phone?" },
  { pl: "O czym starasz się teraz nie myśleć?", en: "What are you trying not to think about?" },
  { pl: "Czego pragniesz najbardziej?", en: "What do you want the most?" },
  { pl: "Co najbardziej lubisz w byciu w domu?", en: "What's your favorite thing about being home?" },
  { pl: "Jak wyglądał Twój pierwszy pocałunek?", en: "How did your first kiss go?" },
  { pl: "Czy kiedykolwiek miałeś/aś złamane serce?", en: "Has your heart ever been broken?" },
  { pl: "Czego chciałbyś/ałabyś się ode mnie nauczyć?", en: "What would you like to learn from me?" },
  { pl: "Jaki smutny film sprawił, że nigdy więcej go nie obejrzysz?", en: "What movie was so sad that you will never watch it again?" },
  { pl: "Wobec czego jesteś nadmiernie emocjonalny/a?", en: "What do you get overly emotional about?" },
  { pl: "Co sprawia, że czujesz się zdenerwowany/a?", en: "What makes you nervous?" },
  { pl: "Co doprowadza Cię do większej złości, niż powinno?", en: "What makes you angrier than it should?" },
  { pl: "Co w Tobie przeraża Cię najbardziej?", en: "What about you scares you the most?" },
  { pl: "Kiedy jesteś najbardziej sobą?", en: "When are you most yourself?" },
  { pl: "Jakie wydarzenie z przeszłości wciąż do Ciebie powraca?", en: "What event in your past has come back to haunt you?" },
  { pl: "Gdybyś mógł/mogła cofnąć się i zmienić tylko jedną decyzję, co by to było?", en: "If you could go back and change just one decision you made, what decision would you change?" },
  { pl: "Jaki był Twój największy błąd, który ostatecznie przyniósł coś dobrego?", en: "What was the biggest mistake you've made? A mistake that turned out really well." },
  { pl: "Jaka była najmądrzejsza rzecz, jaką zrobiłeś/aś jako dziecko?", en: "What was the cleverest thing you did as a child?" },
  { pl: "Jaka jest najdziwniejsza rzecz, jaką widziałeś/aś w pracy?", en: "What's the strangest thing you've seen happen at a job you've had?" },
  { pl: "Co uważasz za zabawne, czego większość ludzi nie rozumie?", en: "What do you find hilarious but most people don't find funny?" },
  { pl: "Kogo trudno jest Ci traktować poważnie?", en: "Who do you have a hard time taking seriously?" },
  { pl: "Kiedy ostatni raz chciałeś/aś wyglądać fajnie, a skończyło się to wstydem?", en: "When was the last time you tried to do something to look cool, and it ended in utter embarrassment?" },
  { pl: "Jaka dziwna rzecz jest warta spróbowania przez każdego chociaż raz?", en: "What's something weird that you recommend everyone tries at least once?" },
  { pl: "Jakie słowo brzmi według Ciebie najgorzej?", en: "What do you think is the most unpleasant-sounding word?" },
  { pl: "Jakimi 1-2 sposobami na pewno nie chciałbyś/ałabyś umrzeć?", en: "What are one or two ways you wouldn't want to die?" },
];

const plusLove: QuestionText[] = [
  { pl: "Jaki mały, codzienny akt miłości znaczy dla Ciebie najwięcej?", en: "What's a small, everyday act of love that means the most to you?" },
  { pl: "Czy miłość powinna być zawsze łatwa, czy walka o nią ją wzmacnia?", en: "Do you think love should always be easy, or does struggle make it stronger?" },
  { pl: "Czy kiedykolwiek zakochałeś/aś się niespodziewanie? Co się stało?", en: "Have you ever fallen for someone unexpectedly? What happened?" },
  { pl: "Jaką lekcję z poprzednich związków stosujesz w obecnych?", en: "What's a lesson from your past relationships that you apply in new ones?" },
  { pl: "Co jest ważniejsze: głęboka więź emocjonalna czy wspólny styl życia?", en: "What's more important to you: deep emotional connection or shared lifestyle?" },
  { pl: "Jaki jest jeden sposób okazywania miłości, którego inni by się nie spodziewali?", en: "What's one way you like to receive love that most people wouldn't expect?" },
  { pl: "Czy kiedykolwiek zmieniłeś/aś zdanie na temat miłości? Co to sprawiło?", en: "Have you ever changed your mind about love? What made you rethink?" },
  { pl: "Wolisz historię miłosną, która jest intensywna i krótka, czy stabilną i długą?", en: "Would you rather have a love story that's intense and short or steady and long-lasting?" },
  { pl: "Co sądzisz o mówieniu „kocham Cię” jako pierwsza osoba? Czy kiedyś tego żałowałeś/aś?", en: "How do you feel about saying 'I love you' first? Have you ever regretted it?" },
  { pl: "Co sprawia, że dana osoba staje się dla Ciebie niezapomniana?", en: "What's one thing that makes a person unforgettable to you?" },
  { pl: "Wolisz świetną chemię przy różnych wartościach, czy te same wartości bez iskry?", en: "Would you rather have great chemistry but different values or aligned values but no spark?" },
  { pl: "Gdybyś mógł przeżyć swoją pierwszą miłość jeszcze raz, zrobiłbyś to?", en: "If you could experience your first love again, would you? Why or why not?" },
  { pl: "Co takiego ludzie romantyzują w związkach, co w rzeczywistości nie jest wcale takie wspaniałe?", en: "What's one thing about relationships that people romanticize but isn't actually that great?" },
];

const plusSpice: QuestionText[] = [
  { pl: "Jaki jest Twój najbardziej nieoczekiwany 'turn-on'?", en: "What's your most unexpected turn-on?" },
  { pl: "Wolisz namiętny, spontaniczny seks czy powolne, zmysłowe budowanie napięcia?", en: "Do you prefer passionate, spontaneous sex or slow, sensual build-up?" },
  { pl: "Jaka jest najseksowniejsza rzecz, jaką partner kiedykolwiek Ci powiedział?", en: "What's the sexiest thing a partner has ever said to you?" },
  { pl: "Jaka jest Twoja sekretna fantazja, o której nikomu nie mówiłeś/aś?", en: "What's a secret fantasy you've never told anyone about?" },
  { pl: "Wolisz być uwodzony/a słowami czy czynami?", en: "Would you rather be seduced with words or with actions?" },
  { pl: "Jaki ruch w grze wstępnej zawsze na Ciebie działa?", en: "What's the best foreplay move that always works on you?" },
  { pl: "W jakim nietradycyjnym miejscu chciałbyś/ałabyś uprawiać seks?", en: "What's a non-traditional place you'd love to have sex?" },
  { pl: "Czy kiedykolwiek wysłałeś/aś ryzykowną wiadomość i żałowałeś/aś? Co się stało?", en: "Have you ever sent a risky text and regretted it? What happened?" },
  { pl: "Jaka jest Twoja opinia o FWB – czy to może naprawdę działać?", en: "What's your opinion on 'friends with benefits'\u2014can it ever truly work?" },
  { pl: "Gdyby partner miał kink, który Cię nie kręci, spróbowałbyś/ałabyś tego dla niego?", en: "If your partner had a kink that you weren't into, would you try it for them?" },
  { pl: "Czego nigdy nie próbowałeś/aś w łóżku, a co Cię ciekawi?", en: "What's something you've never tried in bed but are curious about?" },
  { pl: "Co Cię najbardziej odpycha w sypialni?", en: "What's a huge turn-off for you in the bedroom?" },
  { pl: "Czego partnerzy powinni poświęcać więcej uwagi podczas seksu?", en: "What's one thing you wish partners paid more attention to during sex?" },
  { pl: "Co sądzisz o dominacji i uległości w sypialni?", en: "How do you feel about dominance and submission in the bedroom?" },
  { pl: "Wolisz partnera bardziej doświadczonego czy takiego, który uczy się razem z Tobą?", en: "Would you rather have a partner who's more experienced than you or one who learns with you?" },
  { pl: "Co sądzisz o spontanicznym, nieplanowanym seksie w porównaniu do starannie przygotowanych momentów?", en: "How do you feel about spontaneous, unplanned sex versus carefully planned and prepared moments?" },
];

export const QUESTIONS: Question[] = [
  ...build("love", "basic", love),
  ...build("friendship", "basic", friendship),
  ...build("selfdev", "basic", selfdev),
  ...build("passions", "basic", passions),
  ...build("introspection", "basic", introspection),
  ...build("plus_love", "plus", plusLove),
  ...build("plus_spice", "plus", plusSpice),
];

export const BASIC_CATEGORIES: CategoryId[] = [
  "love",
  "friendship",
  "selfdev",
  "passions",
  "introspection",
];

export const PLUS_CATEGORIES: CategoryId[] = ["plus_love", "plus_spice"];

/** Short, display-friendly edition names per deck. */
export const EDITION_META: Record<DeckId, QuestionText> = {
  basic: { pl: "Podstawowa", en: "Basic" },
  plus: { pl: "Plus", en: "Plus" },
  unfiltered: { pl: "Unfiltered", en: "Unfiltered" },
};

export function editionForCategory(category: CategoryId | "unfiltered"): DeckId {
  return category === "unfiltered" ? "unfiltered" : CATEGORY_META[category].deck;
}
