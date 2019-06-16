interface TelemetryEnvelope {
  key: Symbol
  category: string
  data: TelemetryData
}

export interface TelemetryData {}

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
    * @param {TelemetryData} item The Item to be added to the log
    * @returns {String} Id of the item in the log.
    */
  add(category: string, data: TelemetryData) {
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
  getAllByCategory(category: string): Array<TelemetryData> {
    return this._store
      .filter((envelope) => envelope.category === category)
      .map((envelope) => envelope.data);
  }

}


// var Log = function Log(util) {
//   this.appender = [];
//   this.maxLength = 30;
// };

// Log.prototype = {

//   /**
//     * Returns all the logentries of a type.
//     *
//     * @method all
//     * @param {String} category The category of logs to return.
//     */
//   all: function (category) {
//     var result = [];
//     var logEntry;
//     var i;
//     for (i = 0; i < this.appender.length; i++) {
//       logEntry = this.appender[i];
//       if (logEntry && logEntry.category === category) {
//         result.push(logEntry.value);
//       }
//     }
//     return result;
//   },

//   /**
//     * Clears all appenders.
//     *
//     * @method clear
//     */
//   clear: function () {
//     this.appender.length = 0;
//   },

//   /**
//     * Truncates the appender to maximum length
//     *
//     * @method truncate
//     */
//   truncate: function truncate() {
//     if (this.appender.length > this.maxLength) {
//       this.appender = this.appender.slice(Math.max(this.appender.length - this.maxLength, 0));
//     }
//   },



//   /**
//     * Gets a log entry with the provided category and key
//     *
//     * @method get
//     * @param {String} category The category of the log to be returned.
//     * @param {String} key The Key of the log to be returned.
//     * @returns {Object} Log Entry or false if not found.
//     */
//   get: function get(category, key) {
//     var logEntry;
//     var i;
//     for (i = 0; i < this.appender.length; i++) {
//       logEntry = this.appender[i];
//       if (logEntry.category === category && logEntry.key === key) {
//         return logEntry.value;
//       }
//     }
//     return false;
//   }

// };