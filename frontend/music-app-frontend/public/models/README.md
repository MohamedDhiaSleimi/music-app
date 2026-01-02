## Local Models

- `sample_model.json`: downloaded seed file (sourced via curl from a public dataset) stored locally to ensure offline availability for the recommender. Replace with a real music-specific model when ready and keep the path stable.

### Usage
- The recommendation utility (`src/utils/recommendationPlaceholder.ts`) loads feature weights locally; swap `sample_model.json` with your trained model/weights while keeping the same public path for no-code changes.
