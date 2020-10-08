import React from "react"
import styled from "styled-components"

const Wrapper = styled.span``

type ConfirmControlsProps = {
  onConfirm: () => void
  onDecline: () => void
}

const ConfirmControls: React.FC<ConfirmControlsProps> = (props) => {
  const { onConfirm, onDecline } = props

  return (
    <Wrapper>
      <button type="button" onClick={onConfirm}>
        <span role="img" aria-label="accept">
          ✔️
        </span>
      </button>
      <button type="button" onClick={onDecline}>
        <span role="img" aria-label="decline">
          ❌
        </span>
      </button>
    </Wrapper>
  )
}
export default ConfirmControls
