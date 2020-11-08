import React, { useRef, useState } from "react"
import { useDrag, useDrop } from "react-dnd"
import { LinkSection, SectionItem } from "./SectionList"

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
  const [isHovered, setHovered] = useState(false)
  const ref = useRef<HTMLLIElement>(null)
  const [{ opacity }, dragRef] = useDrag({
    item: { type: DragType, item, index },
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.5 : 1,
    }),
  })

  const [, dropRef] = useDrop({
    accept: DragType,
    hover(item, monitor) {
      if (!ref.current) {
        return
      }
      if (!editMode) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      if (!hoverBoundingRect) {
        return
      }
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      // Determine mouse position
      const clientOffset = monitor.getClientOffset()
      if (!clientOffset) {
        return
      }
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }
      // Time to actually perform the action
      onChangeIndex(section, item.index, hoverIndex)
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
  })

  dragRef(dropRef(ref))

  return (
    <li ref={ref} style={{ opacity }}>
      <button
        type="button"
        onMouseEnter={() => editMode && setHovered(true)}
        onMouseLeave={() => editMode && setHovered(false)}
        onClick={() =>
          editMode ? onDeleteLink(section, item) : onOpenLink(item)
        }
      >
        {isHovered ? "🗑" : item.label}
      </button>
    </li>
  )
}

export default SectionLinkItem
