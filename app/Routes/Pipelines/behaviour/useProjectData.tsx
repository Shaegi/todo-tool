import { useQuery } from "@apollo/client"
import { ProjectQuery, ProjectQueryResult } from "./gql/ProjectQuery"

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
