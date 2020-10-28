import React from "react"
import styled from "styled-components"
import BaseModal from "./BaseModal"
import useModal from "../../behaviour/useModal"
import Button from "../common/Button"
import ConfirmControls from "../ConfirmControls"

const Wrapper = styled.div``

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
        <ConfirmControls onConfirm={handleConfirm} onDecline={handleCancel} />
      </Wrapper>
    </BaseModal>
  )
}

export default ConfirmModal
