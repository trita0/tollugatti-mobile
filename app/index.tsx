import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { useAuth } from "../src/features/auth/auth-context";

export default function HomeScreen() {
  const {
    profile,
    isReady,
    isSigningIn,
    isLoadingProfile,
    lastError,
    signIn,
    signOut,
    reloadProfile
  } = useAuth();

  const signedIn = Boolean(profile);
  const playerName = profile?.displayName ?? profile?.name ?? "Player";

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View style={styles.brandRow}>
            <View style={styles.logoBox}>
              <Text style={styles.logoGlyph}>◆</Text>
            </View>
            <View>
              <Text style={styles.brand}>TolluGatti</Text>
              <Text style={styles.greeting}>
                {signedIn ? `Hi, ${playerName}` : "Welcome"}
              </Text>
            </View>
          </View>
          <Pressable
            style={[styles.authButton, signedIn ? styles.authButtonSecondary : styles.authButtonPrimary]}
            onPress={signedIn ? signOut : signIn}
            disabled={!isReady || isSigningIn}
          >
            <Text style={styles.authGlyph}>{signedIn ? "←" : "→"}</Text>
            <Text style={styles.authButtonText}>
              {isSigningIn ? "Signing in..." : signedIn ? "Logout" : "Login"}
            </Text>
          </Pressable>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <Text style={styles.heroTag}>Today’s Highlight</Text>
            <Text style={styles.sparkleGlyph}>✦</Text>
          </View>
          <Text style={styles.heroTitle}>Next Move Assistant</Text>
          <Text style={styles.heroBody}>
            Real-time move suggestions, probability hints, and tactical nudges while you play.
          </Text>
          <View style={styles.heroMetaRow}>
            <HeroPill icon="◉" text="Smart Hints" />
            <HeroPill icon="◈" text="Win Chance" />
            <HeroPill icon="◬" text="Tactics" />
          </View>
          <Pressable style={styles.primaryCta} onPress={() => router.push("/discover")}>
            <Text style={styles.primaryCtaGlyph}>◎</Text>
            <Text style={styles.primaryCtaText}>Try Assistant</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>Play</Text>
        <View style={styles.tileGrid}>
          <FeatureTile
            icon="▣"
            title="Game Lobby"
            subtitle="Join or create rooms"
            accent="#1D4ED8"
            tint="#DBEAFE"
            onPress={() => router.push("/discover")}
          />
          <FeatureTile
            icon="⚑"
            title="Quick Match"
            subtitle="Play Aaduhuli vs Bot"
            accent="#EA580C"
            tint="#FFEDD5"
            onPress={() => router.push("/bot-aaduhuli")}
          />
        </View>

        <Text style={styles.sectionTitle}>Compete</Text>
        <View style={styles.tileGrid}>
          <FeatureTile
            icon="▲"
            title="Tournaments"
            subtitle="Brackets and rounds"
            accent="#7C3AED"
            tint="#EDE9FE"
            onPress={() => router.push("/discover")}
          />
          <FeatureTile
            icon="◍"
            title="Leagues"
            subtitle="Fixtures and standings"
            accent="#0F766E"
            tint="#CCFBF1"
            onPress={() => router.push("/discover")}
          />
        </View>

        <Text style={styles.sectionTitle}>Track</Text>
        <View style={styles.tileGrid}>
          <FeatureTile
            icon="◷"
            title="Match History"
            subtitle="Results and stats"
            accent="#DC2626"
            tint="#FEE2E2"
            onPress={() => router.push("/discover")}
          />
          <FeatureTile
            icon="⌗"
            title="Physical Logs"
            subtitle="QR verify + evidence"
            accent="#9333EA"
            tint="#F3E8FF"
            onPress={() => router.push("/discover")}
          />
        </View>

        <Text style={styles.sectionTitle}>Community</Text>
        <View style={styles.tileGrid}>
          <FeatureTile
            icon="◯"
            title="Workshops"
            subtitle="Learn and train together"
            accent="#0891B2"
            tint="#CFFAFE"
            onPress={() => router.push("/discover")}
          />
          <FeatureTile
            icon="✶"
            title="Alerts"
            subtitle="Invites and reminders"
            accent="#BE123C"
            tint="#FFE4E6"
            onPress={() => router.push("/discover")}
          />
        </View>

        <View style={styles.cardRow}>
          <Pressable style={styles.secondaryCard} onPress={() => router.push("/profile")} disabled={!signedIn}>
            <Text style={styles.secondaryGlyph}>◉</Text>
            <Text style={styles.secondaryTitle}>Profile</Text>
            <Text style={styles.secondarySubtitle}>
              {signedIn ? "Manage your identity and details" : "Login to edit your profile"}
            </Text>
          </Pressable>
          <Pressable style={styles.secondaryCard} onPress={reloadProfile} disabled={isLoadingProfile}>
            <Text style={styles.secondaryGlyph}>↻</Text>
            <Text style={styles.secondaryTitle}>Sync</Text>
            <Text style={styles.secondarySubtitle}>
              {isLoadingProfile ? "Refreshing..." : "Refresh account session"}
            </Text>
          </Pressable>
        </View>

        {lastError ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorGlyph}>!</Text>
            <Text style={styles.errorText}>{lastError}</Text>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

function HeroPill({
  icon,
  text
}: {
  icon: string;
  text: string;
}) {
  return (
    <View style={styles.heroPill}>
      <Text style={styles.heroPillGlyph}>{icon}</Text>
      <Text style={styles.heroPillText}>{text}</Text>
    </View>
  );
}

function FeatureTile({
  icon,
  title,
  subtitle,
  accent,
  tint,
  onPress
}: {
  icon: string;
  title: string;
  subtitle: string;
  accent: string;
  tint: string;
  onPress?: () => void;
}) {
  return (
    <Pressable style={styles.tile} onPress={onPress}>
      <View style={[styles.iconCircle, { backgroundColor: tint }]}>
        <Text style={[styles.iconGlyph, { color: accent }]}>{icon}</Text>
      </View>
      <Text style={styles.tileTitle}>{title}</Text>
      <Text style={styles.tileSubtitle}>{subtitle}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0E1A2B"
  },
  container: {
    paddingTop: 62,
    paddingHorizontal: 18,
    paddingBottom: 28
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  logoBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#D946EF",
    alignItems: "center",
    justifyContent: "center"
  },
  logoGlyph: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700"
  },
  brand: {
    fontSize: 12,
    letterSpacing: 0.4,
    textTransform: "uppercase",
    color: "#9CA3AF",
    fontWeight: "700"
  },
  greeting: {
    marginTop: 2,
    fontSize: 25,
    color: "#FFFFFF",
    fontWeight: "800"
  },
  authButton: {
    minHeight: 38,
    paddingHorizontal: 12,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6
  },
  authButtonPrimary: {
    backgroundColor: "#2563EB"
  },
  authButtonSecondary: {
    backgroundColor: "#374151"
  },
  authButtonText: {
    color: "#FFFFFF",
    fontWeight: "700"
  },
  authGlyph: {
    color: "#FFFFFF",
    fontWeight: "800"
  },
  heroCard: {
    borderRadius: 20,
    backgroundColor: "#111827",
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#334155"
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  sparkleGlyph: {
    color: "#FFE066",
    fontSize: 16
  },
  heroTag: {
    alignSelf: "flex-start",
    backgroundColor: "#0EA5E9",
    color: "#FFFFFF",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 11,
    textTransform: "uppercase",
    fontWeight: "800"
  },
  heroTitle: {
    marginTop: 12,
    fontSize: 30,
    lineHeight: 34,
    color: "#FFFFFF",
    fontWeight: "800"
  },
  heroBody: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 21,
    color: "#CBD5E1"
  },
  heroMetaRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    flexWrap: "wrap"
  },
  heroPill: {
    backgroundColor: "#E5E7EB",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 5
  },
  heroPillGlyph: {
    color: "#111827",
    fontSize: 11,
    fontWeight: "700"
  },
  heroPillText: {
    color: "#111827",
    fontSize: 11,
    fontWeight: "700"
  },
  primaryCta: {
    marginTop: 14,
    alignSelf: "flex-start",
    backgroundColor: "#FFE066",
    borderRadius: 12,
    minHeight: 42,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 7
  },
  primaryCtaText: {
    color: "#0E1A2B",
    fontWeight: "900"
  },
  primaryCtaGlyph: {
    color: "#0E1A2B",
    fontWeight: "800"
  },
  sectionTitle: {
    marginTop: 2,
    marginBottom: 8,
    fontSize: 18,
    color: "#F8FAFC",
    fontWeight: "800"
  },
  tileGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12
  },
  tile: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E7E1D7",
    padding: 14
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10
  },
  iconGlyph: {
    fontSize: 18,
    fontWeight: "800"
  },
  tileTitle: {
    fontSize: 15,
    color: "#111827",
    fontWeight: "700"
  },
  tileSubtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: "#6B7280"
  },
  cardRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 2
  },
  secondaryCard: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    padding: 14
  },
  secondaryTitle: {
    marginTop: 7,
    fontSize: 15,
    color: "#111827",
    fontWeight: "800"
  },
  secondaryGlyph: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "700"
  },
  secondarySubtitle: {
    marginTop: 5,
    fontSize: 13,
    lineHeight: 18,
    color: "#475569"
  },
  errorBox: {
    marginTop: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FCA5A5",
    backgroundColor: "#FEE2E2",
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  errorGlyph: {
    color: "#991B1B",
    fontWeight: "900"
  },
  errorText: {
    color: "#991B1B",
    fontWeight: "600",
    flex: 1
  }
});
