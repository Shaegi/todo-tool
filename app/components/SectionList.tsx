import * as React from "react"
import styled from "styled-components"

import { shell, remote } from "electron"
import fs from "fs"
import path from "path"
import { v4 } from "uuid"
import useModal, { ModalTypes } from "../behaviour/useModal"
import ConfirmControls from "./ConfirmControls"
import EmojiSelect from "./EmojiSelect"

const { app } = remote

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  max-height: 71vh;

  .section h2 {
    margin-top: 0;
    display: flex;
    padding: 0 8px;
    justify-content: space-between;
  }

  ul {
    li > button {
      display: block;
      margin-bottom: 16px;
      color: white;
      padding: 10px 20px;
      border: 1px solid white;
      width: 80%;
      font-weight: 600;
      font-size: 1.1em;

      button:last-of-type {
        margin-bottom: 0;
      }

      &:hover {
        background: white;
        color: ${(p) => p.theme.color.prim[300]};
      }
    }
  }
  .delete-button {
    color: white;
    font-size: 1em;
  }
`

const getSectionListPath = () =>
  path.resolve(app.getPath("userData"), "sectionList.json")

const useSectionList = () => {
  const [sectionList, setSectionList] = React.useState<Section[]>(() => {
    try {
      const data = fs.readFileSync(getSectionListPath(), "UTF-8")
      return JSON.parse(data) || []
    } catch (e) {
      return []
    }
  })

  const persistSectionList = React.useCallback(
    (updater: (prev: Section[]) => Section[]) => {
      setSectionList((prev) => {
        const next = updater(prev)
        try {
          fs.writeFileSync(getSectionListPath(), JSON.stringify(next))
        } catch (e) {
          // do nothing
        }
        return next
      })
    },
    []
  )

  return {
    sectionList,
    persistSectionList,
  }
}

type Section = {
  id: string
  label: string
  icon: string
  items: Item[]
}

type SectionListProps = {
  editMode?: boolean
}

type Item = {
  id: string
  url: string
  icon?: string
  label?: string
}

const SectionList: React.FC<SectionListProps> = (props) => {
  const { editMode = true } = props

  const { sectionList, persistSectionList } = useSectionList()
  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null)
  const [activeSection, setActiveSection] = React.useState<string | null>(null)
  const { showModal } = useModal()

  const handleLink = (item: Item) => {
    shell.openExternal(item.url)
  }

  const handleAddSection = (section: Section) => {
    persistSectionList((prev) => {
      return [...prev, section]
    })
  }

  const handleAddLink = (section: Section, item: Item) => {
    persistSectionList((prev) => {
      const next = [...prev]

      const sectionItem = next.find((s) => s.id === section.id)
      if (sectionItem) {
        sectionItem.items.push(item)
      }

      return next
    })
  }

  const handleDeleteLink = (section: Section, item: Item) => {
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

  const deleteSection = (section: Section) => {
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

  return (
    <Wrapper>
      {editMode && <AddSectionInput onAdd={handleAddSection} />}
      {sectionList.map((section) => {
        return (
          <div className="section" key={section.id}>
            <h2>
              <span>
                <span role="img">{section.icon}</span>
                {section.label}
              </span>
              {editMode && (
                <button
                  type="button"
                  className="delete-button"
                  onClick={() => deleteSection(section)}
                >
                  🗑
                </button>
              )}
            </h2>
            <ul>
              {editMode && (
                <AddLinkInput
                  active={section.id === activeSection}
                  onActivate={(section) => setActiveSection(section.id)}
                  section={section}
                  onAdd={handleAddLink}
                />
              )}
              {section.items.map((item) => {
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onMouseEnter={() => editMode && setHoveredItem(item.id)}
                      onMouseLeave={() => editMode && setHoveredItem(null)}
                      onClick={() =>
                        editMode
                          ? handleDeleteLink(section, item)
                          : handleLink(item)
                      }
                    >
                      {hoveredItem === item.id ? "🗑" : item.label}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </Wrapper>
  )
}

type AddLinkInputProps = {
  section: Section
  active: boolean
  onActivate: (section: Section) => void
  onAdd: (section: Section, link: Item) => void
}

const AddLinkInput: React.FC<AddLinkInputProps> = (props) => {
  const { section, onAdd, onActivate, active } = props

  const [addLinkMode, setAddLinkMode] = React.useState<string | null>(null)
  const [addLinkURLValue, setAddLinkURLValue] = React.useState<string>("")
  const [addLinkLabelValue, setAddLinkLabelValue] = React.useState<string>("")

  const handleCancelAddLink = () => {
    setAddLinkMode(null)
    setAddLinkURLValue("")
    setAddLinkLabelValue("")
  }

  React.useEffect(() => {
    if (!active) {
      handleCancelAddLink()
    }
  }, [active])

  const activateSection = () => {
    setAddLinkMode(section.id)
    onActivate(section)
  }

  const handleAdd = () => {
    onAdd(section, {
      id: v4(),
      url: addLinkURLValue,
      label: addLinkLabelValue,
    })
    handleCancelAddLink()
  }

  return (
    <>
      {!addLinkMode && (
        <li onClick={activateSection}>
          <button type="button">+ Add link</button>
        </li>
      )}
      {addLinkMode === section.id && active && (
        <>
          <label>Label</label>
          <input
            value={addLinkLabelValue}
            onChange={(e) => setAddLinkLabelValue(e.target.value)}
          />
          <label>Url</label>
          <input
            value={addLinkURLValue}
            onChange={(e) => setAddLinkURLValue(e.target.value)}
          />
          <ConfirmControls
            onConfirm={handleAdd}
            onDecline={handleCancelAddLink}
          />
        </>
      )}
    </>
  )
}

type AddSectionInputProps = {
  onAdd: (section: Section) => void
}

const AddSectionInput: React.FC<AddSectionInputProps> = (props) => {
  const { onAdd } = props

  const [addSectionValue, setAddActionValue] = React.useState<string>("")
  const [addSectionMode, setAddActionMode] = React.useState(false)
  const [sectionIconValue, setSectionIconValue] = React.useState<string>("")

  const handleCancelSectionMode = () => {
    setAddActionValue("")
    setAddActionMode(false)
    setSectionIconValue("")
  }

  const handleAdd = () => {
    onAdd({
      id: v4(),
      icon: sectionIconValue,
      label: addSectionValue,
      items: [],
    })
    handleCancelSectionMode()
  }

  return (
    <>
      {!addSectionMode && (
        <button
          type="button"
          className="add-section"
          onClick={() => setAddActionMode(true)}
        >
          + Add Section
        </button>
      )}
      {addSectionMode && (
        <>
          <input
            value={addSectionValue}
            onChange={(e) => setAddActionValue(e.target.value)}
          />
          <EmojiSelect
            onChange={(e) => setSectionIconValue(e.target.value)}
            initialValue={sectionIconValue}
          />
          <ConfirmControls
            onConfirm={handleAdd}
            onDecline={handleCancelSectionMode}
          />
        </>
      )}
    </>
  )
}

export default SectionList
