import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import styled from "styled-components"

const StyledInput = styled.input<{ width: number }>`
  height: 15vh;
  font-size: 90%;
  width: ${(p) => p.width}px;
`

export type DualNumberInputProps = {
  value: string
  changeable?: boolean
  persistChange: (value: string) => void
}

const DualNumberInput: React.FC<DualNumberInputProps> = (props) => {
  const { changeable, persistChange } = props

  const [value, setValue] = useState(props.value)
  const [edit, setEdit] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const spanRef = useRef<HTMLSpanElement>(null)
  const [width, setWidth] = useState(0)

  useLayoutEffect(() => {
    const listener = () => {
      if (spanRef.current) {
        setWidth(spanRef.current.offsetWidth)
      }
    }
    window.addEventListener("resize", listener)
    listener()
    return () => window.removeEventListener("resize", listener)
  }, [props.value, edit])

  useEffect(() => {
    if (!edit) {
      setValue(props.value)
    }
  }, [edit, props.value])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (Number(e.target.value) >= 0) {
        setValue(e.target.value)
      }
    },
    [setValue]
  )

  useEffect(() => {
    if (edit) {
      inputRef.current?.focus()
    }
  }, [edit])

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setEdit(false)
      persistChange(e.target.value)
    },
    [persistChange]
  )

  return (
    <>
      <span
        onClick={() => changeable && setEdit(true)}
        ref={spanRef}
        style={{
          opacity: edit ? "0" : "1",
          position: edit ? "absolute" : "static",
          top: "-1000%",
        }}
      >
        {value}
      </span>
      {edit && (
        <StyledInput
          ref={inputRef}
          width={width}
          size={2}
          maxLength={2}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          type="number"
        />
      )}
    </>
  )
}

export default DualNumberInput
