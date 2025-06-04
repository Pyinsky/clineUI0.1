const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"]
    }
  }
}));

// Compression middleware for better performance
app.use(compression());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from root for backwards compatibility
app.use(express.static(__dirname));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'StockArt Website'
  });
});

// API endpoint for stock suggestions (mock data)
app.get('/api/stocks/search', (req, res) => {
  const query = req.query.q || '';
  const stocks = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 175.84, change: 2.4 },
    { symbol: 'MSFT', name: 'Microsoft Corporation', price: 420.67, change: 1.8 },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 151.23, change: -0.5 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 178.35, change: 3.2 },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.92, change: -0.9 },
    { symbol: 'META', name: 'Meta Platforms Inc.', price: 352.19, change: 1.2 },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 875.45, change: 4.1 },
    { symbol: 'BRK.A', name: 'Berkshire Hathaway Inc.', price: 542000.00, change: 0.3 },
    { symbol: 'JPM', name: 'JPMorgan Chase & Co.', price: 178.92, change: 0.8 },
    { symbol: 'JNJ', name: 'Johnson & Johnson', price: 156.78, change: -0.2 }
  ];

  const filteredStocks = stocks.filter(stock => 
    stock.name.toLowerCase().includes(query.toLowerCase()) ||
    stock.symbol.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  res.json(filteredStocks);
});

// Catch-all handler: send back React's index.html file for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
  });
});

app.listen(PORT, () => {
  console.log(`🚀 StockArt server is running on port ${PORT}`);
  console.log(`📊 Visit: http://localhost:${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
  console.log(`📈 API endpoint: http://localhost:${PORT}/api/stocks/search?q=apple`);
});

module.exports = app;
