export class DatasetList<T> {

  get active(): T {
    return this._list[this._activeIndex];
  }
  
  private _activeIndex = 0;

  constructor(private _list: T[]) { }

  next(): void {
    this._activeIndex += 1;

    if (this._activeIndex > this._list.length - 1) {
      this._activeIndex = 0;
    }
  }

  get(i: number): T {
    return this._list[i];
  }

}
