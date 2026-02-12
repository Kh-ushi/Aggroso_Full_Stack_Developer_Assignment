import { useEffect, useState } from "react";
import { Server, Database, Brain } from "lucide-react";

const services = [
  { key: "backend", label: "Backend API", icon: Server, healthyLabel: "Healthy", errorLabel: "Down" },
  { key: "database", label: "Database", icon: Database, healthyLabel: "Connected", errorLabel: "Error" },
  { key: "llm", label: "LLM Service", icon: Brain, healthyLabel: "Connected", errorLabel: "Error" },
];

const mockCheck = () =>
  new Promise((resolve) =>
    setTimeout(() => {
      resolve({
        backend: Math.random() > 0.15,
        database: Math.random() > 0.1,
        llm: Math.random() > 0.2,
      });
    }, 600)
  );

const Status = () => {
  const [statuses, setStatuses] = useState(null);
  const [checking, setChecking] = useState(true);

  const check = () => {
    setChecking(true);
    mockCheck().then((result) => {
      setStatuses(result);
      setChecking(false);
    });
  };

  useEffect(() => { check(); }, []);

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">System Status</h1>
          <p className="mt-1 text-sm text-muted-foreground">Real-time health of connected services</p>
        </div>
        <button
          onClick={check}
          disabled={checking}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-50"
        >
          {checking ? "Checking…" : "Refresh"}
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {services.map(({ key, label, icon: Icon, healthyLabel, errorLabel }, i) => {
          const healthy = statuses?.[key];
          return (
            <div
              key={key}
              className="flex items-center justify-between rounded-xl border border-border bg-card p-5 animate-fade-in"
              style={{ animationDelay: `${i * 80}ms`, animationFillMode: "both" }}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <span className="text-sm font-medium text-foreground">{label}</span>
              </div>
              {checking ? (
                <div className="h-5 w-20 animate-pulse rounded-full bg-accent" />
              ) : (
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2.5 w-2.5 rounded-full ${healthy ? "bg-success" : "bg-destructive"}`}
                  />
                  <span className={`text-sm font-medium ${healthy ? "text-success" : "text-destructive"}`}>
                    {healthy ? healthyLabel : errorLabel}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Status;
