import { History } from './index';

describe("undo", () => {
  interface State { foo: string }

  var state: State;
  var history: History<State>;

  beforeEach(() => {
    state = { foo: "fooInitialState" };
    history = new History<State>(
      100,
      () => { return { foo: state.foo } },
      (newState) => state.foo = newState.foo
    );
  });

  it("is defined", () => {
    expect(history).toBeDefined();
  });

  it("can undo", () => {
    history.record();
    state.foo = "someNewState";
    history.undo();
    expect(state.foo).toEqual("fooInitialState");
  });

  it("can redo", () => {
    history.record();
    state.foo = "someNewState";
    history.undo();
    expect(state.foo).toEqual("fooInitialState");
    history.redo();
    expect(state.foo).toEqual("someNewState");
  });

  it("won't break on too many undos", () => {
    history.undo();
    history.undo();
    history.undo();
    expect(state.foo).toEqual("fooInitialState");
  });

  it("won't break on too many redos", () => {
    history.redo();
    history.redo();
    history.redo();
    expect(state.foo).toEqual("fooInitialState");
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