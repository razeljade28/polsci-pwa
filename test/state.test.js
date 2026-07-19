import { describe, it, expect } from "vitest";
import { State } from "../state.js";

describe("State store", () => {
  it("sets and gets values", () => {
    State.clear();
    State.set("foo", 42);
    expect(State.get("foo")).toBe(42);
  });

  it("notifies subscribers", () => {
    State.clear();
    const calls = [];
    const unsub = State.subscribe("bar", (v) => calls.push(v));
    State.set("bar", "a");
    State.set("bar", "b");
    expect(calls).toEqual(["a", "b"]);
    unsub();
    State.set("bar", "c");
    expect(calls).toEqual(["a", "b"]);
  });
});
