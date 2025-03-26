const axios = require("axios");

const apiKey = "26018462d1fb4212aff659c16dd030d6";
const apiUrl = "https://newsapi.org/v2/everything";
const query = "crypto";

// Function to fetch the news
exports.getNews = async (req, res, next) => {
  try {
    const response = await axios.get(`${apiUrl}?q=${query}&apiKey=${apiKey}`);
    const articles = response.data.articles;

    // Generate 3 random unique indexes
    const generateUniqueIndexes = (count, range) => {
      const indexes = Array.from({ length: range }, (_, i) => i);
      const shuffledIndexes = indexes.sort(() => Math.random() - 0.5);
      return shuffledIndexes.slice(0, count);
    };

    const uniqueIndexes = generateUniqueIndexes(3, articles.length);

    // Send the articles and indexes as the response
    res.status(200).json({
      status: "success",
      data: {
        articles: articles,
        indexes: uniqueIndexes,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Unable to fetch news data",
    });
  }
};
