import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  BASIC_INTERVALS, getIntervalChoices, getIntervalDefinition, getIntervalPool,
  getIntervalPrompt, isIntervalAnswer,
} from './intervalRecognition';

describe('interval recognition', () => {
  it('offers a small basic set and all twelve chromatic intervals', () => {
    assert.deepEqual(getIntervalPool('basic').map((item) => item.semitones), BASIC_INTERVALS);
    assert.equal(getIntervalPool('all').length, 12);
  });
  it('generates valid root and interval prompts', () => {
    const prompt = getIntervalPrompt('basic', () => 0.99);
    assert.equal(prompt.rootPitchClass, 11);
    assert.equal(prompt.semitones, 7);
  });
  it('creates four unique choices including the answer', () => {
    const choices = getIntervalChoices(4, 'basic', () => 0.3);
    assert.equal(choices.length, 4);
    assert.equal(new Set(choices).size, 4);
    assert.ok(choices.includes(4));
  });
  it('returns interval labels and validates answers', () => {
    assert.equal(getIntervalDefinition(7)?.nameEn, 'Perfect 5th');
    assert.equal(isIntervalAnswer(5, 5), true);
    assert.equal(isIntervalAnswer(5, 7), false);
  });
});
