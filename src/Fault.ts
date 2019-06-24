import { transmit } from "./Transmitter";
import { AgentRegistrar } from "./AgentRegistrar";
import { serialize } from "./utils/serialize";
import { isError } from "./utils/isType";
import { Agent } from "./Agent";
import { RELEASE_VERSION, RELEASE_NAME, RELEASE_HASH } from "./version";

export function captureFault(fault: any) {
  let error = isError(fault) ? fault : new Error(serialize(fault));
  let agent = AgentRegistrar.getCurrentAgent();
  let agentOptions = agent ? agent.options : Agent.defaults;

  transmit({
    url: agentOptions.faultUrl,
    method: "GET",
    queryParams: {
      token: agentOptions.token,
      file: "",
      msg: error.message,
      stack: (error.stack || "").substr(0, 1000),
      url: "",
      a: RELEASE_NAME,
      v: RELEASE_VERSION,
      h: RELEASE_HASH
    }
  });
}
