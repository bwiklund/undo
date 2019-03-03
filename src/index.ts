class HistoryState<T> {
  public constructor(public state: T, public label: string) { }
}

export class UndoHistory<T> {
  states: HistoryState<T>[] = [];
  index = -1;

  constructor(
    public maxDepth: number,
    private getClone: () => T,
    private setClone: (state: T) => void) { }

  record(label: string = "") {
    var newState = new HistoryState(this.getClone(), label);

    this.index++;
    this.states.splice(this.index); // cut off the end of the array
    this.states[this.index] = newState;

    if (this.states.length > this.maxDepth) {
      var trimCount = this.states.length - this.maxDepth;
      this.states.splice(0, trimCount);
      this.index -= trimCount;
    }
  }

  undo() {
    if (this.states[this.index - 1]) {
      this.setClone(this.states[this.index - 1].state);
      this.index--;
    }
  }

  redo() {
    if (this.states[this.index+1]) {
      this.setClone(this.states[this.index+1].state);
      this.index++;
    }
  }

  clear() {
    this.states.length = 0;
    this.index = -1;
  }

  peekPreviousState() {
    return this.states[this.index - 1];
  }

  peekNextState() {
    return this.states[this.index + 1];
  }
}