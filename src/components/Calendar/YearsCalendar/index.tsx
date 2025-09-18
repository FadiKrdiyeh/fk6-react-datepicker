import moment, { type Moment } from 'moment-hijri';
import { useMemo, type FC, type ReactNode } from 'react';

import { extractTimeParts, getLocalizedMomentDate } from '../../../utils/dateHelpers.js';
import { CalendarsEnum, CalendarViewsEnum, GregorianFormatsEnum, HijriFormatsEnum } from '../../../utils/enums.js';
import { clsx } from '../../../utils/stringHelpers.js';

interface AllYearsCalendarProps {
    value?: Date | Moment | null;
    currentDate: Moment;
    calendar?: `${CalendarsEnum}`;
    minDate?: Date | Moment | undefined;
    maxDate?: Date | Moment | undefined;
    focusedDate?: Moment;
    range?: number | undefined;
    disabledYears?: (Date | Moment)[] | undefined; // mark specific dates disabled
    locale?: string | undefined;
    disableLocaleDigits?: boolean | undefined;
    disabledDatesFn?: ((date: Date, view: `${CalendarViewsEnum}`) => boolean) | undefined; // mark specific dates disabled
    renderYear?: (renderedValue: string, date: Date, options: { selected: boolean, disabled: boolean, today: boolean, focused: boolean, onClick: () => void }) => ReactNode; // custom renderer for day cells
    onSelect?: (date: Date) => void;
}

export type YearsCalendarProps = Omit<AllYearsCalendarProps, "minDate" | "maxDate" | "value" | "calendar" | "focusedDate" | "locale" | "disableLocaleDigits">

export const YearsCalendar: FC<AllYearsCalendarProps> = ({
    value,
    currentDate,
    calendar,
    minDate,
    maxDate,
    focusedDate,
    range = 16,
    disabledYears,
    locale,
    disableLocaleDigits,
    disabledDatesFn,
    renderYear,
    onSelect,
}) => {
    const isHijri = calendar === CalendarsEnum.Hijri;
    const formats = isHijri ? HijriFormatsEnum : GregorianFormatsEnum;

    const calendarYears = useMemo(() => {
        const years: Moment[] = [];
        const yearNumber = isHijri ? currentDate.iYear() : currentDate.year();

        const startYear = yearNumber - (yearNumber % range);

        for (let i = 0; i < range; i++) {
            const y = isHijri
                ? getLocalizedMomentDate(undefined, locale).iYear(startYear + i).startOf("iYear")
                : getLocalizedMomentDate(undefined, locale).year(startYear + i).startOf("year");

            years.push(y);
        }

        return years;
    }, [currentDate, calendar]);

    const momentDisabledYears = useMemo(() => disabledYears?.map(d => getLocalizedMomentDate(d, locale)), [disabledYears]);

    const isDateDisabled = (date: Moment) => {
        return (
            !date.isBetween(minDate, maxDate, "year", "[]")
            || !!disabledDatesFn?.(date.toDate(), CalendarViewsEnum.Years)
            || !!momentDisabledYears?.some(d => d.isSame(date, "year"))
        );
    };

    const handleYearClick = (date: Moment) => {
        if (isDateDisabled(date)) return;

        // [TODO] Need review...
        if (date.isBetween(minDate, maxDate, undefined, '[]')) {
            const extractedTimeParts = extractTimeParts(currentDate, false, locale);
            onSelect?.(date.add({ hours: extractedTimeParts?.hour || 0, minutes: extractedTimeParts?.minute || 0, seconds: extractedTimeParts?.second || 0 }).toDate());
        } else if (date.isBefore(minDate)) {
            onSelect?.(moment(minDate).toDate());
        } else {
            onSelect?.(moment(maxDate).toDate());
        }
    };

    const renderCell = (year: Moment) => {
        const isSelected = !!value && getLocalizedMomentDate(value, locale).isSame(year, "year");
        const isDisabled = isDateDisabled(year);
        const isToday = getLocalizedMomentDate(undefined, locale).isSame(year, "year");
        const isFocused = year.isSame(focusedDate, "day");

        const renderedYear = disableLocaleDigits ? (isHijri ? year.iYear().toString() : year.year().toString()) : year.format(formats.FullYear);

        return (
            !!renderYear ? renderYear(renderedYear, year.toDate(), { selected: isSelected, disabled: isDisabled, today: isToday, focused: isFocused, onClick: () => handleYearClick(year) }) : (
                <button
                    key={year.toString()}
                    type="button"
                    className={clsx({
                        "fkdp-calendar__cell": true,
                        "fkdp-calendar__cell--selected": isSelected,
                        "fkdp-calendar__cell--disabled": isDisabled,
                        "fkdp-calendar__cell--today": isToday,
                        "fkdp-calendar__cell--focused": isFocused,
                    })}
                    onClick={() => handleYearClick(year)}
                    disabled={isDisabled}
                    tabIndex={year.isSame(focusedDate, "day") ? 0 : -1}
                    aria-selected={!!isSelected}
                >
                    {renderedYear}
                </button>
            )
        );
    };

    return (
        <div className="fkdp-calendar__grid fkdp-calendar__grid-years">
            {calendarYears.map((day) => renderCell(day))}
        </div>
    )
}
