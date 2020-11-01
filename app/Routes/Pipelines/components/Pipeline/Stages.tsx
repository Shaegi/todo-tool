import React from "react"
import styled from "styled-components"
import { PipelineStage } from "../../behaviour/useProjectData"
import { stageStatusToEmojiMap } from "../../utils"

const Wrapper = styled.ul`
  display: flex;
  align-items: center;
  border: 1px solid white;
  border-top: none;
  border-bottom: none;
  padding: 0 4px;
  margin: 0 4px;

  li + li {
    &::before {
      content: ">";
    }
  }
`

const stageNameToEmojiMap: Record<string, string> = {
  publish: "📡",
  build: "👷",
  codequality: "🧫",
  skipped: "⏩",
  deploy: "🚀",
  external: "🛰",
}

export type StagesProps = {
  stages: PipelineStage[]
}

const Stages: React.FC<StagesProps> = (props) => {
  const { stages } = props
  return (
    <Wrapper>
      {stages.map(({ node }) => {
        return (
          <li key={node.name} title={node.name}>
            {stageNameToEmojiMap[node.name] || "❓"}
            {stageStatusToEmojiMap[node.detailedStatus.group] ||
              node.detailedStatus.group}
          </li>
        )
      })}
    </Wrapper>
  )
}

export default Stages
