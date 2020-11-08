import React from "react"
import { v4 } from "uuid"
import { LinkSection, SectionItem } from "./SectionList"
import ConfirmControls from "../../../../components/ConfirmControls"

type AddLinkInputProps = {
  section: LinkSection
  active: boolean
  onActivate: (section: LinkSection) => void
  onAdd: (section: LinkSection, link: SectionItem) => void
}

const AddLinkInput: React.FC<AddLinkInputProps> = (props) => {
  const { section, onAdd, onActivate, active } = props

  const [addLinkMode, setAddLinkMode] = React.useState<string | null>(null)
  const [addLinkURLValue, setAddLinkURLValue] = React.useState<string>("")
  const [addLinkLabelValue, setAddLinkLabelValue] = React.useState<string>("")

  const handleCancelAddLink = () => {
    setAddLinkMode(null)
    setAddLinkURLValue("")
    setAddLinkLabelValue("")
  }

  React.useEffect(() => {
    if (!active) {
      handleCancelAddLink()
    }
  }, [active])

  const activateSection = () => {
    setAddLinkMode(section.id)
    onActivate(section)
  }

  const handleAdd = () => {
    onAdd(section, {
      id: v4(),
      url: addLinkURLValue,
      label: addLinkLabelValue,
    })
    handleCancelAddLink()
  }

  return (
    <>
      {!addLinkMode && (
        <li onClick={activateSection}>
          <button type="button">+ Add link</button>
        </li>
      )}
      {addLinkMode === section.id && active && (
        <>
          <label>Label</label>
          <input
            value={addLinkLabelValue}
            onChange={(e) => setAddLinkLabelValue(e.target.value)}
          />
          <label>Url</label>
          <input
            value={addLinkURLValue}
            onChange={(e) => setAddLinkURLValue(e.target.value)}
          />
          <ConfirmControls
            onConfirm={handleAdd}
            onDecline={handleCancelAddLink}
          />
        </>
      )}
    </>
  )
}

export default AddLinkInput
