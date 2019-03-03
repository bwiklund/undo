import { History } from './index';

describe("undo", () => {
  var history: History;
  var state = "fooInitialState";

  beforeEach(() => {
    state = "fooInitialState";
    history = new History(100, () => state, (newState) => state = newState);
  });

  it("is defined", () => {
    expect(history).toBeDefined();
  });

  it("can undo", () => {
    history.record();
    state = "someNewState";
    history.undo();
    expect(state).toEqual("fooInitialState");
  });

  it("can redo", () => {
    history.record();
    state = "someNewState";
    history.undo();
    expect(state).toEqual("fooInitialState");
    history.redo();
    expect(state).toEqual("someNewState");
  });
  
  it("won't break on too many undos", () => {
    history.undo();
    history.undo();
    history.undo();
    expect(state).toEqual("fooInitialState");
  });
  
  it("won't break on too many redos", () => {
    history.redo();
    history.redo();
    history.redo();
    expect(state).toEqual("fooInitialState");
  });
  
  it("recording a new state clears redo", () => {
    history.record();
    history.undo();
    expect(history.redoStack.length).toEqual(1);
    history.record();
    expect(history.redoStack.length).toEqual(0);
  });
  
  it("respects the maximum depth", () => {
    history.maxDepth = 3;
    history.record();
    history.record();
    history.record();
    expect(history.undoStack.length).toEqual(3);
    history.record();
    expect(history.undoStack.length).toEqual(3);
  });
});