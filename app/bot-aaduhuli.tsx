import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import {
  type AaduhuliMoveType,
  type AaduhuliMatch,
  joinAaduhuliMatchAsGoat,
  leaveAaduhuliMatch,
  listBotReadyAaduhuliMatches,
  moveAaduhuli
} from "../src/features/games/aaduhuli-bot-client";
import { AaduhuliBoard } from "../src/features/games/aaduhuli-board";
import { normalizePosition, validateMoveInput } from "../src/features/games/aaduhuli-heuristics";
import { useAuth } from "../src/features/auth/auth-context";

type ActiveSession = {
  matchID: string;
  playerID: "0";
  credentials: string;
};

export default function BotAaduhuliScreen() {
  const { profile } = useAuth();
  const [playerName, setPlayerName] = useState(profile?.displayName ?? profile?.name ?? "");
  const [matches, setMatches] = useState<AaduhuliMatch[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [actionBusy, setActionBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<ActiveSession | null>(null);
  const [moveType, setMoveType] = useState<AaduhuliMoveType>("placeGoat");
  const [position, setPosition] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [lastResponse, setLastResponse] = useState<string>("");

  useEffect(() => {
    setPlayerName(profile?.displayName ?? profile?.name ?? "");
  }, [profile?.displayName, profile?.name]);

  const loadMatches = async () => {
    setLoadingMatches(true);
    setError(null);
    try {
      const botMatches = await listBotReadyAaduhuliMatches();
      setMatches(botMatches);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load bot matches.");
    } finally {
      setLoadingMatches(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, []);

  useEffect(() => {
    setPosition("");
    setFrom("");
    setTo("");
  }, [moveType]);

  const onJoin = async (matchID: string) => {
    if (!playerName.trim()) {
      setError("Enter a player name before joining.");
      return;
    }
    setActionBusy(true);
    setError(null);
    try {
      const joined = await joinAaduhuliMatchAsGoat({
        matchID,
        playerName: playerName.trim()
      });
      setActive({
        matchID,
        playerID: "0",
        credentials: joined.playerCredentials
      });
      setLastResponse("Joined successfully. Submit your first move.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to join match.");
    } finally {
      setActionBusy(false);
    }
  };

  const onMove = async () => {
    if (!active) {
      return;
    }

    const validationError = validateMoveInput(moveType, {
      position,
      from,
      to
    });
    if (validationError) {
      setError(validationError);
      return;
    }

    setActionBusy(true);
    setError(null);
    try {
      const movePayload =
        moveType === "placeGoat"
          ? { position: normalizePosition(position) }
          : { from: normalizePosition(from), to: normalizePosition(to) };

      const response = await moveAaduhuli({
        matchID: active.matchID,
        credentials: active.credentials,
        playerID: active.playerID,
        type: moveType,
        ...movePayload
      });
      setLastResponse(JSON.stringify(response, null, 2));
      await loadMatches();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to submit move.");
    } finally {
      setActionBusy(false);
    }
  };

  const onLeave = async () => {
    if (!active) {
      return;
    }
    setActionBusy(true);
    setError(null);
    try {
      await leaveAaduhuliMatch({
        matchID: active.matchID,
        credentials: active.credentials,
        playerID: active.playerID
      });
      setActive(null);
      setLastResponse("Left match.");
      await loadMatches();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to leave match.");
    } finally {
      setActionBusy(false);
    }
  };

  const maskedCreds = useMemo(() => {
    if (!active?.credentials) {
      return "-";
    }
    return `${active.credentials.slice(0, 6)}...${active.credentials.slice(-4)}`;
  }, [active?.credentials]);

  const selectionHint = useMemo(() => {
    if (moveType === "placeGoat") {
      return "Tap one node to place a goat.";
    }
    if (!from) {
      return "Tap the source node.";
    }
    if (!to) {
      return "Tap the destination node.";
    }
    return "Move selected. Submit when ready.";
  }, [from, moveType, to]);

  const onBoardSelect = (patch: { position?: string; from?: string; to?: string }) => {
    setError(null);
    if (patch.position !== undefined) {
      setPosition(patch.position);
    }
    if (patch.from !== undefined) {
      setFrom(patch.from);
    }
    if (patch.to !== undefined) {
      setTo(patch.to);
    }
  };

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backText}>{"< Back"}</Text>
          </Pressable>
          <Pressable style={styles.refreshBtn} onPress={loadMatches} disabled={loadingMatches || actionBusy}>
            <Text style={styles.refreshText}>{loadingMatches ? "Loading..." : "Reload Bots"}</Text>
          </Pressable>
        </View>

        <Text style={styles.title}>Aaduhuli vs Bot</Text>
        <Text style={styles.subtitle}>
          Finds bot-ready matches, joins you as Goat (Player 0), and lets you send moves.
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>Your player name</Text>
          <TextInput
            value={playerName}
            onChangeText={setPlayerName}
            placeholder="Enter your name"
            style={styles.input}
          />
          <Text style={styles.meta}>Bot matches found: {matches.length}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.section}>Available Bot Matches</Text>
          {matches.length === 0 ? <Text style={styles.meta}>No bot-ready matches right now.</Text> : null}
          {matches.map((m) => (
            <View key={m.matchID} style={styles.matchRow}>
              <View style={styles.matchInfo}>
                <Text style={styles.matchId}>{m.matchID}</Text>
                <Text style={styles.meta}>Tiger: {m.players.find((p) => p.id === 1)?.name ?? "Bot"}</Text>
              </View>
              <Pressable style={styles.joinBtn} onPress={() => onJoin(m.matchID)} disabled={actionBusy}>
                <Text style={styles.joinText}>Join</Text>
              </Pressable>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.section}>Current Session</Text>
          <Text style={styles.meta}>Match: {active?.matchID ?? "-"}</Text>
          <Text style={styles.meta}>Player: {active?.playerID ?? "-"}</Text>
          <Text style={styles.meta}>Credentials: {maskedCreds}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.section}>Move</Text>
          <View style={styles.typeRow}>
            {(["placeGoat", "moveGoat", "moveTiger"] as AaduhuliMoveType[]).map((type) => (
              <Pressable
                key={type}
                style={[styles.typeBtn, moveType === type ? styles.typeBtnActive : null]}
                onPress={() => setMoveType(type)}
              >
                <Text style={[styles.typeText, moveType === type ? styles.typeTextActive : null]}>{type}</Text>
              </Pressable>
            ))}
          </View>

          <AaduhuliBoard
            moveType={moveType}
            position={position}
            from={from}
            to={to}
            disabled={!active || actionBusy}
            onSelect={onBoardSelect}
          />

          <Text style={styles.moveHint}>{selectionHint}</Text>
          <View style={styles.selectionRow}>
            <View style={styles.selectionPill}>
              <Text style={styles.selectionLabel}>position</Text>
              <Text style={styles.selectionValue}>{position ? normalizePosition(position) : "-"}</Text>
            </View>
            <View style={styles.selectionPill}>
              <Text style={styles.selectionLabel}>from</Text>
              <Text style={styles.selectionValue}>{from ? normalizePosition(from) : "-"}</Text>
            </View>
            <View style={styles.selectionPill}>
              <Text style={styles.selectionLabel}>to</Text>
              <Text style={styles.selectionValue}>{to ? normalizePosition(to) : "-"}</Text>
            </View>
          </View>

          <Pressable
            style={styles.clearBtn}
            onPress={() => {
              setPosition("");
              setFrom("");
              setTo("");
              setError(null);
            }}
            disabled={actionBusy}
          >
            <Text style={styles.clearText}>Clear Selection</Text>
          </Pressable>

          <View style={styles.actionRow}>
            <Pressable
              style={[styles.actionBtn, styles.primaryBtn]}
              onPress={onMove}
              disabled={!active || actionBusy}
            >
              <Text style={styles.actionText}>{actionBusy ? "Working..." : "Submit Move"}</Text>
            </Pressable>
            <Pressable
              style={[styles.actionBtn, styles.secondaryBtn]}
              onPress={onLeave}
              disabled={!active || actionBusy}
            >
              <Text style={styles.actionText}>Leave Match</Text>
            </Pressable>
          </View>
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {lastResponse ? (
          <View style={styles.card}>
            <Text style={styles.section}>Last Response</Text>
            <Text style={styles.responseText}>{lastResponse}</Text>
          </View>
        ) : null}
      </ScrollView>
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
    paddingBottom: 28,
    gap: 10
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between"
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
    fontSize: 30,
    color: "#F8FAFC",
    fontWeight: "800"
  },
  subtitle: {
    color: "#CBD5E1",
    marginBottom: 4
  },
  card: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 12
  },
  section: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 6
  },
  label: {
    color: "#374151",
    fontWeight: "700",
    marginTop: 4,
    marginBottom: 4
  },
  input: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF"
  },
  meta: {
    color: "#475569",
    marginTop: 6
  },
  matchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingTop: 8,
    marginTop: 8
  },
  matchInfo: {
    flex: 1,
    paddingRight: 10
  },
  matchId: {
    color: "#111827",
    fontWeight: "700"
  },
  joinBtn: {
    backgroundColor: "#0F766E",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  joinText: {
    color: "#FFFFFF",
    fontWeight: "700"
  },
  typeRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
    flexWrap: "wrap"
  },
  typeBtn: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#FFFFFF"
  },
  typeBtnActive: {
    backgroundColor: "#111827",
    borderColor: "#111827"
  },
  typeText: {
    color: "#111827",
    fontWeight: "700"
  },
  typeTextActive: {
    color: "#FFFFFF"
  },
  moveHint: {
    marginTop: 8,
    color: "#334155",
    fontWeight: "600"
  },
  selectionRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8
  },
  selectionPill: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#DBEAFE",
    backgroundColor: "#EFF6FF",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 8
  },
  selectionLabel: {
    color: "#475569",
    fontSize: 11,
    textTransform: "uppercase",
    fontWeight: "700"
  },
  selectionValue: {
    color: "#0F172A",
    fontWeight: "800",
    marginTop: 2
  },
  clearBtn: {
    marginTop: 8,
    alignSelf: "flex-start",
    borderRadius: 8,
    backgroundColor: "#E2E8F0",
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  clearText: {
    color: "#1E293B",
    fontWeight: "700"
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10
  },
  actionBtn: {
    flex: 1,
    borderRadius: 10,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center"
  },
  primaryBtn: {
    backgroundColor: "#2563EB"
  },
  secondaryBtn: {
    backgroundColor: "#374151"
  },
  actionText: {
    color: "#FFFFFF",
    fontWeight: "700"
  },
  errorBox: {
    backgroundColor: "#FEE2E2",
    borderColor: "#FCA5A5",
    borderWidth: 1,
    borderRadius: 12,
    padding: 10
  },
  errorText: {
    color: "#991B1B",
    fontWeight: "700"
  },
  responseText: {
    color: "#0F172A",
    fontFamily: "Courier",
    fontSize: 12
  }
});
