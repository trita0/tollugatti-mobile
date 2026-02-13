import * as Linking from "expo-linking";

import { endpoints } from "../../config/endpoints";
import type { AuthProfile, AuthSessionInfo, AuthTenantMembership } from "./types";

type MeResult = {
  user: AuthProfile;
  tenants: AuthTenantMembership[];
  session: AuthSessionInfo | null;
};

type MeFetchResult =
  | {
      ok: true;
      status: number;
      data: MeResult;
      message: null;
    }
  | {
      ok: false;
      status: number;
      data: null;
      message: string;
    };

const authRoute = {
  portalEntry: process.env.EXPO_PUBLIC_AUTH_LOGIN_PATH ?? "/login",
  mobileAuthorize: process.env.EXPO_PUBLIC_AUTH_MOBILE_AUTHORIZE_PATH ?? "/api/auth/mobile/authorize",
  mobileExchange: process.env.EXPO_PUBLIC_AUTH_MOBILE_EXCHANGE_PATH ?? "/api/auth/mobile/exchange",
  logout: process.env.EXPO_PUBLIC_AUTH_LOGOUT_PATH ?? "/api/auth/logout",
  me: process.env.EXPO_PUBLIC_AUTH_ME_PATH ?? "/api/me",
  profile: process.env.EXPO_PUBLIC_AUTH_PROFILE_PATH ?? "/api/profile"
};

const toUrl = (path: string) => new URL(path, endpoints.auth).toString();

const parseUser = (body: Record<string, unknown>): AuthProfile => {
  if (body.user && typeof body.user === "object") {
    return body.user as AuthProfile;
  }
  if (body.profile && typeof body.profile === "object") {
    return body.profile as AuthProfile;
  }
  return body as AuthProfile;
};

const parseMe = (body: Record<string, unknown>): MeResult => {
  return {
    user: parseUser(body),
    tenants: Array.isArray(body.tenants) ? (body.tenants as AuthTenantMembership[]) : [],
    session: (body.session as AuthSessionInfo | undefined) ?? null
  };
};

export const createAuthRedirectUrls = () => {
  const redirectScheme = process.env.EXPO_PUBLIC_AUTH_REDIRECT_SCHEME ?? "tollugatti";
  const appReturnUrl = Linking.createURL("auth/callback", { scheme: redirectScheme });
  const authorizeUrl = new URL(authRoute.mobileAuthorize, endpoints.auth);
  authorizeUrl.searchParams.set("returnUrl", appReturnUrl);
  const authUrl = new URL(authRoute.portalEntry, endpoints.auth);
  authUrl.searchParams.set("returnUrl", authorizeUrl.toString());
  return {
    authUrl: authUrl.toString(),
    returnUrl: appReturnUrl
  };
};

export const readCodeFromCallbackUrl = (url: string): string | null => {
  try {
    const parsed = new URL(url);
    return parsed.searchParams.get("code") ?? parsed.searchParams.get("authCode");
  } catch {
    return null;
  }
};

export const exchangeMobileCode = async (input: {
  code: string;
  returnUrl: string;
}): Promise<{ status: number; message: string | null }> => {
  const response = await fetch(toUrl(authRoute.mobileExchange), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    credentials: "include",
    body: JSON.stringify({
      code: input.code,
      returnUrl: input.returnUrl
    })
  });

  const body = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  const message = typeof body.message === "string" ? body.message : null;

  if (!response.ok) {
    throw new Error(message ?? `Code exchange failed (${response.status}).`);
  }

  return {
    status: response.status,
    message
  };
};

export const fetchMe = async (): Promise<MeFetchResult> => {
  const response = await fetch(toUrl(authRoute.me), {
    method: "GET",
    headers: { Accept: "application/json" },
    credentials: "include"
  });

  const body = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  if (!response.ok) {
    const message = typeof body.message === "string" ? body.message : "Not authenticated.";
    return {
      ok: false,
      status: response.status,
      data: null,
      message
    };
  }

  return {
    ok: true,
    status: response.status,
    data: parseMe(body),
    message: null
  };
};

export const updateProfile = async (input: {
  displayName?: string;
  handle?: string;
  city?: string;
  avatarUrl?: string;
}): Promise<AuthProfile> => {
  const response = await fetch(toUrl(authRoute.profile), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    credentials: "include",
    body: JSON.stringify(input)
  });

  const body = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  if (!response.ok) {
    const message = typeof body.message === "string" ? body.message : "Failed to update profile.";
    throw new Error(message);
  }
  return parseUser(body);
};

export const logoutSession = async () => {
  await fetch(toUrl(authRoute.logout), {
    method: "POST",
    headers: { Accept: "application/json" },
    credentials: "include"
  });
};
