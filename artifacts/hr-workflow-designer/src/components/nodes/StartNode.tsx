import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Play } from "lucide-react";
import { NodeShell } from "./NodeShell";
import type { StartNodeData } from "@/flow/types";
import { useWorkflowStore } from "@/flow/useWorkflowStore";

export function StartNode({ id, data, selected }: NodeProps & { data: StartNodeData }) {
  const activeNodeId = useWorkflowStore((s) => s.activeNodeId);
  return (
    <NodeShell
      icon={Play}
      title="Start"
      label={data.label}
      accent="hsl(184 60% 38%)"
      selected={selected}
      active={activeNodeId === id}
      width={200}
      footer="Workflow entry point"
    >
      <div className="text-muted-foreground">Begins the workflow.</div>
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: "hsl(184 60% 38%)", borderColor: "hsl(184 60% 38%)" }}
      />
    </NodeShell>
  );
}
