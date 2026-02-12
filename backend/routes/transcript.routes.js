const express = require("express");
const router = express.Router();

const { createTranscript,getTranscript,getTranscriptById } = require("../controllers/transcript.controller");

router.post("/", createTranscript);
router.get("/", getTranscript);
router.get("/:id", getTranscriptById);

module.exports = router;