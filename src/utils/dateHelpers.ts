import moment, { isMoment, type Moment } from "moment-hijri";
import { MOMENT_MAX_SUPPORTED_DATE, MOMENT_MIN_SUPPORTED_DATE } from "./constants.js";
import type { TimeParts } from "../types/time-parts.js";

const LANG = document.documentElement.lang ?? "en";

export const isSupportedDate = (date: Date | Moment) => {
    return moment(date).isBetween(MOMENT_MIN_SUPPORTED_DATE, MOMENT_MAX_SUPPORTED_DATE, undefined, "[]");
}

export const fixSupportedDate = (date?: Date | Moment | null, locale?: string): Date | undefined => {
    if (!date) return undefined;

    const momentDate = isMoment(date) ? date.locale(locale ?? LANG) : moment(date).locale(locale ?? LANG);
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
            return MOMENT_MAX_SUPPORTED_DATE.locale(locale ?? LANG);
        else
            return MOMENT_MIN_SUPPORTED_DATE.locale(locale ?? LANG);
    }
}

export const getLocalizedMomentDate = (date?: Date | Moment | null, locale?: string) => {
    return moment(date).locale(locale ?? LANG);
}

export const buildDateTime = (
    currentDate: Moment | Date,
    time: TimeParts,
    is12h: boolean = true,
    locale?: string,
): Moment => {
    let hour = time.hour;
    const momentDate = isMoment(currentDate) ? currentDate : moment(currentDate).locale(locale ?? LANG);

    // Handle 12h conversion
    if (is12h && time.meridiem && (!!hour || hour === 0)) {
        if (time.meridiem === moment.localeData(locale).meridiem(12, 0, false) && hour < 12) {
            hour += 12;
        }
        if (time.meridiem === moment.localeData(locale).meridiem(0, 0, false) && hour === 12) {
            hour = 0;
        }
    }

    return momentDate
        .clone()
        .hour(hour || 0)
        .minute(time.minute || 0)
        .second(time.second || 0)
        .millisecond(0);
}

export const extractTimeParts = (date: Moment | Date | null | undefined, is12h: boolean = true, locale?: string): TimeParts | undefined => {
    if (!date)
        return undefined;

    const momentDate = moment(date).locale(locale ?? LANG);
    let hour = momentDate.hour();
    let meridiem: string | undefined;

    if (is12h) {
        meridiem = hour >= 12 ? moment.localeData(locale).meridiem(12, 0, false) : moment.localeData(locale).meridiem(0, 0, false);
        hour = hour % 12;
        if (hour === 0) hour = 12; // show 12 instead of 0
    }

    return {
        hour,
        minute: momentDate.minute(),
        second: momentDate.second(),
        meridiem,
    };
}

export const weekOfHijriYear = (date: Moment) => {
    const startOfYear = date.clone().startOf("iYear");
    const diffDays = date.diff(startOfYear, "days");
    return Math.floor(diffDays / 7) + 1;
};
