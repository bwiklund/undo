export interface UndoHistory<T> {
  states: T[];
  index: number;
  maxDepth?: number;
}

export function mkUndo<T>(maxDepth?: number): UndoHistory<T> {
  return {
    states: [],
    index: -1,
    maxDepth
  };
}

export function record<T>(self: UndoHistory<T>, state: T) {
  self.index++;
  self.states.splice(self.index); // cut off the end of the array
  self.states[self.index] = state;

  if (self.maxDepth != null && self.states.length > self.maxDepth) {
    var trimCount = self.states.length - self.maxDepth;
    self.states.splice(0, trimCount);
    self.index -= trimCount;
  }
}

export function undo<T>(self: UndoHistory<T>) {
  if (self.states[self.index - 1]) {
    return self.states[self.index-- - 1];
  } else {
    return self.states[self.index];
  }
}

export function redo<T>(self: UndoHistory<T>) {
  if (self.states[self.index + 1]) {
    return self.states[self.index++ + 1];
  } else {
    return self.states[self.index];
  }
}

export function clear<T>(self: UndoHistory<T>) {
  self.states.length = 0;
  self.index = -1;
}

export function peekPreviousState<T>(self: UndoHistory<T>): T | undefined {
  return self.states[self.index - 1];
}

export function peekNextState<T>(self: UndoHistory<T>): T | undefined {
  return self.states[self.index + 1];
}
