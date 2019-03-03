# History

A js/ts library to implement undo and redo functionality, with a simple API, with no dependencies or framework requirements.

# Usage
```ts
import { UndoHistory } from 'undo-history';

// set up a trivial class to represent our app's state
interface State { foo: string }
var state = {foo: "cats"};

// set up a new `History` object to track our state, with basic `getClone` and `setClone` methods
var history = new UndoHistory<State>(
  // max undo depth
  100,

  // `getClone` callback to return a copy of the working object
  () => { return { foo: state.foo } },

  // `setClone` callback to overwrite into our working object (MUST read properties FROM the object it is sent)
  (newState) => state.foo = newState.foo
);
history.record("Initial state"); // record and label our initial state

// perform some user action
history.foo = "dogs";

// record and label what we've just done
history.record("Changed cats to dogs");

history.undo();

// state.foo == "cats"

history.redo();

// state.foo == "dogs"
```

It's critical that your callbacks are coded correctly, so that `getClone` returns a new object, and the `setClone` doesn't modify the object it is sent. Whether that means a shallow or deep clone is deliberately left up to the user, since there is no one-size-fits-all solution to this. You could also have a totally separate type for containing history states.

If you have undone several actions, and then record a new user action, the history ahead (redos) will be automatically overwritten, as you'd expect undo operations to work in any program.