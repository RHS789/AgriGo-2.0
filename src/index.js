const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('<h1>AgriGo 2.0</h1><p>Application is running</p>');
});

app.listen(PORT, () => {
  console.log(`AgriGo 2.0 server running on http://localhost:${PORT}`);
});
