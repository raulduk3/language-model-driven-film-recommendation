// src/app.js

import { ingestFavoriteFilms, aggregateMovieData } from './preferences/userPreferences.js';
// import { discoverMovies } from './discovery/movieDiscoverer.js';
// import { evaluateRecommendations } from './recommendation/recommendationEvaluator.js';

// Ingest user's favorite films
const favoriteFilms = await ingestFavoriteFilms(5, 10);

// Aggregate user's films metadata from TMDB/OMDB
const movideMetadata = await aggregateMovieData(favoriteFilms);

console.log(movideMetadata);

// Analyze user preferences based on the ingested films
const userPreferences = analyzePreferences(favoriteFilms);

// Discover new movies based on user preferences
// const discoveredMovies = discoverMovies(userPreferences);

// Evaluate discovered movies and generate recommendations
// const recommendations = evaluateRecommendations(discoveredMovies, userPreferences);

// Log recommendations to the console (or handle them as needed)
// console.log('Recommended Movies:');
