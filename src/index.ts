export class History<T> {
  undoStack: T[] = [];
  redoStack: T[] = [];

  constructor(
    public maxDepth: number,
    private getCopyOfState: () => T,
    private sendCopyOfState: (state: T) => void) { }

  record() {
    this.undoStack.push(this.getCopyOfState());
    this.redoStack.length = 0;

    if (this.undoStack.length > this.maxDepth) {
      this.undoStack.splice(0, this.undoStack.length - this.maxDepth);
    }
  }

  undo() {
    if (this.undoStack.length > 0) {
      this.redoStack.push(this.getCopyOfState());
      this.sendCopyOfState(this.undoStack.pop()!);
    }
  }

  redo() {
    if (this.redoStack.length > 0) {
      this.undoStack.push(this.getCopyOfState());
      this.sendCopyOfState(this.redoStack.pop()!);
    }
  }
}