import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  BEGINNER_NOTE_SET,
  NOTE_RECOGNITION_NOTES,
  getNotePool,
  getNoteRecognitionChoices,
  getNoteRecognitionPrompt,
  isNoteRecognitionAnswer,
} from './noteRecognition';

describe('note recognition', () => {
  it('provides natural notes for beginner and all chromatic notes for advanced level', () => {
    assert.deepEqual(getNotePool('beginner'), BEGINNER_NOTE_SET);
    assert.deepEqual(getNotePool('chromatic'), NOTE_RECOGNITION_NOTES);
  });

  it('creates a prompt from the selected level and avoids the previous note', () => {
    const prompt = getNoteRecognitionPrompt('beginner', 'C', () => 0);
    assert.equal(prompt.note, 'D');
    assert.equal(prompt.octave, 4);
  });

  it('creates four unique choices including the correct answer', () => {
    const choices = getNoteRecognitionChoices('F#', 'chromatic', () => 0.25);
    assert.equal(choices.length, 4);
    assert.equal(new Set(choices).size, 4);
    assert.ok(choices.includes('F#'));
  });

  it('validates note answers exactly', () => {
    assert.equal(isNoteRecognitionAnswer('C', 'C'), true);
    assert.equal(isNoteRecognitionAnswer('C', 'C#'), false);
  });
});
