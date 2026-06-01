const express = require("express");

const app = express();

const crawlRoutes = require("./routes/crawl.routes");


app.use(express.json());

app.use("/api/crawl", crawlRoutes);


module.exports = app;