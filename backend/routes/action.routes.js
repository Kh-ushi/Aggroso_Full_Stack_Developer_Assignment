const express = require("express");
const router = express.Router();

const {actionItemSchema,updateActionItemSchema}=require("../schemas/actionItem.schema");
const {validate}=require("../middleware/validate");

const {
  getActionItems,
  updateActionItem,
  deleteActionItem,
  toggleStatus,
  createActionItem,
} = require("../controllers/action.controller");

router.get("/", getActionItems);
router.post("/", validate(actionItemSchema), createActionItem);
router.patch("/:id", validate(updateActionItemSchema), updateActionItem);
router.patch("/:id/status", toggleStatus);
router.delete("/:id", deleteActionItem);

module.exports = router;
