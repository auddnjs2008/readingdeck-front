import assert from "node:assert/strict";
import test from "node:test";

import { claimAuthRetry } from "./auth-retry.ts";

test("an API request can claim auth refresh only once", () => {
  const request = {};

  assert.equal(claimAuthRetry(request), true);
  assert.equal(claimAuthRetry(request), false);
});
