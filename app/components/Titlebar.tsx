import React, { useEffect, useState } from "react"
import styled from "styled-components"
import ClearIcon from "@material-ui/icons/Clear"
import MinimizeIcon from "@material-ui/icons/Minimize"
import { remote } from "electron"
import Crop32Icon from "@material-ui/icons/Crop32"
import FilterNoneIcon from "@material-ui/icons/FilterNone"

const Wrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  height: 40px;

  background: ${(p) => p.theme.color.prim[400]};

  .dragbar {
    width: 100%;
    -webkit-app-region: drag;

    display: flex;
    height: 100%;
    align-items: center;

    .titlebar-title {
      padding-left: 12px;
    }
  }

  button {
    height: 100%;
    color: white;
    width: 70px;

    :hover {
      opacity: 0.5;
    }
  }

  .close {
    background: ${(p) => p.theme.color.error[500]};
  }
`

type TitleBarProps = {}

const TitleBar: React.FC<TitleBarProps> = () => {
  const [isMaximized, setMaximized] = useState(
    remote.getCurrentWindow().isMaximized
  )

  useEffect(() => {
    const resizeListener = () => {
      setMaximized(remote.getCurrentWindow().isMaximized)
    }
    remote.getCurrentWindow().addListener("resize", resizeListener)

    return () => {
      remote.getCurrentWindow().removeListener("resize", resizeListener)
    }
  }, [])

  return (
    <Wrapper>
      <div className="dragbar">
        <span className="titlebar-title">Todo-Tool</span>
      </div>
      {remote.getCurrentWindow().minimizable && (
        <button
          type="button"
          className="minimize"
          onClick={() => {
            remote.getCurrentWindow().minimize()
          }}
        >
          <MinimizeIcon />
        </button>
      )}
      {isMaximized ? (
        <button
          type="button"
          className="unmaximize"
          onClick={() => {
            remote.getCurrentWindow().unmaximize()
          }}
        >
          <FilterNoneIcon />
        </button>
      ) : (
        <button
          type="button"
          className="maximize"
          onClick={() => {
            remote.getCurrentWindow().maximize()
          }}
        >
          <Crop32Icon />
        </button>
      )}
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
