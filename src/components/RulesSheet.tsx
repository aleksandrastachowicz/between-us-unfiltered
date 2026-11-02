import { motion, AnimatePresence } from "motion/react";
import { Heart, X } from "lucide-react";
import { useGame } from "@/lib/store";
import { DISPLAY_FONT } from "./CardArt";

type Copy = {
  eyebrow: string;
  title: string;
  hook: string;
  hookD: string;
  stepsTitle: string;
  steps: [title: string, body: string][];
  rulesTitle: string;
  rules: string[];
  outro: string;
  start: string;
  close: string;
};

const T: Record<"pl" | "en", Copy> = {
  pl: {
    eyebrow: "",
    title: "Zanim zaczniecie",
    hook: "Każda bliskość zaczyna się od pytania.",
    hookD:
      "Te karty pomagają zadać te, na które zwykle brakuje odwagi albo okazji. Wystarczy jedna, żeby zwykły wieczór zamienił się w rozmowę, którą zapamiętacie.",
    stepsTitle: "Jak grać",
    steps: [
      ["Wybierzcie talię,", "która pasuje do Waszego nastroju."],
      ["Odkryjcie kartę", "i odpowiedzcie szczerze, tak jak czujecie."],
      ["Przesuńcie kartę,", "gdy będziecie gotowi na kolejną."],
    ],
    rulesTitle: "Nasza umowa",
    rules: [
      "Mówisz tyle, ile chcesz. Każde pytanie możesz pominąć.",
      "Słuchamy z ciekawością, bez oceniania.",
      "Co tu padnie, zostaje między nami.",
    ],
    outro: "Gotowi zobaczyć, co jest między Wami?",
    start: "Zaczynamy",
    close: "Zamknij",
  },
  en: {
    eyebrow: "",
    title: "Before you start",
    hook: "Every closeness starts with a question.",
    hookD:
      "These cards help you ask the ones you usually lack the courage or the moment for. One card is enough to turn an ordinary evening into a conversation you will remember.",
    stepsTitle: "How to play",
    steps: [
      ["Choose a deck", "that matches your mood."],
      ["Reveal a card", "and answer honestly, the way you feel."],
      ["Swipe the card", "when you are ready for the next one."],
    ],
    rulesTitle: "Our agreement",
    rules: [
      "Share as much as you want. You can skip any question.",
      "We listen with curiosity, without judging.",
      "What is said here stays between us.",
    ],
    outro: "Ready to see what's between you?",
    start: "Let's play",
    close: "Close",
  },
};

export function RulesSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const lang = useGame((s) => s.lang);
  const c = T[lang];
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[57] bg-black/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="rules-title"
            className="fixed inset-x-0 bottom-0 z-[58] mx-auto flex max-h-[92dvh] w-full max-w-xl flex-col overflow-hidden rounded-t-[28px] md:bottom-auto md:top-1/2 md:max-h-[86dvh] md:-translate-y-1/2 md:rounded-[28px]"
            style={{ background: "var(--panel)" }}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex items-center justify-between gap-3 px-5 pt-5 lg:px-8 lg:pt-8">
              <div className="flex flex-col gap-1">
                <h2 id="rules-title" className="text-[30px] leading-none lg:text-[40px]" style={{ fontFamily: DISPLAY_FONT, color: "var(--ink)" }}>
                  {c.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={c.close}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
                style={{ background: "var(--panel-2)", color: "var(--ink)" }}
              >
                <X className="h-6 w-6" strokeWidth={2.4} />
              </button>
            </div>

            <div className="flex flex-col gap-4 overflow-y-auto px-5 pb-3 pt-4 lg:gap-5 lg:px-8 lg:pt-5">
              <div className="rounded-[20px] p-4 lg:p-6" style={{ background: "var(--accent)", color: "var(--accent-ink)" }}>
                <p className="text-[22px] leading-snug lg:text-[26px]" style={{ fontFamily: DISPLAY_FONT }}>
                  {c.hook}
                </p>
                <p className="mt-2 text-[16px] leading-snug lg:text-[17px]" style={{ opacity: 0.94 }}>
                  {c.hookD}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="text-[12px] font-extrabold uppercase tracking-[0.22em] lg:text-[13px]" style={{ color: "var(--sub-text)" }}>
                  {c.stepsTitle}
                </h3>
                <ol className="flex flex-col gap-3">
                  {c.steps.map(([title, body], i) => (
                    <li key={title} className="flex items-start gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[14px]" style={{ background: "var(--accent)", color: "var(--accent-ink)", fontFamily: DISPLAY_FONT }} aria-hidden="true">
                        {i + 1}
                      </span>
                      <p className="pt-1 text-[15px] leading-snug lg:text-[16px]" style={{ color: "var(--sub-text)" }}>
                        <strong className="font-extrabold" style={{ color: "var(--text)" }}>{title}</strong> {body}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="flex flex-col gap-2.5 rounded-[20px] p-4 lg:gap-3 lg:p-5" style={{ background: "var(--panel-2)" }}>
                <h3 className="text-[12px] font-extrabold uppercase tracking-[0.22em] lg:text-[13px]" style={{ color: "var(--sub-text)" }}>
                  {c.rulesTitle}
                </h3>
                <ol className="flex flex-col gap-2">
                  {c.rules.map((r) => (
                    <li key={r} className="flex items-start gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full" style={{ background: "var(--chip)", color: "var(--chip-ink)" }} aria-hidden="true">
                        <Heart className="h-3.5 w-3.5" fill="currentColor" strokeWidth={0} />
                      </span>
                      <p className="pt-0.5 text-[15px] font-semibold leading-snug lg:text-[16px]" style={{ color: "var(--text)" }}>{r}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="flex flex-col gap-2 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-2 lg:px-8 lg:pb-8">
              <p className="text-center text-[15px] font-bold lg:text-[16px]" style={{ color: "var(--ink)" }}>
                {c.outro}
              </p>
              <button
                type="button"
                onClick={onClose}
                className="h-14 w-full rounded-[18px] text-[19px]"
                style={{ background: "var(--accent)", color: "var(--accent-ink)", fontFamily: DISPLAY_FONT }}
              >
                {c.start}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
