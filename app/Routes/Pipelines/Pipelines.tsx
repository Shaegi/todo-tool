import React, { useState } from "react"
import styled from "styled-components"
import { shell, remote } from "electron"
import fs from "fs"
import { useProjectData } from "./useProjectData"
import Sidebar, { SideBarItem } from "../../components/Sidebar"
import { useReadUserData, useWriteUserData } from "../../behaviour/useUserData"

const PROJECT_LIST_FILE_NAME = "projectList"

const StyledPipeline = styled.ul`
  max-height: 95%;
  overflow: auto;
  width: 100%;
  .pipeline {
    padding: 5px;
    display: block;
  }
`

const getIconByFailedCount = (count: number) => {
  if (count === 0) {
    return "✅"
  }
  if (count > 8) {
    return "❌"
  }
  if (count > 5) {
    return "〽️"
  }
  return ""
}

type PipelineSidebarItemProps = {
  onSelect: (index: number) => void
  index: number
  fullPath: string | null
  icon?: string
  customLabel?: string | null
  addItem?: boolean
}

const PipelineSidebarItem: React.FC<PipelineSidebarItemProps> = ({
  onSelect,
  index,
  fullPath,
  customLabel,
  addItem,
}) => {
  const { data, loading } = useProjectData(fullPath, !!addItem)

  // const myNotification = new Notification('Title', {
  //   body: 'Lorem Ipsum Dolor Sit Amet'
  // })

  // myNotification.onclick = () => {
  //   console.log('Notification clicked')
  // }

  const failedCount =
    (data &&
      data.project &&
      data.project.pipelines.edges.reduce((acc, { node }) => {
        if (node.status !== "SUCCESS") {
          acc++
        }
        return acc
      }, 0)) ||
    0

  if (!addItem && !loading && !(data && data.project)) {
    return <div>Failed to fetch any data</div>
  }

  return (
    <div onClick={() => onSelect(index)}>
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

type PipelineProps = {
  fullPath: string | null
}

const Pipeline: React.FC<PipelineProps> = (props) => {
  const { fullPath } = props
  const { data, loading } = useProjectData(fullPath)

  if (loading) {
    return <div>eh?</div>
  }
  if (!(data && data.project)) {
    return <div>eh?????</div>
  }
  const { project } = data
  const { pipelines, name } = project

  const handleOpen = (url: string) => {
    shell.openExternal(process.env.GIT_URL + url)
  }

  return (
    <StyledPipeline>
      <h4>{name}</h4>
      {pipelines.edges.length > 0 ? (
        pipelines.edges.map(({ node }) => {
          return (
            <li className="pipeline" key={node.id}>
              <div>{node.sha}</div>
              <div>{node.status}</div>
              <div onClick={() => handleOpen(node.detailedStatus.detailsPath)}>
                Open Details
              </div>
            </li>
          )
        })
      ) : (
        <div>No piplines available</div>
      )}
    </StyledPipeline>
  )
}

type PipelineAddProps = {
  onAdd: (item: PipelineItem) => void
}

const PipelineAdd: React.FC<PipelineAddProps> = (props) => {
  const [fullPath, setFullPathValue] = useState("")

  const handleAdd = () => {
    const item = {
      fullPath,
    }
    props.onAdd(item)
  }
  return (
    <div>
      <label>Enter FullPath to project</label>
      <input
        value={fullPath}
        onChange={(ev) => setFullPathValue(ev.target.value)}
      />
      <button type="button" onClick={handleAdd}>
        Add
      </button>
    </div>
  )
}

type PipelineItem = {
  key?: string
  fullPath: null | string
  customLabel?: string
  addItem?: boolean
}

type PipelineList = PipelineItem[]

type PipelinesProps = {}

const Pipelines: React.FC<PipelinesProps> = () => {
  const [selected, setSelected] = React.useState(0)
  const readUserData = useReadUserData()
  const writeUserData = useWriteUserData()
  const [projectList, dispatchProjectList] = React.useState<PipelineList>(
    readUserData({
      fileName: PROJECT_LIST_FILE_NAME,
    }) || []
  )

  const resolvedProjectList: PipelineList = [
    {
      fullPath: null,
      customLabel: "Add",
      addItem: true,
    },
    ...projectList,
  ]

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

  const list: SideBarItem[] = projectList.map((item, index) => {
    const key = item.fullPath || String(index)
    return {
      key,
      active: index === selected,
      Renderer: (
        <PipelineSidebarItem
          {...item}
          key={key}
          onSelect={setSelected}
          index={index}
        />
      ),
    }
  })

  const handleAddItem = (item: PipelineItem) => {
    setProjectList((p) => [...p, item])
  }

  return (
    <div style={{ display: "flex", width: "100%" }}>
      <Sidebar items={list} />
      {resolvedProjectList.map(({ fullPath, addItem }, index) => {
        return index === selected ? (
          addItem ? (
            <PipelineAdd onAdd={handleAddItem} />
          ) : (
            <Pipeline fullPath={fullPath} />
          )
        ) : null
      })}
    </div>
  )
}

export default Pipelines
