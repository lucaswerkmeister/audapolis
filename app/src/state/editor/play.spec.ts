import { defaultEditorState, EditorState } from './types';
import { DocumentItem, emptyDocument } from '../../core/document';
import { goLeft, goRight } from './play';
import { EPSILON } from '../../util';
import _ from 'lodash';

const testContent: DocumentItem[] = [
  { type: 'paragraph_break', speaker: 'paragraph_01' },
  { type: 'artificial_silence', length: 1 },
  { type: 'artificial_silence', length: 1 },
  { type: 'artificial_silence', length: 1 },
  { type: 'paragraph_break', speaker: 'paragraph_02' },
  { type: 'artificial_silence', length: 1 },
  { type: 'artificial_silence', length: 1 },
  { type: 'artificial_silence', length: 1 },
];

const testState: EditorState = {
  ...defaultEditorState,
  document: {
    ...emptyDocument,
    content: testContent,
  },
};

const testLeftPlayer = (before: number, after: number) => {
  const state = _.cloneDeep(testState);
  state.cursor.current = 'player';
  state.cursor.playerTime = before;
  goLeft.reducer(state);
  expect(state.cursor.current).toBe('user');
  expect(state.cursor.userIndex).toBe(after);
};

const testLeftUser = (before: number, after: number) => {
  const state = _.cloneDeep(testState);
  state.cursor.current = 'user';
  state.cursor.playerTime = before;
  goLeft.reducer(state);
  expect(state.cursor.current).toBe('user');
  expect(state.cursor.userIndex).toBe(after);
};

test('goLeft trivial', () => {
  testLeftPlayer(2.0, 2);
  testLeftPlayer(1.0, 1);
  testLeftPlayer(0.0, 0);
});
test('goLeft start of paragraph', () => {
  testLeftPlayer(4.0, 5);
  testLeftPlayer(3.0, 4);
  testLeftPlayer(3.0 - EPSILON, 3);
});

test('goLeft at start of document', () => {
  testLeftUser(0, 1);
  testLeftUser(1, 1);
});

const testRightPlayer = (before: number, after: number) => {
  const state = _.cloneDeep(testState);
  state.cursor.current = 'player';
  state.cursor.playerTime = before;
  goRight.reducer(state);
  expect(state.cursor.current).toBe('user');
  expect(state.cursor.userIndex).toBe(after);
};

const testRightUser = (before: number, after: number) => {
  const state = _.cloneDeep(testState);
  state.cursor.current = 'user';
  state.cursor.userIndex = before;
  goRight.reducer(state);
  expect(state.cursor.current).toBe('user');
  expect(state.cursor.userIndex).toBe(after);
};
test('goRight trivial', () => {
  testRightPlayer(0.0, 2);
  testRightPlayer(1.0, 3);
  testRightPlayer(1.5, 3);
  testRightPlayer(3.0, 6);
  testRightPlayer(6.0, 8);
});

test('goRight end of paragraph', () => {
  testRightPlayer(2.0, 4);
  testRightPlayer(3.0 - EPSILON, 5);
});

test('goRight end of document', () => {
  testRightPlayer(6.0, 8);
  testRightUser(8, 8);
});
