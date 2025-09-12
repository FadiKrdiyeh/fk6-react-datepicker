// export const DATE_FORMAT = 'YYYY/MM/DD';
// export const DATE_FORMAT = 'iYYYY/iMM/iDD';
// // export const CURRENT_DATE_FORMAT = 'MMMM YYYY';
// export const CURRENT_DATE_FORMAT = 'iMMMM iYYYY';
// export const CURRENT_DATE_HIJRI_FORMAT = 'iMMMM iYYYY';
// export const HIJRI_DATE_FORMAT = 'iYYYY/iMM/iDD';

import moment, { isMoment, type Moment } from "moment-hijri";
import { MOMENT_MAX_SUPPORTED_DATE, MOMENT_MIN_SUPPORTED_DATE } from "./constants.js";

const LANG = document.documentElement.lang ?? "en";

export const isSupportedDate = (date: Date | Moment) => {
    return moment(date).isBetween(MOMENT_MIN_SUPPORTED_DATE, MOMENT_MAX_SUPPORTED_DATE, undefined, "[]");
}

export const fixSupportedDate = (date?: Date | Moment | null): Date | undefined => {
    if (!date) return undefined;

    const momentDate = moment(date);
    if (momentDate.isBetween(MOMENT_MIN_SUPPORTED_DATE, MOMENT_MAX_SUPPORTED_DATE, undefined, "[]"))
        return isMoment(date) ? date.toDate() : date;
    else {
        if ((momentDate.year() - MOMENT_MAX_SUPPORTED_DATE.year()) >= 0)
            return MOMENT_MAX_SUPPORTED_DATE.toDate();
        else
            return MOMENT_MIN_SUPPORTED_DATE.toDate();
    }
}

export const fixSupportedMoment = (momentDate?: Moment | null, locale?: string): Moment | undefined => {
    if (!momentDate) return undefined;

    if (momentDate.isBetween(MOMENT_MIN_SUPPORTED_DATE, MOMENT_MAX_SUPPORTED_DATE, undefined, "[]"))
        return momentDate;
    else {
        if ((momentDate.year() - MOMENT_MAX_SUPPORTED_DATE.year()) >= 0)
            return MOMENT_MAX_SUPPORTED_DATE.locale(locale || "en");
        else
            return MOMENT_MIN_SUPPORTED_DATE.locale(locale || "en");
    }
}

export const getLocalizedMomentDate = (date?: Date | Moment | null, locale?: string) => {
    return moment(date).locale(locale ?? LANG);
}
