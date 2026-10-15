# Architecture rules

- Keep journey artwork and its typed Orb mapping in `src/lib/journeyAssets.ts` so every journey view uses the same uploaded assets.
- Derive resume destinations from persisted game progress through `getJourneyResume`; this keeps Home and journey navigation consistent.
- Artwork is served from `public/art/`, generated from the raw files in `imagens/` by `npm run art` (`scripts/optimize-art.mjs`). Add new art to `imagens/`, rerun the script, and reference it only through `journeyAssets.ts`; never edit `public/art/` by hand.
- Challenge banners and medals are keyed by challenge id (`b1`..`b10`, `g1`.., `p1`.., `r1`.., `y1`..). Medals are only illustrated for the blue orb so far; `getMedalArt` returns `undefined` for the rest and the UI falls back to the emoji medal.
- Grimoire skill trees derive orb ownership from `getRewardPresentation` and earned states from existing game collections; this keeps visual branches consistent without changing progression.
- Constellation collections share their atmosphere, orb selector, and semantic styling; this keeps skill and medal interactions accessible and motion preferences consistent.
