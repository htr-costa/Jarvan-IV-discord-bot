import dotenv from "dotenv";

dotenv.config();

export const config = {
  discord: {
    token: process.env.DISCORD_TOKEN || "",
    clientId: process.env.CLIENT_ID || "",
  },
  riot: {
    apiKey: process.env.RIOT_API_KEY || "",
  },
};

if (!config.discord.token) {
  throw new Error("DISCORD_TOKEN not found");
}

if (!config.discord.clientId) {
  throw new Error("CLIENT_ID not found");
}

if (!config.riot.apiKey) {
  throw new Error("RIOT_API_KEY not found");
}

console.log("Config loaded");
