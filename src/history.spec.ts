import { History } from './index';

describe("undo", () => {
  var history: History;
  var state = "fooInitialState";

  beforeEach(() => {
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
});