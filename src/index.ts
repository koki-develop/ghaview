import { Command } from "commander";
import packageJson from "../package.json" with { type: "json" };
import { startServer } from "./server.ts";

const program = new Command();

program
  .name("ghaview")
  .version(packageJson.version)
  .action(async () => {
    await startServer();
  });

program.parse(process.argv);
