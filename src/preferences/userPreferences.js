import inquirer from "inquirer";
import fs from 'fs/promises';
import { searchMovies, getMovieDetails } from '../api/tmdb.js';
import { getMovieMetadataByImdbId } from '../api/omdb.js';

/**
 * Load movie data from file storage.
 * @returns {Object} Cached movie data.
 */
const loadCache = async () => {
	try {
		const data = await fs.readFile('./movieCache.json', 'utf-8');
		return JSON.parse(data);
	} catch (error) {
		console.error("Error loading cache: ", error);
		return [];
	}
};

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
            const answer = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'movieTitle',
                    message: `Enter movie title #${i + 1}:`,
                    validate: input => input.trim() === '' ? 'Please enter a valid movie title.' : true,
                },
            ]);

            const movieTitle = answer.movieTitle;
            let matchedMovies = findInCache(movieTitle);

            if (matchedMovies.length === 0) {
                process.stdout.write("Searching....\n");
                const searchResults = await searchMovies(movieTitle);
                if (searchResults.length > 0) {
                    const choices = searchResults.map((result) => ({
                        name: `${result.title} (${result.release_date.slice(0, 4)})`,
                        value: result,
                    }));
                    const { confirmedChoice } = await inquirer.prompt([
                        {
                            type: 'list',
                            name: 'confirmedChoice',
                            message: 'Found:',
                            choices: [...choices, { name: "None of these, search again.", value: null }],
                        },
                    ]);

                    if (confirmedChoice) {
                        process.stdout.write(`Selected: ${confirmedChoice.title} (${confirmedChoice.release_date.slice(0, 4)})\n`);
                        let imdbData = await getMovieDetails(confirmedChoice.id);
                        cache.push(imdbData);
                        movies.push(imdbData);
                        confirmedMovie = true;
                    } else {
                        console.warn('Please try another title.');
                    }
                } else {
                    console.warn('Movie not found in TMDb. Please try another title.');
                }
            } else {
                // Handle the case where movies are found in the cache
                const { confirmedChoice } = await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'confirmedChoice',
                        message: 'Did you mean:',
                        choices: matchedMovies.map(movie => ({ name: `${movie.title} (${movie.release_date.slice(0, 4)})`, value: movie })).concat([{ name: "None of these, search again.", value: null }]),
                    },
                ]);

                if (confirmedChoice) {
                    process.stdout.write(`Found in cache: ${confirmedChoice.title} (${confirmedChoice.release_date.slice(0, 4)})\n`);
                    movies.push(confirmedChoice);
                    confirmedMovie = true;
                }
            }
        }

        if (movies.length >= minMovies) {
            const { addAnother } = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'addAnother',
                    message: 'Do you want to add another movie title?',
                    default: false,
                },
            ]);

            if (!addAnother) break; // Exit the for loop if the user decides not to add more movies
        }
    }

    await fs.writeFile('./movieCache.json', JSON.stringify(cache, null, 2));
    return movies;
};

/**
 * A module to aggregate movie data from both sources and save it to the cache.
 * This version ensures no duplicate movie entries in the cache.
 * @returns {Object} aggregated movie data
 */
export const aggregateMovieData = async (movies) => {
    const cache = await loadCache();
    let updatedCache = [...cache]; // Copy the cache to avoid mutating the original array directly
    const results = [];

    for (const movie of movies) {
        try {
            const cacheIndex = updatedCache.findIndex((cacheMovie) => cacheMovie.id === movie.id);
            let aggregatedData;

            if (cacheIndex !== -1 && updatedCache[cacheIndex].hasOwnProperty('imdbID') && updatedCache[cacheIndex].hasOwnProperty('imdb_id')) {
                // Use existing complete data from the cache
                aggregatedData = updatedCache[cacheIndex];
            } else {
                // Fetch data from APIs if not found in cache or incomplete
                const tmdbDataPromise = getMovieDetails(movie.imdb_id);
                const omdbDataPromise = getMovieMetadataByImdbId(movie.imdb_id);
                const [tmdbData, omdbData] = await Promise.all([tmdbDataPromise, omdbDataPromise]);

                // Combine TMDB and OMDb data
                aggregatedData = { ...tmdbData, ...omdbData };

                // Update or add the aggregated data to the cache
                if (cacheIndex !== -1) {
                    updatedCache[cacheIndex] = aggregatedData;
                } else {
                    updatedCache.push(aggregatedData);
                }
            }

            results.push(aggregatedData);
        } catch (error) {
            console.error(`Error fetching or aggregating data for movie with ID ${movie.id}:`, error);
        }
    }

    // Remove duplicates from updatedCache before saving
    const uniqueCache = Array.from(new Map(updatedCache.map(item => [item['id'], item])).values());

    // Save the updated cache back to the file
    await fs.writeFile('./movieCache.json', JSON.stringify(uniqueCache, null, 2), 'utf8');
    return results;
};

