import { gql, useQuery } from "@apollo/client"

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

export default function useGitUser() {
  const { data, loading } = useQuery<CurrentUserQueryResult>(CurrentUserQuery)
  return { data, loading }
}
