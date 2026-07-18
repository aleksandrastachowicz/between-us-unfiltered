import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);
  return { session, user: session?.user ?? null, ready };
}

export async function signInWithGoogle() {
  const { lovable } = await import("@/integrations/lovable");
  await lovable.auth.signInWithOAuth("google", {
    redirect_uri: window.location.origin,
  });
}

export async function signOut() {
  await supabase.auth.signOut();
}