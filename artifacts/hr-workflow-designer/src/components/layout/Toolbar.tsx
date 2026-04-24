import { useRef } from "react";
import {
  Download,
  Upload,
  Trash2,
  Sparkles,
  Play,
  Square,
  Workflow,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useWorkflowStore } from "@/flow/useWorkflowStore";
import { onboardingExample } from "@/flow/exampleWorkflow";
import {
  downloadWorkflowJson,
  parseWorkflowJson,
  readFileAsText,
  serializeWorkflow,
} from "@/flow/workflowIO";

interface ToolbarProps {
  onRun: () => void;
  onStop: () => void;
}

export function Toolbar({ onRun, onStop }: ToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const workflowName = useWorkflowStore((s) => s.workflowName);
  const setWorkflowName = useWorkflowStore((s) => s.setWorkflowName);
  const loadWorkflow = useWorkflowStore((s) => s.loadWorkflow);
  const clearWorkflow = useWorkflowStore((s) => s.clearWorkflow);
  const isSimulating = useWorkflowStore((s) => s.isSimulating);

  const handleSave = () => {
    downloadWorkflowJson(serializeWorkflow(workflowName, nodes, edges));
  };

  const handleLoadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await readFileAsText(file);
      const doc = parseWorkflowJson(text);
      loadWorkflow(doc);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load file";
      alert(`Could not load workflow: ${msg}`);
    } finally {
      e.target.value = "";
    }
  };

  const handleLoadExample = () => {
    loadWorkflow(onboardingExample);
  };

  return (
    <header className="flex h-14 items-center gap-3 border-b bg-card px-4">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Workflow className="h-4 w-4" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            HR Workflow Designer
          </span>
          <Input
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="h-6 border-0 bg-transparent p-0 text-sm font-semibold focus-visible:ring-0 focus-visible:ring-offset-0"
            data-testid="input-workflow-name"
          />
        </div>
      </div>

      <Separator orientation="vertical" className="h-8" />

      <div className="flex items-center gap-1.5">
        <Button
          size="sm"
          variant="ghost"
          onClick={handleSave}
          data-testid="button-save"
          className="gap-1.5"
        >
          <Download className="h-4 w-4" />
          Save
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleLoadClick}
          data-testid="button-load"
          className="gap-1.5"
        >
          <Upload className="h-4 w-4" />
          Load
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={handleFileChange}
          data-testid="input-file"
        />
        <Button
          size="sm"
          variant="ghost"
          onClick={handleLoadExample}
          data-testid="button-load-example"
          className="gap-1.5"
        >
          <Sparkles className="h-4 w-4" />
          Example
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="gap-1.5 text-destructive hover:text-destructive"
              data-testid="button-clear"
            >
              <Trash2 className="h-4 w-4" />
              Clear
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear the canvas?</AlertDialogTitle>
              <AlertDialogDescription>
                This removes every node and edge from the current workflow. This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={clearWorkflow}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Clear canvas
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="flex-1" />

      <div className="text-xs text-muted-foreground">
        {nodes.length} {nodes.length === 1 ? "node" : "nodes"} ·{" "}
        {edges.length} {edges.length === 1 ? "edge" : "edges"}
      </div>

      {isSimulating ? (
        <Button
          size="sm"
          variant="destructive"
          onClick={onStop}
          data-testid="button-stop-simulation"
          className="gap-1.5"
        >
          <Square className="h-4 w-4 fill-current" />
          Stop
        </Button>
      ) : (
        <Button
          size="sm"
          onClick={onRun}
          data-testid="button-run-simulation"
          className="gap-1.5"
        >
          <Play className="h-4 w-4 fill-current" />
          Run Simulation
        </Button>
      )}
    </header>
  );
}
