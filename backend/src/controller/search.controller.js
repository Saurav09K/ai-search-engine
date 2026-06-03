const pool = require('../config/db')
const  generateEmbedding  = require('../utils/embedder');

const searchPages = async (req,res)=>{
    try{
        const {q} = req.query;

        if(!q){
            return res.status(400).json({ error: "Please provide context to search" });
        }

        const queryEmbedding = await generateEmbedding(q);
        const vectorString = `[${queryEmbedding.join(",")}]`;

        const result = await pool.query(
        `
            SELECT 
                pc.chunk_text,
                cp.title,
                cp.url,
                1 - (pc.chunk_embedding <=> $1) AS similarity_score
            FROM page_chunks pc
            JOIN crawled_pages cp ON cp.id = pc.page_id
            ORDER BY pc.chunk_embedding <=> $1
            LIMIT 5;
        `,
        [vectorString]
        );
        res.json(result.rows);
    }catch(error){
        console.error("Search Error:", error.message);
        res.status(500).json({ error: "Failed to perform search." });
    }
    
};

module.exports = {searchPages};