import React from "react"
import useModal, { ModalTypes } from "../behaviour/useModal"
import Button from "./common/Button"

type ListHeadlineProps = {
  label: React.ReactNode
  onDelete: () => void
  customConfirmMessage?: string
}

const ListHeadline: React.FC<ListHeadlineProps> = (props) => {
  const { label, onDelete, customConfirmMessage } = props

  const { showModal } = useModal()

  return (
    <h1>
      {label}
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
    </h1>
  )
}

export default ListHeadline
