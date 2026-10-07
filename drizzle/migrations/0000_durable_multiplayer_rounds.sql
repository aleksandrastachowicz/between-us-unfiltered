ALTER TABLE public.game_sessions ADD COLUMN IF NOT EXISTS revision bigint NOT NULL DEFAULT 0, ADD COLUMN IF NOT EXISTS round_number integer NOT NULL DEFAULT 0, ADD COLUMN IF NOT EXISTS narrator jsonb NOT NULL DEFAULT '{"step":"invite"}'::jsonb;
CREATE TABLE public.game_session_events (
  code text NOT NULL REFERENCES public.game_sessions(code) ON DELETE CASCADE,
  action_id uuid NOT NULL,
  revision bigint NOT NULL,
  round_number integer NOT NULL,
  action text NOT NULL,
  state jsonb NOT NULL,
  narrator jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (code, action_id),
  UNIQUE (code, revision)
);
GRANT ALL ON public.game_session_events TO service_role;
ALTER TABLE public.game_session_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service maintains multiplayer journal" ON public.game_session_events FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE INDEX game_session_events_round_idx ON public.game_session_events(code, round_number);
CREATE OR REPLACE FUNCTION public.read_session_v2(_code text, _token uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE s public.game_sessions;
BEGIN
  SELECT * INTO s FROM public.game_sessions WHERE code = upper(_code) AND host_token = _token;
  IF NOT FOUND THEN RAISE EXCEPTION 'Room unavailable'; END IF;
  RETURN jsonb_build_object('state', s.state, 'revision', s.revision, 'round', s.round_number, 'narrator', s.narrator);
END;
$$;
CREATE OR REPLACE FUNCTION public.commit_session_v2(_code text, _token uuid, _expected_revision bigint, _action_id uuid, _action text, _state jsonb, _narrator jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE s public.game_sessions; e public.game_session_events; next_round integer;
BEGIN
  SELECT * INTO s FROM public.game_sessions WHERE code = upper(_code) AND host_token = _token FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Room unavailable'; END IF;
  SELECT * INTO e FROM public.game_session_events WHERE code = s.code AND action_id = _action_id;
  IF FOUND THEN
    RETURN jsonb_build_object('accepted', true, 'duplicate', true, 'state', s.state, 'revision', s.revision, 'round', s.round_number, 'narrator', s.narrator);
  END IF;
  IF s.revision <> _expected_revision THEN
    RETURN jsonb_build_object('accepted', false, 'state', s.state, 'revision', s.revision, 'round', s.round_number, 'narrator', s.narrator);
  END IF;
  IF _action NOT IN ('next', 'flip', 'undo', 'configure', 'narrate', 'deck') THEN RAISE EXCEPTION 'Invalid action'; END IF;
  IF NOT public.game_state_within_limit(_state) OR jsonb_typeof(_state) <> 'object' OR jsonb_typeof(_narrator) <> 'object' OR length(_narrator::text) > 2000 THEN RAISE EXCEPTION 'Invalid state'; END IF;
  IF _action = 'next' AND (_state->'card' IS NULL OR _state->'card' = 'null'::jsonb) THEN RAISE EXCEPTION 'No question available'; END IF;
  IF _action = 'next' AND (s.state->>'screen') = 'game' AND (s.state->'card') <> 'null'::jsonb AND coalesce((s.state->>'flipped')::boolean, false) = false THEN
    RETURN jsonb_build_object('accepted', false, 'state', s.state, 'revision', s.revision, 'round', s.round_number, 'narrator', s.narrator);
  END IF;
  next_round := s.round_number + CASE WHEN _action = 'next' THEN 1 ELSE 0 END;
  UPDATE public.game_sessions SET state = _state, revision = s.revision + 1, round_number = next_round, narrator = _narrator, updated_at = now() WHERE code = s.code RETURNING * INTO s;
  INSERT INTO public.game_session_events(code, action_id, revision, round_number, action, state, narrator)
    VALUES (s.code, _action_id, s.revision, s.round_number, _action, s.state, s.narrator);
  RETURN jsonb_build_object('accepted', true, 'state', s.state, 'revision', s.revision, 'round', s.round_number, 'narrator', s.narrator);
END;
$$;
REVOKE ALL ON FUNCTION public.read_session_v2(text, uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.commit_session_v2(text, uuid, bigint, uuid, text, jsonb, jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.read_session_v2(text, uuid) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.commit_session_v2(text, uuid, bigint, uuid, text, jsonb, jsonb) TO anon, authenticated, service_role;
COMMENT ON TABLE public.game_session_events IS 'Private durable multiplayer action and round journal; read/write only through token-authorized room RPCs.';