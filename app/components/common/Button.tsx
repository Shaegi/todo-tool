import React from "react"
import styled, { css } from "styled-components"

type StyledButtonProps = {
  disabled: boolean
  inline?: boolean
}

const StyledButton = styled.button<StyledButtonProps>`
  padding: 4px 8px;
  background: ${(p) => (p.inline ? "transparent" : p.theme.color.prim[400])};
  color: white;
  height: 30px;

  .button-emoji {
    padding-right: 4px;
  }

  ${(p) =>
    p.disabled
      ? css`
          background: grey;
          cursor: no-drop;
        `
      : css`
          :hover {
            opacity: 0.6;
          }
        `}
`

export type ButtonProps = {
  emoji?: string
  onClick?: React.HTMLAttributes<HTMLButtonElement>["onClick"]
  disabled?: boolean
  inline?: boolean
} & React.HTMLAttributes<HTMLButtonElement>

const Button: React.FC<ButtonProps> = (props) => {
  const { children, emoji, disabled, onClick, inline, ...rest } = props
  return (
    <StyledButton
      inline={inline}
      type="button"
      disabled={!!disabled}
      onClick={disabled ? undefined : onClick}
      {...rest}
    >
      {emoji && (
        <span role="img" className="button-emoji">
          {emoji}
        </span>
      )}
      {children}
    </StyledButton>
  )
}

export default Button
