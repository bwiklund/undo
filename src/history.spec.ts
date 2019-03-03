import { History } from './index';

describe("undo", () => {
  var history: History;
  var state = "fooInitialState";

  beforeEach(() => {
    state = "fooInitialState";
    history = new History(() => state, (newState) => state = newState);
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
});