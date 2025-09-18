import { type Moment } from 'moment-hijri';
import { type FC, type ReactNode } from 'react';

import { getLocalizedMomentDate } from '../../../utils/dateHelpers.js';

export interface CalendarFooterProps {
    locale?: string | undefined;
    showTimePicker?: boolean | undefined;
    enableGoToToday?: boolean | undefined;
    renderGoToToday?: ((onClick: () => void) => ReactNode) | undefined; // custom renderer for go to today button
    renderConfirmBtn?: ((onClick: () => void) => ReactNode) | undefined; // custom renderer for confirm button
    onCurrentDateChange: (currentDate: Moment) => void;
    onConfirm?: () => void;
    onClose?: () => void;
}

export const CalendarFooter: FC<CalendarFooterProps> = ({
    locale,
    showTimePicker,
    enableGoToToday,
    renderGoToToday,
    renderConfirmBtn,
    onCurrentDateChange,
    onConfirm,
}) => {
    const isFooterVisible = !!enableGoToToday || showTimePicker;

    const handleGoToToday = () => {
        onCurrentDateChange(getLocalizedMomentDate(undefined, locale));
    }

    const handleConfirmClick = () => {
        onConfirm?.();
    }

    return (
        isFooterVisible
            ? (
                <div className="fkdp-calendar__footer">
                    {enableGoToToday && (
                        renderGoToToday ? renderGoToToday(handleGoToToday) : (
                            <button onClick={handleGoToToday} className="fkdp-calendar__go-to-today">Go to today</button>
                        )
                    )}
                    {showTimePicker && (
                        <div className="fkdp-calendar__footer--actions">
                            {!!renderConfirmBtn ? renderConfirmBtn(handleConfirmClick) : (
                                <button onClick={handleConfirmClick} className="fkdp-calendar__footer--action fkdp-calendar__footer--action-ok">OK</button>
                            )}
                        </div>
                    )}
                </div>
            ) : <></>
    )
}
