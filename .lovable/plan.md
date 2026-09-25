# Plan: multiplayer recovery and clearer card backs

## What will change
- Test one room in two separate browser sessions: create, join, draw, flip, change turn/state, then refresh both sessions.
- Persist the active room connection locally so each device automatically rejoins the same room after refresh and restores the latest saved game state.
- Harden realtime synchronization to avoid a newly reconnected device overwriting newer room state.
- Remove the “18+” badge from the Unfiltered deck selector.
- Refine all 12 card backs softly: stronger text contrast, calmer backgrounds behind labels, and clearly distinct central symbols without repeated decorative motifs competing with them.
- Update regression snapshots and add focused checks for unique symbols and the removed badge.

## Validation
- Run focused card-art tests.
- Repeat the two-browser multiplayer flow, including refresh recovery and state comparison.
- Visually inspect representative mobile card backs for readable edition/category labels and distinct graphics.
- Confirm the preview builds without errors.

## Technical details
- Keep room codes and room access tokens in browser session storage only; do not expose them in URLs.
- Reconnect by calling the existing join-room function, which returns the persisted room snapshot before realtime listening resumes.
- Keep current game rules and question content unchanged.
