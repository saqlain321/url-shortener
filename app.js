const express = require('express');
const validUrl = require('valid-url');
const shortid = require('shortid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory database to store shortened URLs
const urlDatabase = {};

// Route to shorten a URL
app.post('/shorten', (req, res) => {
  const longUrl = req.body.longUrl;

  // Check if the URL is valid
  if (!validUrl.isUri(longUrl)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  // Generate a short code using shortid
  const shortCode = shortid.generate();

  // Create the short URL
  const shortUrl = `http://localhost:${PORT}/${shortCode}`;

  // Store the short URL in the database
  urlDatabase[shortCode] = longUrl;

  res.json({ shortUrl });
});

// Route to redirect to the original URL
app.get('/:shortCode', (req, res) => {
  const shortCode = req.params.shortCode;
  const longUrl = urlDatabase[shortCode];

  // Check if the short code exists in the database
  if (!longUrl) {
    return res.status(404).json({ error: 'Short URL not found' });
  }

  // Redirect to the original URL
  res.redirect(longUrl);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
