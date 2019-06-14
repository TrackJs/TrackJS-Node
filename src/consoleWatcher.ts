import Agent from './Agent';
import patch from './utils/patch';
import ConsoleTelemetryData from './telemetry/ConsoleTelemetryData';

export function install(agent: Agent, _console?: Object): void {
  let consoleObj = _console || console;
  ['debug','info','warn','error','log'].forEach((name) => {
    patch(consoleObj, name, function(originalFn) {
      return function(...messages: any) {
        agent.telemetry.add('c', new ConsoleTelemetryData(name, messages));
        return originalFn.apply(consoleObj, arguments);
      };
    });
  });
}
