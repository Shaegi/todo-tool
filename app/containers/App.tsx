import * as React from "react"
import styled from "styled-components"
import { HashRouter as Router, Switch, Route } from "react-router-dom"

import { HTML5Backend } from "react-dnd-html5-backend"
import { DndProvider } from "react-dnd"
import Pipelines from "../Routes/Pipelines/Pipelines"
import SettingsRoute from "../Routes/Settings/index"
import Home from "../Routes/Home/Home"
import MainNav, {
  HOME_PATH,
  PIPELINE_PATH,
  SETTINGS_PATH,
  TODO_PATH,
} from "../components/MainNav"
import { ModalContextProvider } from "../behaviour/useModal"
import Todo from "../Routes/Todo/Todo"
import { useWatchProjects } from "../Routes/Pipelines/behaviour/useProjectData"

const Main = styled.div`
  display: flex;
  position: relative;
  height: 100%;
  overflow: hidden;
`

export default function App() {
  useWatchProjects()
  return (
    <DndProvider backend={HTML5Backend}>
      <Main>
        <ModalContextProvider>
          <Router>
            <MainNav />
            <Switch>
              <Route exact path={HOME_PATH}>
                <Home />
              </Route>
              <Route path={PIPELINE_PATH}>
                <Pipelines />
              </Route>
              <Route path={TODO_PATH}>
                <Todo />
              </Route>
              <Route path={SETTINGS_PATH}>
                <SettingsRoute />
              </Route>
            </Switch>
          </Router>
        </ModalContextProvider>
      </Main>
    </DndProvider>
  )
}
