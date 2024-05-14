// Importing required modules
const express = require('express');
const bodyParser = require('body-parser');
const shortid = require('shortid');

// Initialize Express app
const app = express();

// Set up middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// In-memory database to store URL mappings
const urlDatabase = {};

// Endpoint to create shortened URL
app.post('/shorten', (req, res) => {
    const originalUrl = req.body.url;
    const shortCode = shortid.generate();
    const shortUrl = `http://localhost:3000/${shortCode}`;

    // Store mapping in database
    urlDatabase[shortCode] = originalUrl;

    res.json({ shortUrl });
});

// Endpoint to redirect to original URL
app.get('/:shortCode', (req, res) => {
    const shortCode = req.params.shortCode;
    const originalUrl = urlDatabase[shortCode];

    if (originalUrl) {
        res.redirect(originalUrl);
    } else {
        res.status(404).send('URL not found');
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
