import { CURRENT_PAGE_DEFAULT } from "@/constants";

/**
 * Estimates a timestamp for a specific page based on available data
 * This is used for "jump to page" functionality with cursor-based pagination
 */
export const estimateTimestampForPage = (
  currentTimestamp: number,
  currentPage: number,
  targetPage: number,
  mostRecentTimestamp: number, // e.g., Date.now() in seconds
  oldestKnownTimestamp: number = 0, // Default to 0 if unknown
): number => {
  // If jumping to first page, use the most recent timestamp
  if (targetPage === 1) {
    return mostRecentTimestamp;
  }

  // Calculate an estimated time gap per page
  // This is simplified and assumes uniform distribution of attestations over time
  const knownPageGap =
    currentPage > 1
      ? (currentTimestamp - oldestKnownTimestamp) / (currentPage - 1)
      : currentTimestamp - oldestKnownTimestamp;

  // Estimate the timestamp for the target page
  const pagesDiff = targetPage - currentPage;
  return Math.max(0, currentTimestamp - pagesDiff * knownPageGap);
};

/**
 * Converts a traditional page number to timestamp cursor parameters
 * @param pageNumber The page number to convert
 * @param itemsPerPage Number of items per page
 * @param currentCursor Current timestamp cursor data
 * @returns Parameters for timestamp-based pagination
 */
export const pageToTimestampCursor = (
  pageNumber: number,
  itemsPerPage: number,
  currentCursor: {
    currentPage: number;
    currentTimestamp: number;
    oldestKnownTimestamp: number;
    newestKnownTimestamp: number;
  },
): {
  beforeTimestamp?: number;
  afterTimestamp?: number;
  itemsPerPage: number;
} => {
  const { currentPage, currentTimestamp, oldestKnownTimestamp, newestKnownTimestamp } = currentCursor;

  // Default parameters
  const params = { itemsPerPage };

  // First page - get most recent attestations
  if (pageNumber === CURRENT_PAGE_DEFAULT) {
    return params;
  }

  // Moving backward in pages
  if (pageNumber < currentPage) {
    return {
      ...params,
      afterTimestamp: estimateTimestampForPage(
        currentTimestamp,
        currentPage,
        pageNumber,
        newestKnownTimestamp,
        oldestKnownTimestamp,
      ),
    };
  }

  // Moving forward in pages
  if (pageNumber > currentPage) {
    return {
      ...params,
      beforeTimestamp: estimateTimestampForPage(
        currentTimestamp,
        currentPage,
        pageNumber,
        newestKnownTimestamp,
        oldestKnownTimestamp,
      ),
    };
  }

  // Same page
  return params;
};

/**
 * Stores the current pagination state for timestamp-based pagination
 * @param attestationsArray Array of attestations from current page
 * @param currentPage Current page number
 * @returns Cursor data for future pagination
 */
export const storePaginationCursors = (
  attestationsArray: Array<{ attestedDate: number }>,
  currentPage: number,
): {
  currentPage: number;
  currentTimestamp: number | null;
  oldestTimestamp: number | null;
  newestTimestamp: number | null;
} => {
  if (!attestationsArray.length) {
    return {
      currentPage,
      currentTimestamp: null,
      oldestTimestamp: null,
      newestTimestamp: null,
    };
  }

  // Sort by timestamp to find newest and oldest
  const sortedByDate = [...attestationsArray].sort((a, b) => b.attestedDate - a.attestedDate);

  const newestTimestamp = sortedByDate[0].attestedDate;
  const oldestTimestamp = sortedByDate[sortedByDate.length - 1].attestedDate;

  // Current timestamp is typically the oldest on the current page
  // This will be used as the reference point for pagination
  const currentTimestamp = oldestTimestamp;

  return {
    currentPage,
    currentTimestamp,
    oldestTimestamp,
    newestTimestamp,
  };
};
