import React, { useCallback, useMemo, useState } from "react"
import { useReadUserData, useWriteUserData } from "../../behaviour/useUserData"
import TabBar, { TabBarItem } from "../../components/TabBar"
import PipelineAdd from "./components/PipelineAdd"
import PipelineSidebarItem from "./components/PipelineSidebarItem"
import Pipeline from "./components/Pipeline/Pipeline"
import SidebarAddItem from "../../components/SidebarAddItem"

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
  const [active, setActive] = useState(projectList.length === 0 ? 0 : 1)

  const sidebarItems = useMemo<TabBarItem[]>(() => {
    return [
      {
        key: "add-item",
        Renderer: <SidebarAddItem active={active === 0} />,
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
  }, [projectList, active])

  return (
    <div style={{ display: "flex", width: "100%" }}>
      <TabBar
        items={sidebarItems}
        onActiveChange={setActive}
        initialActiveIndex={active}
      />
    </div>
  )
}

export default Pipelines
