interface TelemetryEnvelope {
  key: Symbol
  category: string
  data: Object
}

/**
 * Rolling Telemetry log buffer.
 *
 * @class TelemetryBuffer
*/
export default class TelemetryBuffer {

  _store: Array<TelemetryEnvelope> = []
  _size: number

  constructor(bufferSize: number) {
    this._size = bufferSize;
  }

  /**
    * Add a log entry with the provided category.
    *
    * @method add
    * @param {String} category The category of the log to be added.
    * @param {Object} item The Item to be added to the log
    * @returns {String} Id of the item in the log.
    */
  add(category: string, data: Object) {
    var key = Symbol();
    this._store.push({ key, category, data });

    if (this._store.length > this._size) {
      this._store = this._store.slice(Math.max(this._store.length - this._size, 0));
    }
    return key;
  }

  /**
    * Returns all the Telemetry of a type.
    *
    * @method getAllByCategory
    * @param {String} category The category of logs to return.
    */
  getAllByCategory(category: string): Array<Object> {
    return this._store
      .filter((envelope) => envelope.category === category)
      .map((envelope) => envelope.data);
  }

}
