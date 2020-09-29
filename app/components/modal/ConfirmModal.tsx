import React from "react"
import styled from "styled-components"
import BaseModal from "./BaseModal"
import useModal from "../../behaviour/useModal"

const Wrapper = styled.div`
  .controls {
    margin-top: 8px;
    button {
      font-size: 1.3em;
      margin-right: 8px;
    }
  }
`

type ConfirmModalProps = {
  message?: string
  onAbort: () => void
  onConfirm: () => void
}

const ConfirmModal: React.FC<ConfirmModalProps> = (props) => {
  const { message, onAbort, onConfirm } = props
  const { hideModal } = useModal()

  const handleConfirm = () => {
    hideModal()
    onConfirm()
  }

  const handleCancel = () => {
    hideModal()
    onAbort()
  }

  return (
    <BaseModal onClose={handleCancel} showClose={false}>
      <Wrapper>
        <span className="message"> {message ?? "Confirm?"} </span>
        <div className="controls">
          <button type="button" onClick={handleConfirm}>
            ✔️
          </button>
          <button type="button" onClick={handleCancel}>
            ❌
          </button>
        </div>
      </Wrapper>
    </BaseModal>
  )
}

export default ConfirmModal
