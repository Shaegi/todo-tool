import React from "react"
import { v4 } from "uuid"
import ConfirmControls from "../../../../components/ConfirmControls"
import EmojiSelect from "../../../../components/EmojiSelect"
import { LinkSection } from "./SectionList"

type AddSectionInputProps = {
  onAdd: (section: LinkSection) => void
}

const AddSectionInput: React.FC<AddSectionInputProps> = (props) => {
  const { onAdd } = props

  const [addSectionValue, setAddActionValue] = React.useState<string>("")
  const [addSectionMode, setAddActionMode] = React.useState(false)
  const [sectionIconValue, setSectionIconValue] = React.useState<string>("")

  const handleCancelSectionMode = () => {
    setAddActionValue("")
    setAddActionMode(false)
    setSectionIconValue("")
  }

  const handleAdd = () => {
    onAdd({
      id: v4(),
      icon: sectionIconValue,
      label: addSectionValue,
      items: [],
    })
    handleCancelSectionMode()
  }

  return (
    <>
      {!addSectionMode && (
        <button
          type="button"
          className="add-section"
          onClick={() => setAddActionMode(true)}
        >
          + Add Section
        </button>
      )}
      {addSectionMode && (
        <>
          <input
            value={addSectionValue}
            onChange={(e) => setAddActionValue(e.target.value)}
          />
          <EmojiSelect
            onChange={(e) => setSectionIconValue(e.target.value)}
            initialValue={sectionIconValue}
          />
          <ConfirmControls
            onConfirm={handleAdd}
            onDecline={handleCancelSectionMode}
          />
        </>
      )}
    </>
  )
}

export default AddSectionInput
