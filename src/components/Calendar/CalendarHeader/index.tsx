import { type Moment } from 'moment-hijri';
import { useMemo, type FC, type ReactNode } from 'react';

import { MOMENT_MAX_SUPPORTED_DATE, MOMENT_MIN_SUPPORTED_DATE } from '../../../utils/constants.js';
import { CalendarsEnum, CalendarViewsEnum, GregorianFormatsEnum, HijriFormatsEnum } from '../../../utils/enums.js';
import { clsx } from '../../../utils/stringHelpers.js';

export interface CalendarHeaderProps {
    currentDate: Moment;
    view: `${CalendarViewsEnum}`;
    calendar?: `${CalendarsEnum}`;
    yearsRange?: number | undefined;
    calendarEl?: HTMLElement | null | undefined;
    views?: `${CalendarViewsEnum}`[] | undefined;
    disableLocaleDigits?: boolean | undefined;
    renderPrevButton?: (options: { disabled: boolean, onClick: () => void }) => ReactNode;
    renderNextButton?: (options: { disabled: boolean, onClick: () => void }) => ReactNode;
    renderSelectedMonth?: (renderedValue: string, date: Date, options: { opened: boolean, onClick: () => void }) => ReactNode;
    renderSelectedYear?: (renderedValue: string, date: Date, options: { opened: boolean, onClick: () => void }) => ReactNode;
    onChangeView?: (view: `${CalendarViewsEnum}`) => void;
    onCurrentDateChange: (currentDate: Moment) => void;
}

