"use client"

import { useMemo, useState } from "react"
import WorkspaceHeader from "./workspace-header"
import WorkspaceTabs from "./workspace-tabs"

export interface WorkspaceVersion {
  id: string
  commitMessage: string
  createdAt: string
}

export interface WorkspaceBranch {
  id: string
  name: string
  createdAt: string
  activeVersion: string | null
  Versions: WorkspaceVersion[]
}

export interface Workspace {
  id: string
  banner: string | null
  activeBranch: string
  createdAt: string
  name: string
  type: "Public" | "Private"
  Branch: WorkspaceBranch[]
}


export default function WorkspaceShell({ workspace }: { workspace: Workspace }) {
  // derive initial active version
  // const initialVersion = useMemo(() => workspace?.Branch[0].Versions[0]?.id ?? "v1", [workspace?.versions])
  // const [activeVersion, setActiveVersion] = useState(initialVersion)

  return (
    <div className="px-4 md:px-8">
      <WorkspaceHeader
        workspaceName={workspace?.name}
        onStar={() => console.log("[v0] Star clicked")}
        onFork={() => console.log("[v0] Fork clicked")}
        onDownload={() => console.log("[v0] Download clicked")}
      />

      <WorkspaceTabs
        workspaceId={workspace?.id}
        onChangeVersion={() => { console.log('On change version clicked') }}
        versions={workspace?.Branch[0].Versions}
      />
    </div>
  )
}
