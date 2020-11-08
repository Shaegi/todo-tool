import React, { useCallback, useState } from "react"
import styled from "styled-components"
import useModal, { ModalTypes } from "../behaviour/useModal"
import Button from "./common/Button"
import ConfirmControls from "./ConfirmControls"

const Wrapper = styled.div`
  display: flex;
  align-items: center;

  h1 {
    margin-right: 8px;
  }
`

type ListHeadlineProps = {
  label: string
  emoji?: string
  onDelete: () => void
  onEditLabel?: (newLabel: string) => void
  customConfirmMessage?: string
}

const ListHeadline: React.FC<ListHeadlineProps> = (props) => {
  const { onDelete, customConfirmMessage, onEditLabel, emoji } = props
  const { showModal } = useModal()
  const [editMode, setEditMode] = useState(false)
  const [label, setLabel] = useState<string>(props.label)

  const handleDeclineEdit = useCallback(() => {
    setLabel(props.label)
    setEditMode(false)
  }, [props.label])

  const handleConfirmEdit = useCallback(() => {
    setEditMode(false)
    onEditLabel?.(label)
  }, [label])

  return (
    <Wrapper>
      <h1>
        {emoji && <span>{emoji}</span>}
        {!editMode ? (
          <span>{label}</span>
        ) : (
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        )}
      </h1>
      {onEditLabel ? (
        !editMode ? (
          <Button onClick={() => setEditMode(true)} emoji="✏️" />
        ) : (
          <ConfirmControls
            onConfirm={handleConfirmEdit}
            onDecline={handleDeclineEdit}
          />
        )
      ) : null}
      <Button
        emoji="🗑"
        className="delete-button"
        onClick={() =>
          showModal(ModalTypes.CONFIRM, {
            onConfirm: () => {
              onDelete()
            },
            message: customConfirmMessage,
            onAbort: () => {},
          })
        }
      >
        Delete
      </Button>
    </Wrapper>
  )
}

export default ListHeadline
