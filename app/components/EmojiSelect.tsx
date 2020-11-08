import React, { useState } from "react"

const icons = ["", "📠", "👨‍💻", "⚙️", "⚒"]

export type EmojiSelectProps = {
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  initialValue?: string
}

const EmojiSelect: React.FC<EmojiSelectProps> = (props) => {
  const { onChange, initialValue = "" } = props
  const [value, setValue] = useState<string>(initialValue)

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(e.target.value)
    onChange(e)
  }

  return (
    <select value={value} onChange={handleChange} placeholder="Select an emoji">
      {icons.map((i) => {
        return (
          <option key={i} selected={value === i ? true : undefined} value={i}>
            {i}
          </option>
        )
      })}
    </select>
  )
}

export default EmojiSelect
