import { useEffect, useState } from "react";
import { useGame } from "@/lib/store";
import { AuraBackground } from "./AuraBackground";
import { DeckSelector } from "./DeckSelector";
import { GameScreen } from "./GameScreen";
import { MultiplayerPanel } from "./MultiplayerPanel";

export function BetweenUsApp() {
  const [ready, setReady] = useState(false);
  const theme = useGame((s) => s.theme);
  const mode = useGame((s) => s.mode);
  const screen = useGame((s) => s.screen);

  useEffect(() => {
    useGame.persist.rehydrate();
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <div className={`theme-${theme} ${mode === "dark" ? "dark" : ""} relative min-h-dvh w-full overflow-hidden`}>
      <AuraBackground />
      <MultiplayerPanel />
      <main className="relative z-10">
        {screen === "deck" ? <DeckSelector /> : <GameScreen />}
      </main>
    </div>
  );
}
