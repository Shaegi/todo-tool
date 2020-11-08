import React from "react"
import styled from "styled-components"

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 99;
  backdrop-filter: blur(2px);
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;

  .modal-content {
    background: white;
    position: relative;
    color: black;
    min-width: 30%;
    padding: 8px;
    .close-button {
      position: absolute;
      right: 8px;
      top: 9px;
    }
  }
`

export type BaseModalProps = {
  onClose: () => void
  showClose?: boolean
}

const BaseModal: React.FC<BaseModalProps> = (props) => {
  const { showClose = true } = props
  return (
    <Wrapper onClick={props.onClose} className="base-model-wrapper">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {showClose && (
          <button
            type="button"
            className="close-button"
            onClick={props.onClose}
          >
            ❌
          </button>
        )}
        {props.children}
      </div>
    </Wrapper>
  )
}

export default BaseModal
