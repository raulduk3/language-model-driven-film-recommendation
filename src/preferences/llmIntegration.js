import { PromptTemplate } from '@langchain/core/prompts';
import { OpenAI } from '@langchain/openai';
import { OPENAI_API_KEY } from "../config.js";

// Set up the LangChain client
const LLM = new OpenAI({
    apiKey: OPENAI_API_KEY,
    maxTokens: -1,
    temperature: 0.68,
    model: 'gpt-4', 
});

// Function to describe user preferences based on their favorite film metadata
export const describeUserPreferences = async (userFavoriteFilmMetaData) => {

    // console.log(JSON.stringify(userFavoriteFilmMetaData));

    // Construct a prompt to describe the user's taste based on the metadata
    const prompt = PromptTemplate.fromTemplate(
        `{json} \nAct as a professional film recommender. In one paragraph, precisely describe the taste and commonalities of the movies contained in the user's preferences above. What are some recurring patterns? What are the common genres, writers, actors, locations, themes, and/or styles?`
    );

    // Generate a description using LangChain
    const descriptionPrompt = await prompt.format({
        json: JSON.stringify(userFavoriteFilmMetaData)
    });
    const description = await LLM.invoke(descriptionPrompt);

    // Return the generated description
    return description;
};

