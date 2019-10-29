import {
  UndoHistory,
  mkUndo,
  record,
  undo,
  redo,
  peekPreviousState,
  clear
} from "../src/index";

describe("history", () => {
  interface State {
    foo: string;
  }

  var history: UndoHistory<State>;

  beforeEach(() => {
    history = mkUndo<State>(100);
    record(history, { foo: "fooInitialState" });
  });

  describe("basic functionality", () => {
    it("is defined", () => {
      expect(history).toBeDefined();
    });

    it("can undo", () => {
      record(history, { foo: "bar" });
      expect(undo(history)).toEqual({ foo: "fooInitialState" });
    });

    it("can redo", () => {
      record(history, { foo: "bar" });

      expect(undo(history)).toEqual({ foo: "fooInitialState" });
      expect(redo(history)).toEqual({ foo: "bar" });
    });

    it("won't break on too many undos", () => {
      undo(history);
      undo(history);
      undo(history);
      expect(undo(history)).toEqual({ foo: "fooInitialState" });
      expect(peekPreviousState(history)).toBeUndefined();
    });

    it("won't break on too many redos", () => {
      redo(history);
      redo(history);
      redo(history);
      expect(redo(history)).toEqual({ foo: "fooInitialState" });
    });

    it("recording a new state clears redo", () => {
      record(history, { foo: "bar" });
      undo(history);
      expect(history.states.length).toEqual(2);
      record(history, { foo: "bar" });
      expect(history.states.length).toEqual(2);
    });

    it("respects the maximum depth", () => {
      history.maxDepth = 3;
      record(history, { foo: "bar" });
      record(history, { foo: "bar" });
      record(history, { foo: "bar" });
      expect(history.states.length).toEqual(3);
      record(history, { foo: "bar" });
      expect(history.states.length).toEqual(3);
    });

    it("can be cleared", () => {
      clear(history);
      expect(history.states.length).toBe(0);
    });

    it("won't break on a cleared history", () => {
      clear(history);
      undo(history);
    });

    it("longer test", () => {
      record(history, { foo: "1" });

      record(history, { foo: "2" });

      record(history, { foo: "3" });

      record(history, { foo: "4" });

      expect(undo(history)).toEqual({ foo: "3" });

      expect(undo(history)).toEqual({ foo: "2" });

      expect(redo(history)).toEqual({ foo: "3" });

      record(history, { foo: "A" });

      record(history, { foo: "B" });

      record(history, { foo: "C" });

      expect(undo(history)).toEqual({ foo: "B" });

      expect(undo(history)).toEqual({ foo: "A" });

      expect(undo(history)).toEqual({ foo: "3" });

      expect(undo(history)).toEqual({ foo: "2" });

      expect(undo(history)).toEqual({ foo: "1" });

      expect(undo(history)).toEqual({ foo: "fooInitialState" });
    });
  });
});
