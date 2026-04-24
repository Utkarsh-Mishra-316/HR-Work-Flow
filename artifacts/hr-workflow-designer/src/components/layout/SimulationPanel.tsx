import { useEffect, useRef } from "react";
import {
  Activity,
  CheckCircle2,
  GitBranch,
  AlertCircle,
  Circle,
  RefreshCw,
} from "lucide-react";
import { useWorkflowStore } from "@/flow/useWorkflowStore";
import type { SimulationLogEntry } from "@/flow/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SimulationPanelProps {
  open: boolean;
  onClose: () => void;
  onRun: () => void;
  onStop: () => void;
}

export function SimulationPanel({ open, onClose, onRun, onStop }: SimulationPanelProps) {
  const log = useWorkflowStore((s) => s.simulationLog);
  const isSimulating = useWorkflowStore((s) => s.isSimulating);
  const clearLog = useWorkflowStore((s) => s.clearLog);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [log.length]);

  if (!open) return null;

  return (
    <div className="flex h-72 flex-col border-t bg-card">
      <div className="flex items-center justify-between gap-3 border-b px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-accent text-accent-foreground">
            <Activity className="h-3.5 w-3.5" />
          </div>
          <div>
            <div className="text-sm font-semibold leading-tight">Simulation Log</div>
            <div className="text-[11px] text-muted-foreground leading-tight">
              {log.length} {log.length === 1 ? "step" : "steps"}
              {isSimulating ? " · running" : ""}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {isSimulating ? (
            <Button size="sm" variant="destructive" onClick={onStop} data-testid="button-sim-stop">
              Stop
            </Button>
          ) : (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  clearLog();
                  onRun();
                }}
                data-testid="button-sim-rerun"
                className="gap-1.5"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Re-run
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={clearLog}
                data-testid="button-sim-clear"
              >
                Clear log
              </Button>
            </>
          )}
          <Button size="sm" variant="ghost" onClick={onClose} data-testid="button-sim-close">
            Close
          </Button>
        </div>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <ol className="space-y-1.5 p-3">
          {log.length === 0 ? (
            <li className="px-2 py-6 text-center text-xs text-muted-foreground">
              Run the simulation to see step-by-step execution.
            </li>
          ) : (
            log.map((entry, idx) => <LogRow key={entry.id} entry={entry} index={idx + 1} />)
          )}
        </ol>
      </div>
    </div>
  );
}

function LogRow({ entry, index }: { entry: SimulationLogEntry; index: number }) {
  const Icon =
    entry.status === "complete"
      ? CheckCircle2
      : entry.status === "branch"
        ? GitBranch
        : entry.status === "error"
          ? AlertCircle
          : Circle;
  const color =
    entry.status === "complete"
      ? "text-chart-3"
      : entry.status === "branch"
        ? "text-accent"
        : entry.status === "error"
          ? "text-destructive"
          : "text-primary";
  const time = new Date(entry.timestamp);
  return (
    <li
      className="flex animate-in fade-in slide-in-from-bottom-1 gap-3 rounded-lg border bg-background px-3 py-2 duration-200"
      data-testid={`log-row-${entry.id}`}
    >
      <div className="flex flex-col items-center pt-0.5">
        <span className="text-[10px] font-mono text-muted-foreground">{index}</span>
        <Icon className={cn("mt-1 h-4 w-4", color, entry.status === "running" && "animate-pulse")} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="truncate text-sm font-semibold">{entry.label}</span>
          <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
            {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </span>
        </div>
        <div className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{entry.message}</div>
      </div>
    </li>
  );
}
