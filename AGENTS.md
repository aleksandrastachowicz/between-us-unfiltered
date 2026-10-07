<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Card backs use bundled, fingerprinted 2x WebP backgrounds baked from the adjacent procedural SVG sources; retain symbols and text as vectors so noise/displacement never execute during flips or multiplayer updates.
- Memoize static card artwork by pattern, independently of game state and translated labels, to avoid rebuilding artwork on unrelated session updates.
