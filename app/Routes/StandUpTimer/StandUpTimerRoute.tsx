import React, { useCallback, useState } from "react"
import styled from "styled-components"
import useStandUpTimer from "../../behaviour/useStandUpTimer"
import Button from "../../components/common/Button"
import DualNumberInput from "./DualNumberInput"

type WrapperProps = {}

const Wrapper = styled.div<WrapperProps>`
  h1 {
    display: flex;
    align-items: center;
    input {
      border: none;
    }
  }
`

export type StandUpTimerRouteProps = {}

const StandUpTimerRoute: React.FC<StandUpTimerRouteProps> = (props) => {
  const {
    startTimer,
    pauseTimer,
    resetTimer,
    timer,
    running,
    setNewDefault,
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
      <h1>
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
      </h1>
      <Button onClick={startTimer} disabled={running}>
        Start
      </Button>
      <Button onClick={pauseTimer} disabled={!running}>
        Pause
      </Button>
      <Button onClick={resetTimer}>Reset</Button>
    </Wrapper>
  )
}

export default StandUpTimerRoute
