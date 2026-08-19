export type AaduhuliPosition = string;

export const BOARD_POSITIONS: AaduhuliPosition[] = [
  "a1",
  "a2",
  "a3",
  "a4",
  "a5",
  "b2",
  "b3",
  "b4",
  "b5",
  "c2",
  "c3",
  "c4",
  "d2",
  "d3",
  "d4",
  "d5",
  "e2",
  "e3",
  "e4",
  "e5",
  "f2",
  "f3",
  "f4",
  "g2",
  "g3",
  "g4",
  "h2",
  "h3",
  "h4"
];

export const ADJACENT_MAP: Record<AaduhuliPosition, AaduhuliPosition[]> = {
  a1: ["a2", "b2", "c2", "d2"],
  a2: ["a1", "c2", "b2", "e4"],
  b2: ["a1", "a2", "d2", "d4"],
  c2: ["a1", "a2", "e2", "f4"],
  d2: ["b2", "f2", "a1", "c4"],
  e2: ["g2", "c2", "g4"],
  f2: ["d2", "h2", "b4"],
  g2: ["e2", "h4"],
  h2: ["a4", "f2"],
  a4: ["h2", "h3", "b4"],
  b4: ["a4", "f2", "f3", "c4"],
  c4: ["b4", "d4", "d2", "c3"],
  d4: ["c4", "e4", "b2", "a3"],
  e4: ["d4", "f4", "a2", "d3"],
  f4: ["e4", "g4", "c2", "b3"],
  g4: ["f4", "h4", "e2", "e3"],
  h4: ["g4", "g2", "g3"],
  a3: ["d4", "d5", "d3", "c3"],
  b3: ["e3", "d3", "f4", "a5"],
  c3: ["a3", "f3", "c4", "e5"],
  d3: ["b3", "a3", "e4", "b5"],
  e3: ["g3", "b3", "g4"],
  f3: ["c3", "h3", "b4"],
  g3: ["e3", "h4"],
  h3: ["f3", "a4"],
  a5: ["b3", "b5"],
  b5: ["a5", "d5", "d3"],
  d5: ["b5", "e5", "a3"],
  e5: ["d5", "c3"]
};

type CaptureMove = {
  through: AaduhuliPosition;
  to: AaduhuliPosition;
};

