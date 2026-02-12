import { ArrowRight, Clipboard, ListChecks, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const steps = [
  {
    icon: Clipboard,
    title: "Paste Transcript",
    description: "Drop in your meeting transcript or notes",
  },
  {
    icon: Sparkles,
    title: "Generate Action Items",
    description: "AI extracts tasks, owners, and deadlines",
  },
  {
    icon: ListChecks,
    title: "Track & Complete",
    description: "Edit, assign, and mark tasks as done",
  },
];

const Index = () => {
  return (
    <div className="gradient-hero flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-6">
      <div className="mx-auto max-w-3xl animate-fade-in text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-medium text-muted-foreground">AI-Powered Meeting Intelligence</span>
        </div>

        <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Turn meetings into{" "}
          <span className="text-primary">action items</span>
        </h1>

        <p className="mx-auto mb-10 max-w-xl text-base text-muted-foreground sm:text-lg">
          Paste your meeting transcript, extract tasks automatically, and track everything in one clean workspace.
        </p>

        <Link
          to="/workspace"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 glow-primary"
        >
          Start Tracking
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mx-auto mt-20 grid max-w-4xl gap-6 sm:grid-cols-3">
        {steps.map((step, i) => (
          <div
            key={step.title}
            className="animate-fade-in rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/20"
            style={{ animationDelay: `${i * 100 + 200}ms`, animationFillMode: "both" }}
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <step.icon className="h-5 w-5 text-primary" />
            </div>
            <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Step {i + 1}
            </div>
            <h3 className="mb-1 text-base font-semibold text-foreground">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Index;
