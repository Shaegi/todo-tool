import { useApolloClient } from "@apollo/client"
/* eslint-disable promise/catch-or-return */
import { CircularProgress } from "@material-ui/core"
import React, { useState } from "react"
import styled from "styled-components"
import { v4 } from "uuid"
import Button from "../../../components/common/Button"
import { ProjectQuery, ProjectQueryResult } from "../behaviour/gql/ProjectQuery"
import { PipelineItem } from "../Pipelines"

const Wrapper = styled.div`
  padding: 0 16px;

  .input-wrapper {
    margin-bottom: 8px;
  }

  .path-input {
    margin-right: 8px;
  }
`

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
      id: v4(),
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
    <Wrapper>
      <div>
        <h1>Add Pipeline</h1>
        <div className="input-wrapper">
          <input
            disabled={loading}
            className="path-input"
            placeholder="Enter Full Path to project"
            value={fullPath}
            onChange={(ev) => setFullPathValue(ev.target.value)}
          />
          {loading ? (
            <CircularProgress size="16px" />
          ) : (
            <Button emoji="✔️" onClick={handleAdd} disabled={!fullPath}>
              Add
            </Button>
          )}
        </div>
        <div>Hint: Everything after GitLab url</div>
      </div>
      {error && <div>{error}</div>}
    </Wrapper>
  )
}

export default PipelineAdd
