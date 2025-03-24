let btcprice;
const newsRow1 = document.querySelector(".news-row-1");
const newsRow2 = document.querySelector(".news-row-2");
const newsRow3 = document.querySelector(".news-row-3");

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

axios
  .get("/currency-prices")
  .then((res) => {
    btcprice = res.data.data.BTC;
    document.querySelector(".bitcoin").innerHTML = formatter.format(
      res.data.data.BTC
    );
    document.querySelector(".ethereum").innerHTML = formatter.format(
      res.data.data.ETH
    );
    document.querySelector(".litecoin").innerHTML = formatter.format(
      res.data.data.LTC
    );
  })
  .catch(() => {
    console.log("Unsuccsessful please try again later");
  });

const fetchAndUpdateData = () => {
  // Generate random numbers for size and price
  const getRandomSize = () => Math.floor(Math.random() * 801) + 100; // Random number between 100 and 900
  const getRandomPrice = () =>
    (Math.random() * (2.434 - 0.01) + 0.01).toFixed(3); // Random number between 0.01 and 2.434

  // Get random size and price values
  const randomSize = getRandomSize();
  const randomPrice = getRandomPrice();

  // Calculate derived values
  const lstPriceUSD = randomPrice;
  const lstPriceBTC = (randomSize / btcprice).toFixed(10);
  const change24h = randomSize / 100;
  const lowPriceUSD = getRandomPrice();
  const lowPriceBTC = (getRandomSize() / btcprice).toFixed(10);
  const highPriceUSD = getRandomPrice();
  const highPriceBTC = (getRandomSize() / btcprice).toFixed(10);

  // Update DOM elements with random values
  document.querySelector(".lst-price-usd").innerHTML = `$${lstPriceUSD}`;
  document.querySelector(".lst-price-btc").innerHTML = lstPriceBTC;
  document.querySelector(".change-24h").innerHTML = `+${change24h}%`;
  document.querySelector(".low-price-usd").innerHTML = `$${lowPriceUSD}`;
  document.querySelector(".low-price-btc").innerHTML = lowPriceBTC;
  document.querySelector(".high-price-usd").innerHTML = `$${highPriceUSD}`;
  document.querySelector(".high-price-btc").innerHTML = highPriceBTC;
};

fetchAndUpdateData();
setInterval(fetchAndUpdateData, 3000);

const apiKey = "26018462d1fb4212aff659c16dd030d6";
const apiUrl = "https://newsapi.org/v2/everything";
const query = "crypto";

let articles;
let firstIndex = 0,
  secondIndex = 1,
  thirdIndex = 2;

let indexes = [];

// Function to shuffle an array
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Function to generate unique indexes
const generateUniqueIndexes = (count, range) => {
  const shuffledIndexes = shuffleArray(
    Array.from({ length: range }, (_, i) => i)
  );
  return shuffledIndexes.slice(0, count);
};

const fetchAndUpdateNews = () => {
  const uniqueIndexes = generateUniqueIndexes(3, 100);

  firstIndex = uniqueIndexes[0];
  secondIndex = uniqueIndexes[1];
  thirdIndex = uniqueIndexes[2];

  document
    .querySelector(".news-img-01")
    .setAttribute(
      "src",
      articles[firstIndex].urlToImage || "assets/images/facebook-trending.webp"
    );
  document
    .querySelector(".news-img-02")
    .setAttribute(
      "src",
      articles[secondIndex].urlToImage || "assets/images/trending-02.webp"
    );
  document
    .querySelector(".news-img-03")
    .setAttribute(
      "src",
      articles[thirdIndex].urlToImage || "assets/images/news-trend.jpeg"
    );
  document.querySelector(".news-01").innerHTML = articles[firstIndex].title;
  document.querySelector(".news-02").innerHTML = articles[secondIndex].title;
  document.querySelector(".news-03").innerHTML = articles[thirdIndex].title;
};

axios
  .get(`${apiUrl}?q=${query}&apiKey=${apiKey}`)
  .then((response) => {
    // Handle the response data
    articles = response.data.articles;

    fetchAndUpdateNews();
    setInterval(fetchAndUpdateNews, 5 * 60 * 1000);
  })
  .catch((error) => {
    // Handle any errors
    console.error(error);
  });

newsRow1.addEventListener("click", function (e) {
  e.preventDefault();
  window.open(articles[firstIndex].url, "_blank");
});
newsRow2.addEventListener("click", function (e) {
  e.preventDefault();
  window.open(articles[secondIndex].url, "_blank");
});

newsRow3.addEventListener("click", function (e) {
  e.preventDefault();
  window.open(articles[thirdIndex].url, "_blank");
});
