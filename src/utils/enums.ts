export enum CalendarsEnum {
    Hijri = "hijri",
    Gregorian = "gregorian",
}

export enum CalendarViewsEnum {
    Days = "days",
    Months = "months",
    Years = "years",
}

export enum GregorianFormatsEnum {
    D = "D",
    Day = "DD",
    Month = "MM",
    ShortMonth = "MMM",
    FullMonth = "MMMM",
    FullYear = "YYYY",
    FullTime = "hh:mm:ss A",
    Date = `${GregorianFormatsEnum.FullYear}/${GregorianFormatsEnum.Month}/${GregorianFormatsEnum.Day}`,
    FullDateTime = `${GregorianFormatsEnum.Date} ${GregorianFormatsEnum.FullTime}`,
    FullMonthYear = `${GregorianFormatsEnum.FullMonth} ${GregorianFormatsEnum.FullYear}`,
    WeekNumber = "w",
}

// export enum GregorianFormatsEnum {
//     Date = "iYYYY/iMM/iDD",
//     FullYear = "iYYYY",
//     FullMonth = "iMMMM",
//     Month = "iMMM",
//     FullMonthYear = "iMMMM iYYYY",
// }

export enum HijriFormatsEnum {
    D = "iD",
    Day = "iDD",
    Month = "iMM",
    FullYear = "iYYYY",
    FullMonth = "iMMMM",
    ShortMonth = "iMMM",
    FullTime = "hh:mm:ss A",
    Date = `${HijriFormatsEnum.FullYear}/${HijriFormatsEnum.Month}/${HijriFormatsEnum.Day}`,
    FullDateTime = `${HijriFormatsEnum.Date} ${HijriFormatsEnum.FullTime}`,
    FullMonthYear = `${HijriFormatsEnum.FullMonth} ${HijriFormatsEnum.FullYear}`,
    WeekNumber = "iw",
}

export enum CalendarPositionsEnum {
    Top = "top",
    Right = "right",
    Bottom = "bottom",
    Left = "left",
    Start = "start",
    End = "end",
    TopLeft = "top-left",
    TopRight = "top-right",
    TopStart = "top-start",
    TopEnd = "top-end",
    BottomLeft = "bottom-left",
    BottomRight = "bottom-right",
    BottomStart = "bottom-start",
    BottomEnd = "bottom-end",
}

export enum ThemesEnum {
    Dark = "dark",
    Light = "light",
}

export enum PopupModesEnum {
    Inline = "inline",
    Popover = "popover",
}
