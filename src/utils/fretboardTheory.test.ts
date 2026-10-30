import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CHORD_DEFINITIONS,
  CHROMATIC_NOTES,
  calculateChord,
  getPitchClass,
} from './musicTheory';
import {
  BASS_TUNING,
  GUITAR_TUNING,
  getBassArpeggioPattern,
  getBassFretNote,
  getGuitarChordVoicing,
  getGuitarFretNote,
} from './fretboardTheory';

test('all guitar chord voicings contain only chord tones and their root', () => {
  for (const root of CHROMATIC_NOTES) {
    for (const chordType of Object.keys(CHORD_DEFINITIONS) as (keyof typeof CHORD_DEFINITIONS)[]) {
      const chord = CHORD_DEFINITIONS[chordType];
      const voicing = getGuitarChordVoicing(root, chordType);
      const expected = new Set(chord.semitoneFormula.map((step) => (getPitchClass(root) + step) % 12));

      assert.equal(voicing.frets.length, 6, root + ' ' + chordType + ': six strings');
      assert.equal(voicing.fingers.length, 6, root + ' ' + chordType + ': six finger slots');
      assert.ok(voicing.frets.some((fret, index) => fret >= 0 && getGuitarFretNote(index, fret).pitchClass === getPitchClass(root)),
        root + ' ' + chordType + ': root is present');

      voicing.frets.forEach((fret, index) => {
        assert.ok(Number.isInteger(fret) && fret >= -1 && fret <= 24,
          root + ' ' + chordType + ': valid fret on string ' + GUITAR_TUNING[index].stringNumber);
        if (fret >= 0) {
          const pitch = getGuitarFretNote(index, fret).pitchClass;
          assert.ok(expected.has(pitch),
            root + ' ' + chordType + ': unexpected pitch class ' + pitch + ' on string ' + GUITAR_TUNING[index].stringNumber);
        }
      });
    }
  }
});

test('guitar and bass fret-note calculations follow standard tuning across two octaves', () => {
  for (let stringIndex = 0; stringIndex < GUITAR_TUNING.length; stringIndex++) {
    for (let fret = 0; fret <= 24; fret++) {
      const note = getGuitarFretNote(stringIndex, fret);
      const total = GUITAR_TUNING[stringIndex].openPitchClass + fret;
      assert.equal(note.pitchClass, total % 12);
      assert.equal(note.octave, GUITAR_TUNING[stringIndex].openOctave + Math.floor(total / 12));
    }
  }

  for (let stringIndex = 0; stringIndex < BASS_TUNING.length; stringIndex++) {
    for (let fret = 0; fret <= 24; fret++) {
      const note = getBassFretNote(stringIndex, fret);
      const total = BASS_TUNING[stringIndex].openPitchClass + fret;
      assert.equal(note.pitchClass, total % 12);
      assert.equal(note.octave, BASS_TUNING[stringIndex].openOctave + Math.floor(total / 12));
    }
  }
});

test('bass arpeggio positions reproduce the chord pitch classes', () => {
  for (const root of CHROMATIC_NOTES) {
    for (const chordType of Object.keys(CHORD_DEFINITIONS) as (keyof typeof CHORD_DEFINITIONS)[]) {
      const chord = calculateChord(root, chordType);
      const pattern = getBassArpeggioPattern(chord);
      assert.equal(pattern.notes.length, chord.notes.length, root + ' ' + chordType);

      pattern.notes.forEach((position, index) => {
        assert.ok(position.stringNum >= 1 && position.stringNum <= 4, root + ' ' + chordType + ': valid bass string');
        assert.ok(Number.isInteger(position.fret) && position.fret >= 0 && position.fret <= 24,
          root + ' ' + chordType + ': valid bass fret');
        const tuning = BASS_TUNING[4 - position.stringNum];
        assert.equal((tuning.openPitchClass + position.fret) % 12, chord.notes[index].pitchClass,
          root + ' ' + chordType + ': arpeggio note pitch matches chord tone');
      });
    }
  }
});
