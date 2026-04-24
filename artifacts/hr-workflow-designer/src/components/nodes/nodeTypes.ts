import type { NodeTypes } from "@xyflow/react";
import { StartNode } from "./StartNode";
import { ApprovalNode } from "./ApprovalNode";
import { DocumentVerificationNode } from "./DocumentVerificationNode";
import { DecisionNode } from "./DecisionNode";
import { NotificationNode } from "./NotificationNode";
import { EndNode } from "./EndNode";

export const nodeTypes: NodeTypes = {
  start: StartNode,
  approval: ApprovalNode,
  documentVerification: DocumentVerificationNode,
  decision: DecisionNode,
  notification: NotificationNode,
  end: EndNode,
};
