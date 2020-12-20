import React from "react"
import { Link, useRouteMatch } from "react-router-dom"
import useStandUpTimer from "../behaviour/useStandUpTimer"
import FlashingText from "./FlashingText"
import Sidebar from "./Sidebar"

export const HOME_PATH = "/"
export const PIPELINE_PATH = "/pipeline"
export const SETTINGS_PATH = "/settings"
export const STANDUP_TIMER_PATH = "/standup-timer"
export const TODO_PATH = "/todo"

const MainNav = () => {
  const isHome = useRouteMatch(HOME_PATH)
  const isPipeline = useRouteMatch(PIPELINE_PATH)
  const isSettings = useRouteMatch(SETTINGS_PATH)
  const isStandUpTimer = useRouteMatch(STANDUP_TIMER_PATH)
  const isTodo = useRouteMatch(TODO_PATH)
  const {
    timer,
    finished: timerFinished,
    running: timerRunning,
    setUnfinished: setTimerUnfinished,
  } = useStandUpTimer()

  const mainNavItems = [
    {
      key: HOME_PATH,
      active: !!(isHome && isHome.isExact),
      Renderer: (
        <Link to={HOME_PATH}>
          <div>
            🏠 <br />
            Home
          </div>
        </Link>
      ),
    },
    {
      key: TODO_PATH,
      active: !!isTodo,
      Renderer: (
        <Link to={TODO_PATH}>
          <div>
            ✨ <br />
            Todo
          </div>
        </Link>
      ),
    },
    {
      key: PIPELINE_PATH,
      active: !!isPipeline,
      Renderer: (
        <Link to={PIPELINE_PATH}>
          <div>
            🌈 <br />
            Pipelines
          </div>
        </Link>
      ),
    },
    {
      key: SETTINGS_PATH,
      active: !!isSettings,
      Renderer: (
        <Link to={SETTINGS_PATH}>
          <div>
            ⚙️ <br />
            Settings
          </div>
        </Link>
      ),
    },
    {
      key: STANDUP_TIMER_PATH,
      active: !!isStandUpTimer,
      Renderer: (
        <Link
          to={STANDUP_TIMER_PATH}
          onClick={() => {
            setTimerUnfinished()
          }}
        >
          <div>
            <div>
              {(timerRunning || timerFinished) && (
                <div>
                  <FlashingText flashing={timerFinished}>
                    {timer.formatted}
                  </FlashingText>
                </div>
              )}
              Timer
            </div>
          </div>
        </Link>
      ),
    },
  ]

  return <Sidebar items={mainNavItems} />
}

export default MainNav
