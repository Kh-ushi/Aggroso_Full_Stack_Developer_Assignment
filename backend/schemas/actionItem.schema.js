const { z } = require("zod");
const { tr } = require("zod/v4/locales");

const actionItemSchema =
  z.object({
    transcriptId: z.string().min(1, "Transcript ID is required"),
    task: z.string().min(1, "Task is required"),
    owner: z.string().optional(),
    dueDate: z.string().optional(),
  })
;

const updateActionItemSchema = z.object({
  task: z.string().min(1, "Task is required").optional(),
  owner: z.string().optional(),
  dueDate: z.string().optional(),
});

module.exports = { actionItemSchema, updateActionItemSchema };
