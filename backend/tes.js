require("dotenv").config();
const pool = require("../backend/src/config/db");
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

async function main() {
    const result = await pool.query(`
        SELECT id, chunk_text
        FROM page_chunks
        LIMIT 1
    `);

    const chunk = result.rows[0];

    console.log(chunk.id);

    const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: chunk.chunk_text
});

const embedding = response.embeddings[0].values;

console.log(embedding.length);

console.log(embedding[0]);
console.log(embedding[1]);
console.log(embedding[2]);

const vectorString = `[${embedding.join(",")}]`;

await pool.query(
`
UPDATE page_chunks
SET chunk_embedding = $1
WHERE id = $2
`,
[vectorString, 192]
);

    
}

main().catch(console.error);