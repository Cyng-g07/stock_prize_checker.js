const express = require('express');
const axios = require('axios');
const router = express.Router();

let likedStocks = {};  // Store liked stocks with anonymized IP addresses

// Helper function to anonymize IP address
function anonymizeIp(ip) {
  const parts = ip.split('.');
  parts[3] = '0';  // Anonymize by setting the last part of IP to 0
  return parts.join('.');
}

// Fetch stock prices from external API
async function fetchStockPrice(stockSymbol) {
  try {
    const response = await axios.get(`https://stock-price-checker-proxy.freecodecamp.rocks/stock/${stockSymbol}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Get stock price and handle likes
router.get('/', async (req, res) => {
  const { stock, like } = req.query;
  
  if (!stock) {
    return res.status(400).send({ error: 'Stock symbol is required' });
  }

  let stocks = Array.isArray(stock) ? stock : [stock];  // Ensure stocks is an array
  
  let stockData = [];
  
  for (let i = 0; i < stocks.length; i++) {
    const stockSymbol = stocks[i];
    const stockInfo = await fetchStockPrice(stockSymbol);

    if (stockInfo) {
      // Prepare stock data
      const stockPrice = stockInfo.price;
      const stockName = stockInfo.name;

      let likes = 0;
      
      // Handle likes if applicable
      if (like) {
        const ip = req.ip;
        const anonymizedIp = anonymizeIp(ip);

        if (!likedStocks[stockSymbol]) {
          likedStocks[stockSymbol] = [];
        }

        if (!likedStocks[stockSymbol].includes(anonymizedIp)) {
          likedStocks[stockSymbol].push(anonymizedIp);
          likes = likedStocks[stockSymbol].length;
        }
      }

      stockData.push({
        stock: stockName,
        price: stockPrice,
        likes
      });
    }
  }

  // If two stocks are requested, return them as an array
  if (stocks.length > 1) {
    res.json(stockData);
  } else {
    res.json(stockData[0]);
  }
});

module.exports = router;
