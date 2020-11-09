import { useRef } from "react"
import { useDrag, useDrop } from "react-dnd"

export type UseSortablePayload = {
  type: string
  item: Record<string, any>
  index: number
  canDrag?: boolean
  onChangeIndex: (currentIndex: number, nextIndex: number) => void
}

export default function useSortable(payload: UseSortablePayload) {
  const { type, item, index, canDrag, onChangeIndex } = payload
  const ref = useRef<HTMLElement>(null)
  const [{ opacity }, dragHandleRef, dragPreviewRef] = useDrag({
    item: { type, item, index },
    canDrag,
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.5 : 1,
    }),
  })

  const [, dropRef] = useDrop<
    { item: UseSortablePayload["item"]; index: number; type: string },
    any,
    any
  >({
    accept: type,
    hover(item, monitor) {
      if (!ref.current) {
        return
      }
      if (!canDrag) {
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
      onChangeIndex(item.index, hoverIndex)
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
  })

  dragPreviewRef(dropRef(ref))

  return {
    dragHandleRef,
    itemRef: ref,
    style: {
      opacity,
    },
  }
}
