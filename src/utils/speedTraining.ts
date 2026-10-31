export const SPEED_TRAINING_START_BPM = 60;
export const SPEED_TRAINING_MAX_BPM = 160;

export function getNextTrainingTempo(currentBpm: number, increment = 5, maximum = SPEED_TRAINING_MAX_BPM): number {
  const safeIncrement = Math.max(1, Math.floor(increment));
  const safeMaximum = Math.max(1, Math.floor(maximum));
  return Math.min(safeMaximum, Math.max(1, Math.floor(currentBpm)) + safeIncrement);
}

export function hasReachedTrainingGoal(currentBpm: number, maximum = SPEED_TRAINING_MAX_BPM): boolean {
  return currentBpm >= maximum;
}
