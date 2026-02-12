const ApiError = require("../../utils/ApiError");
const {generateActionItemsWithGemini}="./gemini.service";

exports.extractActionItems = async (transcriptText, provider = "gemini") => {
  switch (provider) {
    case "gemini":
      return generateActionItemsWithGemini(transcriptText);
      
    default:
      throw new ApiError(400, `Unsupported LLM provider: ${provider}`);
  }
};