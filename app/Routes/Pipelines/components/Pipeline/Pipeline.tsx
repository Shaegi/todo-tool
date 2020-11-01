import React, { useCallback, useMemo, useState } from "react"
import styled from "styled-components"
import ListHeadline from "../../../../components/ListHeadline"
import PipelineFilter, { PipelineFilterProps } from "./PipelineFilter"
import PipelineListItem, { pipelineListItemClass } from "./PipelineListIem"
import {
  PipelineStatus,
  useGitUser,
  useProjectData,
} from "../../behaviour/useProjectData"
import { pipelineStatusEmojiMap } from "../../utils"
import Button from "../../../../components/common/Button"

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
  fullPath: string | null
}

const pipelineStatusFilterItems = (Object.keys(
  PipelineStatus
) as PipelineStatus[]).map((status) => ({
  value: status,
  label: pipelineStatusEmojiMap[status],
}))

const userFilterItems = [
  {
    value: "activeUser",
    label: "👋",
  },
]

const Pipeline: React.FC<PipelineProps> = (props) => {
  const { fullPath } = props
  const { data, loading } = useProjectData(fullPath)
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

  if (loading) {
    return <div>Loading</div>
  }
  if (!(data && data.project)) {
    return <div>Received corrupted data. Try again or delete project.</div>
  }
  const { project } = data
  const { name } = project

  return (
    <StyledPipeline>
      <ListHeadline label={name} onDelete={() => null} />
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
