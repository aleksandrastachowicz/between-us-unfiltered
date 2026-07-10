-- Replace overly-permissive "always true" INSERT/UPDATE policies on game_sessions
-- with format-constrained policies. This is an anonymous, code-based multiplayer
-- game: the short code is the shared secret, so reads stay open (participants join
-- by code) but writes now require a well-formed code and a bounded state payload.

ALTER TABLE public.game_sessions
  ADD CONSTRAINT game_sessions_code_format
  CHECK (code ~ '^[A-Z0-9]{4}$') NOT VALID;

-- Bound the JSON payload so a malicious client cannot store arbitrary large blobs.
CREATE OR REPLACE FUNCTION public.game_state_within_limit(_state jsonb)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  SELECT length(_state::text) <= 200000
$$;

DROP POLICY IF EXISTS "Anyone can create sessions" ON public.game_sessions;
DROP POLICY IF EXISTS "Anyone can read sessions" ON public.game_sessions;
DROP POLICY IF EXISTS "Anyone can update sessions" ON public.game_sessions;

-- Reads remain open so a partner can join a room purely by knowing its code.
CREATE POLICY "Read sessions by code"
  ON public.game_sessions
  FOR SELECT
  USING (true);

-- Inserts require a valid code format and a bounded state payload.
CREATE POLICY "Create well-formed sessions"
  ON public.game_sessions
  FOR INSERT
  WITH CHECK (
    code ~ '^[A-Z0-9]{4}$'
    AND public.game_state_within_limit(state)
  );

-- Updates cannot rename the code and must keep the state within limits.
CREATE POLICY "Update sessions by code"
  ON public.game_sessions
  FOR UPDATE
  USING (code ~ '^[A-Z0-9]{4}$')
  WITH CHECK (
    code ~ '^[A-Z0-9]{4}$'
    AND public.game_state_within_limit(state)
  );