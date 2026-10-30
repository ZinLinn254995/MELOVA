import test from 'node:test';import assert from 'node:assert/strict';import {getScaleNotes,isScaleAnswer} from './scalePractice';
test('C major scale',()=>assert.deepEqual(getScaleNotes('C','major'),['C','D','E','F','G','A','B','C']));
test('A natural minor scale',()=>assert.deepEqual(getScaleNotes('A','natural-minor'),['A','B','C','D','E','F','G','A']));
test('G major includes F sharp',()=>assert.deepEqual(getScaleNotes('G','major'),['G','A','B','C','D','E','F#','G']));
test('scale answers compare exact notes',()=>{assert.equal(isScaleAnswer('F#','F#'),true);assert.equal(isScaleAnswer('F#','G'),false)});
