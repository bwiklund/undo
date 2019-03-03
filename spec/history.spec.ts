import { UndoHistory } from '../src/index';

describe("history", () => {
  interface State { foo: string }

  var state: State;
  var history: UndoHistory<State>;

  beforeEach(() => {
    state = { foo: "fooInitialState" };
    history = new UndoHistory<State>(
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
      expect(history.peekPreviousState()).toBeUndefined();
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

    it("can be cleared", () => {
      history.clear();
      expect(history.states.length).toBe(0);
    });

    it("won't break on a cleared history", () => {
      history.clear();
      history.undo(); // don't throw
    });

    it("longer test", () => {
      state.foo = "1";
      history.record();

      state.foo = "2";
      history.record();

      state.foo = "3";
      history.record();

      state.foo = "4";
      history.record();

      history.undo();
      expect(state.foo).toEqual("3");

      history.undo();
      expect(state.foo).toEqual("2");

      history.redo();
      expect(state.foo).toEqual("3");

      state.foo = "A";
      history.record();
      
      state.foo = "B";
      history.record();
      
      state.foo = "C";
      history.record();

      history.undo();
      expect(state.foo).toEqual("B");

      history.undo();
      expect(state.foo).toEqual("A");

      history.undo();
      expect(state.foo).toEqual("3");

      history.undo();
      expect(state.foo).toEqual("2");

      history.undo();
      expect(state.foo).toEqual("1");
      
      history.undo();
      expect(state.foo).toEqual("fooInitialState");
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