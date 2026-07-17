import { spawn } from "node:child_process";
import process from "node:process";

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit" });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(" ")} exited with ${code}`));
    });
  });
}

const args = process.argv.slice(2);
const skipMediaEnforcement = args.includes("--copy-only") || args.includes("--title-only");

await run(process.execPath, ["scripts/backfill-normalized-editorial-guides.mjs", ...args]);
if (!skipMediaEnforcement) {
  await run(process.execPath, ["scripts/enforce-r2-venue-photos.mjs", ...args]);
}
