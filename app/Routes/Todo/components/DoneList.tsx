import React, { useState } from "react"
import styled from "styled-components"
import Button from "../../../components/common/Button"
import { ToDoItem } from "./List"

const Wrapper = styled.div`
  .showDone {
    display: flex;
    align-items: center;
  }

  .doneList {
    li {
      span {
        text-decoration: line-through;
      }
    }
  }
`

export type DoneItem = ToDoItem & {
  index: number
}

type DoneListProps = {
  list: DoneItem[]
  onReAddItem: (item: DoneItem) => void
}

const DoneList: React.FC<DoneListProps> = (props) => {
  const { list: doneList, onReAddItem } = props
  const [showDone, setShowDone] = useState(false)

  return (
    <Wrapper>
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
                <li key={item.name} onDoubleClick={() => onReAddItem(item)}>
                  <span title={item.name}>👌{item.name}</span>
                  <Button emoji="✅" onClick={() => onReAddItem(item)} />
                </li>
              )
            })}
          </ul>
        ) : (
          <div>No items done yet</div>
        )
      ) : null}
    </Wrapper>
  )
}

export default DoneList
