const express = require('express');
const cors = require('cors');

const errorHandler = require('./middleware/errorHandler');
const statusRoutes = require('./routes/status.routes');
const transcriptRoutes = require('./routes/transcript.routes');
const actionRoutes = require('./routes/action.routes');


const app = express();

app.use(cors({
  origin: "https://mini-workspace.vercel.app",
  credentials: true
}));

app.options("*", cors());

app.use(express.json());

app.use("/api/status", statusRoutes);
app.use("/api/transcripts", transcriptRoutes);
app.use("/api/actions", actionRoutes);

app.use(errorHandler);

module.exports = app;