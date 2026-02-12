const mongoose = require('mongoose');

const actionItemSchema = new mongoose.Schema({

    transcriptId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transcript",
        required: true,
        index: true,
    },

    task: {
        type: String,
        required: true,
        trim: true,
    },
    owner: {
        type: String,
        default: null,
        trim: true,
    },

    dueDate: {
        type: Date,
        default: null,
    },

    status: {
        type: String,
        enum: ["open", "done"],
        default: "open",
        index: true,
    },

}, {
    timestamps: true,
});

module.exports = mongoose.model("ActionItem", actionItemSchema);
