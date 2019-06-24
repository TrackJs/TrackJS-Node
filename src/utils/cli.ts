import { spawn } from "child_process";

/**
 * Executes a command line argument in a separate thread and returns the results
 * of stdout to resolve. Rejected on stderr.
 *
 * @param command Command string to be executed
 */
export function cli(command: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const args = command.split(" ").splice(1);
    const exe = command.split(" ")[0];
    const action = spawn(exe, args);
    action.stdout.on("data", resolve);
    action.stderr.on("data", reject);
    action.on("close", code => {
      if (code != 0) {
        reject(code);
      } else {
        resolve();
      }
    });
  });
}
