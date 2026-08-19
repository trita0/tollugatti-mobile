import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View, type LayoutChangeEvent } from "react-native";

import { ADJACENT_MAP, CAPTURE_MOVES, normalizePosition } from "./aaduhuli-heuristics";

type MoveType = "placeGoat" | "moveGoat" | "moveTiger";

type BoardSelectionPatch = {
  position?: string;
  from?: string;
  to?: string;
};

type AaduhuliBoardProps = {
  moveType: MoveType;
  position: string;
  from: string;
  to: string;
  disabled?: boolean;
  onSelect: (patch: BoardSelectionPatch) => void;
};

type BoardPoint = {
  id: string;
  x: number;
  y: number;
  r: number;
};

type BoardLine = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

const VIEWBOX = 400;

// Coordinates copied from the web SVG so mobile and web board geometry match.
const BOARD_POINTS: BoardPoint[] = [
  { id: "a1", x: 196.61017, y: 52.47459, r: 8 },
  { id: "a2", x: 180.11017, y: 152.47459, r: 6 },
  { id: "b2", x: 214.11017, y: 152.47459, r: 6 },
  { id: "c2", x: 146.61017, y: 152.47459, r: 6 },
  { id: "d2", x: 246.61017, y: 152.47459, r: 6 },
  { id: "e2", x: 106.61017, y: 152.47459, r: 6 },
  { id: "f2", x: 286.61017, y: 152.47459, r: 6 },
  { id: "g2", x: 56.610168, y: 152.47459, r: 6 },
  { id: "h2", x: 336.61017, y: 152.47459, r: 6 },
  { id: "a3", x: 230.61017, y: 252.47459, r: 6 },
  { id: "b3", x: 96.610168, y: 252.47459, r: 6 },
  { id: "c3", x: 296.61017, y: 252.47459, r: 6 },
  { id: "d3", x: 163.61017, y: 252.47459, r: 6 },
  { id: "e3", x: 51.610168, y: 252.47459, r: 6 },
  { id: "f3", x: 341.61017, y: 252.47459, r: 6 },
  { id: "g3", x: 6.6101694, y: 252.47459, r: 6 },
  { id: "h3", x: 386.61017, y: 252.47459, r: 6 },
  { id: "a4", x: 361.61017, y: 202.47459, r: 6 },
  { id: "b4", x: 314.49347, y: 202.47459, r: 6 },
  { id: "c4", x: 271.61017, y: 202.47459, r: 6 },
  { id: "d4", x: 221.61017, y: 202.47459, r: 6 },
  { id: "e4", x: 171.61017, y: 202.47459, r: 6 },
  { id: "f4", x: 121.61017, y: 202.47459, r: 6 },
  { id: "g4", x: 79.4935, y: 202.47459, r: 6 },
  { id: "h4", x: 31.61017, y: 202.47459, r: 6 },
  { id: "a5", x: 47.110168, y: 350.91626, r: 8 },
  { id: "b5", x: 146.61017, y: 350.88712, r: 6 },
  { id: "d5", x: 248.13933, y: 350.88712, r: 6 },
  { id: "e5", x: 346.58099, y: 350.91626, r: 8 }
];

const BOARD_LINES: BoardLine[] = [
  { x1: 56.610169, y1: 152.47459, x2: 336.61017, y2: 152.47459 },
  { x1: 196.61017, y1: 52.474586, x2: 247.61017, y2: 352.4746 },
  { x1: 196.61017, y1: 52.474586, x2: 146.61017, y2: 352.4746 },
  { x1: 45.860166, y1: 349.55793, x2: 345.86017, y2: 349.55793 },
  { x1: 47.088079, y1: 352.2338, x2: 196.13226, y2: 52.711276 },
  { x1: 346.13226, y1: 352.2338, x2: 197.08808, y2: 52.711276 },
  { x1: 6.6101694, y1: 251.46459, x2: 386.61017, y2: 251.46459 },
  { x1: 106.61017, y1: 152.47459, x2: 51.610169, y2: 252.47459 },
  { x1: 286.61017, y1: 152.47459, x2: 341.61017, y2: 252.47459 },
  { x1: 31.610169, y1: 202.47459, x2: 361.61017, y2: 202.47459 },
  { x1: 58.562876, y1: 150.88459, x2: 6.6101694, y2: 252.47459 },
  { x1: 336.61017, y1: 152.47459, x2: 386.61017, y2: 252.47459 }
];

