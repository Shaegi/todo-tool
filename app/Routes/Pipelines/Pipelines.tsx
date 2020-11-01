/* eslint-disable promise/catch-or-return */
import React, { useMemo, useState } from "react"
import styled from "styled-components"
import { shell, remote } from "electron"
import { useApolloClient } from "@apollo/react-hooks"
import { CircularProgress } from "@material-ui/core"
import {
  useProjectData,
  ProjectQuery,
  ProjectQueryResult,
} from "./useProjectData"
import { useReadUserData, useWriteUserData } from "../../behaviour/useUserData"
import TabBar, { TabBarItem } from "../../components/TabBar"
import ListHeadline from "../../components/ListHeadline"
import Button from "../../components/common/Button"

export const PROJECT_LIST_FILE_NAME = "projectList"

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
  index: number
  fullPath: string | null
  icon?: string
  customLabel?: string | null
  addItem?: boolean
}

const PipelineSidebarItem: React.FC<PipelineSidebarItemProps> = ({
  index,
  fullPath,
  customLabel,
  addItem,
}) => {
  const { data, loading } = useProjectData(fullPath, !!addItem)

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
      <ListHeadline label={name} onDelete={() => null} />
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
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const client = useApolloClient()

  const handleAdd = () => {
    const item = {
      fullPath,
    }
    setLoading(true)
    client
      .query<ProjectQueryResult>({
        query: ProjectQuery,
        variables: { fullPath },
      })
      .catch(() => {})
      .then((res) => {
        setLoading(false)
        if (res && res.data?.project) {
          props.onAdd(item)
        } else {
          setError("Project not found")
          setFullPathValue("")
          setTimeout(() => {
            setError(null)
          }, 3000)
        }
        return null
      })
  }
  return (
    <div>
      <div>Enter FullPath to project</div>
      <div>Hint: Everything after GitLab url</div>
      <div>
        <input
          disabled={loading}
          value={fullPath}
          onChange={(ev) => setFullPathValue(ev.target.value)}
        />
        {loading ? (
          <CircularProgress size="16px" />
        ) : (
          <Button emoji="✅" onClick={handleAdd}>
            Add
          </Button>
        )}
      </div>
      {error && <div>{error}</div>}
    </div>
  )
}

type PipelineItem = {
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
