import {
  Client,
  GatewayIntentBits,
  Collection,
  ChatInputCommandInteraction,
  ActivityType,
  PresenceUpdateStatus,
} from "discord.js";
import { config } from "./config/config";
import { strings } from "./config/strings";
import * as profileCommand from "./commands/profile";

interface Command {
  data: any;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

const commands = new Collection<string, Command>();

commands.set(profileCommand.data.name, profileCommand);

client.once("ready", () => {
  console.log(`Bot connected as ${client.user?.tag}`);
  console.log(`Servers: ${client.guilds.cache.size}`);
  console.log(`Users: ${client.users.cache.size}`);

  const activityTypeMap: Record<string, ActivityType> = {
    Playing: ActivityType.Playing,
    Streaming: ActivityType.Streaming,
    Listening: ActivityType.Listening,
    Watching: ActivityType.Watching,
    Competing: ActivityType.Competing,
    Custom: ActivityType.Custom,
  };

  let currentMessageIndex = 0;

  // this is for updating discord status
  const updateStatus = () => {
    const currentMessage = strings.botStatus.messages[currentMessageIndex];

    client.user?.setPresence({
      activities: [
        {
          name: currentMessage,
          type: activityTypeMap[strings.botStatus.type] || ActivityType.Custom,
        },
      ],
      status: strings.botStatus.status as
        | "online"
        | "idle"
        | "dnd"
        | "invisible",
    });

    console.log(`Actual status: ${strings.botStatus.type} ${currentMessage}`);

    currentMessageIndex =
      (currentMessageIndex + 1) % strings.botStatus.messages.length;
  };

  updateStatus();

  setInterval(updateStatus, strings.botStatus.rotationInterval * 1000);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = commands.get(interaction.commandName);

  if (!command) {
    console.error(`Command ${interaction.commandName} not found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error("Error:", error);

    const errorMessage = {
      content: "There was an error executing this command!",
      ephemeral: true,
    };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(errorMessage);
    } else {
      await interaction.reply(errorMessage);
    }
  }
});

client.login(config.discord.token);
