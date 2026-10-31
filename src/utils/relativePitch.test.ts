import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getPitchRelation, getRelativePitchPrompt, getRelativePitchTarget, isRelativePitchAnswer } from './relativePitch';

describe('relative pitch', () => {
  it('generates same, higher and lower prompts within the supported range', () => {
    assert.deepEqual(getRelativePitchPrompt(() => 0), { referencePitchClass: 0, semitoneOffset: 0 });
    const higher = getRelativePitchPrompt(() => 0.34);
    assert.ok(higher.semitoneOffset >= 1 && higher.semitoneOffset <= 4);
    const lower = getRelativePitchPrompt(() => 0.67);
    assert.ok(lower.semitoneOffset <= -1 && lower.semitoneOffset >= -4);
  });
  it('classifies pitch direction', () => {
    assert.equal(getPitchRelation(0), 'same');
    assert.equal(getPitchRelation(3), 'higher');
    assert.equal(getPitchRelation(-2), 'lower');
  });
  it('validates answers against the prompt', () => {
    const prompt = { referencePitchClass: 9, semitoneOffset: -2 };
    assert.equal(isRelativePitchAnswer(prompt, 'lower'), true);
    assert.equal(isRelativePitchAnswer(prompt, 'higher'), false);
  });
  it('wraps pitch classes and tracks octave crossings', () => {
    assert.deepEqual(getRelativePitchTarget({ referencePitchClass: 11, semitoneOffset: 2 }), { pitchClass: 1, octaveOffset: 1 });
    assert.deepEqual(getRelativePitchTarget({ referencePitchClass: 1, semitoneOffset: -3 }), { pitchClass: 10, octaveOffset: -1 });
  });
});
