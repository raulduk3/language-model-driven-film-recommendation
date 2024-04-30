import { OpenAI } from '@langchain/openai';
import { OPENAI_API_KEY } from "./config.js";

const openAI = new OpenAI({
    apiKey: OPENAI_API_KEY,
    model: 'gpt-3.5-turbo', // Ensure you have access to this model
});

/**
 * Evaluates if the discovered movie is a good match based on user preferences.
 * @param {Object} movie - The movie to evaluate.
 * @param {string} userPreferences - The description of user preferences.
 * @returns {Promise<boolean>} - A promise that resolves to true if the movie is a compatible recommendation.
 */
export const evaluateRecommendation = async (movie, userPreferences) => {
    const prompt = `Evaluate if the following movie fits these user preferences:\nPreferences: ${userPreferences}\nMovie: ${movie.title}, Genre: ${movie.genres.map(g => g.name).join(', ')}, Released: ${movie.release_date}\nIs this movie a good recommendation for the user?`;
    try {
        const response = await openAI.createCompletion({
            prompt,
            maxTokens: 60,
            temperature: 0.5
        });
        const answer = response.choices[0].text.trim().toLowerCase();
        return answer.includes('yes') || answer.includes('good');
    } catch (error) {
        console.error('Failed to evaluate recommendation:', error);
        return false;
    }
};
