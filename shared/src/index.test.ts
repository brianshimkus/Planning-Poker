import { describe, expect, it } from "vitest";
import { CARD_VALUES, ClientMessage, parse, Participant } from "./index";

const id = "11111111-1111-4111-8111-111111111111";

describe("parse", () => {
  it("trims a join name and keeps the uuid", () => {
    expect(
      parse(
        ClientMessage,
        JSON.stringify({ type: "join", roomId: "sprint", clientId: id, name: "  Ann  " }),
      ),
    ).toEqual({ type: "join", roomId: "sprint", clientId: id, name: "Ann" });
  });

  it("rejects a name that is empty after trimming", () => {
    expect(
      parse(ClientMessage, JSON.stringify({ type: "join", roomId: "sprint", clientId: id, name: "   " })),
    ).toBeNull();
  });

  it("rejects a name longer than 24 characters", () => {
    expect(
      parse(
        ClientMessage,
        JSON.stringify({ type: "join", roomId: "sprint", clientId: id, name: "a".repeat(25) }),
      ),
    ).toBeNull();
  });

  it("accepts every deck card, including coffee", () => {
    for (const value of CARD_VALUES) {
      expect(parse(ClientMessage, JSON.stringify({ type: "vote", msgId: id, value }))).toMatchObject({ value });
    }
  });

  it("rejects a card that is not in the deck", () => {
    expect(parse(ClientMessage, JSON.stringify({ type: "vote", msgId: id, value: "4" }))).toBeNull();
  });

  it("rejects an unknown message type", () => {
    expect(parse(ClientMessage, JSON.stringify({ type: "leave" }))).toBeNull();
  });

  it("returns null for malformed json", () => {
    expect(parse(ClientMessage, "{")).toBeNull();
  });

  it("drops fields the schema does not name", () => {
    expect(parse(ClientMessage, { type: "reveal", extra: true })).toEqual({ type: "reveal" });
  });

  it("allows a hidden vote and a revealed vote", () => {
    const hidden = { id, name: "Ann", connected: true, hasVoted: true, vote: null };
    const revealed = { ...hidden, vote: "5" };
    expect(parse(Participant, hidden)).toMatchObject({ vote: null });
    expect(parse(Participant, revealed)).toMatchObject({ vote: "5" });
  });
});
