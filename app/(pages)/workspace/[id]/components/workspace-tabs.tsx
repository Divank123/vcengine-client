"use client"

import * as React from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"
import WorkspacePanel from "./workspace-panel"
// import IssuesPanel from "./issues-panel"
import PullRequestsPanel from "./pull-requests-panel"
import { WorkspaceVersion } from "./workspace-shell"

export default function WorkspaceTabs({
  workspaceId,
  versions,
  onChangeVersion,
}: {
  workspaceId: string
  versions: WorkspaceVersion[]
  onChangeVersion: (id: string) => void
}) {
  const [tab, setTab] = React.useState<"workspace" | "issues" | "pulls">("workspace")
  const [direction, setDirection] = React.useState<1 | -1>(1)

  const handleChange = (next: typeof tab) => {
    setDirection(next === "workspace" ? -1 : 1)
    setTab(next)
  }

  return (
    <div className="mt-4">
      <Tabs value={tab} onValueChange={(v) => handleChange(v as any)} className="w-full">
        <div className="flex items-center justify-between">
          <TabsList className="bg-card/40 border border-border/80 gap-6 px-2 py-1.5">
            <TabsTrigger value="workspace">Workspace view</TabsTrigger>
            <TabsTrigger value="issues">Issues</TabsTrigger>
            <TabsTrigger value="pulls">Pull request</TabsTrigger>
          </TabsList>
        </div>

        <div className="mt-6 relative">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={tab}
              custom={direction}
              initial={{ opacity: 0, x: 24 * direction }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 * direction }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
            >
              {/* {tab === "workspace" && (
                <WorkspacePanel
                  workspaceId={workspaceId}
                  versions={versions}
                  activeVersion={activeVersion}
                  onChangeVersion={onChangeVersion}
                />
              )} */}
              {/* {tab === "issues" && <IssuesPanel workspaceId={workspaceId} />} */}
              {tab === "issues" && <PullRequestsPanel workspaceId={workspaceId} />}
              {tab === "pulls" && <PullRequestsPanel workspaceId={workspaceId} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </Tabs>
    </div>
  )
}
