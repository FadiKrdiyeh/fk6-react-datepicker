import moment, { type Moment } from 'moment-hijri';
import { Fragment, useMemo, type FC, type ReactNode } from 'react';

import { getLocalizedMomentDate } from '../../../utils/dateHelpers.js';
import { CalendarsEnum, CalendarViewsEnum } from '../../../utils/enums.js';
import { clsx } from '../../../utils/stringHelpers.js';

interface AllDaysCalendarProps {
    value?: Date | Moment | null;
    currentDate: Moment;
    calendar?: `${CalendarsEnum}`;
    firstDayOfWeek?: number;
    focusedDate?: Moment;
    minDate?: Date | Moment | undefined;
    maxDate?: Date | Moment | undefined;
    locale?: string | undefined;
    disabledDates?: (Date | Moment)[] | undefined; // mark specific dates disabled
    hideOutsideDays?: boolean;
    showWeeksNumber?: boolean;
    highlightDates?: (Date | Moment)[];
    disabledMonths?: (Date | Moment)[]; // mark specific months disabled
    disabledYears?: (Date | Moment)[]; // mark specific years disabled
    weekends?: number[];
    disableWeekends?: boolean;
    renderDay?: (date: Date) => ReactNode; // custom renderer for day cells
    renderWeekNumber?: ((weekNumber: number | undefined) => ReactNode) | undefined; // custom renderer for day cells
    disabledDatesFn?: ((date: Date, view: `${CalendarViewsEnum}`) => boolean) | undefined; // mark specific dates disabled
    onSelect: (date: Date) => void;
}

export type DaysCalendarProps = Omit<AllDaysCalendarProps, "minDate" | "maxDate" | "value" | "calendar" | "focusedDate" | "locale" | "currentDate">

