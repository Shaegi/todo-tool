import { gql } from "@apollo/client"
import { Pipeline } from "../../types"

export const ProjectQuery = gql`
  query project($fullPath: ID!) {
    project(fullPath: $fullPath) {
      id
      name
      muted @client
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

export type ProjectQueryResult = {
  project: {
    id: string
    muted: boolean
    name: string
    description: string
    pipelines: {
      edges: {
        node: Pipeline
      }[]
    }
  }
}
