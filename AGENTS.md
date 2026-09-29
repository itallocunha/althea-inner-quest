# Architecture rules

- Keep journey artwork and its typed Orb mapping in `src/lib/journeyAssets.ts` so every journey view uses the same uploaded assets.
- Derive resume destinations from persisted game progress through `getJourneyResume`; this keeps Home and journey navigation consistent.