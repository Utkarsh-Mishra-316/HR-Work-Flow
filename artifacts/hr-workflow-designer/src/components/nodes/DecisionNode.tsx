import { Handle, Position, type NodeProps } from "@xyflow/react";
import { GitBranch } from "lucide-react";
import { NodeShell } from "./NodeShell";
import type { DecisionNodeData } from "@/flow/types";
import { useWorkflowStore } from "@/flow/useWorkflowStore";

const APPROVE = "hsl(142 55% 42%)";
const REJECT = "hsl(0 72% 50%)";

export function DecisionNode({ id, data, selected }: NodeProps & { data: DecisionNodeData }) {
  const activeNodeId = useWorkflowStore((s) => s.activeNodeId);
  const accent = "hsl(28 80% 55%)";
  return (
    <NodeShell
      icon={GitBranch}
      title="Decision"
      label={data.label}
      accent={accent}
      selected={selected}
      active={activeNodeId === id}
      footer="Branches to Approve / Reject"
    >
      <div className="space-y-1">
        <div className="text-muted-foreground">Condition</div>
        <code className="block truncate rounded bg-muted px-1.5 py-0.5 font-mono text-[11px]">
          {data.condition || "—"}
        </code>
      </div>
      <div className="mt-2 flex justify-between text-[10px] font-semibold uppercase tracking-wider">
        <span style={{ color: APPROVE }}>↗ Approve</span>
        <span style={{ color: REJECT }}>↘ Reject</span>
      </div>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: accent, borderColor: accent }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="approve"
        style={{ top: "35%", background: APPROVE, borderColor: APPROVE }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="reject"
        style={{ top: "75%", background: REJECT, borderColor: REJECT }}
      />
    </NodeShell>
  );
}
