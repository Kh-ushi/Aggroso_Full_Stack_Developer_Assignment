const mongoose = require("mongoose");

const ActionItem = require("../models/ActionItem");

exports.updateActionItem = async (req, res, next) => {
    try {

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new ApiError(400, "Invalid action item ID");
        }

        const { task, owner, dueDate } = req.body;

        const actionItem = await ActionItem.findById(id);

        if (!actionItem) {
            throw new ApiError(404, "Action item not found");
        }

        if (task !== undefined) actionItem.task = task;
        if (owner !== undefined) actionItem.owner = owner;
        if (dueDate !== undefined) {
            actionItem.dueDate = dueDate ? new Date(dueDate) : null;
        }

        await actionItem.save();
        res.status(200).json({ success: true, data: actionItem, })
    }
    catch (error) {
        next(error);
    }
};


exports.toggleStatus = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new ApiError(400, "Invalid action item ID");
        }

        const actionItem = await ActionItem.findById(id);

        if (!actionItem) {
            throw new ApiError(404, "Action item not found");
        }

        actionItem.status =
            actionItem.status === "open" ? "done" : "open";

        await actionItem.save();

        res.status(200).json({
            success: true,
            data: actionItem,
        });

    } catch (error) {
        next(error);
    }
};


exports.deleteActionItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid action item ID");
    }

    const actionItem = await ActionItem.findByIdAndDelete(id);

    if (!actionItem) {
      throw new ApiError(404, "Action item not found");
    }

    res.status(200).json({
      success: true,
      message: "Action item deleted successfully",
    });

  } catch (error) {
    next(error);
  }
};


exports.createActionItem = async (req, res, next) => {
  try {
    const { transcriptId, task, owner, dueDate } = req.body;

    if (!mongoose.Types.ObjectId.isValid(transcriptId)) {
      throw new ApiError(400, "Invalid transcript ID");
    }

    if (!task || task.trim().length === 0) {
      throw new ApiError(400, "Task cannot be empty");
    }

    const newItem = await ActionItem.create({
      transcriptId,
      task: task.trim(),
      owner: owner || null,
      dueDate: dueDate ? new Date(dueDate) : null,
    });

    res.status(201).json({
      success: true,
      data: newItem,
    });

  } catch (error) {
    next(error);
  }
};
