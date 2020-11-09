import React from "react"
import DragHandleIcon from "@material-ui/icons/DragHandle"
import { LinkSection, SectionItem } from "./SectionList"
import useSortable, { UseSortablePayload } from "./behaviour/useSortable"

export type SectionLinkItemProps = {
  index: number
  item: SectionItem
  section: LinkSection
  editMode?: boolean
  onDeleteLink: (section: LinkSection, item: SectionItem) => void
  onOpenLink: (item: SectionItem) => void
  onChangeIndex: (
    section: LinkSection,
    currIndex: number,
    nextIndex: number
  ) => void
}

const DragType = "LINK"

const SectionLinkItem: React.FC<SectionLinkItemProps> = (props) => {
  const {
    item,
    editMode,
    section,
    index,
    onDeleteLink,
    onOpenLink,
    onChangeIndex,
  } = props
  const handleChangeIndex: UseSortablePayload["onChangeIndex"] = (
    curr,
    next
  ) => {
    onChangeIndex(section, curr, next)
  }

  const { itemRef, dragHandleRef, style } = useSortable({
    index,
    item,
    type: DragType,
    canDrag: editMode,
    onChangeIndex: handleChangeIndex,
  })

  return (
    <li ref={itemRef} style={style}>
      <div className="button-wrapper">
        <button
          type="button"
          className="link-button"
          onClick={() => !editMode && onOpenLink(item)}
        >
          {item.label}
        </button>
        {editMode && (
          <>
            <button
              type="button"
              className="dragHandle"
              onClick={() => onDeleteLink(section, item)}
            >
              🗑
            </button>
            <button type="button" className="dragHandle" ref={dragHandleRef}>
              <DragHandleIcon />
            </button>
          </>
        )}
      </div>
    </li>
  )
}

export default SectionLinkItem
