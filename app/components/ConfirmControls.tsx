import React from "react"
import styled from "styled-components"
import Button from "./common/Button"

const Wrapper = styled.span``

type ConfirmControlsProps = {
  disabled?: boolean
  inline?: boolean
  confirmDisabled?: boolean
  onConfirm: () => void
  onDecline: () => void
}

const ConfirmControls: React.FC<ConfirmControlsProps> = (props) => {
  const { onConfirm, onDecline, disabled, inline, confirmDisabled } = props

  return (
    <Wrapper className="confirm-controls">
      <Button
        onClick={onConfirm}
        disabled={disabled || confirmDisabled}
        emoji="✔️"
        inline={inline}
      />
      <Button
        onClick={onDecline}
        disabled={disabled}
        emoji="❌"
        inline={inline}
      />
    </Wrapper>
  )
}
export default ConfirmControls
