import { type Moment } from "moment-hijri";
import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState, type ComponentProps, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { MOMENT_MAX_SUPPORTED_DATE, MOMENT_MIN_SUPPORTED_DATE } from "../../utils/constants.js";
import { fixSupportedDate, fixSupportedMoment, getLocalizedMomentDate } from "../../utils/dateHelpers.js";
import { CalendarPositionsEnum, CalendarsEnum, CalendarViewsEnum, PopupModesEnum, ThemesEnum } from "../../utils/enums.js";
import { computeCoords, positionResolvers } from "../../utils/positioningHelper.js";
import { clsx } from "../../utils/stringHelpers.js";
import { CalendarFooter } from "./CalendarFooter/index.js";
import { CalendarHeader } from "./CalendarHeader/index.js";
import { DaysCalendar, type DaysCalendarProps } from "./DaysCalendar/index.js";
import { MonthsCalendar, type MonthsCalendarProps } from "./MonthsCalendar/index.js";
import { YearsCalendar, type YearsCalendarProps } from "./YearsCalendar/index.js";

import "../../scss/components/calendar.scss";

export interface CalendarProps extends Omit<ComponentProps<'div'>, 'onSelect'> {
    open?: boolean;
    value?: Date | Moment | null;
    initialDate?: Date | Moment | undefined;                    // date to show initially
    minDate?: Date | undefined;
    maxDate?: Date | undefined;
    locale?: string | undefined;                      // e.g., 'en', 'fr'
    calendar?: `${CalendarsEnum}` | undefined;
    disablePortal?: boolean;
    yearsCalendarProps?: Partial<YearsCalendarProps>;
    monthsCalendarProps?: Partial<MonthsCalendarProps>;
    daysCalendarProps?: Partial<DaysCalendarProps>;
    enableGoToToday?: boolean;
    mode?: `${PopupModesEnum}`;
    theme?: `${ThemesEnum}`;
    position?: `${CalendarPositionsEnum}`;
    anchorEl?: HTMLElement | null;
    isControlled?: boolean;
    views?: `${CalendarViewsEnum}`[];
    initialView?: `${CalendarViewsEnum}`;
    // stayInViewport?: boolean;
    disabledDatesFn?: (date: Date, view: `${CalendarViewsEnum}`) => boolean; // mark specific dates disabled
    renderGoToToday?: () => ReactNode; // custom renderer for go to today button
    onSelect?: (date: Date, close?: boolean) => void;
    onClose?: () => void;
}

// export type CalendarProps = Omit<AllCalendaCalendarProps, "calendar" | "focusedDate">

