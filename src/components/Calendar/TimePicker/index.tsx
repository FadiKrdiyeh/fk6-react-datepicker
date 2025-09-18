import moment, { type Moment } from 'moment-hijri';
import { useMemo, type FC } from 'react';

import type { TimeParts } from '../../../types/time-parts.js';
import { buildDateTime, extractTimeParts } from '../../../utils/dateHelpers.js';
import { ScrollColumn } from './ScrollColumn/index.js';

interface AllTimePickerProps {
    value?: Date | Moment | null;
    initialDate?: Date | Moment | null | undefined;
    currentDate: Moment;
    is12h?: boolean;
    locale?: string | undefined;                      // e.g., 'en', 'fr'
    showScrollbars?: boolean;
    selectOnScrolling?: boolean;
    visibleColumns?: ('hours' | 'minutes' | 'seconds')[];
    disabledHours?: number[];
    disabledMinutes?: number[];
    disabledSeconds?: number[];
    disabledMeridiem?: string[];
    disableLocaleDigits?: boolean | undefined;
    onSelect?: (date: Date | null) => void;
}

export type TimePickerProps = Omit<AllTimePickerProps, "value" | "locale" | "disableLocaleDigits" | "currentDate">

export const TimePicker: FC<AllTimePickerProps> = ({
    value,
    initialDate,
    currentDate,
    locale,
    is12h = false,
    visibleColumns,
    showScrollbars = false,
    selectOnScrolling,
    disabledHours,
    disabledMinutes,
    disabledSeconds,
    disabledMeridiem,
    disableLocaleDigits,
    onSelect,
}) => {
    const isHoursVisible = visibleColumns === undefined || visibleColumns.includes('hours');
    const isMinutesVisible = visibleColumns === undefined || visibleColumns.includes('minutes');
    const isSecondsVisible = visibleColumns === undefined || visibleColumns.includes('seconds');

    const defaultValue: TimeParts = !!initialDate ? extractTimeParts(initialDate, is12h, locale)! : {
        hour: is12h ? 12 : 0,
        minute: 0,
        second: 0,
        meridiem: moment.localeData(locale).meridiem(0, 0, false),
    }

    const valueTimeParts = useMemo(() => extractTimeParts((value ?? initialDate), is12h, locale), [value, is12h]);

    // const meridiem: string[] = ["AM", "PM"];
    const meridiem = [
        moment.localeData(locale).meridiem(0, 0, false),  // AM
        moment.localeData(locale).meridiem(12, 0, false), // PM
    ];
    const seconds = isSecondsVisible ? Array.from({ length: 60 }, (_, i) => i) : [];
    const minutes = isMinutesVisible ? Array.from({ length: 60 }, (_, i) => i) : [];
    const hours = isHoursVisible ? (is12h
        ? [12, ...Array.from({ length: 11 }, (_, i) => i + 1)] // 12, 1..11
        : Array.from({ length: 24 }, (_, i) => i)) : [];

    const handleChangeTime = (time: TimeParts | null) => {
        if (!time)
            onSelect?.(null);
        else
            onSelect?.(buildDateTime(currentDate, time, is12h, locale).toDate());
    };

    return (
        <div className="fkdp-calendar-time">
            {isHoursVisible && (
                <ScrollColumn
                    locale={locale}
                    items={hours}
                    selected={valueTimeParts?.hour}
                    disabledItems={disabledHours}
                    showScrollbars={showScrollbars}
                    selectOnScrolling={selectOnScrolling}
                    disableLocaleDigits={disableLocaleDigits}
                    onSelect={(h) => handleChangeTime({ ...(valueTimeParts ?? defaultValue), hour: h })}
                />
            )}
            {isMinutesVisible && (
                <ScrollColumn
                    locale={locale}
                    items={minutes}
                    disabledItems={disabledMinutes}
                    selected={valueTimeParts?.minute}
                    showScrollbars={showScrollbars}
                    selectOnScrolling={selectOnScrolling}
                    disableLocaleDigits={disableLocaleDigits}
                    onSelect={(m) => handleChangeTime({ ...(valueTimeParts ?? defaultValue), minute: m })}
                />
            )}
            {isSecondsVisible && (
                <ScrollColumn
                    locale={locale}
                    items={seconds}
                    disabledItems={disabledSeconds}
                    selected={valueTimeParts?.second}
                    showScrollbars={showScrollbars}
                    selectOnScrolling={selectOnScrolling}
                    disableLocaleDigits={disableLocaleDigits}
                    onSelect={(s) => handleChangeTime({ ...(valueTimeParts ?? defaultValue), second: s })}
                />
            )}
            {(is12h && isSecondsVisible) && (
                <ScrollColumn
                    locale={locale}
                    items={meridiem}
                    showScrollbars={false}
                    disabledItems={disabledMeridiem?.map(m => m.toLowerCase() === 'pm' || m.toLowerCase() === 'م' ? moment.localeData(locale).meridiem(12, 0, false) : moment.localeData(locale).meridiem(0, 0, false))}
                    selectOnScrolling={selectOnScrolling}
                    selected={valueTimeParts?.meridiem}
                    onSelect={(ampm) => handleChangeTime({ ...(valueTimeParts ?? defaultValue), meridiem: ampm })}
                />
            )}
        </div>
    )
}
