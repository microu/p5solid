export class StateStore<K = object, S = string> extends Map<K, S> {
  stateChanged(k: K, state: S): boolean {
    const currentState = this.get(k);
    return currentState != state;
  }
  setState(k: K, state: S): S | undefined {
    const prevState = this.get(k);
    this.set(k, state);
    return prevState;
  }
}
