import React from "react"
import DragHandleIcon from "@material-ui/icons/DragHandle"
import useSortable, { UseSortablePayload } from "./behaviour/useSortable"
import { LinkSection, SectionItem } from "./SectionList"
import useModal, { ModalTypes } from "../../../../behaviour/useModal"
import { AddLinkModalProps } from "./AddLinkModal"

export type SectionProps = {
  section: LinkSection
  index: number
  onDeleteSection: (section: LinkSection) => void
  onChangeIndex: (currentIndex: number, nextIndex: number) => void
  onAddLink: (section: LinkSection, item: SectionItem) => void
  editMode?: boolean
}

const DragType = "LINK_SECTION"

const Section: React.FC<SectionProps> = (props) => {
  const {
    section,
    editMode,
    children,
    onDeleteSection,
    index,
    onAddLink,
    onChangeIndex,
  } = props

  const { showModal } = useModal()

  const handleChangeIndex: UseSortablePayload["onChangeIndex"] = (
    curr: number,
    next: number
  ) => {
    onChangeIndex(curr, next)
  }

  const { itemRef, dragHandleRef, style } = useSortable({
    index,
    item: section,
    type: DragType,
    canDrag: editMode,
    onChangeIndex: handleChangeIndex,
  })

  const handleOpenAddLink = () => {
    showModal(ModalTypes.ADD_SECTION_LINK, {
      onConfirm: (item) => {
        onAddLink(section, item)
      },
      section,
    } as AddLinkModalProps)
  }

  return (
    <div className="section" key={section.id} ref={itemRef} stye={style}>
      <h2 className="section-label">
        <span>
          <span role="img">{section.icon}</span>
          {section.label}
        </span>
        {editMode && (
          <div className="edit-controls">
            <button
              type="button"
              className="add-link"
              onClick={handleOpenAddLink}
            >
              +
            </button>
            <button
              type="button"
              className="delete-button"
              onClick={() => onDeleteSection(section)}
            >
              🗑
            </button>
            <button type="button" ref={dragHandleRef} className="drag-handle">
              <DragHandleIcon />
            </button>
          </div>
        )}
      </h2>
      <ul>{children}</ul>
    </div>
  )
}

export default Section
