import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { getFeatured, listEvents, listGames, listTournaments } from "../src/features/discovery/client";
import type { EventSummary, FeaturedPayload, GameSummary, TournamentSummary } from "../src/features/discovery/types";

const formatDate = (value?: string) => {
  if (!value) {
    return "TBA";
  }
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) {
    return "TBA";
  }
  return dt.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric"
  });
};

export default function DiscoverScreen() {
  const [games, setGames] = useState<GameSummary[]>([]);
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [tournaments, setTournaments] = useState<TournamentSummary[]>([]);
  const [featured, setFeatured] = useState<FeaturedPayload>({
    games: [],
    tournaments: [],
    events: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const [gamesRes, eventsRes, tournamentsRes, featuredRes] = await Promise.allSettled([
      listGames(),
      listEvents(),
      listTournaments(),
      getFeatured()
    ]);

    const errors: string[] = [];

    if (gamesRes.status === "fulfilled") {
      setGames(gamesRes.value);
    } else {
      setGames([]);
      errors.push(`games: ${gamesRes.reason instanceof Error ? gamesRes.reason.message : "failed"}`);
    }

    if (eventsRes.status === "fulfilled") {
      setEvents(eventsRes.value);
    } else {
      setEvents([]);
      errors.push(`events: ${eventsRes.reason instanceof Error ? eventsRes.reason.message : "failed"}`);
    }

    if (tournamentsRes.status === "fulfilled") {
      setTournaments(tournamentsRes.value);
    } else {
      setTournaments([]);
      errors.push(
        `tournaments: ${tournamentsRes.reason instanceof Error ? tournamentsRes.reason.message : "failed"}`
      );
    }

    if (featuredRes.status === "fulfilled") {
      setFeatured(featuredRes.value);
    } else {
      setFeatured({ games: [], tournaments: [], events: [] });
      errors.push(`featured: ${featuredRes.reason instanceof Error ? featuredRes.reason.message : "failed"}`);
    }

    if (errors.length > 0) {
      setError(errors.join(" | "));
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const featuredSummary = useMemo(() => {
    return `${featured.games.length} games • ${featured.events.length} events • ${featured.tournaments.length} tournaments`;
  }, [featured.events.length, featured.games.length, featured.tournaments.length]);

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backText}>{"< Back"}</Text>
          </Pressable>
          <View style={styles.headerActions}>
            <Pressable style={styles.botBtn} onPress={() => router.push("/bot-aaduhuli")}>
              <Text style={styles.botText}>Play vs Bot</Text>
            </Pressable>
            <Pressable style={styles.refreshBtn} onPress={loadData} disabled={isLoading}>
              <Text style={styles.refreshText}>{isLoading ? "Loading..." : "Refresh"}</Text>
            </Pressable>
          </View>
        </View>

        <Text style={styles.title}>Discover</Text>
        <Text style={styles.subtitle}>Games, events, and tournaments from live APIs.</Text>

        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>Featured</Text>
          <Text style={styles.heroValue}>{featuredSummary}</Text>
          <Text style={styles.heroHint}>Curated picks from `/api/featured`</Text>
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <SectionTitle title="Games" count={games.length} />
        {games.slice(0, 8).map((game) => (
          <View key={game.id} style={styles.rowCard}>
            <Text style={styles.rowTitle}>{game.name}</Text>
            <Text style={styles.rowMeta}>
              {game.handle} • {game.min_players ?? "?"}-{game.max_players ?? "?"} players
            </Text>
            {game.description ? <Text style={styles.rowDescription}>{game.description}</Text> : null}
          </View>
        ))}
        {games.length === 0 && !isLoading ? <Text style={styles.empty}>No games available.</Text> : null}

        <SectionTitle title="Events" count={events.length} />
        {events.slice(0, 8).map((event) => (
          <View key={event.id} style={styles.rowCard}>
            <Text style={styles.rowTitle}>{event.title}</Text>
            <Text style={styles.rowMeta}>
              {event.event_type ?? "event"} • {event.status ?? "unknown"} • {formatDate(event.start_time)}
            </Text>
            {event.description ? <Text style={styles.rowDescription}>{event.description}</Text> : null}
          </View>
        ))}
        {events.length === 0 && !isLoading ? <Text style={styles.empty}>No events available.</Text> : null}

        <SectionTitle title="Tournaments" count={tournaments.length} />
        {tournaments.slice(0, 8).map((tournament) => (
          <View key={tournament.id} style={styles.rowCard}>
            <Text style={styles.rowTitle}>{tournament.name}</Text>
            <Text style={styles.rowMeta}>
              {tournament.format ?? "format TBD"} • {tournament.status ?? "status TBD"} •{" "}
              {tournament.max_participants ?? "?"} slots
            </Text>
            <Text style={styles.rowDescription}>
              {tournament.games?.name ?? "Game TBD"} • {formatDate(tournament.start_time)}
            </Text>
          </View>
        ))}
        {tournaments.length === 0 && !isLoading ? <Text style={styles.empty}>No tournaments available.</Text> : null}
      </ScrollView>
    </View>
  );
}

function SectionTitle({ title, count }: { title: string; count: number }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionCount}>{count}</Text>
    </View>
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
    marginBottom: 12
  },
  headerActions: {
    flexDirection: "row",
    gap: 8
  },
  backBtn: {
    backgroundColor: "#1E293B",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  backText: {
    color: "#F8FAFC",
    fontWeight: "700"
  },
  botBtn: {
    backgroundColor: "#0F766E",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  botText: {
    color: "#FFFFFF",
    fontWeight: "700"
  },
  refreshBtn: {
    backgroundColor: "#2563EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  refreshText: {
    color: "#FFFFFF",
    fontWeight: "700"
  },
  title: {
    color: "#F8FAFC",
    fontSize: 32,
    fontWeight: "800"
  },
  subtitle: {
    color: "#CBD5E1",
    marginTop: 6,
    marginBottom: 14
  },
  heroCard: {
    backgroundColor: "#111827",
    borderColor: "#334155",
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12
  },
  heroLabel: {
    color: "#38BDF8",
    fontSize: 12,
    textTransform: "uppercase",
    fontWeight: "700"
  },
  heroValue: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    marginTop: 8
  },
  heroHint: {
    color: "#94A3B8",
    marginTop: 6
  },
  sectionHeader: {
    marginTop: 8,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  sectionTitle: {
    color: "#F8FAFC",
    fontSize: 20,
    fontWeight: "800"
  },
  sectionCount: {
    color: "#93C5FD",
    fontWeight: "700"
  },
  rowCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8
  },
  rowTitle: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "800"
  },
  rowMeta: {
    color: "#475569",
    marginTop: 4,
    fontWeight: "600"
  },
  rowDescription: {
    color: "#64748B",
    marginTop: 6
  },
  empty: {
    color: "#94A3B8",
    marginBottom: 8
  },
  errorBox: {
    backgroundColor: "#FEE2E2",
    borderColor: "#FCA5A5",
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    marginBottom: 8
  },
  errorText: {
    color: "#991B1B",
    fontWeight: "700"
  }
});
