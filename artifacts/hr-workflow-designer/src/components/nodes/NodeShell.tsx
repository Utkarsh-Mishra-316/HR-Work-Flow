import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NodeShellProps {
  icon: LucideIcon;
  title: string;
  label: string;
  accent: string;
  selected?: boolean;
  active?: boolean;
  width?: number;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

export function NodeShell({
  icon: Icon,
  title,
  label,
  accent,
  selected,
  active,
  width = 240,
  children,
  footer,
}: NodeShellProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card text-card-foreground shadow-sm transition-all",
        "hover:shadow-md",
        selected && "ring-2 ring-primary border-primary",
        active && "node-active",
      )}
      style={{ width }}
      data-testid={`node-${title.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div
        className="flex items-center gap-2.5 rounded-t-xl border-b px-3 py-2"
        style={{
          backgroundColor: `${accent}14`,
          borderBottomColor: `${accent}33`,
        }}
      >
        <div
          className="flex h-7 w-7 items-center justify-center rounded-md text-white"
          style={{ backgroundColor: accent }}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            {title}
          </div>
          <div className="truncate text-sm font-semibold">{label}</div>
        </div>
      </div>
      {children ? <div className="px-3 py-2.5 text-xs">{children}</div> : null}
      {footer ? (
        <div className="border-t px-3 py-1.5 text-[10px] text-muted-foreground">
          {footer}
        </div>
      ) : null}
    </div>
  );
}
