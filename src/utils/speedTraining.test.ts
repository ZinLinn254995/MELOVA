import test from 'node:test';
import assert from 'node:assert/strict';
import { getNextTrainingTempo, hasReachedTrainingGoal } from './speedTraining';

test('speed training increases tempo by the selected increment', () => {
  assert.equal(getNextTrainingTempo(60, 5), 65);
  assert.equal(getNextTrainingTempo(60, 10), 70);
});

test('speed training never exceeds its maximum tempo', () => {
  assert.equal(getNextTrainingTempo(155, 10), 160);
  assert.equal(getNextTrainingTempo(160, 5), 160);
});

test('speed goal detection uses the configured target', () => {
  assert.equal(hasReachedTrainingGoal(159), false);
  assert.equal(hasReachedTrainingGoal(160), true);
  assert.equal(hasReachedTrainingGoal(120, 120), true);
});
