// src/api/omdb.js

import fetch from 'node-fetch';
import { OMDB_API_KEY } from '../config'; // Make sure your API key is correctly configured

/**
 * Fetch detailed movie metadata from OMDb by IMDb ID.
 * @param {string} imdbId - The IMDb ID of the movie.
 * @returns {Promise<Object>} A promise that resolves to the movie's metadata.
 */
const getMovieMetadataByImdbId = async (imdbId) => {
  const url = `http://www.omdbapi.com/?i=${imdbId}&apikey=${OMDB_API_KEY}`;
  try {
    const response = await fetch(url);
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

module.exports = {
  getMovieMetadataByImdbId,
};
