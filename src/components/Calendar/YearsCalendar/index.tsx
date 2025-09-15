import moment, { type Moment } from 'moment-hijri';
import { useMemo, type FC, type ReactNode } from 'react';

import { getLocalizedMomentDate } from '../../../utils/dateHelpers.js';
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
    disabledDatesFn?: ((date: Date, view: `${CalendarViewsEnum}`) => boolean) | undefined; // mark specific dates disabled
    renderYear?: (date: Date) => ReactNode; // custom renderer for day cells
    onSelect?: (date: Date) => void;
}

export type YearsCalendarProps = Omit<AllYearsCalendarProps, "minDate" | "maxDate" | "value" | "calendar" | "focusedDate" | "locale">

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
    disabledDatesFn,
    renderYear,
    onSelect,
}) => {
    const isHijri = calendar === CalendarsEnum.Hijri;
    const formats = isHijri ? HijriFormatsEnum : GregorianFormatsEnum;

    // // Generate all days for the month grid (including leading/trailing padding)
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
            || disabledDatesFn?.(date.toDate(), CalendarViewsEnum.Years)
            || momentDisabledYears?.some(d => d.isSame(date, "year"))
        );
    };

    const handleYearClick = (date: Moment) => {
        if (isDateDisabled(date)) return;

        // [TODO] Need review...
        if (date.isBetween(minDate, maxDate, undefined, '[]'))
            onSelect?.(date.toDate());
        else if (date.isBefore(minDate))
            onSelect?.(moment(minDate).toDate());
        else
            onSelect?.(moment(maxDate).toDate());
    };

    const renderCell = (year: Moment) => {
        const isSelected = value && getLocalizedMomentDate(value, locale).isSame(year, "year");
        const isDisabled = isDateDisabled(year);
        const isToday = getLocalizedMomentDate(undefined, locale).isSame(year, "year");

        return (
            <button
                key={year.toString()}
                type="button"
                className={clsx({
                    "fkdp-calendar__cell": true,
                    "fkdp-calendar__cell--selected": isSelected,
                    "fkdp-calendar__cell--disabled": isDisabled,
                    "fkdp-calendar__cell--today": isToday,
                    "fkdp-calendar__cell--focused": year.isSame(focusedDate, "day"),
                })}
                onClick={() => handleYearClick(year)}
                disabled={isDisabled}
                tabIndex={year.isSame(focusedDate, "day") ? 0 : -1}
                aria-selected={!!isSelected}
            >
                {renderYear ? renderYear(year.toDate()) : year.format(formats.FullYear)}
            </button>
        );
    };

    return (
        <div className="fkdp-calendar__grid fkdp-calendar__grid-years">
            {calendarYears.map((day) => renderCell(day))}
        </div>
    )
}
