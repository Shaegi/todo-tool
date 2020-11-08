import { PipelineStatus, StageStatus } from "./behaviour/useProjectData"

/* eslint-disable import/prefer-default-export */
export const getIconByFailedCount = (count: number) => {
  if (count === 0) {
    return "💯"
  }
  if (count > 8) {
    return "❌"
  }
  if (count > 5) {
    return "〽️"
  }
  return "✅"
}

export const pipelineStatusEmojiMap: Record<PipelineStatus, string> = {
  [PipelineStatus.RUNNING]: "🏃",
  [PipelineStatus.FAILED]: "❌",
  [PipelineStatus.SUCCESS]: "✔️",
  [PipelineStatus.SKIPPED]: "⏩",
}

export const stageStatusToEmojiMap: Record<StageStatus, string> = {
  [StageStatus.RUNNING]: "🏃",
  [StageStatus.FAILED]: "❌",
  [StageStatus.SUCCESS]: "✔️",
  [StageStatus.SKIPPED]: "⏩",
  [StageStatus.CREATED]: "🔜",
  [StageStatus.CANCELED]: "🚫",
}
