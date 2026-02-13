import { Check, Pencil, Trash2, X } from "lucide-react";
import { useState } from "react";
import axios from "axios";

const ActionItemCard = ({ item, onToggle, onDelete, onEdit }) => {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(item.task);
  const [editOwner, setEditOwner] = useState(item.owner || "");
  const [editDueDate, setEditDueDate] = useState(
    item.dueDate ? item.dueDate.split("T")[0] : ""
  );

  const handleSave = () => {
    onEdit(item._id, {
      task: editTitle,
      owner: editOwner,
      dueDate: editDueDate,
    });
    setEditing(false);
  };

  const handleToggle = async () => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/actions/${item._id}/status`,
        {
          status: item.status === "done" ? "open" : "done",
        }
      );

      onToggle(item._id);
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  return (
    <div
      className={`group animate-fade-in rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/30 hover:glow-primary ${item.status === "done" ? "opacity-60" : ""
        }`}
    >
      <div className="flex items-start gap-3">
        {/* Toggle Button */}
        {
          !editing && (
            <button
              onClick={handleToggle}
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${item.status === "done"
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border hover:border-primary/50"
                }`}
            >
              {item.status === "done" && <Check className="h-3 w-3" />}
            </button>
          )
        }

        <div className="min-w-0 flex-1">
          {editing ? (
            <div className="flex flex-col gap-2">
              {/* Task */}
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Task"
                className="rounded-md border border-border bg-input px-2 py-1 text-sm text-foreground outline-none focus:border-primary"
                autoFocus
              />

              {/* Owner */}
              <input
                value={editOwner}
                onChange={(e) => setEditOwner(e.target.value)}
                placeholder="Owner"
                className="rounded-md border border-border bg-input px-2 py-1 text-sm text-foreground outline-none focus:border-primary"
              />

              {/* Due Date */}
              <input
                type="date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                className="rounded-md border border-border bg-input px-2 py-1 text-sm text-foreground outline-none focus:border-primary"
              />

              {/* Save / Cancel */}
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="text-primary hover:text-primary/80"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Task Text */}
              <p
                className={`text-sm font-medium ${item.status === "done"
                  ? "line-through text-muted-foreground"
                  : "text-foreground"
                  }`}
              >
                {item.task}
              </p>

              {/* Meta Info */}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {item.owner && (
                  <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] text-muted-foreground">
                    {item.owner}
                  </span>
                )}

                {item.dueDate && (
                  <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] text-muted-foreground">
                    {new Date(item.dueDate).toLocaleDateString()}
                  </span>
                )}

                {item.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Edit / Delete Buttons */}
        {!editing && (
          <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            {item.status !== "done" && (
              <button
                onClick={() => {
                  setEditing(true);
                  setEditTitle(item.task);
                  setEditOwner(item.owner || "");
                  setEditDueDate(
                    item.dueDate ? item.dueDate.split("T")[0] : ""
                  );
                }}
                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            )}

            <button
              onClick={() => onDelete(item._id)}
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActionItemCard;
