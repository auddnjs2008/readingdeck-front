# AI Chat Quota

## Approved Scope

Keep the daily limit at 10 and the UTC day boundary (09:00 Asia/Seoul).
Show server-authoritative remaining requests and reset time above the chat input.
Reserve capacity atomically before generation; refund handled failures against the
original day. A client disconnect does not prove generation failed. Process crashes
and database outages during refund are not covered by reservation recovery.
No billing, entry-point changes, or migrations in this task.

## Implementation

- [x] Backend: add regression tests for usage reads, capacity rejection, failed
  generation/refund, successful generation, and midnight boundaries.
- [x] Backend: implement conditional PostgreSQL upsert reservation, bounded refund,
  and authenticated GET /ai/chat/usage using the existing usage service/entity.
- [x] Frontend: fetch usage only for the authenticated, open AI tab; refresh after
  requests, on reopen/focus, and at reset time. Never invent a remaining count.
- [x] Frontend: render remaining/limit, Korean reset time, exhaustion, and fetch
  error/retry states; prevent sending at zero while leaving the draft editable.
- [x] Verify focused tests, TypeScript, lint, and desktop/mobile mocked browser
  behavior. Do not send real AI requests or mutate existing user records.

## Verification

- Backend Jest: 13 passing; frontend focused Node tests: 9 passing.
- Both TypeScript checks and changed-file lint passed. Backend uses
  `ESLINT_USE_FLAT_CONFIG=false` to select its own legacy ESLint config.
- Disposable PostgreSQL 16: the existing migration plus 20 concurrent requests
  yielded exactly 10 reservations and 10 HTTP 429 errors. Refund reopened capacity;
  concurrent refunds never made the count negative. Test database stopped afterward.
- Browser HTTP mocks: successful/failed replies, unchanged quota on new conversation,
  exhausted button/Enter blocking, usage lookup error, reopen refresh, retry recovery.
  Mobile 390x844 showed no dialog overflow. No real model calls were made.
- Changes were transferred to both repositories' dev working trees for review.
  Deploy the backend endpoint before the frontend.
- The database integration script is now `test/ai-chat-usage.integration.ts` to
  match the backend's TypeScript ESLint configuration; lint, type checking, and
  the disposable PostgreSQL integration check passed after conversion.
