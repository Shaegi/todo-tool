import React from "react"
import styled from "styled-components"
import useModal, { ModalTypes } from "../behaviour/useModal"
import Button from "./common/Button"

const Wrapper = styled.div`
  display: flex;
  align-items: center;

  h1 {
    margin-right: 8px;
  }
`

type ListHeadlineProps = {
  label: React.ReactNode
  onDelete: () => void
  customConfirmMessage?: string
}

const ListHeadline: React.FC<ListHeadlineProps> = (props) => {
  const { label, onDelete, customConfirmMessage } = props

  const { showModal } = useModal()

  return (
    <Wrapper>
      <h1>
        <span>{label}</span>
      </h1>
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
