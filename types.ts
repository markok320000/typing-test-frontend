
export enum TestStatus {
  Waiting = 'WAITING',
  Started = 'STARTED',
  Finished = 'FINISHED',
}

export interface TestResult {
  wpm: number;
  cpm: number;
  accuracy: number;
  time: number;
}
