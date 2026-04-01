import { describe, expect, it } from "vitest";
import { normalizeString } from "../features/books/utils/normalize-string";

describe("normalizeString", () => {
  it("should lowercase the string", () => {
    expect(normalizeString("HELLO")).toBe("hello");
  });

  it("should trim surrounding spaces", () => {
    expect(normalizeString("  hello world  ")).toBe("hello world");
  });

  it("should remove accents", () => {
    expect(normalizeString("Éléonore")).toBe("eleonore");
  });

  it("should keep inner spaces intact", () => {
    expect(normalizeString("Victor   Hugo")).toBe("victor   hugo");
  });

  it("should return an empty string when input is empty", () => {
    expect(normalizeString("")).toBe("");
  });
});