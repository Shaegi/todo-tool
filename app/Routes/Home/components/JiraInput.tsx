import React, { useCallback, useState } from "react"
import styled from "styled-components"
import { shell } from "electron"
import useSettings from "../../../behaviour/useSettings"
import Button from "../../../components/common/Button"

const Wrapper = styled.div`
  input {
    padding: 8px;
    width: 50%;
  }

  h2 {
    margin: 4px 0;
  }

  .headline {
    display: flex;
    margin-bottom: 4px;

    button {
      color: white;
      padding: 2px 4px;
      margin-left: 8px;
      border: 1px solid white;
    }
  }
`

type JiraInputProps = {}

const JiraInput: React.FC<JiraInputProps> = () => {
  const [value, setValue] = useState("")

  const handleChange = (ev: any) => {
    setValue(ev.target.value)
  }

  const {
    settings: { jiraBoard, jira, jiraTicketPrefix, jiraDashboard },
  } = useSettings()

  const openTicket = useCallback(() => {
    if (value) {
      setValue("")
      shell.openExternal(`${jira}${jiraTicketPrefix}${value}`)
    }
  }, [jira, jiraTicketPrefix, value])

  const handleKeyDown = (ev: any) => {
    if (ev.which === 13) {
      openTicket()
    }
  }

  return (
    <Wrapper>
      <div className="headline">
        <h2>Jira</h2>
        <button
          type="button"
          onClick={() => jiraDashboard && shell.openExternal(jiraDashboard)}
        >
          Open Dashboard
        </button>
        <button
          type="button"
          onClick={() => jiraBoard && shell.openExternal(jiraBoard)}
        >
          Open Board
        </button>
      </div>
      <input
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        value={value}
        placeholder="Enter Ticket No."
      />
      <Button onClick={openTicket}>Search</Button>
    </Wrapper>
  )
}

export default JiraInput