export const CalendarHeader: FC<CalendarHeaderProps> = ({
    view,
    calendar,
    currentDate,
    yearsRange = 12,
    calendarEl,
    views,
    disableLocaleDigits,
    renderPrevButton,
    renderNextButton,
    renderSelectedMonth,
    renderSelectedYear,
    onChangeView,
    onCurrentDateChange,
}) => {
    const isHijri = calendar === CalendarsEnum.Hijri;
    const formats = isHijri ? HijriFormatsEnum : GregorianFormatsEnum;
    const granularity = (view === CalendarViewsEnum.Years || view === CalendarViewsEnum.Months) ? CalendarViewsEnum.Years : CalendarViewsEnum.Months;

    const isDaysEnabled = useMemo(() => views === undefined || views.includes(CalendarViewsEnum.Days), [views]);
    const isMonthsEnabled = useMemo(() => views === undefined || views.includes(CalendarViewsEnum.Months), [views]);
    const isYearsEnabled = useMemo(() => views === undefined || views.includes(CalendarViewsEnum.Years), [views]);

    const isPrevButtonEnabled = useMemo(() => (
        currentDate.isAfter(MOMENT_MIN_SUPPORTED_DATE, granularity)
        && (view === CalendarViewsEnum.Years || (view === CalendarViewsEnum.Months && isYearsEnabled) || (view === CalendarViewsEnum.Days && isMonthsEnabled))
    ), [currentDate, view, isMonthsEnabled, isYearsEnabled]);

    const isNextButtonEnabled = useMemo(() => (
        currentDate.isBefore(MOMENT_MAX_SUPPORTED_DATE, granularity)
        && (view === CalendarViewsEnum.Years || (view === CalendarViewsEnum.Months && isYearsEnabled) || (view === CalendarViewsEnum.Days && isMonthsEnabled))
    ), [currentDate, view, isMonthsEnabled, isYearsEnabled]);

    const isRTL = useMemo(() => calendarEl?.dir === 'rtl', [calendarEl]);

    const handleMonthClick = () => {
        if (!isMonthsEnabled) return;

        if (view === CalendarViewsEnum.Months && isDaysEnabled)
            onChangeView?.(CalendarViewsEnum.Days);
        else if ((view === CalendarViewsEnum.Days && isMonthsEnabled) || (view === CalendarViewsEnum.Years && isMonthsEnabled))
            onChangeView?.(CalendarViewsEnum.Months);
        else if (view === CalendarViewsEnum.Months && isYearsEnabled)
            onChangeView?.(CalendarViewsEnum.Years);
    }

    const handleYearClick = () => {
        if (!isYearsEnabled) return;

        if (view === CalendarViewsEnum.Years && isDaysEnabled)
            onChangeView?.(CalendarViewsEnum.Days);
        else if ((view === CalendarViewsEnum.Days && isYearsEnabled) || (view === CalendarViewsEnum.Months && isYearsEnabled))
            onChangeView?.(CalendarViewsEnum.Years);
        else if (view === CalendarViewsEnum.Days && isYearsEnabled)
            onChangeView?.(CalendarViewsEnum.Years);
    }

    const handlePrevPage = () => {
        switch (view) {
            case CalendarViewsEnum.Days:
                isMonthsEnabled && onCurrentDateChange(currentDate.clone().subtract(1, "month"));
                break;

            case CalendarViewsEnum.Months:
                isYearsEnabled && onCurrentDateChange(currentDate.clone().subtract(1, "year"));
                break;

            case CalendarViewsEnum.Years:
                if (isPrevButtonEnabled)
                    onCurrentDateChange(currentDate.clone().subtract(yearsRange, "year"));
                break;

            default:
                break;
        }
    }
    const handleNextPage = () => {
        switch (view) {
            case CalendarViewsEnum.Days:
                onCurrentDateChange(currentDate.clone().add(1, "month"));
                break;

            case CalendarViewsEnum.Months:
                onCurrentDateChange(currentDate.clone().add(1, "year"));
                break;

            case CalendarViewsEnum.Years:
                if (isNextButtonEnabled)
                    onCurrentDateChange(currentDate.clone().add(yearsRange, "year"));
                break;

            default:
                break;
        }
    }

    const currentYear = useMemo(() => disableLocaleDigits ? (isHijri ? currentDate.iYear().toString() : currentDate.year().toString()) : currentDate.format(formats.FullYear), [currentDate, isHijri]);
    const currentMonth = useMemo(() => currentDate.format(formats.FullMonth), [currentDate]);

    return (
        <div className="fkdp-calendar__header">
            {!!renderPrevButton ? renderPrevButton({ disabled: !isPrevButtonEnabled, onClick: () => handlePrevPage() }) : (
                <button
                    className={clsx({
                        "fkdp-calendar__btn": true,
                        "fkdp-calendar__btn-prev": true,
                        "fkdp-calendar__btn--disabled": !isPrevButtonEnabled,
                    })}
                    disabled={!isPrevButtonEnabled}
                    type="button"
                    aria-label="Previous"
                    style={{ transform: isRTL ? 'rotate(180deg)' : undefined }}
                    onClick={handlePrevPage}
                >
                    ◀
                </button>
            )}
            {(isYearsEnabled) && (
                !!renderSelectedYear ? renderSelectedYear(currentYear, currentDate.toDate(), { opened: view === CalendarViewsEnum.Years, onClick: () => handleYearClick() }) : (
                    <span style={{
                        cursor: (isMonthsEnabled || isDaysEnabled) ? 'pointer' : undefined,
                        fontWeight: (view === CalendarViewsEnum.Years) ? 'bold' : undefined,
                    }} onClick={handleYearClick}>{currentYear}</span>
                )
            )}
            {(isMonthsEnabled) && (
                !!renderSelectedMonth ? renderSelectedMonth(currentMonth, currentDate.toDate(), { opened: view === CalendarViewsEnum.Months, onClick: () => handleMonthClick() }) : (
                    <span style={{
                        cursor: (isYearsEnabled || isDaysEnabled) ? 'pointer' : undefined,
                        fontWeight: (view === CalendarViewsEnum.Months) ? 'bold' : undefined,
                    }} onClick={handleMonthClick}>{currentMonth}</span>
                )
            )}
            {!!renderPrevButton ? renderPrevButton({ disabled: !isNextButtonEnabled, onClick: () => handleNextPage() }) : (
                <button
                    className={clsx({
                        "fkdp-calendar__btn": true,
                        "fkdp-calendar__btn-prev": true,
                        "fkdp-calendar__btn--disabled": !isNextButtonEnabled,
                    })}
                    disabled={!isNextButtonEnabled}
                    type="button"
                    aria-label="Next"
                    style={{ transform: isRTL ? 'rotate(180deg)' : undefined }}
                    onClick={handleNextPage}
                >
                    ▶
                </button>
            )}
        </div>
    )
}
