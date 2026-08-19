import { endpoints } from "../../config/endpoints";

export type AaduhuliPlayer = {
  id: number;
  name?: string | null;
};

export type AaduhuliMatch = {
  matchID: string;
  players: AaduhuliPlayer[];
  gameName: string;
  numPlayers: number;
  setupData?: Record<string, unknown>;
};

export type AaduhuliMoveType = "placeGoat" | "moveGoat" | "moveTiger";

const aaduhuliPath = process.env.EXPO_PUBLIC_AADUHULI_PATH ?? "/api/games/aaduhuli3";

const toUrl = (path: string) => new URL(path, endpoints.api).toString();

const readError = async (response: Response) => {
  const body = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  const message = typeof body.error === "string" ? body.error : `Request failed (${response.status})`;
  throw new Error(message);
};

const postJson = async <T>(payload: Record<string, unknown>): Promise<T> => {
  const response = await fetch(toUrl(aaduhuliPath), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    credentials: "include",
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    await readError(response);
  }

  return (await response.json()) as T;
};

export const listAaduhuliMatches = async (): Promise<AaduhuliMatch[]> => {
  const response = await fetch(toUrl(aaduhuliPath), {
    method: "GET",
    headers: {
      Accept: "application/json"
    },
    credentials: "include"
  });

  if (!response.ok) {
    await readError(response);
  }

  const data = (await response.json()) as AaduhuliMatch[] | { matches?: AaduhuliMatch[] };
  return Array.isArray(data) ? data : data.matches ?? [];
};

export const listBotReadyAaduhuliMatches = async () => {
  const matches = await listAaduhuliMatches();
  return matches.filter((match) => {
    const goat = match.players.find((p) => p.id === 0);
    const tiger = match.players.find((p) => p.id === 1);
    const goatEmpty = !goat?.name;
    const tigerBotPresent = Boolean(tiger?.name);
    return goatEmpty && tigerBotPresent;
  });
};

export const joinAaduhuliMatchAsGoat = async (input: { matchID: string; playerName: string }) => {
  return postJson<{ playerCredentials: string }>({
    action: "join",
    matchID: input.matchID,
    playerID: "0",
    playerName: input.playerName
  });
};

export const moveAaduhuli = async (input: {
  matchID: string;
  credentials: string;
  playerID?: "0" | "1";
  type: AaduhuliMoveType;
  position?: string;
  from?: string;
  to?: string;
}) => {
  return postJson<Record<string, unknown>>({
    action: "move",
    matchID: input.matchID,
    playerID: input.playerID ?? "0",
    credentials: input.credentials,
    type: input.type,
    position: input.position,
    from: input.from,
    to: input.to
  });
};

export const leaveAaduhuliMatch = async (input: {
  matchID: string;
  credentials: string;
  playerID?: "0" | "1";
}) => {
  return postJson<{ success: boolean }>({
    action: "leave",
    matchID: input.matchID,
    playerID: input.playerID ?? "0",
    credentials: input.credentials
  });
};
