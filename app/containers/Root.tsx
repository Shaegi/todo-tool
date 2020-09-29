import React, { useState, useEffect } from "react"
import { ThemeProvider, createGlobalStyle } from "styled-components"
import ApolloClient from "apollo-boost"
import { ApolloProvider } from "@apollo/react-hooks"
import Theme from "../constants/Theme"
import App from "./App"
import TitleBar from "../components/Titlebar"
import useSettings, {
  SettingsContextProvider,
  Settings,
} from "../behaviour/useSettings"

const Global = createGlobalStyle`
  body {
    background: ${(p) => (p.theme as any).color.prim[300]};
    color: white;
  }
`

const getClient = (settings?: Settings) =>
  new ApolloClient({
    request: (operation) => {
      const token = settings?.gitAPIKey
      operation.setContext({
        headers: {
          authorization: token ? `Bearer ${token}` : "",
        },
      })
    },
    uri: settings?.gitAPI,
  })

const Root: React.FC = () => {
  return (
    <SettingsContextProvider>
      <Inner />
    </SettingsContextProvider>
  )
}

const Inner: React.FC = () => {
  const { settings } = useSettings()
  const [client, setClient] = useState(getClient(settings))
  useEffect(() => {
    setClient(getClient(settings))
  }, [settings?.gitAPI, settings?.gitAPIKey])

  return (
    <ApolloProvider client={client as any}>
      <ThemeProvider theme={Theme}>
        <>
          <Global />
          <TitleBar />
          <App />
        </>
      </ThemeProvider>
    </ApolloProvider>
  )
}

export default Root
