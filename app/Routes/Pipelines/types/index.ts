export enum PipelineStatus {
  RUNNING = "RUNNING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  SKIPPED = "SKIPPED",
}

export enum StageStatus {
  RUNNING = "running",
  SUCCESS = "success",
  SKIPPED = "skipped",
  FAILED = "failed",
  CREATED = "created",
  CANCELED = "canceled",
}

export type PipelineStage = {
  node: {
    name: string
    detailedStatus: {
      group: StageStatus
    }
  }
}

export type Pipeline = {
  detailedStatus: {
    detailsPath: string
  }
  stages: {
    edges: PipelineStage[]
  }
  user: {
    id: string
    name: string
    avatarUrl: string
  }
  duration: number
  id: string
  status: PipelineStatus
  finishedAt: string
  sha: string
  createdAt: string
}
