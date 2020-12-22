import React from "react"
import styled from "styled-components"
import Button from "../../../../components/common/Button"

type WrapperProps = {}

const Wrapper = styled.div<WrapperProps>``

export type MultiInputProps = {
  addMessage?: string
  value: string[]
  onChange: (value: string[]) => void
}

const MultiInput: React.FC<MultiInputProps> = (props) => {
  const { addMessage = "+ Add", onChange, value: valueArr } = props

  return (
    <Wrapper>
      {valueArr.map((value, i) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const next = [...valueArr]
          next[i] = e.target.value
          onChange(next)
        }
        return (
          <div key={String(i)}>
            <input value={value} onChange={handleChange} />
            {i > 0 && (
              <Button
                emoji="🗑"
                onClick={() => {
                  const next = [...valueArr]
                  next.splice(i, 1)
                  onChange(next)
                }}
              />
            )}
          </div>
        )
      })}
      <Button
        onClick={() => {
          onChange([...valueArr, ""])
        }}
      >
        {addMessage}
      </Button>
    </Wrapper>
  )
}

export default MultiInput
