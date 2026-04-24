import {
  Play,
  CheckCheck,
  FileCheck2,
  GitBranch,
  Bell,
  CircleCheck,
  type LucideIcon,
} from "lucide-react";
import type {
  NodeKind,
  WorkflowNodeData,
  ApprovalNodeData,
  DocumentVerificationNodeData,
  DecisionNodeData,
  NotificationNodeData,
  EndNodeData,
  StartNodeData,
} from "@/flow/types";

export interface PaletteItem {
  kind: NodeKind;
  title: string;
  description: string;
  icon: LucideIcon;
  accent: string;
  defaults: WorkflowNodeData;
}

export const palette: PaletteItem[] = [
  {
    kind: "start",
    title: "Start",
    description: "Workflow entry point",
    icon: Play,
    accent: "hsl(184 60% 38%)",
    defaults: { label: "Start" } satisfies StartNodeData,
  },
  {
    kind: "approval",
    title: "Approval Step",
    description: "Requires sign-off from a role",
    icon: CheckCheck,
    accent: "hsl(260 50% 55%)",
    defaults: {
      label: "Manager Approval",
      approverRole: "Manager",
      slaHours: 24,
    } satisfies ApprovalNodeData,
  },
  {
    kind: "documentVerification",
    title: "Document Verification",
    description: "Validate required documents",
    icon: FileCheck2,
    accent: "hsl(184 60% 38%)",
    defaults: {
      label: "Verify Documents",
      documents: ["ID"],
      required: true,
    } satisfies DocumentVerificationNodeData,
  },
  {
    kind: "decision",
    title: "Decision",
    description: "Branch on approve / reject",
    icon: GitBranch,
    accent: "hsl(28 80% 55%)",
    defaults: {
      label: "Decision",
      condition: "all checks passed",
    } satisfies DecisionNodeData,
  },
  {
    kind: "notification",
    title: "Notification",
    description: "Send a message via channel",
    icon: Bell,
    accent: "hsl(28 80% 55%)",
    defaults: {
      label: "Send Notification",
      channel: "Email",
      recipient: "user@company.com",
      message: "Update on your request",
    } satisfies NotificationNodeData,
  },
  {
    kind: "end",
    title: "End",
    description: "Terminate the workflow",
    icon: CircleCheck,
    accent: "hsl(142 55% 42%)",
    defaults: {
      label: "End",
      outcome: "Success",
    } satisfies EndNodeData,
  },
];

export function getPaletteItem(kind: NodeKind): PaletteItem {
  const item = palette.find((p) => p.kind === kind);
  if (!item) throw new Error(`Unknown node kind: ${kind}`);
  return item;
}
