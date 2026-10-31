import test from 'node:test';
import assert from 'node:assert/strict';
import { getFingerExerciseSequence } from './fingerExercises';

test('piano five-finger exercise ascends and descends with correct finger numbers', () => {
  const sequence = getFingerExerciseSequence('piano');
  assert.deepEqual(sequence.map((note) => note.noteName), ['C', 'D', 'E', 'F', 'G', 'G', 'F', 'E', 'D', 'C']);
  assert.deepEqual(sequence.map((note) => note.finger), [1, 2, 3, 4, 5, 5, 4, 3, 2, 1]);
  assert.ok(sequence.every((note) => note.octave === 4));
});

test('guitar chromatic exercise covers six strings and frets one through four', () => {
  const sequence = getFingerExerciseSequence('guitar');
  assert.equal(sequence.length, 24);
  assert.deepEqual(sequence.slice(0, 4).map((note) => note.fret), [1, 2, 3, 4]);
  assert.deepEqual(sequence.filter((note) => note.stringNumber === 1).map((note) => note.fret), [1, 2, 3, 4]);
});

test('bass chromatic exercise covers four strings and frets one through four', () => {
  const sequence = getFingerExerciseSequence('bass');
  assert.equal(sequence.length, 16);
  assert.deepEqual(sequence.filter((note) => note.stringNumber === 4).map((note) => note.finger), [1, 2, 3, 4]);
});

test('every exercise note has a valid pitch and finger assignment', () => {
  for (const instrument of ['piano', 'guitar', 'bass'] as const) {
    for (const note of getFingerExerciseSequence(instrument)) {
      assert.ok(note.pitchClass >= 0 && note.pitchClass <= 11);
      assert.ok(note.finger >= 1 && note.finger <= 5);
    }
  }
});
