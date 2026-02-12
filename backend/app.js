const express = require('express');
const cors = require('cors');

const errorHandler = require('./middleware/errorHandler');
const statusRoutes = require('./routes/status.routes');
const transcriptRoutes = require('./routes/transcript.routes');

const app= express();

app.use(cors());

app.use(express.json());

app.use("/api/status", statusRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Meeting Workspace API running" });
});

app.use("/api/transcripts", transcriptRoutes);


app.use(errorHandler);

module.exports = app;