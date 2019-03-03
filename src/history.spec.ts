import { History } from './index';

describe("undo", () => {
  it("is defined", () => {
    var undo = new History();
    expect(undo).toBeDefined();
  });
  
  it("can undo", () => {
    var history = new History();
    history.record("asdf");
    var previous = history.undo();
    expect(previous).toEqual("asdf");
  });
});