import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} from "discord.js";
import { riotApi } from "../services/riotApi";
import { createDetailedProfileEmbed, createErrorEmbed } from "../utils/embeds";
import { Region } from "../types/riot";
import { strings } from "../config/strings";

export const data = new SlashCommandBuilder()
  .setName("profile")
  .setDescription(
    "Displays a profile for a League of Legends player, including ranks, champion masteries, and account details."
  )
  .addStringOption((option) =>
    option
      .setName("riotid")
      .setDescription("Nickname and Riot ID (ex: Hide on Bush#KR1)")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("region")
      .setDescription("Server Region")
      .setRequired(true)
      .addChoices(
        { name: "Brazil", value: "br1" },
        { name: "North America", value: "na1" },
        { name: "Europe West", value: "euw1" },
        { name: "Europe Nordic & East", value: "eun1" },
        { name: "Korea", value: "kr" },
        { name: "Japan", value: "jp1" },
        { name: "Oceania", value: "oc1" },
        { name: "Latin America North", value: "la1" },
        { name: "Latin America South", value: "la2" }
      )
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  const riotId = interaction.options.getString("riotid", true);
  const region = interaction.options.getString("region", true) as Region;

  // separa o riot id
  const parts = riotId.split("#");
  if (parts.length !== 2) {
    await interaction.editReply({
      embeds: [createErrorEmbed(strings.invalidFormat)],
    });
    return;
  }

  const gameName = parts[0].trim();
  const tagLine = parts[1].trim();

  if (!gameName || !tagLine) {
    await interaction.editReply({
      embeds: [createErrorEmbed(strings.emptyNameOrTag)],
    });
    return;
  }

  try {
    const account = await riotApi.getAccountByRiotId(gameName, tagLine, region);

    if (!account) {
      await interaction.editReply({
        embeds: [createErrorEmbed(strings.accountNotFound)],
      });
      return;
    }

    const summoner = await riotApi.getSummonerByPuuid(account.puuid, region);

    if (!summoner) {
      await interaction.editReply({
        embeds: [createErrorEmbed(strings.summonerNotFound)],
      });
      return;
    }

    const leagues = await riotApi.getLeagueEntries(account.puuid, region);

    const masteries = await riotApi.getChampionMastery(
      account.puuid,
      region,
      50
    );

    let currentPage = 0;
    const totalPages = Math.ceil(masteries.length / 10);

    const embed = createDetailedProfileEmbed(
      summoner,
      leagues,
      masteries,
      account.gameName,
      account.tagLine,
      currentPage
    );

    // navigation
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("prev")
        .setLabel("←")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(currentPage === 0),
      new ButtonBuilder()
        .setCustomId("next")
        .setLabel("→")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(currentPage >= totalPages - 1 || masteries.length <= 10)
    );

    const response = await interaction.editReply({
      embeds: [embed],
      components: masteries.length > 10 ? [row] : [],
    });

    if (masteries.length > 10) {
      const collector = response.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 120000, // 2 minutos
      });

      collector.on("collect", async (i) => {
        if (i.user.id !== interaction.user.id) {
          await i.reply({
            content: "Not your buttons...",
            ephemeral: true,
          });
          return;
        }

        if (i.customId === "prev") {
          currentPage = Math.max(0, currentPage - 1);
        } else if (i.customId === "next") {
          currentPage = Math.min(totalPages - 1, currentPage + 1);
        }

        const newEmbed = createDetailedProfileEmbed(
          summoner,
          leagues,
          masteries,
          account.gameName,
          account.tagLine,
          currentPage
        );

        const newRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId("prev")
            .setLabel("←")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(currentPage === 0),
          new ButtonBuilder()
            .setCustomId("next")
            .setLabel("→")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(currentPage >= totalPages - 1)
        );

        await i.update({
          embeds: [newEmbed],
          components: [newRow],
        });
      });

      collector.on("end", async () => {
        try {
          await interaction.deleteReply();
        } catch (error) {}
      });
    } else {
      setTimeout(async () => {
        try {
          await interaction.deleteReply();
        } catch (error) {}
      }, 120000); // 2 minutos
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown Error";
    await interaction.editReply({
      embeds: [createErrorEmbed(errorMessage)],
    });
  }
}
