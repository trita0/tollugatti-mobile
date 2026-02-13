import * as Linking from "expo-linking";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import {
  createAuthRedirectUrls,
  exchangeMobileCode,
  fetchMe,
  logoutSession,
  readCodeFromCallbackUrl,
  updateProfile
} from "./client";
import type { AuthProfile, AuthSessionInfo, AuthState, AuthTenantMembership } from "./types";

type AuthContextValue = AuthState & {
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  reloadProfile: () => Promise<void>;
  updateProfile: (input: {
    displayName?: string;
    handle?: string;
    city?: string;
    avatarUrl?: string;
  }) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [tenants, setTenants] = useState<AuthTenantMembership[]>([]);
  const [session, setSession] = useState<AuthSessionInfo | null>(null);
  const [exchangeStatus, setExchangeStatus] = useState<number | null>(null);
  const [exchangeMessage, setExchangeMessage] = useState<string | null>(null);
  const [meStatus, setMeStatus] = useState<number | null>(null);
  const [meMessage, setMeMessage] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const loadMe = useCallback(async () => {
    setIsLoadingProfile(true);
    try {
      const result = await fetchMe();
      setMeStatus(result.status);
      setMeMessage(result.message);
      if (!result.ok) {
        throw new Error(result.message);
      }

      setProfile(result.data.user);
      setTenants(result.data.tenants);
      setSession(result.data.session);
    } finally {
      setIsLoadingProfile(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    loadMe()
      .catch(() => {
        if (mounted) {
          setProfile(null);
          setTenants([]);
          setSession(null);
        }
      })
      .finally(() => {
        if (mounted) {
          setIsReady(true);
        }
      });
    return () => {
      mounted = false;
    };
  }, [loadMe]);

  const signIn = useCallback(async () => {
    setIsSigningIn(true);
    setLastError(null);
    try {
      const { authUrl, returnUrl } = createAuthRedirectUrls();
      const expectedPrefix = returnUrl.replace(/\/$/, "");

      const callbackUrl = await new Promise<string>((resolve, reject) => {
        let timeoutId: ReturnType<typeof setTimeout> | null = null;
        const cleanup = () => {
          listener.remove();
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
        };

        const listener = Linking.addEventListener("url", ({ url }) => {
          const normalized = url.replace(/\/$/, "");
          if (!normalized.startsWith(expectedPrefix)) {
            return;
          }
          cleanup();
          resolve(url);
        });

        timeoutId = setTimeout(() => {
          cleanup();
          reject(new Error("Timed out waiting for auth redirect."));
        }, 180000);

        Linking.openURL(authUrl).catch((error) => {
          cleanup();
          reject(error instanceof Error ? error : new Error("Failed to open auth portal."));
        });
      });

      const code = readCodeFromCallbackUrl(callbackUrl);
      if (!code) {
        throw new Error("Missing auth code in callback URL.");
      }

      const exchanged = await exchangeMobileCode({ code, returnUrl });
      setExchangeStatus(exchanged.status);
      setExchangeMessage(exchanged.message);

      await loadMe();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Sign-in failed.";
      setLastError(message);
    } finally {
      setIsSigningIn(false);
    }
  }, [loadMe]);

  const signOut = useCallback(async () => {
    try {
      await logoutSession();
    } finally {
      setProfile(null);
      setTenants([]);
      setSession(null);
      setExchangeStatus(null);
      setExchangeMessage(null);
      setMeStatus(null);
      setMeMessage(null);
      setLastError(null);
    }
  }, []);

  const reloadProfile = useCallback(async () => {
    setLastError(null);
    try {
      await loadMe();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to reload profile.";
      setLastError(message);
    }
  }, [loadMe]);

  const updateProfileAction = useCallback(
    async (input: { displayName?: string; handle?: string; city?: string; avatarUrl?: string }) => {
      setIsUpdatingProfile(true);
      setLastError(null);
      try {
        const nextProfile = await updateProfile(input);
        setProfile(nextProfile);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to update profile.";
        setLastError(message);
        throw error;
      } finally {
        setIsUpdatingProfile(false);
      }
    },
    []
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      tokens: null,
      profile,
      tenants,
      session,
      exchangeStatus,
      exchangeMessage,
      meStatus,
      meMessage,
      isReady,
      isSigningIn,
      isLoadingProfile,
      isUpdatingProfile,
      lastError,
      signIn,
      signOut,
      reloadProfile,
      updateProfile: updateProfileAction
    }),
    [
      isLoadingProfile,
      isUpdatingProfile,
      exchangeMessage,
      exchangeStatus,
      meMessage,
      meStatus,
      isReady,
      isSigningIn,
      lastError,
      profile,
      reloadProfile,
      session,
      signIn,
      signOut,
      tenants,
      updateProfileAction
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within <AuthProvider />");
  }
  return context;
};
