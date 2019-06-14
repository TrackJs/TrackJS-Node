import { patch } from './utils/patch';
import { Agent } from './Agent';

const TELEMETRY_TYPE = 'c';

export function install(agent: Agent, _console?: Object): void {
  let consoleObj = _console || console;
  ['debug','info','warn','error','log'].forEach((name) => {
    patch(consoleObj, name, function(originalFn) {
      return function() {
        agent.addTelemetry(TELEMETRY_TYPE, {
          message: arguments[0],
          severity: name,
          timestamp: new Date().toISOString()
        });
        return originalFn.apply(consoleObj, arguments);
      };
    });
  });
}
