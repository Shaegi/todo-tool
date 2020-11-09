import * as React from "react"
import styled from "styled-components"
import { shell } from "electron"
import useModal, { ModalTypes } from "../../../../behaviour/useModal"
import AddSectionInput from "./AddSectionInput"
import useSectionListData from "./behaviour/useSectionListData"
import Section, { SectionProps } from "./Section"
import SectionLinkItem, { SectionLinkItemProps } from "./SectionLinkItem"

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  max-height: 71vh;

  .section {
    .edit-controls {
      display: flex;
      flex-shrink: 0;
      height: 30px;
      align-items: center;
      .drag-handle {
        color: white;
      }
      .delete-button {
        color: white;
        font-size: 0.8em;
      }

      .add-link {
        color: white;
        height: 25px;
        width: 25px;
        background: ${(p) => p.theme.color.green[500]};
        :hover {
          background: ${(p) => p.theme.color.green[400]};
        }
      }
    }
  }

  .section h2 {
    margin-top: 0;
    display: flex;
    padding: 0 8px;
    justify-content: space-between;
  }

  ul {
    li > .button-wrapper {
      display: flex;
      align-items: center;
      height: 50px;
      justify-content: space-between;
      button {
        color: white;
        font-weight: 600;
        font-size: 1.1em;
        height: 100%;

        &.link-button {
          flex-grow: 1;
        }

        :hover {
          background: white;
          color: ${(p) => p.theme.color.prim[300]};
        }
      }
      margin-bottom: 16px;
      border: 1px solid white;
      width: 200px;
    }
  }
`

export type LinkSection = {
  id: string
  label: string
  icon: string
  items: SectionItem[]
}

type SectionListProps = {
  editMode?: boolean
}

export type SectionItem = {
  id: string
  url: string
  icon?: string
  label?: string
}

const SectionList: React.FC<SectionListProps> = (props) => {
  const { editMode = true } = props

  const { sectionList, persistSectionList } = useSectionListData()
  const { showModal } = useModal()

  const handleLink = (item: SectionItem) => {
    shell.openExternal(item.url)
  }

  const handleAddSection = (section: LinkSection) => {
    persistSectionList((prev) => {
      return [...prev, section]
    })
  }

  const handleAddLink = (section: LinkSection, item: SectionItem) => {
    persistSectionList((prev) => {
      const next = [...prev]

      const sectionItem = next.find((s) => s.id === section.id)
      if (sectionItem) {
        sectionItem.items.push(item)
      }

      return next
    })
  }

  const handleDeleteLink = (section: LinkSection, item: SectionItem) => {
    showModal(ModalTypes.CONFIRM, {
      message: `Delete Link "${item.label}" to "${item.url}"?`,
      onConfirm: () => {
        persistSectionList((prev) => {
          const next = [...prev]

          const sectionItem = next.find((s) => s.id === section.id)
          if (sectionItem) {
            sectionItem.items = sectionItem.items.filter(
              (i) => i.id !== item.id
            )
          }

          return next
        })
      },
      onAbort: () => {},
    })
  }

  const handleDeleteSection = (section: LinkSection) => {
    showModal(ModalTypes.CONFIRM, {
      message: `Delete section "${section.label}" and all its ${section.items.length} items?`,
      onConfirm: () => {
        persistSectionList((prev) => {
          return prev.filter((s) => s.id !== section.id)
        })
      },
      onAbort: () => {},
    })
  }

  const handleChangeLinkIndex: SectionLinkItemProps["onChangeIndex"] = React.useCallback(
    (itemSection, currIndex, nextIndex) => {
      persistSectionList((prev) => {
        const next = [...prev]
        const nextSection = next.find((s) => s.id === itemSection.id)
        if (nextSection) {
          const currItem = nextSection.items[currIndex]
          if (currItem) {
            const nextItems = nextSection.items.filter(
              (i) => i.id !== currItem?.id
            )
            nextItems.splice(nextIndex, 0, currItem)
            nextSection.items = nextItems
          }
        }
        return next
      })
    },
    []
  )

  const handleChangeSectionIndex: SectionProps["onChangeIndex"] = React.useCallback(
    (currIndex, nextIndex) => {
      persistSectionList((prev) => {
        const currSection = prev[currIndex]
        const next = [...prev].filter((s) => s.id !== currSection.id)
        next.splice(nextIndex, 0, currSection)
        return next
      })
    },
    []
  )

  return (
    <Wrapper>
      {editMode && <AddSectionInput onAdd={handleAddSection} />}
      {sectionList.map((section, index) => {
        return (
          <Section
            index={index}
            key={section.id}
            section={section}
            editMode={editMode}
            onAddLink={handleAddLink}
            onChangeIndex={handleChangeSectionIndex}
            onDeleteSection={handleDeleteSection}
          >
            {section.items.map((item, index) => {
              return (
                <SectionLinkItem
                  key={item.id}
                  index={index}
                  section={section}
                  item={item}
                  editMode={editMode}
                  onChangeIndex={handleChangeLinkIndex}
                  onDeleteLink={handleDeleteLink}
                  onOpenLink={handleLink}
                />
              )
            })}
          </Section>
        )
      })}
    </Wrapper>
  )
}

export default SectionList
