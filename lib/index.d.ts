declare class HistoryState<T> {
    state: T;
    label: string;
    constructor(state: T, label: string);
}
export declare class UndoHistory<T> {
    maxDepth: number;
    private getClone;
    private setClone;
    states: HistoryState<T>[];
    index: number;
    constructor(maxDepth: number, getClone: () => T, setClone: (state: T) => void);
    record(label?: string): void;
    undo(): void;
    redo(): void;
    clear(): void;
    peekPreviousState(): HistoryState<T>;
    peekNextState(): HistoryState<T>;
}
export {};
