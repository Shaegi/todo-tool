import React, { useCallback } from "react"
import styled from "styled-components"
import useStandUpTimer from "../../behaviour/useStandUpTimer"
import Button from "../../components/common/Button"
import FlashingText from "../../components/FlashingText"
import DualNumberInput from "./DualNumberInput"

type WrapperProps = {}

const Wrapper = styled.div<WrapperProps>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  h1 {
    display: flex;
    font-size: 15vh;
    align-items: center;
    input {
      border: none;
    }
  }
  .controls {
    button {
      height: inherit;
      font-size: 5vh;
    }

    button + button {
      margin-left: 2vw;
    }
  }
`

export type StandUpTimerRouteProps = {}

const StandUpTimerRoute: React.FC<StandUpTimerRouteProps> = () => {
  const {
    startTimer,
    pauseTimer,
    resetTimer,
    timer,
    running,
    finished,
    setNewDefault,
    setUnfinished,
  } = useStandUpTimer()

  const persistMinutesChange = useCallback(
    (value: string) => {
      setNewDefault(value, timer.seconds)
    },
    [timer.seconds]
  )

  const persistSecondsChange = useCallback(
    (value: string) => {
      setNewDefault(timer.minutes, value)
    },
    [timer.minutes]
  )

  return (
    <Wrapper>
      <h1 onClick={setUnfinished}>
        <FlashingText flashing={finished}>
          <DualNumberInput
            changeable={!running}
            value={timer.minutes}
            persistChange={persistMinutesChange}
          />
          :
          <DualNumberInput
            changeable={!running}
            value={timer.seconds}
            persistChange={persistSecondsChange}
          />
        </FlashingText>
      </h1>
      <div className="controls">
        <Button onClick={startTimer} disabled={running}>
          Start
        </Button>
        <Button onClick={pauseTimer} disabled={!running}>
          Pause
        </Button>
        <Button onClick={resetTimer}>Reset</Button>
      </div>
    </Wrapper>
  )
}

export default StandUpTimerRoute
