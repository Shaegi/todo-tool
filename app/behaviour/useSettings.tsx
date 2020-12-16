import React, { useState, useCallback, useContext } from "react"
import { useReadUserData, useWriteUserData } from "./useUserData"

type SettingsContext = {
  settings: Settings
  resetSettings?: () => void
  persistSettings?: (key: keyof Settings, value: string) => void
}

export type Settings = {
  git?: string
  gitAPI?: string
  gitAPIKey?: string
  jira?: string
  jiraDashboard?: string
  jiraBoard?: string
  jiraTicketPrefix?: string
}

const SETTINGS_FILE_NAME = "settings"

export const SettingsContext = React.createContext<SettingsContext>({} as any)

const { Provider } = SettingsContext

export const SettingsContextProvider: React.FC = (props) => {
  const readUserData = useReadUserData()
  const writeUserData = useWriteUserData()
  const [settings, setSettings] = useState<Settings>(
    readUserData({ fileName: SETTINGS_FILE_NAME }) || {}
  )

  const persistSettings: SettingsContext["persistSettings"] = useCallback(
    (key, value) => {
      setSettings((prev: Settings) => {
        const next = { ...prev, [key]: value }
        writeUserData({
          fileName: SETTINGS_FILE_NAME,
          data: JSON.stringify(next),
        })

        return next
      })
    },
    []
  )

  const resetSettings = useCallback(() => {
    setSettings({})
  }, [])

  return (
    <Provider
      value={{
        resetSettings,
        persistSettings,
        settings,
      }}
    >
      {props.children}
    </Provider>
  )
}

export default function useSettings() {
  return useContext(SettingsContext)
}
