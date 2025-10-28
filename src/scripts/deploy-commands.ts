import { REST, Routes } from "discord.js";
import { config } from "../config/config";
import * as profileCommand from "../commands/profile";

const commands = [profileCommand.data.toJSON()];

const rest = new REST().setToken(config.discord.token);

(async () => {
  try {
    console.log("Registering commands...");

    await rest.put(Routes.applicationCommands(config.discord.clientId), {
      body: commands,
    });

    console.log("Sucess!");
  } catch (error) {
    console.error("Error registering:", error);
  }
})();
