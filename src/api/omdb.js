// src/api/omdb.js

import fetch from 'node-fetch';
import { OMDB_ACCESS_TOKEN } from '../config.js'; 

/**
 * Fetch detailed movie metadata from OMDb by IMDb ID.
 * @param {string} imdbId - The IMDb ID of the movie.
 * @returns {Promise<Object>} A promise that resolves to the movie's metadata.
 */
export const getMovieMetadataByImdbId = async (imdbId) => {
	const url = `http://www.omdbapi.com/?apikey=${OMDB_ACCESS_TOKEN}&i=${imdbId}`;
	try {
		const response = await fetch(url);
		// console.log(response);
		const data = await response.json();
		if (data.Response === "True") {
			return data; // The detailed movie metadata
		} else {
			throw new Error(`OMDb API error: ${data.Error}`);
		}
	} catch (error) {
		console.error('Error fetching movie metadata from OMDb:', error);
		throw error;
	}
};