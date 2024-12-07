function getStockPrice() {
  const stockSymbol = document.getElementById('stock-symbol').value;
  if (!stockSymbol) {
    alert('Please enter a stock symbol');
    return;
  }

  fetch(`/api/stock-prices?stock=${stockSymbol}`)
    .then(response => response.json())
    .then(data => {
      displayStockInfo(data);
    })
    .catch(error => {
      console.error(error);
      alert('An error occurred while fetching the stock price');
    });
}

function displayStockInfo(data) {
  const stockInfoDiv = document.getElementById('stock-info');
  stockInfoDiv.innerHTML = '';

  if (Array.isArray(data)) {
    data.forEach(stock => {
      stockInfoDiv.innerHTML += `
        <div>
          <h3>${stock.stock}</h3>
          <p>Price: $${stock.price}</p>
          <p>Likes: ${stock.likes}</p>
        </div>
      `;
    });
  } else {
    const stock = data;
    stockInfoDiv.innerHTML = `
      <h3>${stock.stock}</h3>
      <p>Price: $${stock.price}</p>
      <p>Likes: ${stock.likes}</p>
    `;
  }
}