const CAPTURE_MAP: Record<AaduhuliPosition, CaptureMove[]> = {
  a1: [
    { through: "a2", to: "a4" },
    { through: "b2", to: "c2" }
  ],
  a2: [
    { through: "c2", to: "e2" },
    { through: "b2", to: "d2" },
    { through: "e4", to: "a3" }
  ],
  b2: [
    { through: "d2", to: "f2" },
    { through: "d4", to: "b3" }
  ],
  c2: [
    { through: "e2", to: "g2" },
    { through: "f4", to: "c3" }
  ],
  d2: [
    { through: "f2", to: "h2" },
    { through: "c4", to: "d3" }
  ],
  e2: [
    { through: "g2", to: "h4" },
    { through: "g4", to: "e3" }
  ],
  f2: [
    { through: "b4", to: "f3" },
    { through: "h2", to: "a4" }
  ],
  g2: [
    { through: "e2", to: "c2" },
    { through: "g4", to: "g3" }
  ],
  h2: [
    { through: "f2", to: "d2" },
    { through: "a4", to: "h3" }
  ],
  g4: [
    { through: "e4", to: "c4" },
    { through: "g3", to: "g2" }
  ],
  f4: [
    { through: "e4", to: "d4" },
    { through: "c2", to: "f3" }
  ],
  e4: [
    { through: "f4", to: "g4" },
    { through: "d4", to: "c4" },
    { through: "d3", to: "b5" },
    { through: "a2", to: "a1" }
  ],
  d4: [
    { through: "e4", to: "f4" },
    { through: "b2", to: "a1" },
    { through: "d3", to: "b5" },
    { through: "a3", to: "d5" }
  ],
  c4: [
    { through: "d4", to: "e4" },
    { through: "b4", to: "a4" },
    { through: "d2", to: "a1" },
    { through: "c3", to: "e5" }
  ],
  b4: [{ through: "c4", to: "d4" }],
  a4: [{ through: "b4", to: "c4" }],
  g3: [
    { through: "e3", to: "b3" },
    { through: "h4", to: "g2" }
  ],
  e3: [
    { through: "b3", to: "d3" },
    { through: "g4", to: "e2" }
  ],
  b3: [
    { through: "e3", to: "g3" },
    { through: "d3", to: "a3" },
    { through: "f4", to: "c2" }
  ],
  d3: [
    { through: "b3", to: "e3" },
    { through: "a3", to: "c3" },
    { through: "e4", to: "a2" }
  ],
  a3: [
    { through: "d3", to: "b3" },
    { through: "c3", to: "f3" },
    { through: "d4", to: "b2" }
  ],
  c3: [
    { through: "a3", to: "d3" },
    { through: "f3", to: "h3" },
    { through: "c4", to: "d2" }
  ],
  f3: [
    { through: "b4", to: "f2" },
    { through: "c3", to: "a3" }
  ],
  h3: [
    { through: "f3", to: "c3" },
    { through: "a4", to: "h2" }
  ],
  a5: [
    { through: "b3", to: "f4" },
    { through: "b5", to: "d5" }
  ],
  b5: [
    { through: "d5", to: "e5" },
    { through: "d3", to: "e4" }
  ],
  d5: [
    { through: "a3", to: "d4" },
    { through: "b5", to: "a5" }
  ],
  e5: [
    { through: "d5", to: "b5" },
    { through: "c3", to: "c4" }
  ]
};

export const CAPTURE_MOVES: Record<AaduhuliPosition, Record<AaduhuliPosition, AaduhuliPosition>> =
  Object.entries(CAPTURE_MAP).reduce((acc, [from, moves]) => {
    acc[from as AaduhuliPosition] = moves.reduce(
      (moveAcc, move) => {
        moveAcc[move.to] = move.through;
        return moveAcc;
      },
      {} as Record<AaduhuliPosition, AaduhuliPosition>
    );
    return acc;
  }, {} as Record<AaduhuliPosition, Record<AaduhuliPosition, AaduhuliPosition>>);

export const normalizePosition = (value?: string) => (value ?? "").trim().toLowerCase();

export const isValidPosition = (value?: string) => BOARD_POSITIONS.includes(normalizePosition(value));

export const isAdjacentMove = (from?: string, to?: string) => {
  const fromPos = normalizePosition(from);
  const toPos = normalizePosition(to);
  return ADJACENT_MAP[fromPos]?.includes(toPos) ?? false;
};

export const isTigerCaptureMove = (from?: string, to?: string) => {
  const fromPos = normalizePosition(from);
  const toPos = normalizePosition(to);
  return Boolean(CAPTURE_MOVES[fromPos]?.[toPos]);
};

export const validateMoveInput = (
  type: "placeGoat" | "moveGoat" | "moveTiger",
  input: { position?: string; from?: string; to?: string }
) => {
  if (type === "placeGoat") {
    if (!isValidPosition(input.position)) {
      return "Invalid position. Use board coordinates like c3, d4, h2.";
    }
    return null;
  }

  if (!isValidPosition(input.from) || !isValidPosition(input.to)) {
    return "Invalid from/to coordinates for board move.";
  }

  if (type === "moveGoat" && !isAdjacentMove(input.from, input.to)) {
    return "Invalid goat move. Goats can only move to adjacent positions.";
  }

  if (type === "moveTiger" && !isAdjacentMove(input.from, input.to) && !isTigerCaptureMove(input.from, input.to)) {
    return "Invalid tiger move. Tigers move adjacent or capture by jump.";
  }

  return null;
};

