import { type Moment } from 'moment-hijri';
import { type FC, type ReactNode } from 'react';

import { getLocalizedMomentDate } from '../../../utils/dateHelpers.js';

export interface CalendarFooterProps {
    locale?: string | undefined;
    enableGoToToday?: boolean | undefined;
    renderGoToToday?: (() => ReactNode) | undefined; // custom renderer for go to today button
    onCurrentDateChange: (currentDate: Moment) => void;
}

export const CalendarFooter: FC<CalendarFooterProps> = ({
    locale,
    enableGoToToday,
    renderGoToToday,
    onCurrentDateChange,
}) => {

    const handleGoToToday = () => {
        onCurrentDateChange(getLocalizedMomentDate(undefined, locale));
    }

    return (
        <div className="fkdp-calendar__footer">
            {enableGoToToday && (
                renderGoToToday ? renderGoToToday() : (
                    <button onClick={handleGoToToday} className="fkdp-calendar__go-to-today">Go to today</button>
                )
            )}
        </div>
    )
}
