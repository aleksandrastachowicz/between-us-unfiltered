-- Lock down internal helper functions from API roles
REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.game_state_within_limit(jsonb) FROM PUBLIC, anon, authenticated;

-- Multiplayer RPCs: remove the implicit PUBLIC grant and grant explicitly
REVOKE ALL ON FUNCTION public.create_session(jsonb) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.join_session(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.update_session(text, uuid, jsonb) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.create_session(jsonb) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.join_session(text) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.update_session(text, uuid, jsonb) TO anon, authenticated, service_role;
