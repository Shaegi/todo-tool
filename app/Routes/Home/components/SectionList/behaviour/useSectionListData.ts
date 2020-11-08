import React from "react"
import { remote } from "electron"
import fs from "fs"
import path from "path"
import { LinkSection } from "../SectionList"

const { app } = remote

const getSectionListPath = () =>
  path.resolve(app.getPath("userData"), "sectionList.json")

const useSectionListData = () => {
  const [sectionList, setSectionList] = React.useState<LinkSection[]>(() => {
    try {
      const data = fs.readFileSync(getSectionListPath(), "UTF-8")
      return JSON.parse(data) || []
    } catch (e) {
      return []
    }
  })

  const persistSectionList = React.useCallback(
    (updater: (prev: LinkSection[]) => LinkSection[]) => {
      setSectionList((prev) => {
        const next = updater(prev)
        try {
          fs.writeFileSync(getSectionListPath(), JSON.stringify(next))
        } catch (e) {
          // do nothing
        }
        return next
      })
    },
    []
  )

  return {
    sectionList,
    persistSectionList,
  }
}

export default useSectionListData
