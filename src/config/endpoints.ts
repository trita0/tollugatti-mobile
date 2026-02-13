const read = (value: string | undefined, fallback: string) => {
  if (!value) {
    return fallback;
  }
  return value;
};

export const endpoints = {
  auth: read(process.env.EXPO_PUBLIC_AUTH_URL, "http://localhost:3001"),
  api: read(process.env.EXPO_PUBLIC_API_URL, "http://localhost:3000"),
  gameServer: read(process.env.EXPO_PUBLIC_GAME_SERVER_URL, "http://localhost:8000"),
  lobbyServer: read(process.env.EXPO_PUBLIC_LOBBY_SERVER_URL, "http://localhost:8080")
};
