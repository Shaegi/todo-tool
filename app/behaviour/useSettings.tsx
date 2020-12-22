import React, { useState, useCallback, useContext } from "react"
import { mutedProjects } from "../containers/Root"
import { useReadUserData, useWriteUserData } from "./useUserData"

type SettingsContext = {
  settings: Settings
  resetSettings?: () => void
  persistSettings?: (
    key: keyof Settings,
    value: string | number | boolean
  ) => void
}

export type Settings = {
  git?: string
  gitAPI?: string
  gitAPIKey?: string
  autostartTimer?: boolean
  timerDefault?: number
  jira?: string
  jiraDashboard?: string
  jiraBoard?: string
  muted?: boolean
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

  const handleSettingsChangeSideEffect = useCallback(
    (prev: Settings, key: keyof Settings, value: string | number | boolean) => {
      switch (key) {
        case "muted": {
          if (!value) {
            mutedProjects([])
          }
          break
        }
        default: {
          // do nothing
        }
      }
    },
    []
  )

  const persistSettings: SettingsContext["persistSettings"] = useCallback(
    (key, value) => {
      setSettings((prev: Settings) => {
        handleSettingsChangeSideEffect(prev, key, value)
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
