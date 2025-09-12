import moment from "moment-hijri";

// export const MIN_SUPPORTED_DATE = "1937-01-01" as const;
export const MIN_SUPPORTED_DATE = "1937-03-14" as const;
export const MOMENT_MIN_SUPPORTED_DATE = moment(MIN_SUPPORTED_DATE);
// export const MAX_SUPPORTED_DATE = "2076-12-31" as const;
export const MAX_SUPPORTED_DATE = "2077-10-17" as const;
export const MOMENT_MAX_SUPPORTED_DATE = moment(MAX_SUPPORTED_DATE);
