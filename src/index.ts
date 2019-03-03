export class History {
  undoStack : any[] = [];
  redoStack : any[] = [];

  record(state: any) {
    this.undoStack.push(state);
  }

  undo() {
    return this.undoStack.pop();
  }
}