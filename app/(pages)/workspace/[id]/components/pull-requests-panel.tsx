"use client"

import { Button } from "@/components/ui/button"

export default function PullRequestsPanel({ workspaceId }: { workspaceId: string }) {
  return (
    <div className="rounded-xl border border-border/80 bg-card/40 p-6 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Pull Requests</h3>
        <Button variant="outline" className="border-border bg-transparent">
          New pull request
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">No pull requests yet. Create one to review and merge changes.</p>
    </div>
  )
}
