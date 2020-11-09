import React, { useCallback, useState, useContext } from "react"
import ConfirmModal from "../components/modal/ConfirmModal"
import AddLinkModal from "../Routes/Home/components/SectionList/AddLinkModal"

type ModalContextValue = {
  openModal: ModalState | null
  showModal: (modal: ModalTypes, payload: Record<string, any>) => void
  hideModal: () => void
}

const ModalContext = React.createContext<ModalContextValue>({
  openModal: null,
  showModal: () => {},
  hideModal: () => {},
})

export enum ModalTypes {
  CONFIRM = "CONFIRM",
  ADD_SECTION_LINK = "ADD_SECTION_LINK",
}

const getModalFromType = (type: ModalTypes) => {
  switch (type) {
    case ModalTypes.CONFIRM:
      return ConfirmModal
    case ModalTypes.ADD_SECTION_LINK:
      return AddLinkModal
    default:
      return null
  }
}

type ModalState = {
  type: ModalTypes
  payload: Record<string, any>
}

export const ModalContextProvider: React.FC = (props) => {
  const [openModal, setOpenModal] = useState<ModalContextValue["openModal"]>(
    null
  )

  const showModal = useCallback<ModalContextValue["showModal"]>(
    (modal: ModalTypes, payload: Record<string, any>) => {
      setOpenModal({
        type: modal,
        payload,
      })
    },
    []
  )

  const Modal = (openModal ? getModalFromType(openModal.type) : null) as any

  const hideModal = useCallback<ModalContextValue["hideModal"]>(() => {
    setOpenModal(null)
  }, [])

  return (
    <ModalContext.Provider
      value={{
        openModal,
        showModal,
        hideModal,
      }}
    >
      {Modal && openModal && <Modal {...openModal.payload} />}
      {props.children}
    </ModalContext.Provider>
  )
}

export default function useModal() {
  return useContext(ModalContext)
}
