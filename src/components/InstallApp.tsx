import { useState } from "react";
import { Download, Share, PlusSquare, X, Check } from "lucide-react";
import { useGame } from "@/lib/store";
import { useInstall } from "@/lib/pwa";
import { DISPLAY_FONT } from "./CardArt";

const T = {
  pl: {
    title: "Aplikacja na telefon",
    pitch: "Dodaj Between Us do ekranu głównego. Otwiera się jak aplikacja, na pełnym ekranie, także bez internetu.",
    install: "Zainstaluj",
    installed: "Masz już Between Us na ekranie głównym.",
    iosSteps: ["Stuknij Udostępnij na dole Safari", "Wybierz „Do ekranu początkowego”", "Stuknij „Dodaj”"],
    manual: "Otwórz menu przeglądarki i wybierz „Zainstaluj aplikację” albo „Dodaj do ekranu głównego”.",
    banner: "Graj jak w aplikacji",
    bannerD: "Dodaj Between Us do ekranu głównego.",
    how: "Jak?",
    close: "Zamknij",
  },
  en: {
    title: "App on your phone",
    pitch: "Add Between Us to your home screen. It opens like an app, full screen, even offline.",
    install: "Install",
    installed: "Between Us is already on your home screen.",
    iosSteps: ["Tap Share at the bottom of Safari", "Choose “Add to Home Screen”", "Tap “Add”"],
    manual: "Open your browser menu and choose “Install app” or “Add to Home screen”.",
    banner: "Play it like an app",
    bannerD: "Add Between Us to your home screen.",
    how: "How?",
    close: "Close",
  },
};

const STEP_ICONS = [Share, PlusSquare, Check];

/** Full explanation, used in Settings. */
export function InstallCard() {
  const lang = useGame((s) => s.lang);
  const { mode, install } = useInstall();
  const c = T[lang];
  return (
    <div className="flex flex-col gap-3 rounded-[20px] p-4 lg:p-5" style={{ background: "var(--card-surface)", border: "1px solid var(--border)" }}>
      {mode === "installed" ? (
        <p className="flex items-center gap-2 text-[15px] font-bold" style={{ color: "var(--text)" }}>
          <Check className="h-5 w-5" style={{ color: "var(--ink)" }} /> {c.installed}
        </p>
      ) : (
        <>
          <p className="text-[14px] leading-snug lg:text-[15px]" style={{ color: "var(--sub-text)" }}>{c.pitch}</p>
          {mode === "native" && (
            <button
              type="button"
              onClick={() => void install()}
              className="flex h-12 items-center justify-center gap-2 rounded-[16px] text-[16px]"
              style={{ background: "var(--accent)", color: "var(--accent-ink)", fontFamily: DISPLAY_FONT }}
            >
              <Download className="h-5 w-5" /> {c.install}
            </button>
          )}
          {mode === "ios" && <IosSteps steps={c.iosSteps} />}
          {mode === "manual" && <p className="text-[14px] font-semibold leading-snug" style={{ color: "var(--text)" }}>{c.manual}</p>}
        </>
      )}
    </div>
  );
}

function IosSteps({ steps }: { steps: string[] }) {
  return (
    <ol className="flex flex-col gap-2">
      {steps.map((s, i) => {
        const Icon = STEP_ICONS[i];
        return (
          <li key={s} className="flex items-center gap-3 text-[15px] font-semibold" style={{ color: "var(--text)" }}>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full" style={{ background: "var(--chip)", color: "var(--chip-ink)" }}>
              <Icon className="h-[18px] w-[18px]" strokeWidth={2.3} />
            </span>
            {s}
          </li>
        );
      })}
    </ol>
  );
}

const KEY = "bu-install-dismissed";
function wasDismissed() {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

/** Small, dismissible invitation on the start screen (phones only). */
export function InstallBanner() {
  const lang = useGame((s) => s.lang);
  const { mode, install } = useInstall();
  const [hidden, setHidden] = useState(wasDismissed);
  const [showSteps, setShowSteps] = useState(false);
  const c = T[lang];
  if (hidden || (mode !== "native" && mode !== "ios")) return null;

  const dismiss = () => {
    setHidden(true);
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* private mode: just hide for now */
    }
  };

  return (
    <div className="mx-4 mt-4 flex flex-col gap-3 rounded-[20px] p-3.5 md:hidden" style={{ background: "var(--panel)" }}>
      <div className="flex items-center gap-3">
        <img src="/icons/icon-192.png" alt="" className="h-11 w-11 shrink-0 rounded-[12px]" />
        <div className="flex min-w-0 flex-1 flex-col">
          <p className="text-[15px] font-extrabold" style={{ color: "var(--text)" }}>{c.banner}</p>
          <p className="text-[13px] leading-snug" style={{ color: "var(--sub-text)" }}>{c.bannerD}</p>
        </div>
        <button
          type="button"
          onClick={() => (mode === "native" ? void install() : setShowSteps((v) => !v))}
          className="h-10 shrink-0 rounded-full px-4 text-[14px] font-extrabold"
          style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
        >
          {mode === "native" ? c.install : c.how}
        </button>
        <button type="button" onClick={dismiss} aria-label={c.close} className="flex h-10 w-8 shrink-0 items-center justify-center" style={{ color: "var(--ink)" }}>
          <X className="h-5 w-5" />
        </button>
      </div>
      {showSteps && <IosSteps steps={c.iosSteps} />}
    </div>
  );
}
