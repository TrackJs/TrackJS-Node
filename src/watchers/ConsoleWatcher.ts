import { patch, unpatch } from '../utils/patch';
import { ConsoleTelemetry } from '../telemetry';
import { AgentRegistrar } from '../AgentRegistrar';
import { Watcher } from './Watcher';

const CONSOLE_FN_NAMES = ['debug','info','warn','error','log'];

class _ConsoleWatcher implements Watcher {

  install(_console?: Object): void {
    let consoleObj = _console || console;
    CONSOLE_FN_NAMES.forEach((name) => {
      patch(consoleObj, name, function(originalFn) {
        return function(...messages: any) {
          AgentRegistrar.getCurrentAgent().telemetry.add('c', new ConsoleTelemetry(name, messages));
          return originalFn.apply(consoleObj, arguments);
        };
      });
    });
  }

  uninstall(_console?: Object): void {
    let consoleObj = _console || console;
    CONSOLE_FN_NAMES.forEach((name) => unpatch(consoleObj, name));
  }

}

export const ConsoleWatcher = new _ConsoleWatcher() as Watcher;
