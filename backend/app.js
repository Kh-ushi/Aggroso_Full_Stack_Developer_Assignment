const express = require('express');
const cors = require('cors');

const errorHandler = require('./middleware/errorHandler');
const statusRoutes = require('./routes/status.routes');
const transcriptRoutes = require('./routes/transcript.routes');
const actionRoutes = require('./routes/action.routes');


const app = express();

const cors = require("cors");

const corsOptions = {
  origin: "https://mini-workspace.vercel.app",
  credentials: true,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(express.json());

app.use("/api/status", statusRoutes);
app.use("/api/transcripts", transcriptRoutes);
app.use("/api/actions", actionRoutes);

app.use(errorHandler);

module.exports = app;