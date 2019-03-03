import { History } from './index';

describe("history", () => {
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
    history.record("Initial state");
  });

  describe("basic functionality", () => {
    it("is defined", () => {
      expect(history).toBeDefined();
    });

    it("can undo", () => {
      state.foo = "someNewState";
      history.record();

      history.undo();
      expect(state.foo).toEqual("fooInitialState");
    });

    it("can redo", () => {
      state.foo = "someNewState";
      history.record();

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
      expect(history.states.length).toEqual(2);
      history.record();
      expect(history.states.length).toEqual(2);
    });

    it("respects the maximum depth", () => {
      history.maxDepth = 3;
      history.record();
      history.record();
      history.record();
      expect(history.states.length).toEqual(3);
      history.record();
      expect(history.states.length).toEqual(3);
    });
  });

  describe("labels", () => {
    it("can record labels", () => {
      state.foo = "someNewState";
      history.record("Did something");
  
      expect(history.peekPreviousState().label).toEqual("Initial state");
      expect(history.peekNextState()).toBeUndefined();

      history.undo();
      expect(history.peekPreviousState()).toBeUndefined();
      expect(history.peekNextState().label).toEqual("Did something");
    });
  })

});