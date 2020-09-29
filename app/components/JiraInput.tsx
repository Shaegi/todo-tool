import React from "react"
import styled from "styled-components"
import { shell } from "electron"

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

class JiraInput extends React.Component {
  state = {
    value: "",
  }

  handleChange = (ev: any) => {
    this.setState({ value: ev.target.value })
  }

  handleKeyDown = (ev: any) => {
    if (ev.which === 13) {
      this.setState({ value: "" })
      shell.openExternal(
        `${process.env.JIRA_URL}${process.env.JIRA_TICKET_PREFIX}${this.state.value}`
      )
    }
  }

  render() {
    console.log(process.env)
    return (
      <Wrapper>
        <div className="headline">
          <h2>Jira</h2>
          <button
            type="button"
            onClick={() =>
              shell.openExternal(
                process.env.JIRA_URL! + process.env.JIRA_DASHBOARD!
              )
            }
          >
            Open Dashboard
          </button>
          <button
            type="button"
            onClick={() =>
              shell.openExternal(
                process.env.JIRA_URL! + process.env.JIRA_RAPIDBOARD!
              )
            }
          >
            Open Board
          </button>
        </div>
        <input
          onKeyDown={this.handleKeyDown}
          onChange={this.handleChange}
          value={this.state.value}
        />
      </Wrapper>
    )
  }
}

export default JiraInput
