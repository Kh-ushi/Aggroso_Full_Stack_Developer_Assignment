import { useState, useCallback, useEffect } from "react";
import { Plus, Sparkles, AlertCircle, Inbox, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import HistorySidebar from "@/components/HistorySidebar";
import ActionItemCard from "@/components/ActionItemCard";
import axios from "axios";
// import { set } from "date-fns";


const Workspace = () => {
  const [transcript, setTranscript] = useState("");
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState(null);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchActionItems = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/actions`);
      console.log("Fetched action items:", response.data.data);
      setItems(response.data.data);
    }
    catch (error) {
      console.error("Error fetching action items:", error);
      setError("Failed to load action items. Please try again later.");
    }
  }


  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/transcripts`);
      // setHistory(response.data.data);
      const historyData = response.data.data.map((entry) => {
        return {
          id: entry._id,
          title: entry.text.slice(0, 40) + "…",
          preview: entry.text.slice(0, 80),
          timestamp: new Date(entry.createdAt).toLocaleString(),
          transcript: entry.text,
          items: entry.items || [],
        }
      })
      setHistory(historyData);
    }
    catch (error) {
      console.error("Error fetching history:", error);
      setError("Failed to load history. Please try again later.");
    }
  };


  const fetchTranscriptById = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/transcripts/${selectedHistoryId}`);
      // console.log("Fetched transcript by ID:", response.data.data);
      const entry = response.data.data;
      setTranscript(entry.text);
      setItems(entry.actionItems || []);
    }
    catch (error) {
      console.error("Error fetching transcript by ID:", error);
      setError("Failed to load selected transcript. Please try again later.");
    }
  }

  useEffect(() => {
    fetchHistory();
    fetchActionItems();
  }, []);



  useEffect(() => {

    if (!selectedHistoryId) {
      fetchActionItems();
      return;
    }
    fetchTranscriptById();
  }, [selectedHistoryId]);


  const generateActionItems = async (transcript: string) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/transcripts`, { text: transcript });
      return response.data.data;
    }
    catch (error) {
      console.error("Error generating action items:", error);
      setError(error.response.data?.error || error.response.data?.message || "server_error")
    }
  }

  const handleGenerate = useCallback(() => {
    setError(null);
    if (!transcript.trim()) {
      setError("Please paste a transcript before generating action items.");
      return;
    }
    setLoading(true);
    setTimeout(async () => {
      const result = await generateActionItems(transcript);
      if (result.error === "no_items") {
        setError("No action items could be extracted. Try a longer transcript.");
        setItems([]);
      } else if (result.actionItems) {
        setItems(result.actionItems);
        const entry = {
          id: result.transcriptId,
          title: transcript.slice(0, 40) + "…",
          preview: transcript.slice(0, 80),
          timestamp: new Date().toLocaleString(),
          transcript,
          items: result.actionItems || [],
        };
        setHistory((prev) => [entry, ...prev].slice(0, 5));
        setSelectedHistoryId(result.transcriptId);
      }
      setLoading(false);
    }, 800);
  }, [transcript]);


  const handleToggle = (id:string) =>
    setItems((prev) => prev.map((item) => (item._id === id ? { ...item, status: item.status === "done" ? "open" : "done" } : item)));

  const handleDelete = async (id:string) => {
    try{
    await axios.delete(`${BACKEND_URL}/actions/${id}`);  
    setItems((prev) => prev.filter((item) => item._id !== id));
    }
    catch(error){
      console.error("Error deleting item:", error);
      setError("Failed to delete item. Please try again.");
    }
  }

  const handleEdit = async(id:string, changes:Partial<Record<string, any>>) =>{
    console.log("Editing item:", id, changes);
    try{
      const response=await axios.patch(`${BACKEND_URL}/actions/${id}`, changes);
      // console.log("Edit response:", response.data);
      setItems((prev) => prev.map((item) => (item._id === id ? { ...item, ...changes } : item)));
    }
    catch(error){
      console.error("Error editing item:", error);
      setError("Failed to edit item. Please try again.");
    }
    }

  const handleSelectHistory = (entry) => {

    if (!entry) {
      setSelectedHistoryId(null);
      setTranscript("");
      setError(null);
      return;
    }

    console.log("Selected history entry:", entry);
    setSelectedHistoryId(entry.id);
    setTranscript(entry.transcript);
    setItems(entry.actionItems || []);
    setError(null);
  };


  const filtered = items.filter((item) => {
    if (filter === "open") return item.status === "open";
    if (filter === "done") return item.status === "done";
    return true;
  });



  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      <HistorySidebar history={history} onSelect={handleSelectHistory} selectedId={selectedHistoryId} />
      <main className="flex flex-1 flex-col overflow-y-auto">
                {/* Mobile history trigger */}
        <div className="flex items-center border-b border-border px-4 py-2 lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                <Menu className="h-4 w-4" />
                Recent Transcripts
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0 bg-card">
              <SheetTitle className="sr-only">Recent Transcripts</SheetTitle>
              <HistorySidebar history={history} onSelect={handleSelectHistory} selectedId={selectedHistoryId} mobile />
            </SheetContent>
          </Sheet>
        </div>
        <div className="mx-auto w-full max-w-3xl p-6">
          {/* Transcript Input */}
          <div className="mb-6">
            <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Meeting Transcript
            </label>
            <textarea
              value={transcript}
              onChange={(e) => { setTranscript(e.target.value); setError(null); }}
              placeholder="Paste your meeting transcript here..."
              rows={6}
              className="w-full resize-none rounded-lg border border-border bg-input p-4 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-colors focus:border-primary"
            />
            {error && (
              <div className="mt-2 flex items-center gap-2 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive animate-fade-in">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50 glow-primary"
            >
              <Sparkles className="h-4 w-4" />
              {loading ? "Generating…" : "Generate Action Items"}
            </button>
          </div>

          {/* Filter & Add */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex gap-1 rounded-lg border border-border p-0.5">
              {["all", "open", "done"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-md px-3 py-1 text-xs font-medium capitalize transition-colors ${filter === f ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Action Items */}
          <div className="flex flex-col gap-3 max-h-[45vh] overflow-y-auto">
            {filtered.length === 0 && (
              <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border py-16 text-center animate-fade-in">
                <Inbox className="h-10 w-10 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">
                  {items.length === 0
                    ? "No action items yet. Paste a transcript and generate."
                    : "No items match this filter."}
                </p>
              </div>
            )}
            {filtered.map((item) => (
              <ActionItemCard
                key={item._id}
                item={item}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Workspace;
