const mongoose = require("mongoose");

const rateLimitSchema = new mongoose.Schema({
  key: { type: String, required: true },
  count: { type: Number, default: 0 },
  windowStart: { type: Date, default: Date.now },
});

rateLimitSchema.index({ windowStart: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model("RateLimit", rateLimitSchema);