import React, { useCallback, useEffect, useMemo, useState } from "react"
import { shell } from "electron"
import styled from "styled-components"
import classNames from "classnames"
import useSettings from "../../../../behaviour/useSettings"

import Stages from "./Stages"
import { pipelineStatusEmojiMap } from "../../utils"
import { Pipeline, PipelineStatus } from "../../types"
import useGitUser from "../../behaviour/useGitUser"

export const pipelineListItemClass = "pipeline-list-item"

const Wrapper = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 8px;
  cursor: pointer;

  .left-section {
    display: flex;

    .duration,
    .status {
      display: flex;
      align-items: center;
    }
  }

  .user {
    display: flex;
    align-items: center;
    padding-left: 8px;

    .user-name {
      margin-left: 8px;
    }
  }
  .user-img {
    height: 30px;
    border-radius: 50%;
  }
`

type PipelineListItemProps = {
  pipeline: Pipeline
  user: ReturnType<typeof useGitUser>["data"]
}

const PipelineListItem: React.FC<PipelineListItemProps> = (props) => {
  const { pipeline, user } = props
  const { status, detailedStatus, duration, finishedAt } = pipeline

  const userId = user?.currentUser.id

  const {
    settings: { git },
  } = useSettings()

  const [finishedAgo, setFinishedAgo] = useState<string | null>(null)
  const handleOpen = useCallback(() => {
    shell.openExternal(git + detailedStatus.detailsPath)
  }, [detailedStatus])

  const resolvedDuration = useMemo(() => {
    const minutes = Math.floor(duration / 60)
    const seconds = Math.floor(duration - minutes * 60)
    return `🕒 ${minutes}:${seconds > 10 ? seconds : `0${seconds}`}`
  }, [duration])

  useEffect(() => {
    let interval: null | ReturnType<typeof setInterval> = null
    if (finishedAt) {
      const refresh = () => {
        const refreshed = (() => {
          const currDate = new Date()
          const finishedDate = new Date(finishedAt)

          // @ts-ignore
          const secSince = (currDate - finishedDate) / 1000

          const days = Math.floor(secSince / 60 / 60 / 24)

          if (days > 0) {
            return `${days} day(s) ago`
          }
          const hours = Math.floor(secSince / 60 / 60)
          if (hours > 0) {
            return `${hours} hour(s) ago`
          }
          const minutes = Math.floor(secSince / 60)
          if (minutes > 0) {
            return `${minutes} minute(s) ago`
          }
          return `${Math.floor(secSince)} seconds ago`
        })()
        setFinishedAgo(refreshed)
      }
      interval = setInterval(() => {
        refresh()
      }, 60000)

      refresh()
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [finishedAt])

  return (
    <Wrapper className={pipelineListItemClass} onClick={handleOpen}>
      <div className="left-section">
        <div
          className="status"
          title={status[0] + status.substring(1, status.length).toLowerCase()}
        >
          {pipelineStatusEmojiMap[status]}
        </div>
        {status !== PipelineStatus.RUNNING && (
          <div className="duration">{resolvedDuration}</div>
        )}
        <Stages stages={pipeline.stages.edges} />
        <div className="user">
          <img
            src={git + pipeline.user.avatarUrl}
            className="user-img"
            alt="avatar"
          />
          <span className={classNames("user-name")}>
            {pipeline.user.name}
            {pipeline.user.id === userId && (
              <span
                className="active-user-indicator"
                role="img"
                aria-label="active user"
                title="Thats you!"
              >
                👋
              </span>
            )}
          </span>
        </div>
      </div>
      <div>{finishedAgo}</div>
    </Wrapper>
  )
}

export default PipelineListItem
