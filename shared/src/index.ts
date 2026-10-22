import { z } from "zod";

export const CARD_VALUES = ["0", "1", "2", "3", "5", "8", "13", "21", "?", "☕"] as const;
export const CardValue = z.enum(CARD_VALUES);
export type CardValue = z.infer<typeof CardValue>;

export const Participant = z.object({
  id: z.string(),
  name: z.string(),
  connected: z.boolean(),
  hasVoted: z.boolean(),
  vote: CardValue.nullable(), // null until the round is revealed
});

export const Round = z.object({
  number: z.number(),
  votes: z.record(z.string(), CardValue), // participantId -> value
  revealedAt: z.number(),
});

export const RoomState = z.object({
  id: z.string(),
  phase: z.enum(["voting", "revealed"]),
  round: z.number(),
  participants: z.array(Participant),
  history: z.array(Round),
  version: z.number(), // bumps on every mutation
});
export type RoomState = z.infer<typeof RoomState>;

export const ClientMessage = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("join"),
    roomId: z.string().min(1).max(40),
    clientId: z.uuid(),
    name: z.string().trim().min(1).max(24),
  }),
  z.object({ type: z.literal("vote"), msgId: z.uuid(), value: CardValue }),
  z.object({ type: z.literal("reveal") }),
  z.object({ type: z.literal("reset") }),
  z.object({ type: z.literal("ping"), sentAt: z.number() }),
]);
export type ClientMessage = z.infer<typeof ClientMessage>;

export const RejectReason = z.enum(["round_revealed", "not_joined"]);
export type RejectReason = z.infer<typeof RejectReason>;

export const ServerMessage = z.discriminatedUnion("type", [
  z.object({ type: z.literal("state"), state: RoomState, serverTime: z.number() }),
  z.object({ type: z.literal("ack"), msgId: z.string() }),
  z.object({ type: z.literal("rejected"), msgId: z.string(), reason: RejectReason }),
  z.object({ type: z.literal("pong"), sentAt: z.number(), serverTime: z.number() }),
  z.object({ type: z.literal("error"), message: z.string() }),
]);
export type ServerMessage = z.infer<typeof ServerMessage>;

export function parse<T>(schema: z.ZodType<T>, raw: unknown): T | null {
  try {
    const json = typeof raw === "string" ? JSON.parse(raw) : raw;
    const result = schema.safeParse(json);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}
