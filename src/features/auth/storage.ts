import type { AuthTokens } from "./types";

let memoryTokens: AuthTokens | null = null;

export const authStorage = {
  async getTokens(): Promise<AuthTokens | null> {
    return memoryTokens;
  },
  async saveTokens(tokens: AuthTokens) {
    memoryTokens = tokens;
  },
  async clearTokens() {
    memoryTokens = null;
  }
};
