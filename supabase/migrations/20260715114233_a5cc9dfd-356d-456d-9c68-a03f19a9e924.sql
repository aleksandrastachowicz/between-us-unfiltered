
-- Add secret token to each session; anyone with the code can join and receive it.
ALTER TABLE public.game_sessions
  ADD COLUMN IF NOT EXISTS host_token uuid NOT NULL DEFAULT gen_random_uuid();

-- Drop the permissive RLS policies that allowed anyone to scan/modify all sessions.
DROP POLICY IF EXISTS "Read sessions by code" ON public.game_sessions;
DROP POLICY IF EXISTS "Update sessions by code" ON public.game_sessions;
DROP POLICY IF EXISTS "Create well-formed sessions" ON public.game_sessions;

-- Revoke direct Data API privileges; access is only via SECURITY DEFINER RPCs.
REVOKE ALL ON public.game_sessions FROM anon, authenticated, PUBLIC;
GRANT ALL ON public.game_sessions TO service_role;

ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;

-- Create a new session with a server-generated code and secret host token.
CREATE OR REPLACE FUNCTION public.create_session(_state jsonb)
RETURNS TABLE(code text, host_token uuid)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _alphabet text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  _code text;
  _token uuid;
  _attempts int := 0;
BEGIN
  IF NOT public.game_state_within_limit(_state) THEN
    RAISE EXCEPTION 'state payload too large';
  END IF;
  LOOP
    _code := substr(_alphabet, 1 + floor(random() * 32)::int, 1)
          || substr(_alphabet, 1 + floor(random() * 32)::int, 1)
          || substr(_alphabet, 1 + floor(random() * 32)::int, 1)
          || substr(_alphabet, 1 + floor(random() * 32)::int, 1);
    BEGIN
      INSERT INTO public.game_sessions(code, state)
      VALUES (_code, _state)
      RETURNING public.game_sessions.host_token INTO _token;
      EXIT;
    EXCEPTION WHEN unique_violation THEN
      _attempts := _attempts + 1;
      IF _attempts > 12 THEN
        RAISE EXCEPTION 'could not allocate a unique session code';
      END IF;
    END;
  END LOOP;
  RETURN QUERY SELECT _code, _token;
END;
$$;

-- Join an existing session by code. Returning the token gates all writes to
-- callers who first proved they know the 4-char code.
CREATE OR REPLACE FUNCTION public.join_session(_code text)
RETURNS TABLE(state jsonb, host_token uuid)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT s.state, s.host_token
  FROM public.game_sessions s
  WHERE _code ~ '^[A-Za-z0-9]{4}$'
    AND s.code = upper(_code)
  LIMIT 1;
$$;

-- Update a session's state only when the caller presents the secret token.
CREATE OR REPLACE FUNCTION public.update_session(_code text, _host_token uuid, _state jsonb)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _rows int;
BEGIN
  IF NOT public.game_state_within_limit(_state) THEN
    RAISE EXCEPTION 'state payload too large';
  END IF;
  IF _code !~ '^[A-Za-z0-9]{4}$' THEN
    RETURN false;
  END IF;
  UPDATE public.game_sessions
     SET state = _state, updated_at = now()
   WHERE code = upper(_code)
     AND host_token = _host_token;
  GET DIAGNOSTICS _rows = ROW_COUNT;
  RETURN _rows > 0;
END;
$$;

REVOKE ALL ON FUNCTION public.create_session(jsonb) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.join_session(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.update_session(text, uuid, jsonb) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.create_session(jsonb) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.join_session(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.update_session(text, uuid, jsonb) TO anon, authenticated;
