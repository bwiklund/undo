export class History {
  undoStack: any[] = [];
  redoStack: any[] = [];

  constructor(private getState: () => any, private setState: (state: any) => void) { }

  record() {
    this.undoStack.push(this.getState());
  }

  undo() {
    this.redoStack.push(this.getState());
    this.setState(this.undoStack.pop());
  }

  redo() {
    this.undoStack.push(this.getState());
    this.setState(this.redoStack.pop());
  }
}