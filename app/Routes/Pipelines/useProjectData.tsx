import { useApolloClient, useQuery } from "@apollo/react-hooks"
import { gql } from "apollo-boost"
import { remote } from "electron"
import { useEffect, useMemo, useRef } from "react"
import { useReadUserData } from "../../behaviour/useUserData"
import { PROJECT_LIST_FILE_NAME } from "./Pipelines"

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
            user {
              id
            }
            duration
            id
            status
            sha
            createdAt
          }
        }
      }
    }
  }
`

export type ProjectQueryResult = {
  project: {
    id: string
    name: string
    description: string
    pipelines: {
      edges: {
        node: {
          detailedStatus: {
            detailsPath: string
          }
          user: {
            id: string
          }
          duration: number
          id: string
          status: "RUNNING" | "SUCCESS" | "FAILED"
          sha: string
          createdAt: string
        }
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
  const { data: userData, loading: userLoading } = useGitUser()

  const currentUserIdRef = useRef<string | undefined>()
  currentUserIdRef.current = userData?.currentUser.id

  const prevPendingPipelinesRef = useRef<
    Record<string, ProjectQueryResult["project"]["pipelines"]["edges"]>
  >({})

  const readUserData = useReadUserData()
  const projectList = useMemo(() => {
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
          .catch((err) => {})
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
    setInterval(fetch, 30000)
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
