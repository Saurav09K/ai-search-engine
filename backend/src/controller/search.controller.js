const pool = require('../config/db')

const searchPages = async (req,res)=>{
    try{
        const {q} = req.query;

        if(!q){
            return res.status(400).json({ error: "Please provide context to search" });
        }

        const result = await pool.query(
        `
            SELECT
            pc.chunk_text,
            pc.chunk_index,
            cp.title,
            cp.url,
            ts_rank(
            to_tsvector(pc.chunk_text),
            plainto_tsquery($1)
            ) AS rank
            FROM page_chunks pc
            JOIN crawled_pages cp
            ON cp.id = pc.page_id
            WHERE to_tsvector(pc.chunk_text)
            @@ plainto_tsquery($1)
            ORDER BY rank DESC;
            `,
            [q]
        );
        res.json(result.rows);
    }catch(error){
        console.error("Search Error:", error.message);
        res.status(500).json({ error: "Failed to perform search." });
    }
    
};

module.exports = {searchPages};