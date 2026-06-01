const axios = require("axios");
const cheerio = require("cheerio");
const pool = require("../config/db");

const crawlPage = async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: "Please provide a URL to crawl." });
    }

    try {

        const { data } = await axios.get(url);

        const $ = cheerio.load(data);
        $('script, style, nav, header, footer, noscript').remove();
        
        const title = $('title').text().trim();
        const raw_content = $('body').text().replace(/\s+/g, ' ').trim();

        const insertQuery = `
            INSERT INTO crawled_pages (url, title, raw_content)
            VALUES ($1, $2, $3)
            RETURNING id, title;
        `;
        
        const dbResult = await pool.query(insertQuery, [url, title, raw_content]);

        res.status(201).json({
            message: "Page successfully crawled and saved!",
            data: dbResult.rows[0]
        });

    } catch (error) {
        console.error("Crawling Error:", error.message);
        
        if (error.code === '23505') {
            return res.status(409).json({ error: "This URL has already been crawled and saved." });
        }

        res.status(500).json({ error: "Failed to crawl the website." });
    }
};

module.exports = {
  crawlPage
};