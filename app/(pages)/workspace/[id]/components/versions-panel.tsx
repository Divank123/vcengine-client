"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { WorkspaceVersion } from "./workspace-tabs"

export default function VersionsPanel({
  versions,
  activeVersion,
  onChangeVersion,
}: {
  versions: WorkspaceVersion[]
  activeVersion: string
  onChangeVersion: (id: string) => void
}) {
  return (
    <aside className="rounded-xl border border-border/80 bg-card/40 p-3">
      <div className="text-sm font-medium mb-2">Versions</div>
      <div className="space-y-2">
        {versions.map((v, idx) => (
          <Button
            key={v.id}
            variant={v.id === activeVersion ? "default" : "outline"}
            onClick={() => onChangeVersion(v.id)}
            className={cn(
              "w-full justify-between",
              v.id === activeVersion
                ? "bg-primary text-primary-foreground"
                : "bg-card/60 border-border hover:border-primary/50 hover:bg-card/80",
            )}
          >
            <span className="truncate">v{idx} - {v.name}</span>
          </Button>
        ))}
      </div>
    </aside>
  )
}