export const DaysCalendar: FC<AllDaysCalendarProps> = ({
    value,
    currentDate,
    calendar,
    firstDayOfWeek = 0,
    focusedDate,
    minDate,
    maxDate,
    locale,
    hideOutsideDays,
    showWeeksNumber,
    highlightDates,
    disabledDates,
    disabledMonths,
    disabledYears,
    weekends,
    disableWeekends,
    renderDay,
    renderWeekNumber,
    disabledDatesFn,
    onSelect,
}) => {
    const isHijri = calendar === CalendarsEnum.Hijri;
    const momentHighlightedDates = highlightDates?.map(d => moment(d));

    // Generate all days for the month grid (including leading/trailing padding)
    const calendarDays = useMemo(() => {
        const startOfMonth = isHijri ? currentDate.clone().startOf("iMonth") : currentDate.clone().startOf("month");
        const endOfMonth = isHijri ? currentDate.clone().endOf("iMonth") : currentDate.clone().endOf("month");

        // const startDay = startOfMonth.clone().startOf("week").add(firstDayOfWeek, "days");
        let startDay = startOfMonth.clone().startOf("week").subtract(7 - firstDayOfWeek, "days");
        while (isNaN(startDay.iDate()))
            startDay = startDay.add(1, "days");

        const endDay = endOfMonth.clone().endOf("week").add(firstDayOfWeek, "days");
        const days: Moment[] = [];
        let day = startDay.clone();

        while (day.isBefore(endDay, "day") || day.isSame(endDay, "day")) {
            if (!isNaN(day.iDate()))
                days.push(day.clone());

            day.add(1, "day");
        }
        return days;
    }, [currentDate, firstDayOfWeek, calendar]);

    const calendarWeeks = useMemo(() => {
        const weeks = [];

        for (let i = 0; i < calendarDays.length; i += 7) {
            const week = calendarDays.slice(i, i + 7);
            const weekNum = week[0]?.isoWeek();
            const isCurrentMonth = isHijri
                ? (week[0]?.iMonth() === currentDate.iMonth()) || (week[week.length - 1]?.iMonth() === currentDate.iMonth())
                : (week[0]?.month() === currentDate.month()) || (week[week.length - 1]?.month() === currentDate.month());

            if (isCurrentMonth)
                weeks.push({ weekNum, days: week });
        }

        return weeks;
    }, [calendarDays]);

    const weekDays = useMemo(() => {
        const allDays = moment.weekdaysMin(); // ["Sun", "Mon", ...]
        if (showWeeksNumber)
            return ['#', ...allDays.slice(firstDayOfWeek), ...allDays.slice(0, firstDayOfWeek)];
        return [...allDays.slice(firstDayOfWeek), ...allDays.slice(0, firstDayOfWeek)];
    }, [firstDayOfWeek]);

    const momentDisabledDates = useMemo(() => disabledDates?.map(d => getLocalizedMomentDate(d, locale)), [disabledDates]);
    const momentDisabledMonths = useMemo(() => disabledMonths?.map(d => getLocalizedMomentDate(d, locale)), [disabledMonths]);
    const momentDisabledYears = useMemo(() => disabledYears?.map(d => getLocalizedMomentDate(d, locale)), [disabledYears]);

    const isDateDisabled = (date: Moment) => {
        return (
            !date.isBetween(minDate, maxDate, "day", "[]")
            || (disableWeekends && weekends?.includes(date.day()))
            || disabledDatesFn?.(date.toDate(), CalendarViewsEnum.Days)
            || momentDisabledDates?.some(d => d.isSame(date, "day"))
            || momentDisabledMonths?.some(d => d.isSame(date, "month"))
            || momentDisabledYears?.some(d => d.isSame(date, "year"))
        );
    };

    const handleDayClick = (date: Moment) => {
        if (isDateDisabled(date)) return;
        onSelect(date.toDate());
    };

    const renderCell = (day: Moment) => {
        const isCurrentMonth = isHijri ? day.iMonth() === currentDate.iMonth() : day.month() === currentDate.month();

        if (hideOutsideDays && !isCurrentMonth)
            return <span key={day.toString()} className="fkdp-calendar__cell fkdp-calendar__cell--outside"></span>

        const isSelected = value && getLocalizedMomentDate(value, locale).isSame(day, "day");
        const isDisabled = isDateDisabled(day);
        const isToday = getLocalizedMomentDate(undefined, locale).isSame(day, "day");
        const isHighlighted = momentHighlightedDates?.some(d => d.isSame(day, "day"));
        const isHoliday = weekends?.includes(day.day());

        return (
            <button
                key={day.toString()}
                type="button"
                className={clsx({
                    "fkdp-calendar__cell": true,
                    "fkdp-calendar__cell--selected": isSelected,
                    "fkdp-calendar__cell--disabled": isDisabled,
                    "fkdp-calendar__cell--today": isToday,
                    "fkdp-calendar__cell--highlighted": isHighlighted,
                    "fkdp-calendar__cell--focused": day.isSame(focusedDate, "day"),
                    "fkdp-calendar__cell--holiday": isHoliday,
                    "fkdp-calendar__cell--outside": !isCurrentMonth,
                })}
                onClick={() => handleDayClick(day)}
                disabled={isDisabled}
                tabIndex={day.isSame(focusedDate, "day") ? 0 : -1}
                aria-selected={!!isSelected}
            >
                {renderDay ? renderDay(day.toDate()) : (isHijri ? day.iDate() : day.date())}
            </button>
        );
    };

    const renderWeekDay = (weekDay: string) => {
        return (
            <span
                key={weekDay}
                className="fkdp-calendar__cell fkdp-calendar__cell--weekday"
            >
                {weekDay}
            </span>
        );
    };

    return (
        <div>
            <div className={clsx({ "fkdp-calendar__grid": true, "fkdp-calendar__grid-weekdays": true, "fkdp-calendar__grid-with-weeknum": !!showWeeksNumber })}>
                {weekDays.map((day) => renderWeekDay(day))}
            </div>

            <div className={clsx({ "fkdp-calendar__grid": true, "fkdp-calendar__grid-days": true, "fkdp-calendar__grid-with-weeknum": !!showWeeksNumber })}>
                {calendarWeeks.map((week, i) => (
                    <Fragment key={i}>
                        {showWeeksNumber && (
                            <div className="fkdp-calendar__cell">
                                {!!renderWeekNumber ? renderWeekNumber(week.weekNum) : (
                                    <span className="fkdp-calendar__cell--weeknum">{week.weekNum}</span>
                                )}
                            </div>
                        )}
                        {week.days.map(day => renderCell(day))}
                    </Fragment>
                ))}
            </div>
        </div>
    )
}
