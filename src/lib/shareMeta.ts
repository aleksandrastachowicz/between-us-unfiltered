const SITE = "https://between-us-cards-game.lovable.app";
const TITLE = "Between Us — pytania, które zbliżają";
const DESC = "Karciana gra do rozmów dla par, przyjaciół i rodzin. Po polsku i po angielsku. Questions that bring you closer.";
const IMAGE = `${SITE}/og-image.png`;

/** Link preview (Messenger, WhatsApp, iMessage, Slack, X…): title, text and the 1200×630 brand image. */
export const SHARE_META = [
  { title: TITLE },
  { name: "description", content: DESC },
  { property: "og:site_name", content: "Between Us" },
  { property: "og:locale", content: "pl_PL" },
  { property: "og:locale:alternate", content: "en_US" },
  { property: "og:type", content: "website" },
  { property: "og:url", content: SITE },
  { property: "og:title", content: TITLE },
  { property: "og:description", content: DESC },
  { property: "og:image", content: IMAGE },
  { property: "og:image:width", content: "1200" },
  { property: "og:image:height", content: "630" },
  { property: "og:image:alt", content: "between us — trzy talie kart z pytaniami na różowym tle" },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: TITLE },
  { name: "twitter:description", content: DESC },
  { name: "twitter:image", content: IMAGE },
];
