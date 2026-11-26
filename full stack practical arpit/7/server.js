
const express = require("express");
const path = require("path");

const app = express();
const PORT = 3001;

// API route: Get universities by country
app.get("/api/universities", async (req, res) => {

    const country = (req.query.country || "").trim();

    if (!country) {
        return res.status(400).json({
            error: "Please enter a country."
        });
    }

    try {

        // Request data from Hipolabs API
        const response = await fetch(
            `http://universities.hipolabs.com/search?country=${encodeURIComponent(country)}`
        );

        if (!response.ok) {
            throw new Error("University API request failed.");
        }

        const universities = await response.json();

        // Send university data to frontend
        res.json(universities);

    } catch (error) {

        console.error("API Error:", error.message);

        res.status(500).json({
            error: "Unable to fetch university data."
        });

    }

});

// Serve HTML, CSS and JavaScript
app.use(express.static(path.join(__dirname, "public")));

// Start server
app.listen(PORT, () => {
    console.log(`University Atlas running at http://localhost:${PORT}`);
});
