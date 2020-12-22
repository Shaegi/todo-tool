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
  STANDUP_TIMER_PATH,
  TODO_PATH,
} from "../components/MainNav"
import Todo from "../Routes/Todo/Todo"
import StandUpTimerRoute from "../Routes/StandUpTimer/StandUpTimerRoute"
import TitleBar from "../components/Titlebar"
import useWatchProjects from "../Routes/Pipelines/behaviour/useWatchProjects"

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
      <TitleBar />
      <Main>
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
            <Route path={STANDUP_TIMER_PATH}>
              <StandUpTimerRoute />
            </Route>
          </Switch>
        </Router>
      </Main>
    </DndProvider>
  )
}