const formatLabel = (id: string) => id.toUpperCase();

const lineStyle = (line: BoardLine, scale: number) => {
  const x1 = line.x1 * scale;
  const y1 = line.y1 * scale;
  const x2 = line.x2 * scale;
  const y2 = line.y2 * scale;
  const length = Math.hypot(x2 - x1, y2 - y1);
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const centerX = (x1 + x2) / 2;
  const centerY = (y1 + y2) / 2;

  return {
    left: centerX - length / 2,
    top: centerY - 1,
    width: length,
    transform: [{ rotateZ: `${angle}rad` }]
  } as const;
};

export function AaduhuliBoard({ moveType, position, from, to, disabled, onSelect }: AaduhuliBoardProps) {
  const [boardSize, setBoardSize] = useState(320);
  const scale = boardSize / VIEWBOX;
  const normalizedPosition = normalizePosition(position);
  const normalizedFrom = normalizePosition(from);
  const normalizedTo = normalizePosition(to);

  const validTargets = useMemo(() => {
    if (moveType === "placeGoat" || !normalizedFrom) {
      return new Set<string>();
    }
    const adjacent = ADJACENT_MAP[normalizedFrom] ?? [];
    if (moveType === "moveGoat") {
      return new Set(adjacent);
    }
    const captures = Object.keys(CAPTURE_MOVES[normalizedFrom] ?? {});
    return new Set([...adjacent, ...captures]);
  }, [moveType, normalizedFrom]);

  const onLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    if (width > 0) {
      setBoardSize(width);
    }
  };

  const onNodePress = (node: string) => {
    if (disabled) {
      return;
    }

    if (moveType === "placeGoat") {
      onSelect({ position: node, from: "", to: "" });
      return;
    }

    if (!normalizedFrom || normalizedTo) {
      onSelect({ from: node, to: "", position: "" });
      return;
    }

    if (node === normalizedFrom) {
      onSelect({ from: "", to: "", position: "" });
      return;
    }

    if (!validTargets.has(node)) {
      onSelect({ from: node, to: "", position: "" });
      return;
    }

    onSelect({ to: node, position: "" });
  };

  return (
    <View style={styles.frame}>
      <View style={styles.board} onLayout={onLayout}>
        {BOARD_LINES.map((line, index) => (
          <View key={`line-${index}`} style={[styles.line, lineStyle(line, scale)]} />
        ))}

        {BOARD_POINTS.map((point) => {
          const pointRadius = point.r * scale;
          const dotSize = Math.max(pointRadius * 2, 12);
          const tapSize = Math.max(dotSize + 16, 28);
          const isPointSelected =
            normalizedPosition === point.id || normalizedFrom === point.id || normalizedTo === point.id;
          const isTarget = validTargets.has(point.id);
          const showTarget = moveType !== "placeGoat" && normalizedFrom && !normalizedTo && isTarget;

          return (
            <Pressable
              key={point.id}
              onPress={() => onNodePress(point.id)}
              style={[
                styles.hitArea,
                {
                  left: point.x * scale - tapSize / 2,
                  top: point.y * scale - tapSize / 2,
                  width: tapSize,
                  height: tapSize
                }
              ]}
            >
              <View
                style={[
                  styles.dot,
                  {
                    width: dotSize,
                    height: dotSize,
                    borderRadius: dotSize / 2
                  },
                  isPointSelected ? styles.dotSelected : null,
                  showTarget ? styles.dotTarget : null
                ]}
              />
              <Text style={styles.label}>{formatLabel(point.id)}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: "100%",
    borderRadius: 16,
    padding: 8,
    backgroundColor: "#F3F8FF",
    borderWidth: 1,
    borderColor: "#CFDDF7"
  },
  board: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#F9FBFF",
    borderRadius: 12,
    overflow: "hidden"
  },
  line: {
    position: "absolute",
    height: 2,
    backgroundColor: "#6A7C97",
    borderRadius: 2
  },
  hitArea: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center"
  },
  dot: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#3E4F67"
  },
  dotSelected: {
    backgroundColor: "#FFD166",
    borderColor: "#C2410C",
    borderWidth: 2
  },
  dotTarget: {
    backgroundColor: "#86EFAC",
    borderColor: "#166534"
  },
  label: {
    marginTop: 2,
    fontSize: 8,
    fontWeight: "700",
    color: "#334155"
  }
});
