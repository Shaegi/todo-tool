import React from "react"
// @ts-ignore
import CKEditor from "@ckeditor/ckeditor5-react"
// @ts-ignore
import ClassicEditor from "@ckeditor/ckeditor5-build-classic"
import styled, { createGlobalStyle } from "styled-components"
import ClearIcon from "@material-ui/icons/Clear"
import DoneIcon from "@material-ui/icons/Done"
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp"
import AddIcon from "@material-ui/icons/Add"

const Global = createGlobalStyle`

.ck-editor {
  color: black;
  width: 100% !important;
}
`

const Wrapper = styled.div`
  .input {
    display: flex;
    width: 100%;

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

type ListState = {
  list: ToDoItem[]
  doneList: any[]
  showDone: boolean
  inputValue: string
}
type ListProps = any

class List extends React.Component<ListProps, ListState> {
  editorRef = React.createRef()

  state: ListState = {
    inputValue: "",
    list: [],
    doneList: [],
    showDone: false,
  }

  addListItem = (item: ToDoItem | null = null, prio = 0) => {
    const { inputValue, list } = this.state

    if (!item && inputValue.trim().length === 0) {
      return
    }

    const addItem = item || {
      name: inputValue,
      index: list.length,
      prio,
    }

    this.setState((prev) => ({ list: [...prev.list, addItem], inputValue: "" }))
  }

  removeItem = (item: { index: number }, done = false) => {
    const { list, doneList } = this.state
    const nextList = list.filter((i) => i.index !== item.index)
    if (done) {
      const nextDoneList = [...doneList, { ...item, index: doneList.length }]
      this.setState({ doneList: nextDoneList })
    }

    this.setState({ list: nextList })
  }

  getSortedByPrio = (list: ListState["list"]) => {
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

  readdItem = (item: ToDoItem) => {
    const { doneList, list } = this.state
    this.setState({ doneList: doneList.filter((i) => i.index !== item.index) })
    this.addListItem({ ...item, index: list.length })
  }

  render() {
    const { inputValue, list, doneList, showDone } = this.state
    return (
      <Wrapper>
        <Global />
        <div className="input">
          <CKEditor
            editor={ClassicEditor}
            data={inputValue}
            ref={this.editorRef}
            config={{
              toolbar: [
                "heading",
                "|",
                "bold",
                "italic",
                "link",
                "bulletedList",
                "numberedList",
                "blockQuote",
              ],
              heading: {
                options: [
                  {
                    model: "paragraph",
                    title: "Paragraph",
                    class: "ck-heading_paragraph",
                  },
                  {
                    model: "heading1",
                    view: "h1",
                    title: "Heading 1",
                    class: "ck-heading_heading1",
                  },
                  {
                    model: "heading2",
                    view: "h2",
                    title: "Heading 2",
                    class: "ck-heading_heading2",
                  },
                ],
              },
            }}
            onInit={(editor: any) => {
              editor.keystrokes.set("Ctrl+enter", () => {
                this.addListItem(null, 0)
              })
            }}
            onChange={(e: any, editor: any) => {
              const data = editor.getData()
              this.setState({ inputValue: data })
            }}
          />
          <button type="button" onClick={() => this.addListItem(null, 0)}>
            <DoneIcon />
          </button>
          <button
            type="button"
            className="addPrio"
            onClick={() => this.addListItem(null, 1)}
          >
            <DoneIcon />
          </button>
        </div>
        {list.length > 0 ? (
          <ul className="list">
            {this.getSortedByPrio(list).map((item) => {
              return (
                <li
                  key={item.name}
                  onDoubleClick={() => this.removeItem(item, true)}
                >
                  <span title={item.name}>
                    {item.prio === 1 ? "🚨" : "📝"}
                    {item.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => this.removeItem(item, true)}
                  >
                    <DoneIcon />
                  </button>
                  <button
                    type="button"
                    onClick={() => this.removeItem(item, false)}
                  >
                    <ClearIcon />
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
            onClick={() => this.setState({ showDone: !showDone })}
          >
            {showDone ? "Hide" : "Show"} Done
            {showDone ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
          </button>
          {showDone ? (
            doneList.length > 0 ? (
              <ul className="doneList">
                {doneList.map((item) => {
                  return (
                    <li
                      key={item.name}
                      onDoubleClick={() => this.readdItem(item)}
                    >
                      <span title={item.name}>👌{item.name}</span>
                      <button
                        type="button"
                        onClick={() => this.readdItem(item)}
                      >
                        <AddIcon />
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
}

export default List
