import { useEffect, useState } from "react";
import { useGame } from "@/lib/store";
import { setHapticsEnabled } from "@/lib/haptics";
import { usePlayerProfileSync } from "@/lib/profile";
import { AuraBackground } from "./AuraBackground";
import { DeckSelector } from "./DeckSelector";
import { GameScreen } from "./GameScreen";

export function BetweenUsApp() {
  const [ready, setReady] = useState(false);
  const theme = useGame((s) => s.theme);
  const mode = useGame((s) => s.mode);
  const screen = useGame((s) => s.screen);
  const hapticsEnabled = useGame((s) => s.hapticsEnabled);
  usePlayerProfileSync();

  useEffect(() => {
    useGame.persist.rehydrate();
    setReady(true);
  }, []);

  useEffect(() => {
    setHapticsEnabled(hapticsEnabled);
  }, [hapticsEnabled]);

  if (!ready) return null;

  return (
    <div
      className={`theme-${theme} ${mode === "dark" ? "dark" : ""} relative min-h-dvh w-full overflow-hidden`}
      style={{ background: "var(--bg)", color: "var(--text)" }}
    >
      <AuraBackground />
      <main className="relative z-10">
        {screen === "deck" ? <DeckSelector /> : <GameScreen />}
      </main>
    </div>
  );
}
