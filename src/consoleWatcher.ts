import Agent from './Agent';
import { patch, unpatch } from './utils/patch';
import ConsoleTelemetryData from './telemetry/ConsoleTelemetryData';

const CONSOLE_FN_NAMES = ['debug','info','warn','error','log'];

export default class ConsoleWatcher {

  static install(agent: Agent, _console?: Object): void {
    let consoleObj = _console || console;
    CONSOLE_FN_NAMES.forEach((name) => {
      patch(consoleObj, name, function(originalFn) {
        return function(...messages: any) {
          agent.telemetry.add('c', new ConsoleTelemetryData(name, messages));
          return originalFn.apply(consoleObj, arguments);
        };
      });
    });
  }

  static uninstall(_console?: Object): void {
    let consoleObj = _console || console;
    CONSOLE_FN_NAMES.forEach((name) => unpatch(consoleObj, name));
  }

}
