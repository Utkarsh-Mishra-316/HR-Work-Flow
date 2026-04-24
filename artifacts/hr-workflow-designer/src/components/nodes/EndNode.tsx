import { Handle, Position, type NodeProps } from "@xyflow/react";
import { CircleCheck, CircleX, CircleSlash } from "lucide-react";
import { NodeShell } from "./NodeShell";
import type { EndNodeData } from "@/flow/types";
import { useWorkflowStore } from "@/flow/useWorkflowStore";

const outcomeMap = {
  Success: { icon: CircleCheck, color: "hsl(142 55% 42%)" },
  Rejected: { icon: CircleX, color: "hsl(0 72% 50%)" },
  Cancelled: { icon: CircleSlash, color: "hsl(200 12% 50%)" },
} as const;

export function EndNode({ id, data, selected }: NodeProps & { data: EndNodeData }) {
  const activeNodeId = useWorkflowStore((s) => s.activeNodeId);
  const cfg = outcomeMap[data.outcome] ?? outcomeMap.Success;
  return (
    <NodeShell
      icon={cfg.icon}
      title="End"
      label={data.label}
      accent={cfg.color}
      selected={selected}
      active={activeNodeId === id}
      width={200}
      footer={`Outcome: ${data.outcome}`}
    >
      <div className="text-muted-foreground">Workflow terminates here.</div>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: cfg.color, borderColor: cfg.color }}
      />
    </NodeShell>
  );
}
