# CineMatchAI

CineMatchAI is a powerful command-line tool designed to provide personalized film recommendations using advanced semantic search and heuristic analysis powered by Large Language Models (LLMs). By interfacing with the OMDb and TMDb APIs, it offers users a deeply personalized experience, leveraging rich movie metadata to suggest films that align closely with their tastes and preferences.

## Features

- **Personalized Recommendations:** Leverages LLMs to analyze user preferences and suggest films tailored to their tastes.
- **Integration with OMDb and TMDb:** Fetches comprehensive movie metadata, providing users with detailed insights into each recommendation.
- **Advanced Semantic Analysis:** Utilizes semantic search techniques to understand and match user preferences with potential film suggestions.
- **Heuristic Evaluation:** Employs heuristic methods to refine the recommendation process, ensuring high relevance and user satisfaction.
- **CLI-Based Interface:** Offers a streamlined, command-line interface for ease of use and accessibility, catering to users who prefer terminal-based applications.

## Getting Started

### Prerequisites

Ensure you have Node.js installed on your system to run the CineMatchAI CLI tool. You can download Node.js from [here](https://nodejs.org/).

### Installation

Clone the CineMatchAI repository to your local machine:

```bash
git clone https://github.com/raulduk3/language-model-driven-film-recommendation.git
```

Navigate to the project directory:

```bash
cd language-model-driven-film-recommendation
```

Install the necessary dependencies:

```bash
npm install
```

Usage
To start the application and receive film recommendations, run:

```bash
npm start
```

Follow the on-screen prompts to input your favorite films and receive personalized recommendations based on your preferences.

## How It Works
1. Ingest Favorite Films: Users input their favorite films, providing a basis for understanding their cinematic tastes.
2. Fetch Movie Metadata: The tool fetches movie metadata from TMDb (with a higher priority) and OMDb, creating a detailed dataset for analysis.
3. Analyze Preferences: Using LLMs, CineMatchAI identifies patterns, themes, genres, and other factors common to the user's favorite films.
4. Discover New Films: Based on the analysis, it generates a tailored request to discover new movies that match the user's preferences.
5. Generate Recommendations: The tool assesses each discovered film against the user's profile, recommending those that closely match their preferences.

## Contribution
Contributions are welcome! Whether it's adding new features, fixing bugs, or improving documentation, please feel free to fork the repository, make your changes, and submit a pull request. Check the issues tracker for areas where you can help.

## License
CineMatchAI CLI is licensed under the ISC License - see the LICENSE file for details.

## Acknowledgments
OMDb API: For providing a comprehensive database of movie metadata.
TMDb API: For its extensive film database and robust search capabilities.
LangChain: For facilitating advanced LLM integrations, enabling sophisticated semantic analysis and recommendation logic.

Visit our GitHub repository for more information about the project.
