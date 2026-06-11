const { Worker } = require('bullmq');
const { PDFParse } = require('pdf-parse');
const { redisConnection } = require('../config/connection');


const pool = require('../config/db'); 
const generateEmbedding = require('../utils/embedder'); 

console.log("👷‍♂️ Worker is booting up and listening to Redis...");

const worker = new Worker('crawl-queue', async (job) => {

    const { pdfUrl } = job.data; 
    console.log(`Downloading PDF from: ${pdfUrl}`);

    try {
        const response = await fetch(pdfUrl);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        console.log('Extracting text...');
        const parser = new PDFParse({ data: buffer });
        const result = await parser.getText();
        let text = result.text;

        const cleanedText = text.replace(/--\s*\d+\s*of\s*\d+\s*--/g, "");

        console.log('Saving document to PostgreSQL...');
        const insertpageQuery = `
            INSERT INTO crawled_pages(url, title, raw_content)
            VALUES ($1, $2, $3)
            RETURNING id, title;
        `;
        
        const fileName = pdfUrl.split('/').pop() || "Legal PDF";
        
        const dbResult = await pool.query(insertpageQuery, [pdfUrl, fileName, cleanedText]);
        const pageId = dbResult.rows[0].id;

        console.log('Chunking text...');
        const chunks = [];
        for(let i = 0; i < cleanedText.length; i += 800){
            chunks.push(cleanedText.slice(i, i + 1000));
        }

        console.log(`Sending ${chunks.length} chunks to Gemini...`);
        for(let i = 0; i < chunks.length; i++) {
            
            const embedding = await generateEmbedding(chunks[i]);
            const embeddingString = `[${embedding.join(",")}]`;

            await pool.query(
                `
                INSERT INTO page_chunks
                (
                    page_id,
                    chunk_index,
                    chunk_text,
                    chunk_embedding
                )
                VALUES($1,$2,$3,$4)
                `,
                [
                    pageId,
                    i,
                    chunks[i],
                    embeddingString
                ]
            );

            if (i % 10 === 0) console.log(`   ...processed chunk ${i}/${chunks.length}`);
        }

        console.log(`Job completely finished Database is populated.`);
        return { success: true, chunksProcessed: chunks.length };

    } catch (error) {
        console.error(`Worker failed:`, error);
        throw error; 
    }
}, { 
    connection: redisConnection 
});

