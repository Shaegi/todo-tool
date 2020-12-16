import { clearConfigCache } from "prettier"
import React, {
  useState,
  useCallback,
  useContext,
  useMemo,
  useEffect,
  useRef,
} from "react"
import useSettings from "./useSettings"

type StandUpTimerContext = {
  timer: {
    formatted: string
    minutes: string
    seconds: string
  }
  running: boolean
  resetTimer: () => void
  startTimer: () => void
  pauseTimer: () => void
  setNewDefault: (minutes: string, seconds: string) => void
}

const timerDefaultFallback = 1500000

export const StandUpContext = React.createContext<StandUpTimerContext>(
  {} as any
)
const { Provider } = StandUpContext

export const StandUpTimerContextProvider: React.FC<{}> = (props) => {
  const {
    settings: { timerDefault = timerDefaultFallback },
    persistSettings,
  } = useSettings()
  const [running, setRunning] = useState(true)
  const [timer, setTimer] = useState<number>(timerDefault)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => {
        setTimer((p) => p - 1000)
      }, 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }, [running])

  const setNewDefault = useCallback((minutes: string, seconds: string) => {
    const defaultTimer = Number(minutes) * 60 * 1000 + Number(seconds) * 1000
    setTimer(defaultTimer)
    persistSettings?.("timerDefault", String(defaultTimer))
  }, [])

  const pauseTimer = useCallback(() => {
    setRunning(false)
  }, [])

  const startTimer = useCallback(() => {
    setRunning(true)
  }, [])

  const resetTimer = useCallback(() => {
    pauseTimer()
    setTimer(timerDefault)
  }, [timerDefault])

  const formattedTimer = useMemo(() => {
    console.log("format", timer)
    const minutes = Math.floor(timer / 1000 / 60)
    const seconds = Math.floor((timer - minutes * 1000 * 60) / 1000)

    const formSeconds = `${seconds < 10 ? 0 : ""}${seconds}`

    return {
      formatted: String(`${minutes}:${formSeconds}`),
      minutes: String(minutes),
      seconds: formSeconds,
    }
  }, [timer])

  return (
    <Provider
      value={{
        resetTimer,
        pauseTimer,
        running,
        startTimer,
        setNewDefault,
        timer: formattedTimer,
      }}
    >
      {props.children}
    </Provider>
  )
}

export default function useStandUpTimer() {
  return useContext(StandUpContext)
}
