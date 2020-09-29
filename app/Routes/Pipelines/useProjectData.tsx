import { useQuery } from "@apollo/react-hooks"
import { gql } from "apollo-boost"

const ProjectQuery = gql`
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

type ProjectQueryResult = {
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
          duration: number
          id: string
          status: string
          sha: string
          createdAt: string
        }
      }[]
    }
  }
}

export const useProjectData = (fullPath: string | null, skip?: boolean) => {
  const { data, loading } = useQuery<ProjectQueryResult>(ProjectQuery, {
    skip,
    variables: {
      fullPath,
    },
    pollInterval: 30000,
  })
  return { data, loading }
}

export default useProjectData
