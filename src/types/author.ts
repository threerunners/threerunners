export interface Author {
  id: string
  slug: string
  name: string
  runnerTypeTag: string
  voiceLine: string
  weeklyMileage: string
  yearsRunning: number
  racesCompleted: string
  currentTrainingGoal: string
  pb: string
  stravaHandle: string
  photo: string | null
  initials: string
  runningStory: string
  authoredSpokes: string[]
}
