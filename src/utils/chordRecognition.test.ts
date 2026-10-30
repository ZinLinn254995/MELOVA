import test from 'node:test';
import assert from 'node:assert/strict';
import { getChordRecognitionChoices, getRandomChordPrompt, isChordQualityAnswer } from './chordRecognition';

test('recognition includes four foundational triad qualities', () => {
  assert.deepEqual(getChordRecognitionChoices(), ['major', 'minor', 'diminished', 'augmented']);
});
test('answer checker compares chord quality', () => {
  assert.equal(isChordQualityAnswer('major', 'major'), true);
  assert.equal(isChordQualityAnswer('major', 'minor'), false);
});
test('random prompt stays within supported roots and qualities', () => {
  assert.deepEqual(getRandomChordPrompt(() => 0), { root: 'C', quality: 'major' });
  assert.deepEqual(getRandomChordPrompt(() => 0.999), { root: 'B', quality: 'augmented' });
});
