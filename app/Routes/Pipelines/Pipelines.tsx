import React, { useCallback, useMemo } from "react"
import { useReadUserData, useWriteUserData } from "../../behaviour/useUserData"
import TabBar, { TabBarItem } from "../../components/TabBar"
import PipelineAdd from "./components/PipelineAdd"
import PipelineSidebarItem from "./components/PipelineSidebarItem"
import Pipeline from "./components/Pipeline/Pipeline"

export const PROJECT_LIST_FILE_NAME = "projectList"

export type PipelineItem = {
  key?: string
  id: string
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

  const handleDeleteItem = useCallback((id) => {
    if (id) {
      setProjectList((p) => p.filter((item) => item.id !== id))
    }
  }, [])

  const handleEditLabel = useCallback((id: string, newLabel: string) => {
    if (id) {
      setProjectList((p) => {
        const next = [...p]
        const item = next.find((i) => i.id === id)
        if (item) {
          item.customLabel = newLabel
        }

        return next
      })
    }
  }, [])

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
          ContentRenderer: (
            <Pipeline
              fullPath={item.fullPath}
              id={item.id}
              key={key}
              label={item.customLabel}
              onDelete={handleDeleteItem}
              onEditLabel={handleEditLabel}
            />
          ),
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
