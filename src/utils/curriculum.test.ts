import test from 'node:test';
import assert from 'node:assert/strict';
import {
  LEARNING_COURSES,
  LEARNING_LEVELS,
  getCourse,
  getLessonsForLevel,
  getNextLesson,
} from './curriculum';

test('structured curriculum covers guitar, bass, and piano at all three levels', () => {
  assert.deepEqual(LEARNING_COURSES.map((course) => course.instrument), ['guitar', 'bass', 'piano']);
  for (const course of LEARNING_COURSES) {
    for (const level of LEARNING_LEVELS) {
      assert.equal(getLessonsForLevel(course, level).length, 3, course.instrument + ' ' + level);
    }
    assert.equal(course.lessons.length, 9);
  }
});

test('every lesson has bilingual teaching content and a valid quiz answer', () => {
  for (const course of LEARNING_COURSES) {
    for (const lesson of course.lessons) {
      assert.ok(lesson.titleEn.length > 0 && lesson.titleMy.length > 0, lesson.id + ': titles');
      assert.ok(lesson.explanationEn.length > 0 && lesson.explanationMy.length > 0, lesson.id + ': explanations');
      assert.ok(lesson.practiceEn.length > 0 && lesson.practiceMy.length > 0, lesson.id + ': practice steps');
      assert.ok(lesson.questionEn.length > 0 && lesson.questionMy.length > 0, lesson.id + ': quiz prompts');
      assert.ok(lesson.correctIndex >= 0 && lesson.correctIndex < lesson.options.length, lesson.id + ': answer index');
      assert.ok(lesson.answerEn.length > 0 && lesson.answerMy.length > 0, lesson.id + ': answer explanations');
    }
  }
});

test('course helpers return the selected course and first incomplete lesson', () => {
  const piano = getCourse('piano');
  assert.equal(piano.instrument, 'piano');
  assert.equal(getNextLesson(piano, [])?.id, piano.lessons[0].id);
  assert.equal(getNextLesson(piano, piano.lessons.slice(0, 2).map((item) => item.id))?.id, piano.lessons[2].id);
  assert.equal(getNextLesson(piano, piano.lessons.map((item) => item.id)), undefined);
});
