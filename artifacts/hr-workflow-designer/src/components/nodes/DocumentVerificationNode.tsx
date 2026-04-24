import { Handle, Position, type NodeProps } from "@xyflow/react";
import { FileCheck2 } from "lucide-react";
import { NodeShell } from "./NodeShell";
import type { DocumentVerificationNodeData } from "@/flow/types";
import { useWorkflowStore } from "@/flow/useWorkflowStore";

export function DocumentVerificationNode({
  id,
  data,
  selected,
}: NodeProps & { data: DocumentVerificationNodeData }) {
  const activeNodeId = useWorkflowStore((s) => s.activeNodeId);
  const accent = "hsl(184 60% 38%)";
  return (
    <NodeShell
      icon={FileCheck2}
      title="Document Verification"
      label={data.label}
      accent={accent}
      selected={selected}
      active={activeNodeId === id}
      footer={data.required ? "Required step" : "Optional step"}
    >
      <div className="space-y-1">
        <div className="text-muted-foreground">Documents</div>
        <div className="flex flex-wrap gap-1">
          {data.documents.length === 0 ? (
            <span className="text-muted-foreground italic">none configured</span>
          ) : (
            data.documents.map((doc) => (
              <span
                key={doc}
                className="inline-flex items-center rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-secondary-foreground"
              >
                {doc}
              </span>
            ))
          )}
        </div>
      </div>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: accent, borderColor: accent }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: accent, borderColor: accent }}
      />
    </NodeShell>
  );
}
