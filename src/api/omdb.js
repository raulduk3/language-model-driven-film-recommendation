// src/api/omdb.js

import fetch from 'node-fetch';
import { OMDB_ACCESS_TOKEN } from '../config.js'; 

/**
 * Constructs the OMDb API URL.
 * @param {string} imdbId - The IMDb ID of the movie.
 * @returns {string} The constructed URL with the provided IMDb ID.
 */
const constructOmdbUrl = (imdbId) => {
    return `http://www.omdbapi.com/?apikey=${OMDB_ACCESS_TOKEN}&i=${imdbId}`;
};

/**
 * Fetch detailed movie metadata from OMDb by IMDb ID.
 * @param {string} imdbId - The IMDb ID of the movie to fetch metadata for.
 * @returns {Promise<Object>} A promise that resolves to the movie's metadata or throws an error.
 * @throws {Error} Throws an error if the fetch operation fails or the API returns an error.
 */
export const getMovieMetadataByImdbId = async (imdbId) => {
    const url = constructOmdbUrl(imdbId);
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.Response === "True") {
            return data;
        } else {
            throw new Error(`OMDb API error: ${data.Error}`);
        }
    } catch (error) {
        console.error('Error fetching movie metadata from OMDb:', error);
        throw error;
    }
};
