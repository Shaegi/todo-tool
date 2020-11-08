import React, { useMemo } from "react"
import { PipelineStatus, useProjectData } from "../behaviour/useProjectData"
import { getIconByFailedCount, pipelineStatusEmojiMap } from "../utils"

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

  const { failedCount, isRunning } = useMemo(() => {
    let isRunning = false

    const failedCount =
      (data &&
        data.project &&
        data.project.pipelines.edges.reduce((acc, { node }) => {
          if (node.status === PipelineStatus.RUNNING) {
            isRunning = true
          } else if (node.status !== PipelineStatus.SUCCESS) {
            acc++
          }
          return acc
        }, 0)) ||
      0

    return { failedCount, isRunning }
  }, [data])

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
            {isRunning
              ? pipelineStatusEmojiMap[PipelineStatus.RUNNING]
              : getIconByFailedCount(failedCount)}
            <br />
            {customLabel || (data && data.project.name)}
          </span>
        )}
      </div>
    </div>
  )
}
export default PipelineSidebarItem
