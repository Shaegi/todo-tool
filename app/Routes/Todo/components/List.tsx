import React, { useState } from "react"
import styled from "styled-components"
import Button from "../../../components/common/Button"
import DoneList, { DoneItem } from "./DoneList"

const Wrapper = styled.div`
  .input {
    display: flex;
    width: 100%;

    textarea {
      width: 100%;
    }

    input {
      width: 100%;
      height: 50px;
      display: block;
    }
  }

  button {
    color: white;
  }

  .emptyList {
    text-align: center;
    user-select: none;
  }

  .addPrio {
    color: ${(p) => p.theme.color.error[200]};
  }

  ul {
    max-width: 100%;
    width: 100%;
    overflow: hidden;
    li {
      max-width: 100%;
      width: 100%;
      overflow: hidden;

      cursor: pointer;

      :hover {
        background: ${(p) => p.theme.color.prim[400]};
      }

      span {
        max-width: 100%;
        width: 100%;
        overflow: hidden;
        word-break: break-all;

        text-overflow: ellipsis;
      }
    }
  }
`

export type ToDoItem = {
  index: number
  prio: number
  name: string
}

type ListState = {
  list: ToDoItem[]
  doneList: any[]
  showDone: boolean
  inputValue: string
}
type ListProps = {}

const List: React.FC<ListProps> = (props) => {
  const [inputValue, setInputValue] = useState("")
  const [list, setList] = useState<ToDoItem[]>([])
  const [doneList, setDoneList] = useState<DoneItem[]>([])

  const addListItem = (item: ToDoItem | null = null, prio = 0) => {
    if (!item && inputValue.trim().length === 0) {
      return
    }

    const addItem = item || {
      name: inputValue,
      index: list.length,
      prio,
    }
    setInputValue("")
    setList((prev) => [...prev, addItem])
  }

  const removeItem = (item: DoneItem, done = false) => {
    if (done) {
      setDoneList((prev) => [...prev, { ...item, index: prev.length }])
    }

    setList((prev) => prev.filter((i) => i.index !== item.index))
  }

  const getSortedByPriority = (list: ListState["list"]) => {
    const prio: ToDoItem[] = []
    const common: ToDoItem[] = []
    list.forEach((item) => {
      if (item.prio === 1) {
        prio.push(item)
      } else {
        common.push(item)
      }
    })

    return [...prio.reverse(), ...common.reverse()]
  }

  const handleReAddItem = (item: ToDoItem) => {
    setDoneList((prev) => prev.filter((i) => i.index !== item.index))
    addListItem({ ...item, index: list.length })
  }

  return (
    <Wrapper>
      <div className="input">
        <textarea
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
          }}
        />
        <Button emoji="✔️" onClick={() => addListItem(null, 0)} />
        <Button
          className="addPrio"
          emoji="✔️"
          onClick={() => addListItem(null, 1)}
        />
      </div>
      {list.length > 0 ? (
        <ul className="list">
          {getSortedByPriority(list).map((item) => {
            return (
              <li key={item.name} onDoubleClick={() => removeItem(item, true)}>
                <span title={item.name}>
                  {item.prio === 1 ? "🚨" : "📝"}
                  {item.name}
                </span>
                <Button emoji="✔️" onClick={() => removeItem(item, true)} />
                <Button emoji="❌" onClick={() => removeItem(item, false)} />
              </li>
            )
          })}
        </ul>
      ) : (
        <div className="emptyList">✨ Nothing todo ✨</div>
      )}
      <DoneList list={doneList} onReAddItem={handleReAddItem} />
    </Wrapper>
  )
}

export default List
