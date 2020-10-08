import React, { useState } from "react"
import styled from "styled-components"

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

  .showDone {
    display: flex;
    align-items: center;
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

  .doneList {
    li {
      span {
        text-decoration: line-through;
      }
    }
  }
`

type ToDoItem = {
  index: number
  prio: number
  name: string
}

type DoneItem = ToDoItem & {
  index: number
}

type ListState = {
  list: ToDoItem[]
  doneList: any[]
  showDone: boolean
  inputValue: string
}
type ListProps = any

const List: React.FC<ListProps> = () => {
  const [inputValue, setInputValue] = useState("")
  const [list, setList] = useState<ToDoItem[]>([])
  const [doneList, setDoneList] = useState<DoneItem[]>([])
  const [showDone, setShowDone] = useState(false)

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

  const readItem = (item: ToDoItem) => {
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
        <button type="button" onClick={() => addListItem(null, 0)}>
          ✔️
        </button>
        <button
          type="button"
          className="addPrio"
          onClick={() => addListItem(null, 1)}
        >
          ✔️
        </button>
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
                <button type="button" onClick={() => removeItem(item, true)}>
                  ✔️
                </button>
                <button type="button" onClick={() => removeItem(item, false)}>
                  ❌
                </button>
              </li>
            )
          })}
        </ul>
      ) : (
        <div className="emptyList">✨ Nothing todo ✨</div>
      )}
      <div>
        <button
          type="button"
          className="showDone"
          onClick={() => setShowDone((p) => !p)}
        >
          {showDone ? "Hide" : "Show"} Done
          {showDone ? "🔽" : "🔼"}
        </button>
        {showDone ? (
          doneList.length > 0 ? (
            <ul className="doneList">
              {doneList.map((item) => {
                return (
                  <li key={item.name} onDoubleClick={() => readItem(item)}>
                    <span title={item.name}>👌{item.name}</span>
                    <button type="button" onClick={() => readItem(item)}>
                      ✅
                    </button>
                  </li>
                )
              })}
            </ul>
          ) : (
            <div>No items done yet</div>
          )
        ) : null}
      </div>
    </Wrapper>
  )
}

export default List
