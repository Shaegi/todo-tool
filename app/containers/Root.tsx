import React, { useState, useEffect } from "react"
import { ThemeProvider, createGlobalStyle } from "styled-components"
import {
  InMemoryCache,
  ApolloProvider,
  ApolloClient,
  createHttpLink,
} from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import Theme from "../constants/Theme"
import App from "./App"
import TitleBar from "../components/Titlebar"
import useSettings, {
  SettingsContextProvider,
  Settings,
} from "../behaviour/useSettings"

const Global = createGlobalStyle<any>`

    ::-webkit-scrollbar-track
    {
      background-color: ${(p) => p.theme.color.prim[300]};
    }

    ::-webkit-scrollbar
    {
      width: 0;
      background-color: #F5F5F5;
    }

    ::-webkit-scrollbar-thumb
    {
      background-color: ${(p) => p.theme.color.prim[400]};
    }


  body {
    background: ${(p) => (p.theme as any).color.prim[300]};
    color: white;
  }

  select, input {
    height: 30px;
    box-sizing: border-box;
    background: ${(p) => p.theme.color.prim[300]};
    border: 1px solid white;
    color: white;
    outline-color: ${(p) => p.theme.color.prim[400]};
    padding: 0 4px;
  }
`

const getClient = (settings?: Settings) => {
  const httpLink = createHttpLink({
    uri: settings?.gitAPI,
  })

  const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = settings?.gitAPIKey
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    }
  })
  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    uri: settings?.gitAPI,
  })
}

const Root: React.FC = () => {
  return (
    <SettingsContextProvider>
      <Inner />
    </SettingsContextProvider>
  )
}

const Inner: React.FC = () => {
  const { settings } = useSettings()
  const [client, setClient] = useState<any>(null)
  useEffect(() => {
    setClient(getClient(settings))
  }, [settings?.gitAPI, settings?.gitAPIKey])

  if (!client) {
    return null
  }

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
