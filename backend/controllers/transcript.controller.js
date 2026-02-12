const Transcript = require("../models/Transcript");
const ApiError = require("../utils/ApiError");

const ActionItem = require("../models/ActionItem");
const mongoose = require("mongoose");

const generateActionItemsWithGemini = require("../services/llm/gemini.service").generateActionItemsWithGemini;

exports.createTranscript = async (req, res, next) => {
    try {
        console.log("Received transcript creation request with body:", req.body);
        const { text, provider } = req.body;

        if (!text || typeof text !== "string" || text.trim().length === 0) {
            throw new ApiError(400, "Transcript text cannot be empty");
        }

        if (text.length < 10) {
            throw new ApiError(400, "Transcript is too short");
        }

        const transcript = await Transcript.create({
            text: text.trim(),
        });

        const extractedItems = await generateActionItemsWithGemini(transcript.text, provider || "gemini");

        console.log("Extracted action items:", extractedItems);

        const savedItems = extractedItems.map((item) => ({
            transcriptId: transcript._id,
            ...item,
        }))

        await ActionItem.insertMany(savedItems);

        res.status(201).json({
            success: true,
            data: {
                transcriptId: transcript._id,
                text: transcript.text,
                actionItems: savedItems,
            },
        });

    } catch (error) {
        next(error);
    }
};

exports.getTranscript = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        if (limit <= 0) {
            throw new ApiError(400, "Limit must be a positive integer");
        }
        

        const transcripts = await Transcript.find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .select("_id text createdAt");

        res.status(200).json({
            success: true,
            data: transcripts
        });
    }
    catch (error) {
        next(error);
    }
};


exports.getTranscriptById = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new ApiError(400, "Invalid transcript ID");
        }

        const transcript = await Transcript.findById(id);

        if (!transcript) {
            throw new ApiError(404, "Transcript not found");
        }
        const actionItems = await ActionItem.find({ transcriptId: id }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: {
                transcriptId: transcript._id,
                text: transcript.text,
                createdAt: transcript.createdAt,
                actionItems,
            },
        });
    }
    catch (error) {
        next(error);
    }
}