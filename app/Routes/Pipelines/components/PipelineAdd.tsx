/* eslint-disable promise/catch-or-return */
import { useApolloClient } from "@apollo/react-hooks"
import { CircularProgress } from "@material-ui/core"
import React, { useState } from "react"
import Button from "../../../components/common/Button"
import { ProjectQuery, ProjectQueryResult } from "../behaviour/useProjectData"
import { PipelineItem } from "../Pipelines"

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
          <Button emoji="✔️" onClick={handleAdd} disabled={!fullPath}>
            Add
          </Button>
        )}
      </div>
      {error && <div>{error}</div>}
    </div>
  )
}

export default PipelineAdd
