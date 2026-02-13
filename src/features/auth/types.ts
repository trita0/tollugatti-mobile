export type AuthProfile = {
  id: string;
  displayName?: string;
  name?: string;
  email?: string;
  phone?: string;
  [key: string]: unknown;
};

export type AuthTenantMembership = {
  tenant_id: string;
  user_id: string;
  role?: string;
  tenants?: {
    id: string;
    name: string;
    slug: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

export type AuthSessionInfo = {
  userId: string;
  tenantId?: string;
  role?: string;
  [key: string]: unknown;
};

export type AuthTokens = {
  accessToken?: string;
  refreshToken?: string;
};

export type AuthState = {
  tokens: AuthTokens | null;
  profile: AuthProfile | null;
  tenants: AuthTenantMembership[];
  session: AuthSessionInfo | null;
  exchangeStatus: number | null;
  exchangeMessage: string | null;
  meStatus: number | null;
  meMessage: string | null;
  isReady: boolean;
  isSigningIn: boolean;
  isLoadingProfile: boolean;
  isUpdatingProfile: boolean;
  lastError: string | null;
};
