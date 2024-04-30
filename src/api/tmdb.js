// src/api/tmdb.js

import fetch from 'node-fetch';
import { TMDB_ACCESS_TOKEN } from '../config.js';

/**
 * Constructs the headers necessary for TMDb API requests.
 * @returns {Object} Headers object for fetch requests.
 */
const constructTmdbHeaders = () => {
    return {
        'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
        'Content-Type': 'application/json;charset=utf-8'
    };
};

/**
 * Search for movies by name on TMDb.
 * @param {string} query - The movie name to search for.
 * @returns {Promise<Array>} A promise that resolves to an array of movie search results.
 * @throws {Error} Throws an error if the fetch operation fails.
 */
export const searchMovies = async (query) => {
    const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}`;
    try {
        const response = await fetch(url, {
            headers: constructTmdbHeaders()
        });
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching data from TMDb:', error);
        throw error;
    }
};

/**
 * Get top-level details of a movie by ID from TMDb.
 * @param {number} movieId - The ID of the movie to fetch.
 * @returns {Promise<Object>} A promise that resolves to the movie's details.
 * @throws {Error} Throws an error if the fetch operation fails.
 */
export const getMovieDetails = async (movieId) => {
    const url = `https://api.themoviedb.org/3/movie/${movieId}`;
    try {
        const response = await fetch(url, {
            headers: constructTmdbHeaders()
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching movie details from TMDb:', error);
        throw error;
    }
};

/**
 * Discover movies on TMDb based on a dynamic query URL.
 * @param {string} url - The full API URL including query parameters.
 * @returns {Promise<Object>} A promise that resolves to the result of the movie discovery.
 * @throws {Error} Throws an error if the fetch operation fails.
 */
export const discoverMovies = async (url) => {
    try {
        const response = await fetch(url, {
            headers: constructTmdbHeaders()
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching movie details from TMDb:', error);
        throw error;
    }
};
