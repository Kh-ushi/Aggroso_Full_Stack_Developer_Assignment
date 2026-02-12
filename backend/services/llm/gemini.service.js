const { GoogleGenerativeAI } = require("@google/generative-ai");
const ApiError = require("../../utils/ApiError");
const { SYSTEM_PROMPT } = require("./prompts");


if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables");
}


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
});

exports.generateActionItemsWithGemini = async (transcriptText) => {
    try {
        if (!transcriptText || typeof transcriptText !== "string") {
            throw new ApiError(400, "Transcript text must be a valid string");
        }
        if (transcriptText.trim().length < 10) {
            throw new ApiError(400, "Transcript too short for extraction");
        }

        const response = await model.generateContent({
            systemInstruction: {
                parts: [{ text: SYSTEM_PROMPT }]
            },
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: `Extract action items from the following meeting transcript:\n\n${transcriptText}`
                        }
                    ]
                }
            ],
            generationConfig: {
                temperature: 0.2,
                responseMimeType: "application/json"
            }
        });

        let rawText = response.response.text().trim();

        rawText = rawText.replace(/```json|```/g, "").trim();

        let parsed;

        try {
            parsed = JSON.parse(rawText);
        } catch (err) {
            console.error("Gemini raw response:", rawText);
            throw new ApiError(500, "Gemini returned invalid JSON");
        }

        const cleaned = parsed
            .map((item) => ({
                task:
                    typeof item.task === "string"
                        ? item.task.trim()
                        : "",
                owner:
                    item.owner && typeof item.owner === "string"
                        ? item.owner.trim()
                        : null,
                dueDate:
                    item.dueDate && !isNaN(new Date(item.dueDate))
                        ? new Date(item.dueDate)
                        : null,
            }))
            .filter((item) => item.task.length > 0);

        return cleaned;
    }
    catch (error) {
        if (error instanceof ApiError) throw error;

        console.error("Gemini extraction error:", error.message);
        throw new ApiError(500, "Failed to extract action items using Gemini");
    }
};

exports.healthCheck = async () => {
    try {
        const result = await model.generateContent({
            contents: [
                {
                    role: "user",
                    parts: [{ text: "Reply with the word OK only." }]
                }
            ],
            generationConfig: {
                temperature: 0,
                maxOutputTokens: 5,
            },
        });

        const response = await result.response;
        const text = response.text().trim();

        return text.length > 0;
    }
    catch (error) {
        console.error("Gemini health check failed:", error.message);
        return false;
    }
}