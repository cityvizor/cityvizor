import {
  isPositiveInteger,
  parseAndLimitNumber,
  stringsAreEqualCaseInsensitive,
} from "../src/utils";

describe("utils", () => {
  describe("isPositiveInteger", () => {
    it("accepts whole positive numbers and zero", () => {
      expect(isPositiveInteger("0")).toBe(true);
      expect(isPositiveInteger("2026")).toBe(true);
    });

    it("rejects decimals, negative numbers, and non-numeric values", () => {
      expect(isPositiveInteger("12.5")).toBe(false);
      expect(isPositiveInteger("-1")).toBe(false);
      expect(isPositiveInteger("abc")).toBe(false);
    });

    it("rejects empty and missing input", () => {
      expect(isPositiveInteger("")).toBe(false);
      expect(isPositiveInteger()).toBe(false);
    });
  });

  describe("parseAndLimitNumber", () => {
    it("returns the parsed number when it is below the limit", () => {
      expect(parseAndLimitNumber("25", 100)).toBe(25);
    });

    it("caps valid numbers at the configured maximum", () => {
      expect(parseAndLimitNumber("250", 100)).toBe(100);
    });

    it("falls back to the maximum for invalid values", () => {
      expect(parseAndLimitNumber("abc", 100)).toBe(100);
      expect(parseAndLimitNumber(undefined, 100)).toBe(100);
    });
  });

  describe("stringsAreEqualCaseInsensitive", () => {
    it("compares strings regardless of letter casing", () => {
      expect(stringsAreEqualCaseInsensitive("CityVizor", "cityvizor")).toBe(
        true
      );
    });
  });
});
