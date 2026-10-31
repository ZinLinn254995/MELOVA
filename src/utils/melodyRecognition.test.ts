import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getMelodyChoices, getMelodyPrompt, getMelodyNoteName, isMelodyAnswer } from './melodyRecognition';

describe('melody recognition', () => {
  it('generates melodies with the requested length using natural major-scale notes', () => {
    for (const length of [3, 4, 5] as const) {
      const prompt = getMelodyPrompt(length, () => 0.5);
      assert.equal(prompt.notes.length, length);
      assert.ok(prompt.notes.every((note) => [0, 2, 4, 5, 7, 9, 11].includes(note)));
    }
  });
  it('creates four unique sequence choices including the target', () => {
    const target = [0, 4, 7];
    const choices = getMelodyChoices(target, () => 0.37);
    assert.equal(choices.length, 4);
    assert.equal(new Set(choices.map((choice) => choice.notes.join(','))).size, 4);
    assert.ok(choices.some((choice) => isMelodyAnswer(target, choice.notes)));
  });
  it('validates complete ordered melodies, not just individual notes', () => {
    assert.equal(isMelodyAnswer([0, 2, 4], [0, 2, 4]), true);
    assert.equal(isMelodyAnswer([0, 2, 4], [0, 4, 2]), false);
    assert.equal(isMelodyAnswer([0, 2, 4], [0, 2]), false);
  });
  it('maps pitch classes to readable note names', () => {
    assert.equal(getMelodyNoteName(0), 'C');
    assert.equal(getMelodyNoteName(13), 'C#');
  });
});
