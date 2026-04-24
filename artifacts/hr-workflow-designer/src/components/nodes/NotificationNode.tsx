import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Bell, Mail, MessageSquare, Phone } from "lucide-react";
import { NodeShell } from "./NodeShell";
import type { NotificationNodeData } from "@/flow/types";
import { useWorkflowStore } from "@/flow/useWorkflowStore";

const channelIcon = {
  Email: Mail,
  Slack: MessageSquare,
  SMS: Phone,
} as const;

export function NotificationNode({
  id,
  data,
  selected,
}: NodeProps & { data: NotificationNodeData }) {
  const activeNodeId = useWorkflowStore((s) => s.activeNodeId);
  const accent = "hsl(28 80% 55%)";
  const ChannelIcon = channelIcon[data.channel] ?? Bell;
  return (
    <NodeShell
      icon={Bell}
      title="Notification"
      label={data.label}
      accent={accent}
      selected={selected}
      active={activeNodeId === id}
      footer={
        <span className="inline-flex items-center gap-1">
          <ChannelIcon className="h-3 w-3" />
          via {data.channel}
        </span>
      }
    >
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">To</span>
          <span className="truncate font-medium" title={data.recipient}>
            {data.recipient || "—"}
          </span>
        </div>
        <div className="line-clamp-2 text-muted-foreground italic">
          "{data.message || "no message"}"
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
