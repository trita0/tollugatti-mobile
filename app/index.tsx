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
          <View>
            <Text style={styles.brand}>TolluGatti</Text>
            <Text style={styles.greeting}>
              {signedIn ? `Hi, ${playerName}` : "Welcome"}
            </Text>
          </View>
          <Pressable
            style={[styles.authButton, signedIn ? styles.authButtonSecondary : styles.authButtonPrimary]}
            onPress={signedIn ? signOut : signIn}
            disabled={!isReady || isSigningIn}
          >
            <Text style={styles.authButtonText}>
              {isSigningIn ? "Signing in..." : signedIn ? "Logout" : "Login"}
            </Text>
          </Pressable>
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.heroTag}>Today’s Highlight</Text>
          <Text style={styles.heroTitle}>Next Move Assistant</Text>
          <Text style={styles.heroBody}>
            Real-time move suggestions, probability hints, and tactical nudges while you play.
          </Text>
          <Pressable style={styles.primaryCta}>
            <Text style={styles.primaryCtaText}>Try Assistant</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>Play</Text>
        <View style={styles.tileGrid}>
          <FeatureTile title="Game Lobby" subtitle="Join or create rooms" accent="#1D3557" />
          <FeatureTile title="Quick Match" subtitle="Ranked 1v1 queue" accent="#0F766E" />
        </View>

        <Text style={styles.sectionTitle}>Compete</Text>
        <View style={styles.tileGrid}>
          <FeatureTile title="Tournaments" subtitle="Brackets and rounds" accent="#7C3AED" />
          <FeatureTile title="Leagues" subtitle="Fixtures and standings" accent="#E76F51" />
        </View>

        <Text style={styles.sectionTitle}>Track</Text>
        <View style={styles.tileGrid}>
          <FeatureTile title="Match History" subtitle="Results and stats" accent="#0EA5E9" />
          <FeatureTile title="Physical Logs" subtitle="QR verify + evidence" accent="#2A9D8F" />
        </View>

        <View style={styles.cardRow}>
          <Pressable style={styles.secondaryCard} onPress={() => router.push("/profile")} disabled={!signedIn}>
            <Text style={styles.secondaryTitle}>Profile</Text>
            <Text style={styles.secondarySubtitle}>
              {signedIn ? "Manage your identity and details" : "Login to edit your profile"}
            </Text>
          </Pressable>
          <Pressable style={styles.secondaryCard} onPress={reloadProfile} disabled={isLoadingProfile}>
            <Text style={styles.secondaryTitle}>Sync</Text>
            <Text style={styles.secondarySubtitle}>
              {isLoadingProfile ? "Refreshing..." : "Refresh account session"}
            </Text>
          </Pressable>
        </View>

        {lastError ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{lastError}</Text>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

function FeatureTile({
  title,
  subtitle,
  accent
}: {
  title: string;
  subtitle: string;
  accent: string;
}) {
  return (
    <Pressable style={styles.tile}>
      <View style={[styles.dot, { backgroundColor: accent }]} />
      <Text style={styles.tileTitle}>{title}</Text>
      <Text style={styles.tileSubtitle}>{subtitle}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F8F5EE"
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
  brand: {
    fontSize: 13,
    letterSpacing: 0.4,
    textTransform: "uppercase",
    color: "#6B7280",
    fontWeight: "700"
  },
  greeting: {
    marginTop: 3,
    fontSize: 26,
    color: "#111827",
    fontWeight: "800"
  },
  authButton: {
    minHeight: 38,
    paddingHorizontal: 14,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center"
  },
  authButtonPrimary: {
    backgroundColor: "#111827"
  },
  authButtonSecondary: {
    backgroundColor: "#374151"
  },
  authButtonText: {
    color: "#FFFFFF",
    fontWeight: "700"
  },
  heroCard: {
    borderRadius: 20,
    backgroundColor: "#111827",
    padding: 18,
    marginBottom: 16
  },
  heroTag: {
    alignSelf: "flex-start",
    backgroundColor: "#E9C46A",
    color: "#111827",
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
    color: "#D1D5DB"
  },
  primaryCta: {
    marginTop: 16,
    alignSelf: "flex-start",
    backgroundColor: "#2A9D8F",
    borderRadius: 12,
    minHeight: 42,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center"
  },
  primaryCtaText: {
    color: "#FFFFFF",
    fontWeight: "800"
  },
  sectionTitle: {
    marginTop: 2,
    marginBottom: 8,
    fontSize: 18,
    color: "#111827",
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
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginBottom: 10
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
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E7E1D7",
    padding: 14
  },
  secondaryTitle: {
    fontSize: 15,
    color: "#111827",
    fontWeight: "800"
  },
  secondarySubtitle: {
    marginTop: 5,
    fontSize: 13,
    lineHeight: 18,
    color: "#6B7280"
  },
  errorBox: {
    marginTop: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FCA5A5",
    backgroundColor: "#FEE2E2",
    padding: 12
  },
  errorText: {
    color: "#991B1B",
    fontWeight: "600"
  }
});
