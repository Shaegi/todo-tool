import { useCallback } from "react"
import { remote } from "electron"
import fs from "fs"
import path from "path"

const { app } = remote

const getPath = (fileName: string) =>
  path.join(app.getPath("userData"), `${fileName}.json`)

type UseWriteDataOptions = {
  fileName: string
  /** Stringified JSON Data */
  data: string
  onError?: (e: Error) => void
}

export function useWriteUserData() {
  return useCallback((options: UseWriteDataOptions) => {
    const path = getPath(options.fileName)
    try {
      fs.writeFileSync(path, options.data)
    } catch (e) {
      console.log("error @ write file", e)
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      options.onError && options.onError(e)
    }
  }, [])
}

type UseReadDataOptions = {
  fileName: string
  onError?: (e: Error) => void
}

export function useReadUserData() {
  return useCallback((options: UseReadDataOptions) => {
    try {
      const data = fs.readFileSync(getPath(options.fileName), "UTF-8")
      console.log(data, JSON.parse(data))
      return JSON.parse(data)
    } catch (e) {
      console.log("error @ read file", e)
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      options.onError && options.onError(e)
    }
    return null
  }, [])
}
