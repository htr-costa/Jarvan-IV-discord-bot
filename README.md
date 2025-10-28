# Jarvan IV - League of Legends Discord Bot

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Discord](https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

> A personal learning project built to practice TypeScript, API integrations and Discord bot development while combining my League passion

## About This Project

This bot was created as a hands-on learning experience to improve my skills in:

- **TypeScript** - Implementing proper types and interfaces
- **API Integration** - Working with external APIs (Riot Games & Discord)
- **Async/Await Patterns** - Managing asynchronous operations effectively

It fetches real-time LoL player data and displays it in a clean interactive Discord embed.

## Features

- **Player Profiles**: Fetch and display summoner information using Riot's API
- **Ranked Stats**: Show SoloQ and Flex rankings with LP, wins/losses, and winrate
- **Champion Mastery**: Display top 50 champions with mastery levels and points
- **Interactive Pagination**: Navigate through champion masteries using Discord buttons
- **Multi-Region Support**: Works across all major League of Legends regions

## Slash Commands

### `/profile`

Displays a profile for any League of Legends player.

**Usage:**

```
/profile riotid:Hide on Bush#KR1 region:Korea
```

**Parameters:**

- `riotid` (required): Player's Riot ID in the format `Nick#TAG`
- `region` (required): Server region (BR, NA, EUW, etc.)

---

## Tech Stack

- **TypeScript**
- **Discord.js v14**
- **Axios**
- **dotenv**
- **Node.js**

## 📁 Project Structure

```
JarvanIV/
├── src/
│   ├── commands/         # Discord slash commands
│   ├── services/         # External API services (Riot API)
│   ├── utils/            # Utility functions (embeds, formatters)
│   ├── types/            # TypeScript type definitions
│   ├── config/           # Configuration and constants
│   │   ├── config.ts     # Environment variables & settings
│   │   └── strings.ts    # Centralized strings and messages
│   ├── scripts/          # Utility scripts
│   │   └── deploy-commands.ts # Command deployment script
│   └── index.ts          # Bot entry point
├── .env.example          # Environment variables template
├── package.json          # Dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

## Future Improvements

Some ideas Im considering:

- [ ] Add match history command
- [ ] Show live game information
- [ ] Add more statistics and graphs
- [ ] Add admin commands for bot management
- [ ] Support for multiple languages
