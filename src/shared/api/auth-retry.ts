export const API_TIMEOUT_MS = 10_000;

export const claimAuthRetry = (request: { _authRetry?: boolean }) => {
  if (request._authRetry) return false;
  request._authRetry = true;
  return true;
};
