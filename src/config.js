// src/config.js

import 'dotenv/config';

/**
 * Retrieves the environment variable or throws an error if it's not defined.
 * @param {string} varName - The name of the environment variable.
 * @returns {string} The value of the environment variable.
 * @throws {Error} Throws an error if the environment variable is not defined.
 */
const getEnvVariable = (varName) => {
    const value = process.env[varName];
    if (!value) {
        throw new Error(`Environment variable ${varName} is missing.`);
    }
    return value;
};

/**
 * TMDb API access token, required for TMDb API requests.
 * @type {string}
 */
export const TMDB_ACCESS_TOKEN = getEnvVariable('TMDB_ACCESS_TOKEN');

/**
 * OMDb API access token, required for OMDb API requests.
 * @type {string}
 */
export const OMDB_ACCESS_TOKEN = getEnvVariable('OMDB_ACCESS_TOKEN');

/**
 * OpenAI API key, required for making requests to OpenAI services.
 * @type {string}
 */
export const OPENAI_API_KEY = getEnvVariable('OPENAI_API_KEY');
