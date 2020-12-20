import React from "react"
import styled, { css, keyframes } from "styled-components"

type WrapperProps = {
  flashing?: boolean
}

const flashing = keyframes`
    from {
      opacity: 0;
      color: red;
    }
    to {
      opacity: 1;
    }
`

const Wrapper = styled.span<WrapperProps>`
  ${(p) =>
    p.flashing &&
    css`
      animation: ${flashing} 1s linear infinite;
    `}
`

export type FlashingTextProps = {
  flashing?: boolean
}

const FlashingText: React.FC<FlashingTextProps> = (props) => {
  const { children, flashing } = props
  return <Wrapper flashing={flashing}>{children}</Wrapper>
}

export default FlashingText
