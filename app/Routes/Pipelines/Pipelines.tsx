import React, { useMemo } from "react"
import { useReadUserData, useWriteUserData } from "../../behaviour/useUserData"
import TabBar, { TabBarItem } from "../../components/TabBar"
import PipelineAdd from "./components/PipelineAdd"
import PipelineSidebarItem from "./components/PipelineSidebarItem"
import Pipeline from "./components/Pipeline/Pipeline"

export const PROJECT_LIST_FILE_NAME = "projectList"

export type PipelineItem = {
  key?: string
  fullPath: null | string
  customLabel?: string
  addItem?: boolean
}

export type PipelineList = PipelineItem[]

type PipelinesProps = {}

const Pipelines: React.FC<PipelinesProps> = () => {
  const readUserData = useReadUserData()
  const writeUserData = useWriteUserData()
  const [projectList, dispatchProjectList] = React.useState<PipelineList>(
    readUserData({
      fileName: PROJECT_LIST_FILE_NAME,
    }) || []
  )

  const persistProjectList = (nextList: PipelineList) => {
    writeUserData({
      fileName: PROJECT_LIST_FILE_NAME,
      data: JSON.stringify(nextList),
    })
  }

  const setProjectList = (callback: (p: PipelineList) => PipelineList) => {
    dispatchProjectList((p) => {
      const nextList = callback(p)
      persistProjectList(nextList)
      return nextList
    })
  }

  const handleAddItem = (item: PipelineItem) => {
    setProjectList((p) => [...p, item])
  }

  const sidebarItems = useMemo<TabBarItem[]>(() => {
    return [
      {
        key: "add-item",
        Renderer: (
          <div>
            <div>Add</div>
          </div>
        ),
        ContentRenderer: <PipelineAdd onAdd={handleAddItem} />,
      },
      ...projectList.map((item, index) => {
        const key = item.fullPath || String(index)
        return {
          key,
          Renderer: <PipelineSidebarItem {...item} key={key} index={index} />,
          ContentRenderer: <Pipeline fullPath={item.fullPath} />,
        }
      }),
    ]
  }, [projectList])

  return (
    <div style={{ display: "flex", width: "100%" }}>
      <TabBar
        items={sidebarItems}
        initialActiveIndex={sidebarItems.length === 1 ? 0 : 1}
      />
    </div>
  )
}

export default Pipelines
