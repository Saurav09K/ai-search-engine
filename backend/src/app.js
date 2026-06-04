const express = require("express");

const app = express();

const crawlRoutes = require("./routes/crawl.routes");
const searchRoutes = require("./routes/search.routes");
const askRoutes = require("./routes/ask.routes");

app.use(express.json());

app.use("/api/crawl", crawlRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/ask", askRoutes);

module.exports = app;