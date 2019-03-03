"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HistoryState {
    constructor(state, label) {
        this.state = state;
        this.label = label;
    }
}
class UndoHistory {
    constructor(maxDepth, getClone, setClone) {
        this.maxDepth = maxDepth;
        this.getClone = getClone;
        this.setClone = setClone;
        this.states = [];
        this.index = -1;
    }
    record(label = "") {
        var newState = new HistoryState(this.getClone(), label);
        this.index++;
        this.states.splice(this.index);
        this.states[this.index] = newState;
        if (this.states.length > this.maxDepth) {
            var trimCount = this.states.length - this.maxDepth;
            this.states.splice(0, trimCount);
            this.index -= trimCount;
        }
    }
    undo() {
        if (this.states[this.index - 1]) {
            this.setClone(this.states[this.index - 1].state);
            this.index--;
        }
    }
    redo() {
        if (this.states[this.index + 1]) {
            this.setClone(this.states[this.index + 1].state);
            this.index++;
        }
    }
    clear() {
        this.states.length = 0;
        this.index = -1;
    }
    peekPreviousState() {
        return this.states[this.index - 1];
    }
    peekNextState() {
        return this.states[this.index + 1];
    }
}
exports.UndoHistory = UndoHistory;
