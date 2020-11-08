import { useCallback, useState } from "react"

export default function useForceUpdate() {
  const [, setTimer] = useState(0)

  return useCallback(() => {
    setTimer((p) => p++)
  }, [])
}
