export class MetaDataStore<O = object, M = any> extends Map<O, M> {
  setMeta(o: O, m: M): M | undefined {
    const prevMeta = this.get(o);
    this.set(o, m);
    return prevMeta;
  }

  *iter(filter?: (o: O, m: M) => boolean): Generator<[O, M]> {
    for (const [o, m] of this) {
      if (filter == undefined || filter(o, m)) {
        yield [o, m];
      }
    }
  }
}
