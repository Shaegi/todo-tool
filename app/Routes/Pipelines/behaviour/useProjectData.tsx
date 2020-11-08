import { gql, useApolloClient, useQuery } from "@apollo/client"
import { remote } from "electron"
import { useEffect, useMemo, useRef } from "react"
import { useReadUserData } from "../../../behaviour/useUserData"
import { PROJECT_LIST_FILE_NAME } from "../Pipelines"

export const ProjectQuery = gql`
  query project($fullPath: ID!) {
    project(fullPath: $fullPath) {
      id
      name
      description
      pipelines(first: 10) {
        edges {
          node {
            detailedStatus {
              detailsPath
            }
            stages {
              edges {
                node {
                  name
                  detailedStatus {
                    group
                  }
                }
              }
            }
            user {
              id
              name
              avatarUrl
            }
            duration
            id
            status
            sha
            finishedAt
            createdAt
          }
        }
      }
    }
  }
`

export enum PipelineStatus {
  RUNNING = "RUNNING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  SKIPPED = "SKIPPED",
}

export enum StageStatus {
  RUNNING = "running",
  SUCCESS = "success",
  SKIPPED = "skipped",
  FAILED = "failed",
  CREATED = "created",
  CANCELED = "canceled",
}

export type PipelineStage = {
  node: {
    name: string
    detailedStatus: {
      group: StageStatus
    }
  }
}

export type Pipeline = {
  detailedStatus: {
    detailsPath: string
  }
  stages: {
    edges: PipelineStage[]
  }
  user: {
    id: string
    name: string
    avatarUrl: string
  }
  duration: number
  id: string
  status: PipelineStatus
  finishedAt: string
  sha: string
  createdAt: string
}

export type ProjectQueryResult = {
  project: {
    id: string
    name: string
    description: string
    pipelines: {
      edges: {
        node: Pipeline
      }[]
    }
  }
}

const CurrentUserQuery = gql`
  query user {
    currentUser {
      id
    }
  }
`

type CurrentUserQueryResult = {
  currentUser: {
    id: string
  }
}

export const useGitUser = () => {
  const { data, loading } = useQuery<CurrentUserQueryResult>(CurrentUserQuery)
  return { data, loading }
}

export const useWatchProjects = () => {
  const { data: userData } = useGitUser()

  const currentUserIdRef = useRef<string | undefined>()
  currentUserIdRef.current = userData?.currentUser?.id

  const prevPendingPipelinesRef = useRef<
    Record<string, ProjectQueryResult["project"]["pipelines"]["edges"]>
  >({})

  const readUserData = useReadUserData()
  const projectList: { fullPath: string }[] = useMemo(() => {
    return (
      readUserData({
        fileName: PROJECT_LIST_FILE_NAME,
      }) || []
    )
  }, [])
  const client = useApolloClient()

  useEffect(() => {
    const fetch = () => {
      projectList.forEach((item) => {
        client
          .query<ProjectQueryResult>({
            query: ProjectQuery,
            fetchPolicy: "network-only",
            variables: {
              fullPath: item.fullPath,
            },
          })
          .catch(() => {})
          .then((res) => {
            if (res) {
              const { data } = res
              if (currentUserIdRef.current && item.fullPath) {
                prevPendingPipelinesRef.current[item.fullPath]?.forEach(
                  (prevPending) => {
                    const fetched = data.project.pipelines.edges.find(
                      (pipeline) => pipeline.node.sha === prevPending.node.sha
                    )
                    if (
                      fetched &&
                      ["SUCCESS", "FAILED"].includes(fetched.node.status)
                    ) {
                      const myNotification = new remote.Notification({
                        title: "Pipeline finished!",
                        body: `Your triggered Pipeline for ${data.project.name} ${fetched.node.status}.`,
                      })
                      myNotification.show()
                    }
                  }
                )

                prevPendingPipelinesRef.current[
                  item.fullPath
                ] = data.project.pipelines.edges.filter(
                  (pipeline) =>
                    pipeline.node.status === "RUNNING" &&
                    pipeline.node.user.id === currentUserIdRef.current
                )
              }
            }
            return null
          })
          .catch(() => {
            // e
          })
      })
    }
    setInterval(fetch, 10000)
    fetch()
  }, [])
}

export const useProjectData = (fullPath: string | null, skip = false) => {
  const { data, loading } = useQuery<ProjectQueryResult>(ProjectQuery, {
    skip,
    variables: {
      fullPath,
    },
  })
  return { data, loading }
}

export default useProjectData
