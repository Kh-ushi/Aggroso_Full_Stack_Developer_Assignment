const Transcript = require("../models/Transcript");
const ApiError = require("../utils/ApiError");

const ActionItem = require("../models/ActionItem");
const mongoose = require("mongoose");

exports.createTranscript = async (req, res, next) => {
    try {
        const { text } = req.body;

        if (!text || typeof text !== "string" || text.trim().length === 0) {
            throw new ApiError(400, "Transcript text cannot be empty");
        }

        if (text.length < 10) {
            throw new ApiError(400, "Transcript is too short");
        }

        const transcript = await Transcript.create({
            text: text.trim(),
        });

        res.status(201).json({
            success: true,
            data: {
                transcriptId: transcript._id,
                text: transcript.text,
                actionItems: [],
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
            data: transcripts,
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