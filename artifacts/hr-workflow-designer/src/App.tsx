import { useCallback, useRef, useState } from "react";
import { Toolbar } from "@/components/layout/Toolbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { PropertiesPanel } from "@/components/layout/PropertiesPanel";
import { SimulationPanel } from "@/components/layout/SimulationPanel";
import { WorkflowCanvas } from "@/flow/WorkflowCanvas";
import { useWorkflowStore } from "@/flow/useWorkflowStore";
import { runSimulation } from "@/flow/simulator";

function App() {
  const [simOpen, setSimOpen] = useState(false);
  const stopRef = useRef(false);

  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const setActiveNode = useWorkflowStore((s) => s.setActiveNode);
  const appendLog = useWorkflowStore((s) => s.appendLog);
  const clearLog = useWorkflowStore((s) => s.clearLog);
  const setIsSimulating = useWorkflowStore((s) => s.setIsSimulating);
  const isSimulating = useWorkflowStore((s) => s.isSimulating);

  const handleRun = useCallback(async () => {
    if (isSimulating) return;
    stopRef.current = false;
    clearLog();
    setIsSimulating(true);
    setSimOpen(true);
    try {
      await runSimulation(nodes, edges, {
        onActiveNode: (id) => setActiveNode(id),
        onLog: (entry) => appendLog(entry),
        shouldStop: () => stopRef.current,
      });
    } finally {
      setIsSimulating(false);
      setActiveNode(null);
    }
  }, [nodes, edges, isSimulating, clearLog, setIsSimulating, setActiveNode, appendLog]);

  const handleStop = useCallback(() => {
    stopRef.current = true;
  }, []);

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background">
      <Toolbar onRun={handleRun} onStop={handleStop} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex flex-1 flex-col overflow-hidden">
          <div className="relative flex-1">
            <WorkflowCanvas />
          </div>
          <SimulationPanel
            open={simOpen}
            onClose={() => setSimOpen(false)}
            onRun={handleRun}
            onStop={handleStop}
          />
        </main>
        <PropertiesPanel />
      </div>
    </div>
  );
}

export default App;
