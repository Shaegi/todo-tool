import React from "react"
import { Link, useRouteMatch } from "react-router-dom"
import Sidebar from "./Sidebar"

export const HOME_PATH = "/"
export const PIPELINE_PATH = "/pipeline"
export const SETTINGS_PATH = "/settings"
export const TODO_PATH = "/todo"

const MainNav = () => {
  const isHome = useRouteMatch(HOME_PATH)
  const isPipeline = useRouteMatch(PIPELINE_PATH)
  const isSettings = useRouteMatch(SETTINGS_PATH)
  const isTodo = useRouteMatch(TODO_PATH)

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
  ]

  return <Sidebar items={mainNavItems} />
}

export default MainNav
