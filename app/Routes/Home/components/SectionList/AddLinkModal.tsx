import React from "react"
import styled from "styled-components"
import { v4 } from "uuid"
import useModal from "../../../../behaviour/useModal"
import ConfirmControls from "../../../../components/ConfirmControls"
import BaseModal from "../../../../components/modal/BaseModal"
import MultiInput from "./MultiInput"
import { LinkSection, SectionItem } from "./SectionList"

const Wrapper = styled.div`
  label {
    display: block;
  }
`

export type AddLinkModalProps = {
  section: LinkSection
  onAbort?: () => void
  onConfirm: (link: SectionItem) => void
}

const AddLinkModal: React.FC<AddLinkModalProps> = (props) => {
  const { onAbort, onConfirm, section } = props
  const { hideModal } = useModal()

  const [addLinkURLValue, setAddLinkURLValue] = React.useState<string[]>([""])
  const [addLinkLabelValue, setAddLinkLabelValue] = React.useState<string>("")

  const handleConfirm = () => {
    hideModal()
    onConfirm({
      id: v4(),
      label: addLinkLabelValue,
      urls: addLinkURLValue.filter(Boolean),
    })
  }

  const handleCancel = () => {
    hideModal()
    onAbort?.()
  }

  return (
    <BaseModal onClose={handleCancel} showClose={false}>
      <Wrapper>
        <h1>Add Item to {section.label}</h1>
        <div>
          <label>Label</label>
          <input
            value={addLinkLabelValue}
            onChange={(e) => setAddLinkLabelValue(e.target.value)}
          />
        </div>
        <label>Url</label>
        <MultiInput value={addLinkURLValue} onChange={setAddLinkURLValue} />
        <div>
          <ConfirmControls
            confirmDisabled={
              !(addLinkLabelValue || addLinkURLValue.some(Boolean))
            }
            onConfirm={handleConfirm}
            onDecline={handleCancel}
          />
        </div>
      </Wrapper>
    </BaseModal>
  )
}

export default AddLinkModal
