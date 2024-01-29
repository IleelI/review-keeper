import { AppUser } from "~/models/user";

import { isUser } from "./helpers";

describe("useUser helpers", () => {
  it("return true if user is valid", () => {
    const argument: AppUser = {
      email: "some@email.com",
      id: 1,
      username: "SomeUsername123",
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
    const argument = {
      id: 1,
      username: "Username",
    };

    const result = isUser(argument);

    expect(result).toBe(false);
  });
});
