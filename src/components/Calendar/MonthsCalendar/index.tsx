import moment, { type Moment } from 'moment-hijri';
import { useMemo, type FC, type ReactNode } from 'react';

import { extractTimeParts, getLocalizedMomentDate } from '../../../utils/dateHelpers.js';
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
    renderMonth?: (renderedValue: string, date: Date, options: { selected: boolean, disabled: boolean, today: boolean, focused: boolean, onClick: () => void }) => ReactNode;
    disabledDatesFn?: ((date: Date, view: `${CalendarViewsEnum}`) => boolean) | undefined;
    onSelect?: (date: Date) => void;
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
            !date.isBetween(minDate, maxDate, "month", "[]")
            || !!disabledDatesFn?.(date.toDate(), CalendarViewsEnum.Months)
            || !!momentDisabledMonths?.some(d => d.isSame(date, "month"))
            || !!momentDisabledYears?.some(d => d.isSame(date, "year"))
        );
    };

    const handleMonthClick = (date: Moment) => {
        if (isDateDisabled(date)) return;

        if (date.isBetween(minDate, maxDate, undefined, '[]')) {
            const extractedTimeParts = extractTimeParts(currentDate, false, locale);
            onSelect?.(date.add({ hours: extractedTimeParts?.hour || 0, minutes: extractedTimeParts?.minute || 0, seconds: extractedTimeParts?.second || 0 }).toDate());
        } else if (date.isBefore(minDate)) {
            onSelect?.(moment(minDate).toDate());
        } else {
            onSelect?.(moment(maxDate).toDate());
        }
    };

    const renderCell = (month: Moment) => {
        const isSelected = !!value && getLocalizedMomentDate(value, locale).isSame(month, "month");
        const isDisabled = isDateDisabled(month);
        const isThisMonth = getLocalizedMomentDate(undefined, locale).isSame(month, "month");
        const isFocused = month.isSame(focusedDate, "day");

        const renderedMonth = month.format(formats.ShortMonth);

        return (
            !!renderMonth ? renderMonth(renderedMonth, month.toDate(), { selected: isSelected, disabled: isDisabled, today: isThisMonth, focused: isFocused, onClick: () => handleMonthClick(month) }) : (
                <button
                    key={month.toString()}
                    type="button"
                    className={clsx({
                        "fkdp-calendar__cell": true,
                        "fkdp-calendar__cell--selected": isSelected,
                        "fkdp-calendar__cell--disabled": isDisabled,
                        "fkdp-calendar__cell--today": isThisMonth,
                        "fkdp-calendar__cell--focused": isFocused,
                    })}
                    onClick={() => handleMonthClick(month)}
                    disabled={isDisabled}
                    tabIndex={month.isSame(focusedDate, "day") ? 0 : -1}
                    aria-selected={!!isSelected}
                >
                    {renderedMonth}
                </button>
            )
        );
    };

    return (
        <div className="fkdp-calendar__grid fkdp-calendar__grid-months">
            {calendarMonths.map((month) => renderCell(month))}
        </div>
    )
}
