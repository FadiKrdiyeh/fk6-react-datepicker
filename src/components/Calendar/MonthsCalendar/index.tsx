import { type Moment } from 'moment-hijri';
import { useMemo, type FC, type ReactNode } from 'react';

import { getLocalizedMomentDate } from '../../../utils/dateHelpers.js';
import { CalendarsEnum, CalendarViewsEnum, GregorianFormatsEnum, HijriFormatsEnum } from '../../../utils/enums.js';
import { clsx } from '../../../utils/stringHelpers.js';

interface AllMonthsCalendarProps {
    value?: Date | Moment | null;
    calendar?: `${CalendarsEnum}`;
    currentDate: Moment;
    minDate?: Date | Moment | undefined;
    maxDate?: Date | Moment | undefined;
    locale?: string | undefined;
    disabledMonths?: (Date | Moment)[] | undefined; // mark specific months disabled
    disabledYears?: (Date | Moment)[] | undefined; // mark specific years disabled
    focusedDate?: Moment;
    renderMonth?: (date: Date) => ReactNode;
    disabledDatesFn?: ((date: Date, view: `${CalendarViewsEnum}`) => boolean) | undefined;
    onSelect: (date: Date) => void;
}

export type MonthsCalendarProps = Omit<AllMonthsCalendarProps, "minDate" | "maxDate" | "value" | "calendar" | "focusedDate" | "locale">

export const MonthsCalendar: FC<AllMonthsCalendarProps> = ({
    value,
    calendar,
    currentDate,
    focusedDate,
    minDate,
    maxDate,
    locale,
    disabledMonths,
    disabledYears,
    disabledDatesFn,
    renderMonth,
    onSelect,
}) => {
    const isHijri = calendar === CalendarsEnum.Hijri;
    const formats = isHijri ? HijriFormatsEnum : GregorianFormatsEnum;

    const calendarMonths = useMemo(() => {
        const months: Moment[] = [];
        const yearStart = isHijri
            ? currentDate.clone().startOf("iYear")
            : currentDate.clone().startOf("year");

        for (let i = 0; i < 12; i++) {
            const month = isHijri
                ? yearStart.clone().add(i, "iMonth")
                : yearStart.clone().add(i, "month");

            months.push(month);
        }

        return months;
    }, [currentDate, calendar]);

    const momentDisabledMonths = useMemo(() => disabledMonths?.map(d => getLocalizedMomentDate(d, locale)), [disabledMonths]);
    const momentDisabledYears = useMemo(() => disabledYears?.map(d => getLocalizedMomentDate(d, locale)), [disabledYears]);

    const isDateDisabled = (date: Moment) => {
        return (
            !date.isBetween(minDate, maxDate, "day", "[]")
            || disabledDatesFn?.(date.toDate(), CalendarViewsEnum.Months)
            || momentDisabledMonths?.some(d => d.isSame(date, "month"))
            || momentDisabledYears?.some(d => d.isSame(date, "year"))
        );
    };

    const handleMonthClick = (date: Moment) => {
        if (isDateDisabled(date)) return;
        onSelect(date.toDate());
    };

    const renderCell = (month: Moment) => {
        const isSelected = value && getLocalizedMomentDate(value, locale).isSame(month, "month");
        const isDisabled = isDateDisabled(month);
        const isThisMonth = getLocalizedMomentDate(undefined, locale).isSame(month, "month");

        return (
            <button
                key={month.toString()}
                type="button"
                className={clsx({
                    "fkdp-calendar__cell": true,
                    "fkdp-calendar__cell--selected": isSelected,
                    "fkdp-calendar__cell--disabled": isDisabled,
                    "fkdp-calendar__cell--today": isThisMonth,
                    "fkdp-calendar__cell--focused": month.isSame(focusedDate, "day"),
                })}
                onClick={() => handleMonthClick(month)}
                disabled={isDisabled}
                tabIndex={month.isSame(focusedDate, "day") ? 0 : -1}
                aria-selected={!!isSelected}
            >
                {renderMonth ? renderMonth(month.toDate()) : month.format(formats.Month)}
            </button>
        );
    };

    return (
        <div className="fkdp-calendar__grid fkdp-calendar__grid-months">
            {calendarMonths.map((month) => renderCell(month))}
        </div>
    )
}
