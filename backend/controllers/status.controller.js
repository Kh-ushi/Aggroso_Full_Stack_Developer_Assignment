const mongoose = require("mongoose");
const { healthCheck } = require("../services/llm/gemini.service");

const getHealthStatus = async (req, res) => {
    const backendStatus = "ok";
    const dbStatus =
        mongoose.connection.readyState === 1
            ? "connected"
            : "disconnected";

    let llmStatus = "unknown";

    try {
        const llmHealthy = await healthCheck();
        llmStatus = llmHealthy ? "ok" : "error";
        console.log("LLM health check result:", llmStatus);
    } catch (error) {
        llmStatus = "error";
    }

    res.status(200).json({
        backend: backendStatus === "ok",
        database: dbStatus === "connected",
        llm: llmStatus=== "ok",
    });
};

module.exports = {
    getHealthStatus,
};