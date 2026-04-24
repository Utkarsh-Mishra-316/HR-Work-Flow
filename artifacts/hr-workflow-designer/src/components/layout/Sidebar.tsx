import { palette } from "@/components/nodes/nodePalette";
import type { NodeKind } from "@/flow/types";
import { GripVertical } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function Sidebar() {
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, kind: NodeKind) => {
    event.dataTransfer.setData("application/hrwf-node-kind", kind);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="flex h-full w-72 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="border-b border-sidebar-border px-4 py-4">
        <div className="text-[10px] font-medium uppercase tracking-wider text-sidebar-foreground/60">
          Node Palette
        </div>
        <div className="mt-1 text-sm font-semibold">Drag onto the canvas</div>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-2 p-3">
          {palette.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.kind}
                draggable
                onDragStart={(e) => onDragStart(e, item.kind)}
                className="group flex cursor-grab items-center gap-3 rounded-lg border border-sidebar-border bg-sidebar-accent/40 p-2.5 transition-colors hover:bg-sidebar-accent active:cursor-grabbing"
                data-testid={`palette-item-${item.kind}`}
              >
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md"
                  style={{ backgroundColor: `${item.accent}` }}
                >
                  <Icon className="h-4.5 w-4.5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{item.title}</div>
                  <div className="truncate text-[11px] text-sidebar-foreground/60">
                    {item.description}
                  </div>
                </div>
                <GripVertical className="h-4 w-4 text-sidebar-foreground/40 transition-opacity group-hover:text-sidebar-foreground/70" />
              </div>
            );
          })}
        </div>
      </ScrollArea>
      <div className="border-t border-sidebar-border px-4 py-3 text-[11px] leading-relaxed text-sidebar-foreground/60">
        Drag a node onto the canvas, then connect handles to wire up the flow. Click a node to edit
        its properties on the right.
      </div>
    </aside>
  );
}
