import { useEffect, useState } from "react";
import { useGame } from "@/lib/store";
import { setHapticsEnabled } from "@/lib/haptics";
import { registerServiceWorker } from "@/lib/pwa";
import { usePlayerProfileSync } from "@/lib/profile";
import { DeckSelector } from "./DeckSelector";
import { GameScreen } from "./GameScreen";

export function BetweenUsApp() {
  const [ready, setReady] = useState(false);
  const theme = useGame((s) => s.theme);
  const screen = useGame((s) => s.screen);
  const hapticsEnabled = useGame((s) => s.hapticsEnabled);
  usePlayerProfileSync();

  useEffect(() => {
    useGame.persist.rehydrate();
    setReady(true);
    registerServiceWorker();
  }, []);

  useEffect(() => {
    setHapticsEnabled(hapticsEnabled);
  }, [hapticsEnabled]);

  // Match the browser bar and page edges to the chosen theme.
  useEffect(() => {
    const bg = { rose: "#F2BCCB", sage: "#BFCEB5", lavender: "#CFC4EC" }[theme] ?? "#F2BCCB";
    document.body.style.backgroundColor = bg;
    document.documentElement.style.backgroundColor = bg;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", bg);
  }, [theme]);

  if (!ready) return null;

  return (
    <div
      className={`theme-${theme} relative min-h-dvh w-full overflow-hidden`}
      style={{ background: "var(--bg)", color: "var(--text)" }}
    >
      <main className="relative z-10">
        {screen === "deck" ? <DeckSelector /> : <GameScreen />}
      </main>
    </div>
  );
}
