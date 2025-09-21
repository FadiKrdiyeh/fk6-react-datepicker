import moment, { type Moment } from "moment-hijri"

import { MAX_SUPPORTED_DATE, MIN_SUPPORTED_DATE, MOMENT_MAX_SUPPORTED_DATE, MOMENT_MIN_SUPPORTED_DATE } from "../utils/constants.js"

export const useHandleMinMaxDates = (minDate?: Date | Moment, maxDate?: Date | Moment) => {
    if (!!minDate) {
        const momentMinDate = moment(minDate);

        if (momentMinDate.isBefore(MOMENT_MIN_SUPPORTED_DATE))
            console.error(`@fk6/react-datepicker ERROR: The minimum supported date is (${MIN_SUPPORTED_DATE})`);
        else if (momentMinDate.isAfter(MOMENT_MAX_SUPPORTED_DATE))
            console.error(`@fk6/react-datepicker ERROR: The maximum supported date is (${MAX_SUPPORTED_DATE})`);
    }

    if (!!maxDate) {
        // const minSupportedDate = moment(MIN_SUPPORTED_DATE);
        // const maxSupportedDate = moment(MAX_SUPPORTED_DATE);
        const momentMaxDate = moment(maxDate);

        if (momentMaxDate.isBefore(MOMENT_MIN_SUPPORTED_DATE))
            console.error(`@fk6/react-datepicker ERROR: The minimum supported date is (${MIN_SUPPORTED_DATE})`);
        else if (momentMaxDate.isAfter(MOMENT_MAX_SUPPORTED_DATE))
            console.error(`@fk6/react-datepicker ERROR: The maximum supported date is (${MAX_SUPPORTED_DATE})`);
    }
}