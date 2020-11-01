import { PipelineStatus } from "./behaviour/useProjectData"

/* eslint-disable import/prefer-default-export */
export const getIconByFailedCount = (count: number) => {
  if (count === 0) {
    return "✅"
  }
  if (count > 8) {
    return "❌"
  }
  if (count > 5) {
    return "〽️"
  }
  return ""
}

export const statusEmojiMap: Record<PipelineStatus, string> = {
  [PipelineStatus.RUNNING]: "🏃",
  [PipelineStatus.FAILED]: "❌",
  [PipelineStatus.SUCCESS]: "✔️",
}
