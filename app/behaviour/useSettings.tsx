import React, { useState, useCallback, useContext } from "react"
import { remote } from "electron"
import fs from "fs"
import path from "path"

const { app } = remote

const getSettingsPath = () =>
  path.join(app.getPath("userData"), "settings.json")

type SettingsContext = {
  settings?: Settings
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
}

export const SettingsContext = React.createContext<SettingsContext>({})

const { Provider } = SettingsContext

export const SettingsContextProvider: React.FC = (props) => {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const data = fs.readFileSync(getSettingsPath(), "UTF-8")
      return JSON.parse(data)
      return {}
    } catch (e) {
      return null
    }
  })

  const persistSettings: SettingsContext["persistSettings"] = useCallback(
    (key, value) => {
      setSettings((prev: Settings) => {
        const next = { ...prev, [key]: value }
        const path = getSettingsPath()
        try {
          fs.writeFileSync(path, JSON.stringify(next))
        } catch (e) {
          console.log("error @ ready file", e)
        }

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
