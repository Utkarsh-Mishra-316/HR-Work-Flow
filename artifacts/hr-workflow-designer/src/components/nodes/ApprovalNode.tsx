import { Handle, Position, type NodeProps } from "@xyflow/react";
import { CheckCheck, Clock } from "lucide-react";
import { NodeShell } from "./NodeShell";
import type { ApprovalNodeData } from "@/flow/types";
import { useWorkflowStore } from "@/flow/useWorkflowStore";

export function ApprovalNode({ id, data, selected }: NodeProps & { data: ApprovalNodeData }) {
  const activeNodeId = useWorkflowStore((s) => s.activeNodeId);
  return (
    <NodeShell
      icon={CheckCheck}
      title="Approval"
      label={data.label}
      accent="hsl(260 50% 55%)"
      selected={selected}
      active={activeNodeId === id}
      footer={
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3 w-3" />
          SLA {data.slaHours}h
        </span>
      }
    >
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Approver</span>
        <span className="font-medium">{data.approverRole}</span>
      </div>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: "hsl(260 50% 55%)", borderColor: "hsl(260 50% 55%)" }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: "hsl(260 50% 55%)", borderColor: "hsl(260 50% 55%)" }}
      />
    </NodeShell>
  );
}
