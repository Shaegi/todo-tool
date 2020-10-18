import React, { useMemo, useRef, useState } from "react"
import { v4 } from "uuid"
import styled from "styled-components"
import { useReadUserData, useWriteUserData } from "../../behaviour/useUserData"
import TabBar, { TabBarItem, TabBarRef } from "../../components/TabBar"
import EmojiSelect from "../../components/EmojiSelect"
import List from "./components/List"
import ConfirmControls from "../../components/ConfirmControls"
import Button from "../../components/common/Button"

export const TODO_LIST_PATH = "todoList"

const Wrapper = styled.div`
  width: 100%;

  .content {
    padding: 16px;
    padding-top: 0;
    width: 100%;
  }
`

export type TodoProps = {}

export type ToDoListItem = {
  id: string
  label: string
  icon: string
}

const Todo: React.FC<TodoProps> = (props) => {
  const writeUserData = useWriteUserData()
  const readUserData = useReadUserData()
  const tabBarRef = useRef<TabBarRef>(null)
  const [list, setList] = useState<ToDoListItem[]>(
    readUserData({
      fileName: TODO_LIST_PATH,
    }) || []
  )

  const dispatchList = (updater: (prev: typeof list) => typeof list) => {
    setList((p) => {
      const next = updater(p)

      writeUserData({
        fileName: TODO_LIST_PATH,
        data: JSON.stringify(next),
      })

      return next
    })
  }

  const handleAdd: AddItemContentProps["onAdd"] = (item) => {
    dispatchList((p) => {
      const next = [...p, item]
      tabBarRef.current?.setIndex(next.length)
      return next
    })
  }

  const deleteItem = (item: ToDoListItem) => {
    dispatchList((p) => {
      const next = p.filter((p) => p.id !== item.id)
      tabBarRef.current?.setIndex(next.length)
      return next
    })
  }

  const sidebarItems = useMemo<TabBarItem[]>(() => {
    return [
      {
        key: "add-item",
        Renderer: (
          <div>
            <div>Add</div>
          </div>
        ),
        ContentRenderer: <AddItemContent onAdd={handleAdd} />,
      },
      ...list.map((item) => {
        return {
          key: item.id,
          ContentRenderer: (
            <div className="content">
              <h1>
                {item.icon} {item.label}
                <Button
                  emoji="🗑"
                  className="delete-button"
                  onClick={() => deleteItem(item)}
                >
                  Delete
                </Button>
              </h1>
              <List />
            </div>
          ),
          Renderer: (
            <div>
              <div>
                {item.icon} <br />
                {item.label}
              </div>
            </div>
          ),
        }
      }),
    ]
  }, [list])

  return (
    <Wrapper className="todo-view">
      <TabBar
        ref={tabBarRef}
        items={sidebarItems}
        initialActiveIndex={sidebarItems.length === 1 ? 0 : 1}
      />
    </Wrapper>
  )
}

type AddItemContentProps = {
  onAdd: (item: ToDoListItem) => void
}

const AddItemContent: React.FC<AddItemContentProps> = (props) => {
  const { onAdd } = props
  const [label, setLabel] = useState("")
  const [emoji, setEmoji] = useState("")

  const handleCancel = () => {
    setLabel("")
    setEmoji("")
  }

  const handleAdd = () => {
    onAdd({
      id: v4(),
      label,
      icon: emoji,
    })
    handleCancel()
  }

  return (
    <div>
      Add new Todo List!
      <input value={label} onChange={(e) => setLabel(e.target.value)} />
      <EmojiSelect onChange={(e) => setEmoji(e.target.value)} />
      <ConfirmControls onConfirm={handleAdd} onDecline={handleCancel} />
    </div>
  )
}

export default Todo
