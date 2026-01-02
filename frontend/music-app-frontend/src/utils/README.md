## Utilities

### Recommendation Placeholder
- File: `recommendationPlaceholder.ts`
- API: `getRecommendations(input, catalog)` returns an ordered list of songs based on cosine similarity of audio features and optional mood/genre filters.
- Purpose: local, content-based recommender leveraging enriched song metadata (BPM, energy, danceability, valence, acousticness, instrumentalness, liveness, speechiness).
- Model file: `public/models/sample_model.json` is downloaded and stored locally for future model swaps.
