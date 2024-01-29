import { DEFAULT_REDIRECT, getSafeRedirect } from "./routing";

describe("Routing Utils", () => {
  describe("getSafeRedirect", () => {
    it("returns default redirect when destination is invalid", () => {
      const result = getSafeRedirect(null);

      expect(result).toBe(DEFAULT_REDIRECT);
    });

    it("returns default redirect when destination starts with //", () => {
      const result = getSafeRedirect("//");

      expect(result).toBe(DEFAULT_REDIRECT);
    });

    it("return default redirect when destination doesn't start with /", () => {
      const result = getSafeRedirect("invalid-destination");

      expect(result).toBe(DEFAULT_REDIRECT);
    });

    it("returns redirect when destination is ok", () => {
      const result = getSafeRedirect("/valid-destination");

      expect(result).toBe("/valid-destination");
    });

    it("returns new default redirect when it's changed and destination is ok", () => {
      const result = getSafeRedirect(
        "invalid-destination",
        "/new-default-redirect",
      );

      expect(result).toBe("/new-default-redirect");
    });
  });
});
