import React from "react"

export type ButtonProps = {
  emoji?: string
} & React.HTMLAttributes<HTMLButtonElement>

const Button: React.FC<ButtonProps> = (props) => {
  const { children, emoji, ...rest } = props
  return (
    <button type="button" {...rest}>
      {emoji && <span role="img">{emoji}</span>}
      {children}
    </button>
  )
}

export default Button
