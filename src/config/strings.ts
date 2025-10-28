// Strings centralizadas do bot - Edite aqui para customizar as mensagens

export const strings = {
  // Header
  profileTitle: "📊 Profile",

  // Profile
  levelField: "🎯 Level",
  rankedField: "🏆 Ranked",
  soloQueueField: "👺 SoloQ",
  flexQueueField: "👾 Flex",
  top10MasteryField: "⭐ Mastery - Top 10",

  noRanking: "No ranking",
  hotStreak: "🔥",

  // Ranking
  // placeholders: {tier} {rank} {lp} {wins} {losses} {games} {winrate}
  rankFormat: "**{tier} {rank}** - {lp} LP",
  statsFormat: "{wins}V / {losses}D - {games} games - {winrate}% WR",

  // Mastery
  // placeholders: {index} {level} {champion} {points}
  masteryFormat: "{index}. **M{level}** - {champion} - {points}k pts",

  // Error messages
  errorTitle: "❌ Erro",
  accountNotFound: "Account not found. Check the name and tag.",
  summonerNotFound: "Summoner not found.",
  invalidFormat: "Invalid format! Use: Name#Tag (ex: Hide on Bush#br1)",
  emptyNameOrTag: "Empty name or tag! Use: Name#Tag (ex: Hide on Bush#br1)",

  // Riot Api error
  summonerNotFoundApi: "Summoner not found. Check name and region.",
  invalidApiKey: "Invalid or expired API key.",
  unauthorizedApiKey: "Riot API unauthorized.",
  rateLimited: "Too many request, try again in a few minutes.",
  unknownApiError: "Riot API error: {status}",
  unknownError: "Unknown error with Riot API.",

  // default player name if not provided
  defaultPlayerName: "Summoner",

  // Unknown champion
  unknownChampion: "Champion #{id}",

  // Footer
  footer: "Made by htR",
  botStatus: {
    // "Playing", "Streaming", "Listening", "Watching", "Competing", "Custom"
    type: "Custom",
    // Status: "online", "idle", "dnd", "invisible"
    status: "online",
    rotationInterval: 5,
    messages: [
      "Fetching summoner data...",
      "Checking ranked stats",
      "Compiling champion masteries",
      "Monitoring the Rift",
      "Scanning recent matches",
      "Keeping an eye on the meta",
      "Tip: Use /profile to view a player summary",
      "Bot is online and listening",
      "Optimizing builds and runes",
      "Collecting match highlights",
      "Standing by for your next command",
    ],
  },
};

export type Strings = typeof strings;
