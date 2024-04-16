// src/app.js

console.clear()

import { ingestFavoriteFilms, aggregateMovieData } from './preferences/userPreferences.js';
import { describeUserPreferences } from './preferences/llmIntegration.js';

process.stdout.write("\x1b[35mlanguage-model-driven-film-recommendation\x1b[0m");


// Ingest user's favorite films
const favoriteFilms = await ingestFavoriteFilms(5, 10);

// Aggregate user's films metadata from TMDB/OMDB
const movideMetadata = await aggregateMovieData(favoriteFilms);

process.stdout.write(`\n Selected films:\n`);
for(const movie in movideMetadata) {
    process.stdout.write(`${favoriteFilms.indexOf(movie)}. ${movie.title},\n`);
}

// Analyze user preferences based on the ingested films
const userPreferences = await describeUserPreferences(movideMetadata);

process.stdout.write(`Analyzing....\n`);

console.log("User Preference Description: userPreferences");

// Discover new movies based on user preferences
// const discoveredMovies = discoverMovies(userPreferences);

// Evaluate discovered movies and generate recommendations
// const recommendations = evaluateRecommendations(discoveredMovies, userPreferences);

// Log recommendations to the console (or handle them as needed)
// console.log('Recommended Movies:');
