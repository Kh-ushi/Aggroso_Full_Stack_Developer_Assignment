import { Check, Pencil, Trash2, X } from "lucide-react";
import { useState } from "react";

const ActionItemCard = ({ item, onToggle, onDelete, onEdit }) => {
  console.log("Item",item);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(item.title);

  const handleSave = () => {
    onEdit(item.id, { title: editTitle });
    setEditing(false);
  };

  return (
    <div
      className={`group animate-fade-in rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/30 hover:glow-primary ${
        item.done ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggle(item.id)}
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
            item.done
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border hover:border-primary/50"
          }`}
        >
          {item.done && <Check className="h-3 w-3" />}
        </button>
        <div className="min-w-0 flex-1">
          {editing ? (
            <div className="flex items-center gap-2">
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="flex-1 rounded-md border border-border bg-input px-2 py-1 text-sm text-foreground outline-none focus:border-primary"
                autoFocus
              />
              <button onClick={handleSave} className="text-primary hover:text-primary/80">
                <Check className="h-4 w-4" />
              </button>
              <button onClick={() => setEditing(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <p className={`text-sm font-medium ${item.done ? "line-through text-muted-foreground" : "text-foreground"}`}>
              {item.task}
            </p>
          )}
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
        </div>
        <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => { setEditing(true); setEditTitle(item.title); }}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionItemCard;
