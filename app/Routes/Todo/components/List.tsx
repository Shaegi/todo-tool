import React, { useMemo, useState } from "react"
import styled from "styled-components"
import {
  useWriteUserData,
  useReadUserData,
} from "../../../behaviour/useUserData"
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
type ListProps = {
  id: string
  headline: string
}

const List: React.FC<ListProps> = (props) => {
  const { id } = props

  const writeUserData = useWriteUserData()
  const readUserData = useReadUserData()

  const readData = useMemo(() => {
    const data = readUserData({
      fileName: id,
    })

    return (
      data ?? {
        list: [],
        doneList: [],
      }
    )
  }, [])

  const [inputValue, setInputValue] = useState("")

  const [list, dispatchList] = useState<ToDoItem[]>(readData.list)
  const [doneList, dispatchDoneList] = useState<DoneItem[]>(readData.doneList)

  const setLists = (
    setList: (prev: ToDoItem[]) => ToDoItem[],
    setDoneList: (prev: DoneItem[]) => DoneItem[]
  ) => {
    dispatchList((prevList) => {
      const nextList = setList(prevList)

      dispatchDoneList((prevDoneList) => {
        const nextDoneList = setDoneList(prevDoneList)

        writeUserData({
          data: JSON.stringify({
            list: nextList,
            doneList: nextDoneList,
          }),
          fileName: id,
        })

        return nextDoneList
      })

      return nextList
    })
  }

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
    setLists(
      (prev) => [...prev, addItem],
      (p) => p
    )
  }

  const removeItem = (item: DoneItem, done = false) => {
    setLists(
      (prev) => prev.filter((i) => i.index !== item.index),
      (prev) => (!done ? prev : [...prev, { ...item, index: prev.length }])
    )
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
    setLists(
      (p) => p,
      (prev) => prev.filter((i) => i.index !== item.index)
    )
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
