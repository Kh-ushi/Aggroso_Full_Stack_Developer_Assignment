const express = require("express");
const router = express.Router();

const {
  getActionItems,
  updateActionItem,
  deleteActionItem,
  toggleStatus,
  createActionItem,
} = require("../controllers/action.controller");

router.get("/", getActionItems);
router.post("/", createActionItem);
router.patch("/:id", updateActionItem);
router.patch("/:id/status", toggleStatus);
router.delete("/:id", deleteActionItem);

module.exports = router;
