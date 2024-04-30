// src/preferences/userPreferences.js

import inquirer from "inquirer";
import fs from 'fs/promises';
import { searchMovies, getMovieDetails } from './api/tmdb.js';
import { getMovieMetadataByImdbId } from './api/omdb.js';

/**
 * Reads and parses the movie cache from a local JSON file.
 * @returns {Promise<Array>} The cached movie data or an empty array if an error occurs.
 */
const loadCache = async () => {
    try {
        const data = await fs.readFile('./movieCache.json', 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error loading cache:", error);
        return [];
    }
};

/**
 * Saves the updated movie cache to a local JSON file.
 * @param {Array} cache The cache data to save.
 */
const saveCache = async (cache) => {
    // Remove duplicates from updatedCache before saving
    const uniqueCache = Array.from(new Map(cache.map(item => [item['id'], item])).values());

    await fs.writeFile('./movieCache.json', JSON.stringify(uniqueCache, null, 2));
};

/**
 * Ingests user's favorite films by interacting with the user via CLI.
 * @param {number} minMovies - Minimum number of movies to ingest.
 * @param {number} maxMovies - Maximum number of movies to ingest.
 * @returns {Promise<Array>} An array of movie data.
 */
export const ingestFavoriteFilms = async (minMovies, maxMovies) => {
    let movies = [];
    let cache = await loadCache();
    const findInCache = (title) => {
        const titleRegex = new RegExp(title.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), 'i');
        return cache.filter(movie => titleRegex.test(movie.title));
    };

    for (let i = 0; i < maxMovies; i++) {
        let confirmedMovie = false;
        while (!confirmedMovie) {
            const answer = await inquirer.prompt([{
                type: 'input',
                name: 'movieTitle',
                message: `Enter movie title #${i + 1}:`,
                validate: input => input.trim() === '' ? 'Please enter a valid movie title.' : true,
            }]);

            const movieTitle = answer.movieTitle;
            let matchedMovies = findInCache(movieTitle);

            if (matchedMovies.length === 0) {
                const searchResults = await searchMovies(movieTitle);
                if (searchResults.length > 0) {
                    const choices = searchResults.map((result) => ({
                        name: `${result.title} (${result.release_date.slice(0, 4)})`,
                        value: result,
                    }));
                    const { confirmedChoice } = await inquirer.prompt([{
                        type: 'list',
                        name: 'confirmedChoice',
                        message: 'Found:',
                        choices: [...choices, { name: "None of these, search again.", value: null }],
                    }]);

                    if (confirmedChoice) {
                        const imdbData = await getMovieDetails(confirmedChoice.id);
                        cache.push(imdbData);
                        movies.push(imdbData);
                        confirmedMovie = true;
                    }
                } else {
                    console.warn('Movie not found in TMDb. Please try another title.');
                }
            } else {
                const { confirmedChoice } = await inquirer.prompt([{
                    type: 'list',
                    name: 'confirmedChoice',
                    message: 'Did you mean:',
                    choices: matchedMovies.map(movie => ({ name: `${movie.title} (${movie.release_date.slice(0, 4)})`, value: movie })).concat([{ name: "None of these, search again.", value: null }]),
                }]);

                if (confirmedChoice) {
                    movies.push(confirmedChoice);
                    confirmedMovie = true;
                }
            }
        }

        if (movies.length >= minMovies) {
            const { addAnother } = await inquirer.prompt([{
                type: 'confirm',
                name: 'addAnother',
                message: 'Do you want to add another movie title?',
                default: false,
            }]);
            if (!addAnother) break;
        }
    }

    await saveCache(cache);
    return movies;
};

/**
 * Merges and aggregates movie data from TMDB and OMDB APIs.
 * @param {Array} movies - Array of movie identifiers.
 * @returns {Promise<Array>} An array of aggregated movie data.
 */
export const aggregateMovieData = async (movies) => {
    let cache = await loadCache();
    const results = [];

    for (const movie of movies) {
        const cacheIndex = cache.findIndex((cacheMovie) => cacheMovie.id === movie.id);

        if (cacheIndex !== -1) {
            results.push(cache[cacheIndex]);
        } else {
            const tmdbData = await getMovieDetails(movie.id);
            const omdbData = await getMovieMetadataByImdbId(movie.imdb_id);

            const aggregatedData = mergeMovieData(tmdbData, omdbData);
            cache.push(aggregatedData);  
            results.push(aggregatedData);
        }

    }

    await saveCache(cache);
    return results;
};

/**
 * Merges data from TMDB and OMDB APIs, giving priority to OMDB data for most fields.
 * @param {Object} tmdbData - Data from TMDB API.
 * @param {Object} omdbData - Data from OMDB API.
 * @returns {Object} - Merged movie data.
 */
const mergeMovieData = (tmdbData, omdbData) => {
    return {
        id: tmdbData.id,
        title: omdbData.Title || tmdbData.title,
        overview: tmdbData.overview || omdbData.Plot,
        genres: tmdbData.genres,
        production_companies: tmdbData.production_companies,
        release_date: tmdbData.release_date,
        runtime: omdbData.Runtime || tmdbData.runtime,
        spoken_languages: tmdbData.spoken_languages,
        imdb_id: tmdbData.imdb_id,
        imdbRating: omdbData.imdbRating,
        boxOffice: omdbData.BoxOffice,
        rated: omdbData.Rated,
        director: omdbData.Director,
        actors: omdbData.Actors,
        ratings: omdbData.Ratings
    };
};
