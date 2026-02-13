import { Clock, FileText } from "lucide-react";

const HistorySidebar = ({ history, onSelect, selectedId,mobile=false }) => {
  return (
    <aside className={`${mobile ? "block w-full" : "hidden lg:block w-72"} shrink-0 border-r border-border bg-card`}>
      <div className="flex h-12 items-center gap-2 border-b border-border px-4">
        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Recent Transcripts
        </span>
      </div>
      <div className="flex flex-col gap-1 p-2">
        <button
          onClick={() => onSelect(null)}
          className={`group flex flex-col gap-1 rounded-lg px-3 py-2.5 text-left transition-colors ${
            selectedId === null
              ? "bg-accent text-foreground"
              : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
          }`}
        >
          <span className="text-sm font-medium">All Action Items</span>
          <span className="text-xs text-muted-foreground">
            View items from all transcripts
          </span>
        </button>

        {history.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
            <FileText className="h-8 w-8 text-muted-foreground/40" />
            <p className="text-xs text-muted-foreground">No transcripts yet</p>
          </div>
        ) : (
          
          history.map((entry) => (
            <button
              key={entry.id}
              onClick={() => onSelect(entry)}
              className={`group flex flex-col gap-1 rounded-lg px-3 py-2.5 text-left transition-colors ${
                selectedId === entry.id
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
              }`}
            >
              <span className="truncate text-sm font-medium">{entry.title}</span>
              <span className="truncate text-xs text-muted-foreground">{entry.preview}</span>
              <span className="text-[10px] text-muted-foreground/70">{entry.timestamp}</span>
            </button>
          ))
        )}
      </div>
    </aside>
  );
};

export default HistorySidebar;
