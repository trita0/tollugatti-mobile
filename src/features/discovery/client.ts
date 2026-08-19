import { endpoints } from "../../config/endpoints";
import type { EventSummary, FeaturedPayload, GameSummary, TournamentSummary } from "./types";

const toUrl = (path: string) => new URL(path, endpoints.api).toString();

const parseError = async (response: Response) => {
  const body = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  const message = typeof body.message === "string" ? body.message : `Request failed (${response.status})`;
  throw new Error(message);
};

const fetchJson = async <T>(path: string): Promise<T> => {
  const response = await fetch(toUrl(path), {
    method: "GET",
    headers: {
      Accept: "application/json"
    },
    credentials: "include"
  });

  if (!response.ok) {
    await parseError(response);
  }

  return (await response.json()) as T;
};

export const listGames = async () => {
  const data = await fetchJson<{ games?: GameSummary[] }>("/api/games");
  return data.games ?? [];
};

export const listEvents = async () => {
  const data = await fetchJson<{ events?: EventSummary[] }>("/api/events");
  return data.events ?? [];
};

export const listTournaments = async () => {
  const data = await fetchJson<{ tournaments?: TournamentSummary[] }>("/api/tournaments");
  return data.tournaments ?? [];
};

export const getFeatured = async (): Promise<FeaturedPayload> => {
  const data = await fetchJson<{ featured?: Partial<FeaturedPayload> }>("/api/featured");
  return {
    games: data.featured?.games ?? [],
    tournaments: data.featured?.tournaments ?? [],
    events: data.featured?.events ?? []
  };
};

