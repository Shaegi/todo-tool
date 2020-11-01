import React from "react"
import { PipelineStatus, useProjectData } from "../behaviour/useProjectData"
import { getIconByFailedCount } from "../utils"

type PipelineSidebarItemProps = {
  index: number
  fullPath: string | null
  icon?: string
  customLabel?: string | null
  addItem?: boolean
}

const PipelineSidebarItem: React.FC<PipelineSidebarItemProps> = ({
  fullPath,
  customLabel,
  addItem,
}) => {
  const { data, loading } = useProjectData(fullPath, !!addItem)

  const failedCount =
    (data &&
      data.project &&
      data.project.pipelines.edges.reduce((acc, { node }) => {
        if (node.status !== PipelineStatus.SUCCESS) {
          acc++
        }
        return acc
      }, 0)) ||
    0

  if (!addItem && !loading && !(data && data.project)) {
    return <div>Failed to fetch any data</div>
  }

  return (
    <div>
      <div>
        {loading ? (
          <span>Loading...</span>
        ) : (
          <span>
            {getIconByFailedCount(failedCount)}
            <br />
            {customLabel || (data && data.project.name)}
          </span>
        )}
      </div>
    </div>
  )
}
export default PipelineSidebarItem
