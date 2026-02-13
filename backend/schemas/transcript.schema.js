const { z } = require("zod");

const transcriptSchema = z.object({
  text: z
    .string()
    .trim()
    .min(10, "Transcript must be at least 10 characters"),
   provider: z.string().optional(), 
});

module.exports = { transcriptSchema };
