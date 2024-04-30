// src/preferences/llmIntegration.js

import { PromptTemplate } from '@langchain/core/prompts';
import fs from 'fs/promises';
import { OpenAI } from '@langchain/openai';
import { APIChain } from "langchain/chains";

import { discoverMovies } from './api/tmdb.js';
import { OPENAI_API_KEY } from "./config.js";

/**
 * Initializes and configures the LangChain OpenAI client.
 */
const LLM = new OpenAI({
    apiKey: OPENAI_API_KEY,
    temperature: 0.65,
    model: 'gpt-4',
});

/**
 * Reads the TMDB OpenAPI Specification from a local JSON file.
 * @returns {Promise<string>} The JSON string of the TMDB OpenAPI specification.
 */
async function readTMDBOAS() {
    return await fs.readFile('./tmdb_oas.json', 'utf-8');
}

/**
 * Describes user preferences based on their favorite film metadata.
 * @param {Array} userFavoriteFilmMetaData - An array of user's favorite film metadata.
 * @returns {Promise<string>} A promise that resolves to a description of user preferences.
 */
export const describeUserPreferences = async (userFavoriteFilmMetaData) => {

    const prompt = PromptTemplate.fromTemplate(`
        {json}
        - genres
        - release_date
        - runtime
        - spoken_languages
        - vote_average answers for the 
        - boxOffice
        - rated   
        Fill out the fields above based on the movie metadata. Simple answers.
    `);

    const descriptionPrompt = await prompt.format({
        json: JSON.stringify(userFavoriteFilmMetaData),
    });
    const description = await LLM.invoke(descriptionPrompt);

    return description;
};

/**
 * Generates a TMDB API movie discovery request based on user preferences.
 * @param {string} preferences - The user preferences description.
 * @returns {Promise<Array>} A promise that resolves to an array with the API request URL and movie discovery results.
 */
export const discoverMoviesFromPreferences = async (preferences) => {
    const TMDB_OAS = await readTMDBOAS();
    
    const discoverPrompt = PromptTemplate.fromTemplate(`
        {tmdb_oas}
        {preferences}
        Create a valid TMDb API movie discovery request with filters based on the user preference description. Reference the TMDB OAS above.
        USE sort_by=vote_average.desc.
        USE genre numbers.
        NEVER USE keywords OR primary release year.
        NEVER USE API KEY.
        USE THE | seperator.
        ONLY RESPOND WITH THE URL.
    `);

    const prompt = await discoverPrompt.format({ preferences, tmdb_oas: TMDB_OAS });
    const res = await LLM.invoke(prompt);

    const movies = await discoverMovies(res);

    return [res, movies];
};
