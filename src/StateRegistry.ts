import type FileTreeView from './FileTreeView';

type StateType = 'expanded';

type Path = string;
type StateValue = boolean;

type State = Map<Path, StateValue>;
type States = Map<StateType, State>;

class StateRegistry extends Map<FileTreeView, States> {
  createStates(types: Array<StateType>): States {
    return new Map<StateType, State>(
      types.map((type) => [type, new Map<Path, StateValue>()]),
    );
  }
}

export default new StateRegistry();
