/**
 * Utility functions for Reactive Contracts
 */

/**
 * Parse latency string to milliseconds
 * @param latency - Latency string (e.g., "100ms", "1s", "5m")
 * @returns Latency in milliseconds or null if invalid
 */
export function parseLatencyToMs(latency: string): number | null {
  const match = latency.match(/^(\d+)(ms|s|m)$/);
  if (!match || !match[1] || !match[2]) {
    return null;
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 'ms':
      return value;
    case 's':
      return value * 1000;
    case 'm':
      return value * 60 * 1000;
    default:
      return null;
  }
}

/**
 * Parse duration string to milliseconds
 * Supports: ms, s, m, h, d
 * @param duration - Duration string (e.g., "5m", "1h", "2d")
 * @returns Duration in milliseconds or null if invalid
 */
export function parseDurationToMs(duration: string): number | null {
  const match = duration.match(/^(\d+)(ms|s|m|h|d)$/);
  if (!match || !match[1] || !match[2]) {
    return null;
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 'ms':
      return value;
    case 's':
      return value * 1000;
    case 'm':
      return value * 60 * 1000;
    case 'h':
      return value * 60 * 60 * 1000;
    case 'd':
      return value * 24 * 60 * 60 * 1000;
    default:
      return null;
  }
}
