import React, { useState } from "react"
import styled from "styled-components"
import SectionList from "./components/SectionList/SectionList"
import JiraInput from "./components/JiraInput"

const Wrapper = styled.div`
  padding: 16px;
  padding-top: 54px;
  grid-template-columns: 50% 50%;
  display: grid;
  position: relative;
  width: 100%;

  .edit-mode {
    position: absolute;
    color: white;
    top: 16px;
    right: 16px;
  }

  .input {
    margin-bottom: 8px;
  }
`
const Home: React.FC = () => {
  const [editMode, setEditMode] = useState(false)

  return (
    <Wrapper>
      <div>
        <button
          type="button"
          className="edit-mode"
          onClick={() => setEditMode((prev) => !prev)}
        >
          {editMode ? "❌" : "🖊"} Edit
        </button>
        <div className="input">
          <JiraInput />
        </div>
        <SectionList editMode={editMode} />
      </div>
    </Wrapper>
  )
}

export default Home
