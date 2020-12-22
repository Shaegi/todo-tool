import { useApolloClient } from "@apollo/client"
import { remote } from "electron"
import { useEffect, useMemo, useRef } from "react"
import useSettings from "../../../behaviour/useSettings"
import { useReadUserData } from "../../../behaviour/useUserData"
import { PROJECT_LIST_FILE_NAME } from "../Pipelines"
import { ProjectQuery, ProjectQueryResult } from "./gql/ProjectQuery"
import useGitUser from "./useGitUser"

export default function useWatchProjects() {
  const { data: userData } = useGitUser()
  const {
    settings: { muted: globalMuted },
  } = useSettings()

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
                      ["SUCCESS", "FAILED"].includes(fetched.node.status) &&
                      !(data.project.muted || globalMuted)
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
