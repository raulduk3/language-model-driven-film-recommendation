import inquirer from "inquirer";
import fs from 'fs/promises';
import { searchMovies } from '../api/tmdb.js';

/**
 * Load movie data from file storage.
 * @returns {Object} Cached movie data.
 */
const loadCache = async () => {
	try {
		const data = await fs.readFile('./movieCache.json', 'utf-8');
		return JSON.parse(data);
	} catch (error) {
		return []; 
	}
};

/**
 * A module to ingest and store user's favorite films, initially asking for 5 movies and allowing up to 10.
 */
const askForMovies = async (initialCount, maxMovies) => {
	let movies = [];
	let cache = await loadCache();

	/**
	 * Checks if a given movie title exist in the cache.
	 * @returns {Boolean} 
	*/
	const findInCache = (title) => cache.find(movie => movie.title.toLowerCase() === title.toLowerCase());

	for (let i = 0; i < maxMovies; i++) {
		let searchingForFilm = true;
		while (searchingForFilm) {
			const answer = await inquirer.prompt([
				{
					type: 'input',
					name: 'movieTitle',
					message: `Enter movie title #${i + 1}:`,
					validate: input => input.trim() === '' ? 'Please enter a valid movie title.' : true,
				},
			]);

			const movieTitle = answer.movieTitle;
			let movieData = findInCache(movieTitle);

			if (!movieData) {
				// Movie not in cache, search using API
				const searchResults = await searchMovies(movieTitle);
				if (searchResults.length > 0) {
					// console.log(`Found: ${searchResults[0].title}`);
					cache.push(searchResults[0]); // Update cache
					movieFound = true;
				} else {
					console.log('Movie not found in TMDb. Please try another title.');
				}
			} else {
				// Movie found in cache
				// console.log(`Found in cache: ${movieData.title}`);
				movieFound = true;
			}

			if (movieFound) {
				movies.push(movieData.title);
			}
		}

		if (i >= initialCount - 1) {
			const { addAnother } = await inquirer.prompt([
				{
					type: 'confirm',
					name: 'addAnother',
					message: 'Do you want to add another movie title?',
					default: false,
				},
			]);

			if (!addAnother) break;
		}
	}

	await fs.writeFile('./movieCache.json', JSON.stringify(cache, null, 2));
};

/**
 * Function to ingest a list of favorite films, starting with 5 and allowing up to 10.
 */
export const ingestFavoriteFilms = async () => {
	await askForMovies(5, 10); //cd 
};
