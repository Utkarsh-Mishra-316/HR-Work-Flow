import { useMemo, useState } from "react";
import { MousePointerClick, Trash2, X } from "lucide-react";
import { useWorkflowStore } from "@/flow/useWorkflowStore";
import type {
  ApprovalNodeData,
  DecisionNodeData,
  DocumentVerificationNodeData,
  EndNodeData,
  NotificationNodeData,
} from "@/flow/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export function PropertiesPanel() {
  const selectedNodeId = useWorkflowStore((s) => s.selectedNodeId);
  const nodes = useWorkflowStore((s) => s.nodes);
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const deleteNode = useWorkflowStore((s) => s.deleteNode);
  const selectNode = useWorkflowStore((s) => s.selectNode);

  const node = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId),
    [nodes, selectedNodeId],
  );

  if (!node) {
    return (
      <aside className="flex h-full w-80 flex-col border-l bg-card">
        <div className="border-b px-4 py-4">
          <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Properties
          </div>
          <div className="mt-1 text-sm font-semibold">Inspector</div>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <MousePointerClick className="h-5 w-5 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-sm font-semibold">Nothing selected</h3>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Click a node on the canvas to edit its label, role, message, or condition.
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="flex h-full w-80 flex-col border-l bg-card">
      <div className="flex items-start justify-between gap-2 border-b px-4 py-3">
        <div className="min-w-0">
          <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            {nodeTypeLabel(node.type)}
          </div>
          <div className="mt-0.5 truncate text-sm font-semibold">{String(node.data.label)}</div>
          <Badge variant="outline" className="mt-1.5 font-mono text-[10px]">
            id: {node.id}
          </Badge>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7 shrink-0"
          onClick={() => selectNode(null)}
          data-testid="button-deselect"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-4 px-4 py-4">
          <Field label="Label">
            <Input
              value={String(node.data.label)}
              onChange={(e) => updateNodeData(node.id, { label: e.target.value })}
              data-testid="input-node-label"
            />
          </Field>

          {node.type === "approval" ? (
            <ApprovalFields
              nodeId={node.id}
              data={node.data as ApprovalNodeData}
              onChange={(d) => updateNodeData(node.id, d)}
            />
          ) : null}

          {node.type === "documentVerification" ? (
            <DocumentVerificationFields
              nodeId={node.id}
              data={node.data as DocumentVerificationNodeData}
              onChange={(d) => updateNodeData(node.id, d)}
            />
          ) : null}

          {node.type === "decision" ? (
            <DecisionFields
              nodeId={node.id}
              data={node.data as DecisionNodeData}
              onChange={(d) => updateNodeData(node.id, d)}
            />
          ) : null}

          {node.type === "notification" ? (
            <NotificationFields
              nodeId={node.id}
              data={node.data as NotificationNodeData}
              onChange={(d) => updateNodeData(node.id, d)}
            />
          ) : null}

          {node.type === "end" ? (
            <EndFields
              nodeId={node.id}
              data={node.data as EndNodeData}
              onChange={(d) => updateNodeData(node.id, d)}
            />
          ) : null}
        </div>
      </ScrollArea>

      <Separator />
      <div className="px-4 py-3">
        <Button
          variant="outline"
          className="w-full justify-start gap-2 text-destructive hover:text-destructive"
          onClick={() => deleteNode(node.id)}
          data-testid="button-delete-node"
        >
          <Trash2 className="h-4 w-4" />
          Delete this node
        </Button>
      </div>
    </aside>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}

function nodeTypeLabel(type: string | undefined): string {
  switch (type) {
    case "start":
      return "Start Node";
    case "approval":
      return "Approval Step";
    case "documentVerification":
      return "Document Verification";
    case "decision":
      return "Decision Node";
    case "notification":
      return "Notification Step";
    case "end":
      return "End Node";
    default:
      return "Node";
  }
}

function ApprovalFields({
  nodeId,
  data,
  onChange,
}: {
  nodeId: string;
  data: ApprovalNodeData;
  onChange: (d: Partial<ApprovalNodeData>) => void;
}) {
  return (
    <>
      <Field label="Approver Role">
        <Select
          value={data.approverRole}
          onValueChange={(v) => onChange({ approverRole: v as ApprovalNodeData["approverRole"] })}
        >
          <SelectTrigger data-testid={`select-approver-${nodeId}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Manager">Manager</SelectItem>
            <SelectItem value="HR">HR</SelectItem>
            <SelectItem value="Director">Director</SelectItem>
            <SelectItem value="Team Lead">Team Lead</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <Field label="SLA (hours)">
        <Input
          type="number"
          min={1}
          value={data.slaHours}
          onChange={(e) =>
            onChange({ slaHours: Math.max(1, Number(e.target.value) || 0) })
          }
          data-testid={`input-sla-${nodeId}`}
        />
      </Field>
    </>
  );
}

function DocumentVerificationFields({
  nodeId,
  data,
  onChange,
}: {
  nodeId: string;
  data: DocumentVerificationNodeData;
  onChange: (d: Partial<DocumentVerificationNodeData>) => void;
}) {
  const [draft, setDraft] = useState("");
  const addDoc = () => {
    const value = draft.trim();
    if (!value) return;
    if (data.documents.includes(value)) {
      setDraft("");
      return;
    }
    onChange({ documents: [...data.documents, value] });
    setDraft("");
  };
  const removeDoc = (doc: string) => {
    onChange({ documents: data.documents.filter((d) => d !== doc) });
  };
  return (
    <>
      <Field label="Documents">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1.5">
            {data.documents.length === 0 ? (
              <span className="text-xs italic text-muted-foreground">
                No documents added yet
              </span>
            ) : (
              data.documents.map((doc) => (
                <Badge
                  key={doc}
                  variant="secondary"
                  className="gap-1 pr-1"
                  data-testid={`doc-tag-${doc}`}
                >
                  {doc}
                  <button
                    onClick={() => removeDoc(doc)}
                    className="ml-0.5 rounded-sm p-0.5 hover-elevate"
                    aria-label={`Remove ${doc}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))
            )}
          </div>
          <div className="flex gap-1.5">
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addDoc();
                }
              }}
              placeholder="Add document (e.g. Passport)"
              data-testid={`input-doc-${nodeId}`}
            />
            <Button size="sm" variant="outline" onClick={addDoc}>
              Add
            </Button>
          </div>
        </div>
      </Field>
      <Field label="Required">
        <div className="flex items-center justify-between rounded-md border bg-background px-3 py-2">
          <span className="text-sm">
            {data.required ? "Required to proceed" : "Optional step"}
          </span>
          <Switch
            checked={data.required}
            onCheckedChange={(v) => onChange({ required: v })}
            data-testid={`switch-required-${nodeId}`}
          />
        </div>
      </Field>
    </>
  );
}

