import test from 'node:test';
import assert from 'node:assert/strict';
import { getFretboardPositions, getProgression, getProgressionLabel, getRandomTarget, isCorrectNoteAnswer } from './practiceStudio';

test('guitar and bass practice grids cover every standard string through fret 12', () => {
  const guitar = getFretboardPositions('guitar');
  const bass = getFretboardPositions('bass');
  assert.equal(guitar.length, 6 * 13);
  assert.equal(bass.length, 4 * 13);
  assert.equal(guitar.filter((position) => position.fret === 0).length, 6);
  assert.equal(bass.filter((position) => position.fret === 12).length, 4);
});

test('fretboard positions use standard tuning and octave-aware note calculations', () => {
  const guitar = getFretboardPositions('guitar');
  const bass = getFretboardPositions('bass');
  assert.deepEqual(
    guitar.filter((position) => position.fret === 0).map((position) => position.noteName),
    ['E', 'A', 'D', 'G', 'B', 'E'],
  );
  assert.deepEqual(
    bass.filter((position) => position.fret === 0).map((position) => position.noteName),
    ['E', 'A', 'D', 'G'],
  );
  assert.equal(guitar.find((position) => position.stringNumber === 6 && position.fret === 12)?.octave, 3);
  assert.equal(bass.find((position) => position.stringNumber === 4 && position.fret === 12)?.octave, 2);
});

test('note answers require the exact pitch-class label and random target avoids immediate repeats', () => {
  assert.equal(isCorrectNoteAnswer('C#', 'C#'), true);
  assert.equal(isCorrectNoteAnswer('C#', 'D'), false);
  assert.equal(getRandomTarget('C', () => 0), 'C#');
  assert.equal(getRandomTarget('B', () => 0), 'C');
});

test('practice progressions expose the expected chord order and labels', () => {
  assert.deepEqual(getProgression('pop').map(getProgressionLabel), ['C', 'G', 'Am', 'F']);
  assert.deepEqual(getProgression('classic').map(getProgressionLabel), ['C', 'F', 'G', 'C']);
});
