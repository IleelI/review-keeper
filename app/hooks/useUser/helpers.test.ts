import { AppUser } from "~/.server/data/user";

import { isUser } from "./helpers";

describe("useUser helpers", () => {
  it("return true if user is valid", () => {
    const argument: AppUser = {
      email: "some@email.com",
      id: "user-id",
      username: "SomeUsername123",
      createdAt: new Date().toISOString(),
    };

    const result = isUser(argument);

    expect(result).toBe(true);
  });

  it("return false if user is null", () => {
    const argument = null;

    const result = isUser(argument);

    expect(result).toBe(false);
  });

  it("return false if user is missing email", () => {
    const argument: Omit<AppUser, "email"> = {
      id: "user-id",
      username: "Username",
      createdAt: new Date().toISOString(),
    };

    const result = isUser(argument);

    expect(result).toBe(false);
  });
});
