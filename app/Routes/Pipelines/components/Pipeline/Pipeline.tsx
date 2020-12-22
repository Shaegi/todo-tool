import React, { useCallback, useMemo, useState } from "react"
import styled from "styled-components"
import { shell } from "electron"
import ListHeadline from "../../../../components/ListHeadline"
import PipelineFilter, {
  FilterItem,
  PipelineFilterProps,
} from "./PipelineFilter"
import PipelineListItem, { pipelineListItemClass } from "./PipelineListIem"
import { useProjectData } from "../../behaviour/useProjectData"
import { pipelineStatusEmojiMap } from "../../utils"
import Button from "../../../../components/common/Button"
import { mutedProjects } from "../../../../containers/Root"
import useSettings from "../../../../behaviour/useSettings"
import useGitUser from "../../behaviour/useGitUser"
import { PipelineStatus } from "../../types"

const StyledPipeline = styled.ul`
  max-height: 95%;
  overflow: auto;
  width: 100%;
  padding-left: 8px;

  .pipeline {
    padding: 5px;
    display: block;
  }

  .filter {
    display: flex;
    align-items: center;
    padding-bottom: 8px;
    .filter-label {
      padding-right: 8px;
    }
  }

  .${pipelineListItemClass} + .${pipelineListItemClass} {
    border-top: 1px solid lightgrey;
  }
`
type PipelineProps = {
  id: string
  fullPath: string | null
  label?: string
  onDelete: (id: string) => void
  onEditLabel: (id: string, newLabel: string) => void
}

const pipelineStatusFilterItems = (Object.keys(
  PipelineStatus
) as PipelineStatus[]).map((status) => ({
  value: status,
  title: status[0] + status.substr(1, status.length).toLowerCase(),
  label: pipelineStatusEmojiMap[status],
}))

const userFilterItems: FilterItem[] = [
  {
    value: "activeUser",
    label: "👋",
    title: "Triggered by myself",
  },
]

const Pipeline: React.FC<PipelineProps> = (props) => {
  const { fullPath, id, onDelete, label, onEditLabel } = props
  const { data, loading } = useProjectData(fullPath)
  const {
    settings: { muted: globalMuted },
    persistSettings,
  } = useSettings()
  const {
    settings: { git },
  } = useSettings()
  const [statusFilter, setStatusFilter] = useState<
    PipelineFilterProps["value"]
  >(null)
  const [userFilter, setUserFilter] = useState<PipelineFilterProps["value"]>(
    null
  )

  const handleStatusFilterChange: PipelineFilterProps["onChange"] = useCallback(
    (val) => {
      setStatusFilter(val)
    },
    []
  )

  const handleUserFilterChange: PipelineFilterProps["onChange"] = useCallback(
    (val) => {
      setUserFilter(val)
    },
    []
  )

  const handleDeletePipeline = useCallback(() => {
    onDelete(id)
  }, [id])

  const { data: user } = useGitUser()

  const resolvedPipelines = useMemo(() => {
    if (data && data.project && data.project.pipelines) {
      return data.project.pipelines.edges.filter(
        ({ node }) =>
          (!statusFilter || node.status === statusFilter.value) &&
          (!userFilter || node.user.id === user?.currentUser.id)
      )
    }
    return []
  }, [data, statusFilter, userFilter])
  const handleOpen = useCallback(() => {
    if (git && fullPath) {
      shell.openExternal(git + fullPath)
    }
  }, [git, fullPath])

  const handleEditLabel = useCallback(
    (newLabel: string) => {
      onEditLabel(id, newLabel)
    },
    [id, onEditLabel]
  )

  if (loading) {
    return <div>Loading</div>
  }
  if (!(data && data.project)) {
    return <div>Received corrupted data. Try again or delete project.</div>
  }
  const { project } = data
  const { name, muted, id: projectId } = project

  const handleSetMuted = () => {
    const next = [...mutedProjects()]
    if (globalMuted && !muted) {
      persistSettings?.("muted", false)
    }
    if (!muted) {
      mutedProjects([...next, projectId])
    } else {
      mutedProjects(next.filter((i) => i !== projectId))
    }
  }

  const AdditionalHeadlineControls = (
    <>
      <Button
        onClick={handleSetMuted}
        emoji={muted || globalMuted ? "🔕" : "🔔"}
      />
      <Button onClick={handleOpen} emoji="🌍">
        Open
      </Button>
    </>
  )

  return (
    <StyledPipeline>
      <ListHeadline
        label={label || name}
        onDelete={handleDeletePipeline}
        onEditLabel={handleEditLabel}
        AdditionalControls={AdditionalHeadlineControls}
      />
      <div className="filter">
        <div className="filter-label">Filter</div>
        <div>
          <PipelineFilter
            onChange={handleStatusFilterChange}
            value={statusFilter}
            items={pipelineStatusFilterItems}
          />
          <PipelineFilter
            onChange={handleUserFilterChange}
            value={userFilter}
            items={userFilterItems}
          />
        </div>
      </div>

      {resolvedPipelines.length > 0 ? (
        <div className="pipeline-list">
          {resolvedPipelines.map(({ node }) => {
            return (
              <PipelineListItem pipeline={node} user={user} key={node.id} />
            )
          })}
        </div>
      ) : (
        <div className="no-result">
          No piplines available
          {(userFilter || statusFilter) && (
            <div className="no-result-clear-filter">
              Filter is active.
              <Button
                onClick={() => {
                  handleStatusFilterChange(null)
                  handleUserFilterChange(null)
                }}
              >
                Clear Filter
              </Button>
            </div>
          )}
        </div>
      )}
    </StyledPipeline>
  )
}

export default Pipeline
