import axios, { AxiosError } from "axios";
import { config } from "../config/config";
import {
  SummonerDTO,
  LeagueEntryDTO,
  Region,
  REGION_TO_ROUTING,
  RoutingValue,
  ChampionMasteryDTO,
} from "../types/riot";
import { strings } from "../config/strings";

class RiotApiService {
  private apiKey: string;

  constructor() {
    this.apiKey = config.riot.apiKey;
  }

  private getRegionalUrl(region: Region): string {
    return `https://${region}.api.riotgames.com`;
  }

  private getRoutingUrl(region: Region): string {
    const routing = REGION_TO_ROUTING[region];
    return `https://${routing}.api.riotgames.com`;
  }

  private handleError(error: unknown): string {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error("API Riot error:", axiosError.response?.data);
      if (axiosError.response?.status === 404) {
        return strings.summonerNotFoundApi;
      }
      if (axiosError.response?.status === 403) {
        return strings.invalidApiKey;
      }
      if (axiosError.response?.status === 401) {
        return strings.unauthorizedApiKey;
      }
      if (axiosError.response?.status === 429) {
        return strings.rateLimited;
      }
      return strings.unknownApiError.replace(
        "{status}",
        axiosError.response?.status?.toString() || "Unknown"
      );
    }
    return strings.unknownError;
  }

  private getHeaders() {
    return {
      "X-Riot-Token": this.apiKey,
      Accept: "application/json",
      "User-Agent": "Mozilla/5.0",
    };
  }

  async getAccountByRiotId(
    gameName: string,
    tagLine: string,
    region: Region
  ): Promise<{ puuid: string; gameName: string; tagLine: string } | null> {
    try {
      const url = `${this.getRoutingUrl(
        region
      )}/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(
        gameName
      )}/${encodeURIComponent(tagLine)}`;
      // console.log("Searching account:", url);

      const response = await axios.get(url, {
        headers: this.getHeaders(),
      });

      return response.data;
    } catch (error) {
      throw new Error(this.handleError(error));
    }
  }

  async getSummonerByPuuid(
    puuid: string,
    region: Region
  ): Promise<SummonerDTO | null> {
    try {
      const url = `${this.getRegionalUrl(
        region
      )}/lol/summoner/v4/summoners/by-puuid/${puuid}`;
      // console.log("Searching summoner:", url);

      const response = await axios.get<SummonerDTO>(url, {
        headers: this.getHeaders(),
      });

      // console.log("Status:", response.status);
      // console.log("Data:", response.data);

      return response.data;
    } catch (error) {
      throw new Error(this.handleError(error));
    }
  }

  async getLeagueEntries(
    puuid: string,
    region: Region
  ): Promise<LeagueEntryDTO[]> {
    try {
      const url = `${this.getRegionalUrl(
        region
      )}/lol/league/v4/entries/by-puuid/${puuid}`;
      console.log("Searching leagues:", url);

      const response = await axios.get<LeagueEntryDTO[]>(url, {
        headers: this.getHeaders(),
      });

      //console.log("Status leagues:", response.status);
      //console.log("Data leagues:", response.data);

      return response.data;
    } catch (error) {
      throw new Error(this.handleError(error));
    }
  }

  async getChampionMastery(
    puuid: string,
    region: Region,
    count: number = 10
  ): Promise<ChampionMasteryDTO[]> {
    try {
      const url = `${this.getRegionalUrl(
        region
      )}/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/top?count=${count}`;

      const response = await axios.get<ChampionMasteryDTO[]>(url, {
        headers: this.getHeaders(),
      });

      return response.data;
    } catch (error) {
      throw new Error(this.handleError(error));
    }
  }
}

export const riotApi = new RiotApiService();