export const Calendar = forwardRef<HTMLDivElement, CalendarProps>(({
    open,
    value = null,
    initialDate,
    minDate: _minDate,
    maxDate: _maxDate,
    locale,
    theme = "light",
    calendar = CalendarsEnum.Gregorian,
    disablePortal = false,
    mode = "popover",
    position = CalendarPositionsEnum.Bottom,
    anchorEl,
    monthsCalendarProps,
    yearsCalendarProps,
    daysCalendarProps,
    enableGoToToday,
    isControlled,
    views,
    initialView,
    // stayInViewport = true,
    renderGoToToday,
    disabledDatesFn,
    onSelect,
    onClose,
    ...calendarProps
}, ref) => {
    const isOpen = open ?? mode === "inline";
    const minDate = fixSupportedDate(_minDate) ?? MOMENT_MIN_SUPPORTED_DATE.toDate();
    const maxDate = fixSupportedDate(_maxDate) ?? MOMENT_MAX_SUPPORTED_DATE.toDate();

    const isMonthsEnabled = useMemo(() => views === undefined || views.includes('months'), [views]);
    const isYearsEnabled = useMemo(() => views === undefined || views.includes('years'), [views]);
    const isDaysEnabled = useMemo(() => views === undefined || views.includes('days'), [views]);

    // const [isOpen, setIsOpen] = useState(mode === "inline");
    const [view, setView] = useState<`${CalendarViewsEnum}`>(initialView ?? views?.[0] ?? CalendarViewsEnum.Days);
    const [currentDate, setCurrentDate] = useState(getLocalizedMomentDate(fixSupportedDate(value || initialDate || new Date()), locale));
    const [focusedDate, setFocusedDate] = useState(getLocalizedMomentDate(fixSupportedDate(value || new Date()), locale));
    const [styles, setStyles] = useState<CSSProperties>({ visibility: 'hidden' });

    const calendarRef = useRef<HTMLDivElement>(null);

    // merge forwarded ref with local ref
    useEffect(() => {
        if (!ref) return;
        if (typeof ref === "function") ref(calendarRef.current);
        else (ref as React.RefObject<HTMLDivElement | null>).current = calendarRef.current;
    }, [ref]);

    useEffect(() => {
        if (views !== undefined && !views?.includes(view))
            console.error(`The value of [initialView] property must be defined in views array. Please add (${initialView}) to views array!`);
    }, [views, initialDate]);

    const calculatePopoverPosition = useCallback((): CSSProperties => {
        if (!anchorEl || !calendarRef.current)
            return {};

        const coords = computeCoords(anchorEl, calendarRef.current, disablePortal);

        return { position: 'absolute', ...positionResolvers[position](coords) };
    }, [anchorEl, calendarRef.current, position]);

    // Recalculate popover position when open or anchor changes
    useEffect(() => {
        if (mode === "popover" && isOpen && anchorEl) {
            const updatePosition = () => {
                const style = calculatePopoverPosition();
                setStyles(style);
            }

            updatePosition();

            window.addEventListener("resize", updatePosition);
            window.addEventListener("scroll", updatePosition, true); // true = capture phase

            return () => {
                window.removeEventListener("resize", updatePosition);
                window.removeEventListener("scroll", updatePosition, true);
            };
        }
    }, [mode, isOpen, anchorEl, position]);

    const handleSetCurrentDate = (date: Moment) => {
        setCurrentDate(fixSupportedMoment(date, locale)!);
    }

    // const isDateDisabled = (date: Moment) => {
    //     return !date.isBetween(minDate, maxDate, "day", "[]") || disabledDatesFn?.(date.toDate(), view) || disabledDates?.includes(date.toDate());
    // };

    if (!isOpen) return null;

    // const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    //     let newFocus = focusedDate.clone();
    //     // debugger
    //     switch (e.key) {
    //         case "ArrowLeft":
    //             newFocus.subtract(1, "day");
    //             break;
    //         case "ArrowRight":
    //             newFocus.add(1, "day");
    //             break;
    //         case "ArrowUp":
    //             newFocus.subtract(7, "day");
    //             break;
    //         case "ArrowDown":
    //             newFocus.add(7, "day");
    //             break;
    //         case "PageUp":
    //             newFocus.subtract(1, "month");
    //             handleSetCurrentDate(newFocus.clone());
    //             break;
    //         case "PageDown":
    //             newFocus.add(1, "month");
    //             handleSetCurrentDate(newFocus.clone());
    //             break;
    //         case "Home":
    //             newFocus.startOf("week");
    //             break;
    //         case "End":
    //             newFocus.endOf("week");
    //             break;
    //         case "Enter":
    //             if (!isDateDisabled(focusedDate)) {
    //                 onSelect?.(focusedDate.toDate(), true);
    //             }
    //             break;
    //         default:
    //             return;
    //     }
    //     e.preventDefault();
    //     setFocusedDate(newFocus);
    // };

    // Handle outside clicks
    const handleClickOutside = useCallback((e: MouseEvent) => {
        if (calendarRef.current && !calendarRef.current.contains(e.target as Node) && anchorEl && !anchorEl.contains(e.target as Node) && !(e.target as HTMLElement).closest(".calendar-popover"))
            onClose?.();
    }, [calendarRef.current, anchorEl]);

    useEffect(() => {
        if (mode === "popover") {
            if (isOpen)
                document.addEventListener("mousedown", handleClickOutside);
            else
                document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, handleClickOutside, mode]);

    const DaysCalendarUI = (
        <DaysCalendar
            {...daysCalendarProps}
            value={value}
            currentDate={currentDate}
            calendar={calendar}
            focusedDate={focusedDate}
            minDate={minDate}
            maxDate={maxDate}
            locale={locale}
            onSelect={date => {
                onSelect?.(date, true);
                handleSetCurrentDate(getLocalizedMomentDate(date, locale));
                setFocusedDate(getLocalizedMomentDate(date, locale));
            }}
        />
    )

    const MonthsCalendarUI = (
        <MonthsCalendar
            {...monthsCalendarProps}
            value={value}
            currentDate={currentDate}
            calendar={calendar}
            minDate={minDate}
            maxDate={maxDate}
            focusedDate={focusedDate}
            locale={locale}
            onSelect={date => {
                onSelect?.(date);
                handleSetCurrentDate(getLocalizedMomentDate(date, locale));
                setFocusedDate(getLocalizedMomentDate(date, locale));
                if (isDaysEnabled)
                    setView(CalendarViewsEnum.Days);
                else
                    onClose?.();
            }}
        />
    )

    const YearsCalendarUI = (
        <YearsCalendar
            {...yearsCalendarProps}
            value={value}
            calendar={calendar}
            currentDate={currentDate}
            focusedDate={focusedDate}
            minDate={minDate}
            maxDate={maxDate}
            locale={locale}
            onSelect={date => {
                onSelect?.(date);
                handleSetCurrentDate(getLocalizedMomentDate(date, locale));
                setFocusedDate(getLocalizedMomentDate(date, locale));
                if (isMonthsEnabled)
                    setView(CalendarViewsEnum.Months);
                else if (isDaysEnabled)
                    setView(CalendarViewsEnum.Days);
                else
                    onClose?.();
            }}
        />
    )

    const renderedView = () => {

        switch (view) {
            case 'days':
                if (isDaysEnabled)
                    return DaysCalendarUI;

            case 'months':
                if (isMonthsEnabled)
                    return MonthsCalendarUI;

            case 'years':
                if (isYearsEnabled)
                    return YearsCalendarUI;

            default:
                if (isMonthsEnabled)
                    return MonthsCalendarUI;
                else if (isYearsEnabled)
                    return YearsCalendarUI;
        }
    }

    const CalendarUI = (
        <div
            {...calendarProps}
            ref={calendarRef}
            className={clsx({
                "fkdp-calendar": true,
                [calendarProps.className || '']: !!calendarProps.className,
                "fkdp-calendar__dark": theme === 'dark',
                "fkdp-calendar__woth-week-nums": daysCalendarProps?.showWeeksNumber,
            })}
            role="grid"
            aria-label={calendarProps["aria-label"] || "Calendar"}
            onClick={e => e.stopPropagation()}
        // onKeyDown={handleKeyDown}
        >
            <CalendarHeader
                yearsRange={yearsCalendarProps?.range}
                calendar={calendar}
                currentDate={currentDate}
                view={view}
                views={views}
                calendarEl={calendarRef.current}
                onChangeView={setView}
                onCurrentDateChange={handleSetCurrentDate}
            />

            {renderedView()}

            <CalendarFooter
                locale={locale}
                enableGoToToday={enableGoToToday}
                renderGoToToday={renderGoToToday}
                onCurrentDateChange={handleSetCurrentDate}
            />
        </div>
    )

    if (mode === "inline")
        return CalendarUI;

    return (
        <>
            {(isOpen && (anchorEl || isControlled)) && (
                !disablePortal ? (
                    createPortal(<div style={styles}>{CalendarUI}</div>, document.body)
                ) : (<div style={styles}>{CalendarUI}</div>)
            )}
        </>
    );
});
