const { getAnswerFromGemini } = require("../services/gemini.service");

const askAi = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                error: "Please provide a query.",
            });
        }

        const result = await getAnswerFromGemini(q);

        return res.status(200).json(result);
    } catch (error) {
        console.error("AI Generation Error:", error);

        return res.status(500).json({
            error: "Failed to generate AI response.",
        });
    }
};

module.exports = {
    askAi,
};