// src/app.js

console.clear();

import { ingestFavoriteFilms, aggregateMovieData } from './userPreferences.js';
import { describeUserPreferences, discoverMoviesFromPreferences } from './llmIntegration.js';

/**
 * Initializes the application, ingests user's favorite films, aggregates movie data,
 * analyzes preferences, and discovers new movies.
 */
const initApp = async () => {
    console.log("\n\n\t\t\x1b[35mlanguage-model-driven-film-recommendation\x1b[0m\n\n");

    // Ingest user's favorite films
    const favoriteFilms = await ingestFavoriteFilms(5, 10);

    // Aggregate user's films metadata from TMDB/OMDB
    console.log("\nAggregating film data across TMDB & OMDB...");
    const movieMetadata = await aggregateMovieData(favoriteFilms);
    console.log("\nAggregation Complete!\n");

    console.log(`Selected films:\n`);
    movieMetadata.forEach(movie => {
        console.log(`\t · ${movieMetadata.indexOf(movie) + 1}. ${movie.title}`);
    });

    // Analyze user preferences based on the ingested films
    console.log("\nGenerating preference description using GPT-4...");
    const userPreferences = await describeUserPreferences(movieMetadata);
    console.log("\nPreference description complete!\n");

    console.log(`User Preference Description: ${JSON.stringify(userPreferences)}\n`);

    // Discover new movies based on user preferences
    console.log("Generating TMDb Discover API call...");
    const discoveredMovies = await discoverMoviesFromPreferences(JSON.stringify(userPreferences));
    console.log("Discovery Complete!");

    console.log(`API URL: ${discoveredMovies[0]}`);
    console.log(`\nSuggested Films:`);
    discoveredMovies[1].results.forEach((movie) => {
        console.log(`\t · ${movie.title}`);
    });

    // Optional: Evaluate discovered movies and generate recommendations
    // This section could be implemented as needed for further features
};

initApp().catch(error => {
    console.error('Failed to initialize app:', error);
});
