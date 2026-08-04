import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useGame } from "@/lib/store";
import { useAuth } from "@/lib/useAuth";

/**
 * Cloud-backed default player names for signed-in users.
 * Loads the stored roster on sign-in, then mirrors local changes back up.
 */
export function usePlayerProfileSync() {
  const { user, ready } = useAuth();
  const players = useGame((s) => s.players);
  const setPlayers = useGame((s) => s.setPlayers);
  const loadedFor = useRef<string | null>(null);

  useEffect(() => {
    if (!ready || !user) {
      loadedFor.current = null;
      return;
    }
    if (loadedFor.current === user.id) return;
    let cancelled = false;
    void (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("players")
        .eq("user_id", user.id)
        .maybeSingle();
      if (cancelled) return;
      loadedFor.current = user.id;
      const stored = (data?.players ?? []) as string[];
      if (stored.length) setPlayers(stored);
      else if (useGame.getState().players.length) {
        await supabase
          .from("profiles")
          .upsert({ user_id: user.id, players: useGame.getState().players });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [ready, user, setPlayers]);

  useEffect(() => {
    if (!user || loadedFor.current !== user.id) return;
    const id = setTimeout(() => {
      void supabase.from("profiles").upsert({ user_id: user.id, players });
    }, 600);
    return () => clearTimeout(id);
  }, [players, user]);
}
