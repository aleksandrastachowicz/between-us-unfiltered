import { useEffect, useState } from "react";
import { Settings as Cog, Heart } from "lucide-react";
import { useGame } from "@/lib/store";
import { AuraBackground } from "./AuraBackground";
import { DeckSelector } from "./DeckSelector";
import { GameScreen } from "./GameScreen";
import { MultiplayerPanel } from "./MultiplayerPanel";
import { Settings } from "./Settings";
import { FavoritesPanel } from "./FavoritesPanel";

export function BetweenUsApp() {
  const [ready, setReady] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const theme = useGame((s) => s.theme);
  const mode = useGame((s) => s.mode);
  const screen = useGame((s) => s.screen);
  const favCount = useGame((s) => s.favorites.length);

  useEffect(() => {
    useGame.persist.rehydrate();
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <div
      className={`theme-${theme} ${mode === "dark" ? "dark" : ""} relative min-h-dvh w-full overflow-hidden`}
      style={{ background: "var(--bg)", color: "var(--text)" }}
    >
      <AuraBackground />
      <MultiplayerPanel />

      {/* Global side navigation (top-right): Favorites + Settings */}
      <div className="fixed right-4 top-4 z-30 flex items-center gap-2">
        <button
          onClick={() => setFavoritesOpen(true)}
          aria-label="Favorites"
          className="relative flex items-center justify-center rounded-full p-2.5 shadow-lg backdrop-blur"
          style={{ background: "var(--panel)", color: "var(--text)", border: "1px solid var(--border)" }}
        >
          <Heart className="h-5 w-5" />
          {favCount > 0 && (
            <span
              className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-black"
              style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
            >
              {favCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setSettingsOpen(true)}
          aria-label="Settings"
          className="flex items-center justify-center rounded-full p-2.5 shadow-lg backdrop-blur"
          style={{ background: "var(--panel)", color: "var(--text)", border: "1px solid var(--border)" }}
        >
          <Cog className="h-5 w-5" />
        </button>
      </div>

      <main className="relative z-10">
        {screen === "deck" ? <DeckSelector /> : <GameScreen />}
      </main>

      <Settings open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <FavoritesPanel open={favoritesOpen} onClose={() => setFavoritesOpen(false)} />
    </div>
  );
}
