import React, { useCallback } from "react"
import styled from "styled-components"
import useSettings, { Settings } from "../../behaviour/useSettings"

const Wrapper = styled.div`
  .section {
    display: flex;
    max-width: 100%;
  }

  label {
    grid-column-start: 1;
  }
  input {
    grid-column-start: 2;
  }

  .content {
    margin-left: 8px;
    display: grid;
  }

  input {
    border: 1px solid white;
    background: transparent;
    color: white;
    padding: 8px 4px;
  }
`

type SettingsProps = {}

const SettingsRoute: React.FC<SettingsProps> = () => {
  const { settings, persistSettings } = useSettings()

  return (
    <Wrapper>
      <h1>Settings</h1>
      <div className="section">
        <h2>Git</h2>
        <div className="content">
          <SettingsInput
            valueKey="git"
            label="Git Link"
            value={settings?.git}
            onChange={persistSettings}
          />
          <SettingsInput
            valueKey="gitAPI"
            label="Git Lab Api"
            value={settings?.gitAPI}
            onChange={persistSettings}
          />
          <SettingsInput
            valueKey="gitAPIKey"
            label="Git Api Key"
            value={settings?.gitAPIKey}
            onChange={persistSettings}
          />
        </div>
        <h2>Jira</h2>
        <div className="content">
          <SettingsInput
            valueKey="jira"
            label="Jira Link"
            value={settings?.jira}
            onChange={persistSettings}
          />
          <SettingsInput
            valueKey="jiraDashboard"
            label="Jira Dashboard"
            value={settings?.jiraDashboard}
            onChange={persistSettings}
          />
          <SettingsInput
            valueKey="jiraBoard"
            label="Jira Board"
            value={settings?.jiraBoard}
            onChange={persistSettings}
          />
          <SettingsInput
            valueKey="jiraTicketPrefix"
            label="Ticket Prefix"
            value={settings?.jiraTicketPrefix}
            onChange={persistSettings}
          />
        </div>
      </div>
    </Wrapper>
  )
}

type SettingsInputProps = {
  label: string
  valueKey: keyof Settings
  value: string | undefined
  onChange?: ReturnType<typeof useSettings>["persistSettings"]
}

const SettingsInput: React.FC<SettingsInputProps> = ({
  label,
  valueKey,
  value,
  onChange,
}) => {
  const handleChange = useCallback((e) => {
    onChange?.(valueKey, e.target.value)
  }, [])
  return (
    <>
      <label>{label}</label>
      <input value={value} onChange={handleChange} />
    </>
  )
}

export default SettingsRoute
