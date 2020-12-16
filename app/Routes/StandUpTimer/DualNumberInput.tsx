import React, { useCallback, useEffect, useRef, useState } from "react"

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

  useEffect(() => {
    if (!edit) {
      setValue(props.value)
    }
  }, [edit, props.value])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }, [])

  useEffect(() => {
    if (edit) {
      inputRef.current?.focus()
    }
  }, [edit])

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    setEdit(false)
    persistChange(e.target.value)
  }, [])

  return (
    <>
      {!edit ? (
        <span onClick={() => changeable && setEdit(true)}>{value}</span>
      ) : (
        <input
          ref={inputRef}
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