function DecisionFields({
  nodeId,
  data,
  onChange,
}: {
  nodeId: string;
  data: DecisionNodeData;
  onChange: (d: Partial<DecisionNodeData>) => void;
}) {
  return (
    <Field label="Condition">
      <Textarea
        value={data.condition}
        onChange={(e) => onChange({ condition: e.target.value })}
        rows={3}
        className="font-mono text-xs"
        placeholder="e.g. score >= 70"
        data-testid={`input-condition-${nodeId}`}
      />
      <p className="text-[11px] text-muted-foreground">
        The simulator picks Approve / Reject randomly. The condition is shown for documentation.
      </p>
    </Field>
  );
}

function NotificationFields({
  nodeId,
  data,
  onChange,
}: {
  nodeId: string;
  data: NotificationNodeData;
  onChange: (d: Partial<NotificationNodeData>) => void;
}) {
  return (
    <>
      <Field label="Channel">
        <Select
          value={data.channel}
          onValueChange={(v) => onChange({ channel: v as NotificationNodeData["channel"] })}
        >
          <SelectTrigger data-testid={`select-channel-${nodeId}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Email">Email</SelectItem>
            <SelectItem value="Slack">Slack</SelectItem>
            <SelectItem value="SMS">SMS</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <Field label="Recipient">
        <Input
          value={data.recipient}
          onChange={(e) => onChange({ recipient: e.target.value })}
          placeholder={
            data.channel === "Slack"
              ? "#channel or @user"
              : data.channel === "Email"
                ? "user@company.com"
                : "+1 555 0100"
          }
          data-testid={`input-recipient-${nodeId}`}
        />
      </Field>
      <Field label="Message">
        <Textarea
          value={data.message}
          onChange={(e) => onChange({ message: e.target.value })}
          rows={4}
          placeholder="Hi {{name}}, your request was approved."
          data-testid={`input-message-${nodeId}`}
        />
      </Field>
    </>
  );
}

function EndFields({
  nodeId,
  data,
  onChange,
}: {
  nodeId: string;
  data: EndNodeData;
  onChange: (d: Partial<EndNodeData>) => void;
}) {
  return (
    <Field label="Outcome">
      <Select
        value={data.outcome}
        onValueChange={(v) => onChange({ outcome: v as EndNodeData["outcome"] })}
      >
        <SelectTrigger data-testid={`select-outcome-${nodeId}`}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Success">Success</SelectItem>
          <SelectItem value="Rejected">Rejected</SelectItem>
          <SelectItem value="Cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>
    </Field>
  );
}
