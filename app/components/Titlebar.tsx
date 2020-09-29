import React from "react"
import styled from "styled-components"
import ClearIcon from "@material-ui/icons/Clear"
import { remote } from "electron"

const Wrapper = styled.div`
  display: flex;
  justify-content: flex-end;

  background: ${(p) => p.theme.color.prim[400]};

  .dragbar {
    width: 100%;
    -webkit-app-region: drag;
  }

  .close {
    background: ${(p) => p.theme.color.error[500]};
    color: white;
    height: 5vh;
    width: 5vw;
  }
`

type TitleBarProps = {}

const TitleBar: React.FC<TitleBarProps> = () => {
  return (
    <Wrapper>
      <div className="dragbar" />
      <button
        type="button"
        className="close"
        onClick={() => {
          remote.getCurrentWindow().close()
        }}
      >
        <ClearIcon />
      </button>
    </Wrapper>
  )
}

export default TitleBar
