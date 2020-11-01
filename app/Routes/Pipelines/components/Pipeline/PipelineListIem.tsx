import React, { useCallback, useMemo } from "react"
import { shell } from "electron"
import styled from "styled-components"
import classNames from "classnames"
import useSettings from "../../../../behaviour/useSettings"
import { Pipeline, useGitUser } from "../../behaviour/useProjectData"
import { statusEmojiMap } from "../../utils"

export const pipelineListItemClass = "pipeline-list-item"

const Wrapper = styled.li`
  padding: 4px 8px;
  cursor: pointer;

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

  const handleOpen = useCallback(() => {
    shell.openExternal(git + detailedStatus.detailsPath)
  }, [detailedStatus])

  const resolvedDuration = useMemo(() => {
    const minutes = Math.floor(duration / 60)
    const seconds = duration - minutes * 60
    return `🕒 ${minutes}:${seconds > 10 ? seconds : `0${seconds}`}`
  }, [duration])

  const finishedAgo = useMemo(() => {
    const currDate = new Date()
    const finishedDate = new Date(finishedAt)

    // @ts-ignore
    const secSince = (currDate - finishedDate) / 1000

    const days = Math.floor(secSince / 60 / 60 / 24)

    if (days > 0) {
      return `${days} days ago`
    }
    const hours = Math.floor(secSince / 60 / 60)
    if (hours > 0) {
      return `${hours} hours ago`
    }
    const minutes = Math.floor(secSince / 60)
    if (minutes > 0) {
      return `${minutes} minutes ago`
    }
    return `${secSince} seconds ago`
  }, [finishedAt])

  return (
    <Wrapper className={pipelineListItemClass} onClick={handleOpen}>
      <div
        className="status"
        title={status[0] + status.substring(1, status.length).toLowerCase()}
      >
        {statusEmojiMap[status]}
      </div>
      <div className="duration">{resolvedDuration}</div>
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
            >
              👋
            </span>
          )}
        </span>
      </div>
      <div>{finishedAgo}</div>
    </Wrapper>
  )
}

export default PipelineListItem
