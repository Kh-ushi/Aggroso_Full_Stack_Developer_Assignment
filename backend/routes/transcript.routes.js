const express = require("express");
const router = express.Router();
const {validate}=require("../middleware/validate");
const {transcriptSchema}=require("../schemas/transcript.schema");

const {perMinuteLimiter,dailyQuotaGuard}=require("../middleware/llmRateLimit");

const { createTranscript,getTranscript,getTranscriptById } = require("../controllers/transcript.controller");

router.post("/", perMinuteLimiter, dailyQuotaGuard, validate(transcriptSchema), createTranscript);
router.get("/", getTranscript);
router.get("/:id", getTranscriptById);

module.exports = router;