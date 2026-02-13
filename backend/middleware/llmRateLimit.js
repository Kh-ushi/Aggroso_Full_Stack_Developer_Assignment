const rateLimit = require("express-rate-limit");
const RateLimit = require("../models/RateLimit");

const perMinuteLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 4,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests. Please wait a minute.",
    },
});


const GLOBAL_KEY = "GLOBAL_DAILY_LLM_LIMIT";
const DAILY_LIMIT = 19;
const WINDOW_MS = 24 * 60 * 60 * 1000;


const globalDailyQuotaGuard = async (req, res, next) => {
    try {

        const now = new Date();
        const windowStart = new Date(now.getTime() - WINDOW_MS);

        const record = await RateLimit.findOneAndUpdate(
            { key: GLOBAL_KEY },
            [
                {
                    $set: {
                        windowStart: {
                            $cond: [
                                { $lt: ["$windowStart", windowStart] },
                                now,
                                "$windowStart",
                            ],
                        },
                        count: {
                            $cond: [
                                { $lt: ["$windowStart", windowStart] },
                                1,
                                { $add: ["$count", 1] },
                            ],
                        },
                    },
                },
            ], { upsert: true, new: true,updatePipeline:true }
        );

        if (record.count > DAILY_LIMIT) {
            return res.status(429).json({
                success: false,
                message: "Global LLM quota reached. Try again tomorrow.",
            });
        }

        next();

    }
    catch (error) {
        console.error("Global rate limit error:", error);
        return res.status(500).json({
            success: false,
            message: "Rate limit system error",
        });
    }
}

module.exports = {
    perMinuteLimiter,
    dailyQuotaGuard: globalDailyQuotaGuard
};