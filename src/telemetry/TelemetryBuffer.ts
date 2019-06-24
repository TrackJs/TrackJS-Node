interface TelemetryEnvelope {
  key: Symbol;
  category: string;
  data: Object;
}

/**
 * Rotating log of Telemetry data.
 */
export class TelemetryBuffer {
  private _store: Array<TelemetryEnvelope>;
  private _size: number;

  constructor(bufferSize: number, store?: Array<TelemetryEnvelope>) {
    this._size = bufferSize;
    this._store = store ? store.slice(0) : [];
  }

  /**
   * Add a log entry with the provided category.
   *
   * @method add
   * @param {String} category The category of the log to be added.
   * @param {Object} item The Item to be added to the log
   * @returns {Symbol} Id of the item in the log.
   */
  add(category: string, data: Object): Symbol {
    var key = Symbol();
    this._store.push({ key, category, data });

    if (this._store.length > this._size) {
      this._store = this._store.slice(
        Math.max(this._store.length - this._size, 0)
      );
    }
    return key;
  }

  /**
   * Removes all items from the buffer
   *
   * @method clear
   */
  clear(): void {
    this._store.length = 0;
  }

  /**
   * Clone the current buffer into a new instance
   *
   * @method clone
   * @returns {TelemetryBuffer} Clone
   */
  clone(): TelemetryBuffer {
    return new TelemetryBuffer(this._size, this._store);
  }

  /**
   * Returns the current number of items in the buffer
   *
   * @method count
   * @returns {Number}
   */
  count(): number {
    return this._store.length;
  }

  /**
   * Gets a telemetry item from the store with the provided key.
   *
   * @method get
   * @param key {Symbol} @see add
   * @returns {Object}
   */
  get(key: Symbol): Object {
    let result = this._store.find(envelope => envelope.key === key);
    return result ? result.data : null;
  }

  /**
   * Returns all the Telemetry of a type.
   *
   * @method getAllByCategory
   * @param {String} category The category of logs to return.
   */
  getAllByCategory(category: string): Array<Object> {
    return this._store
      .filter(envelope => envelope.category === category)
      .map(envelope => envelope.data);
  }
}
