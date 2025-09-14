<!-- # fk6-react-datepicker
A React datetime picker supporting Gregorian and Hijri calendars using moment and moment-hijri (NOT READY TO USE YET!) -->

# React Date Picker

[![npm version](https://img.shields.io/npm/v/@fk6/react-datepicker.svg)](https://www.npmjs.com/package/@fk6/react-datepicker)
[![npm downloads](https://img.shields.io/npm/dm/@fk6/react-datepicker.svg)](https://www.npmjs.com/package/@fk6/react-datepicker)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@fk6/react-datepicker.svg)](https://bundlephobia.com/package/@fk6/react-datepicker)
[![license](https://img.shields.io/npm/l/@fk6/react-datepicker.svg)](LICENSE)

A modern, fully customizable **React Date Picker** component with support for both **Gregorian** and **Hijri** calendars.
It provides multiple views (day, month, year), works in **inline** or **popover** mode, supports **localization (i18n)**, and allows complete **theming** via SCSS variables or CSS custom properties.

Whether you’re building a simple form date field or a complex internationalized app, this library gives you full control over how dates are displayed, selected, highlighted, and styled.

---

## ✨ Features

- 🔥 **Flexible and customizable components**

- **🕌 Dual Calendar Support**
  Built-in support for both **Gregorian** and **Hijri (Islamic)** calendars.

- **🌍 Internationalization (i18n)**
  Localize month names, weekdays, and calendar layout using `moment.js` locales.  
  Supports **RTL (Right-to-Left)** and **LTR** directions.

- **🎨 Theming & Customization**
  Supporting light & dark modes.
  Customize colors customize using **SCSS or CSS variables** without modifying the source code.

- **📐 Flexible Positioning**
  Choose from multiple popover positions (`top`, `bottom`, `start`, `end`, etc.) with automatic viewport adjustments.

- **📅 Multiple Calendar Views**
  Switch easily between **Day**, **Month**, and **Year** views with a single prop.

- 📌 **Inline** or **Popover** modes (attach to an input field)

- **🚀 Lightweight & Performant**
  Optimized with React hooks (`useMemo`, `useEffect`) and minimal dependencies.

  - **🔒 Disable Dates**
    Provide a custom function or array of dates to disable specific days, months, or years.

- **📆 First Day of Week**
  Configure which day your calendar starts on (Sunday, Monday, etc.).

- **🔢 Week Numbers**
  Optionally display ISO week numbers for better planning.

- **🖼 Inline or Popover Mode**
  Use the calendar embedded in your layout or as a dropdown attached to an input field.

- **⚡ Simple API**
  Minimal props with sensible defaults, but flexible enough for advanced use cases.
- 🛠️ Written in **TypeScript** with full typings

---

## 📦 Installation

You can install **@fk6/react-datepicker** using your favorite package manager:

```bash
# Using npm
npm install @fk6/react-datepicker moment moment-hijri

# Using yarn
yarn add @fk6/react-datepicker moment moment-hijri

# Using pnpm
pnpm add @fk6/react-datepicker moment moment-hijri
```

### Peer Dependencies

This package relies on:

- React +18
- moment (for Gregorian calendar support)
- moment-hijri (for Hijri calendar support)

Make sure these are installed in your project.

---

## 🚀 Usage

### Basic Example

```tsx
import React, { useState } from "react";
import { DatePicker } from "react-date-picker";
import "@fk6/react-datepicker/react-datepicker.css";

export default function App() {
  const [date, setDate] = useState<Date | Moment | null>(null);

  return (
    <div>
      <DatePicker value={date} onChange={setDate} />
    </div>
  );
}
```

---

### Hijri Calendar

Switch to **Hijri** mode using calendar prop:

```tsx
<DatePicker calendar="hijri" />
```

---

### Inline Mode

Render **Calendar** without field:

```tsx
import React, { useRef, useState } from "react";
import { Calendar } from "@fk6/react-datepicker";
import moment from "moment";

export default function App() {
  const [value, setValue] = useState(moment());
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <Calendar mode="inline" value={value} onChange={setValue} />
    </div>
  );
}
```

---

### Localization

This example sets the Moment.js locale to Arabic ("ar") and renders a DatePicker with Arabic localization. It ensures that date formats, calendar labels, and UI elements appear in Arabic, providing a fully localized experience for Arabic-speaking users.

```tsx
import { useState } from "react";
import { DatePicker } from "@fk6/react-datepicker";

import "@fk6/react-datepicker/react-datepicker.css";
import "moment/locale/ar";

moment.locale("ar");

const Example = () => {
  return <DatePicker locale="ar" />;
};
```

### Render Custom Field

Render your own **Custom Input**:

This `DatePicker` allow you to render your own custom input component (`MyCustomInput`) to render the date field. The `ref` connects the input to the calendar popover, while `onOpenRequest` enables the calendar to open on click—providing seamless integration between the input field and date selection UI.

```tsx
<DatePicker
  renderInput={(inputProps) => (
    <MyCustomInput
      ref={inputProps.ref}
      value={inputProps.value || ""}
      onChange={inputProps.onChange}
      onClick={inputProps.onOpenRequest}
    />
  )}
/>
```

---

### Theming

You can override CSS variables in your styles:

```scss
:root {
  --fkdp-primary: #4caf50;
  --fkdp-secondary: #977e7e;
  --fkdp-highlight: #5da064cd;
  --fkdp-text: #000000ff;
  --fkdp-light-text: #c6c6c6ff;

  // DateField
  --fkdp-field-bg: #c2e2d0ff;
  --fkdp-field-color: #222;
  --fkdp-field-icon-color: #222;

  // Calendar
  --fkdp-calendar-bg: #c2e2d0ff;
  --fkdp-calendar-highlighted-bg: #459588cd;
  --fkdp-calendar-holiday-bg: #5a3434ff;
}
```

---

## ⚙️ Props

### Common Props

| Prop                               | Type                                                       | Default        | Description                                                                              |
| ---------------------------------- | ---------------------------------------------------------- | -------------- | ---------------------------------------------------------------------------------------- |
| `value`                            | `Date \| Moment \| null`                                   | `null`         | The currently selected date.                                                             |
| `defaultValue`                     | `Date \| Moment \| null`                                   | `null`         | Uncontrolled selected date.                                                              |
| `onChange`                         | `(date: Date \| null) => void`                             | —              | Callback fired when a date is selected.                                                  |
| `minDate`                          | `Date \| Moment`                                           | `"1937-03-14"` | The earliest date a user can select. Dates before this are disabled.                     |
| `maxDate`                          | `Date \| Moment`                                           | `"2077-10-17"` | The latest date a user can select. Dates after this are disabled.                        |
| `disabledDates`                    | `(Date \| Moment)[]`                                       | —              | Array of Date objects that should be disabled in the calendar.                           |
| `disabledDatesFn`                  | `(date: Date) => boolean`                                  | —              | Function to disable dates dynamically.                                                   |
| `locale`                           | `string`                                                   | `"en"`         | Moment.js locale (e.g. `"ar"`, `"ar-sa"`, `"en-gb"`).                                    |
| `format`                           | `string`                                                   | `"YYYY/MM/DD"` | Specifies the format pattern used to display and interpret dates.                        |
| `calendar`                         | `gregorian` \| `hijri`                                     | `"gregorian"`  | Specifies the calendar system used for date calculations and display.                    |
| `anchorEl`                         | `HTMLElement \| null`                                      | `null`         | When in popover mode, the element to anchor the calendar to.                             |
| `closeOnSelect`                    | `boolean`                                                  | `true`         | Determines whether the calendar should close immediately after a date is selected.       |
| `readOnly`                         | `boolean`                                                  | `false`        | Prevents manual input/editing but still allows interaction (e.g. calendar popover).      |
| `disabled`                         | `boolean`                                                  | `false`        | Fully disables the component—no input, no interaction, and typically styled as inactive. |
| `theme`                            | `light` \| `dark`                                          | `light`        | Sets the calendar's color scheme to either light or dark mode.                           |
| `renderInput`                      | `(props: `[FieldProps](#field-props)`) => ReactNode`       | —              | A function that receives input props and returns a custom input component.               |
| `renderCalendar`                   | `(props: `[CalendarProps](#calendar-props)`) => ReactNode` | —              | A function that receives calendar props and returns a custom calendar layout.            |
| `onOpenChange`                     | `(open: boolean) => void`                                  | —              | Called with a boolean value whenever the calendar's visibility changes.                  |
| [`calendarProps`](#calendar-props) | `CalendarProps`                                            | —              | An object containing props that customize the rendering and behavior of the calendar.    |
| [`fieldProps`](#field-props)       | `FieldProps`                                               | —              | An object containing props that customize the rendering and behavior of the date field.  |

## Calendar Props

### Common Props

| Prop                  | Type                                                                                                                                                                                       | Default        | Description                                                                                       |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------- | ------------------------------------------------------------------------------------------------- |
| `open`                | `boolean`                                                                                                                                                                                  | `false`        | Determines whether the calendar or picker is currently visible.                                   |
| `value`               | `Date \| Moment \| null`                                                                                                                                                                   | `null`         | The currently selected date.                                                                      |
| `initialDate`         | `Date \| Moment \| null`                                                                                                                                                                   | `null`         | The date the calendar initially focuses on when rendered.                                         |
| `onSelect`            | `(date: Date \| null) => void`                                                                                                                                                             | —              | Callback fired when a date is selected.                                                           |
| `disablePortal`       | `boolean`                                                                                                                                                                                  | `false`        | If true, renders the calendar/popover inline instead of using a portal.                           |
| `enableGoToToday`     | `boolean`                                                                                                                                                                                  | —              | If true, displays a button that navigates the calendar to today’s date.                           |
| `renderGoToToday`     | `() => ReactNode`                                                                                                                                                                          | —              | A function that returns a custom element for the “Go to Today” button.                            |
| `disabledDatesFn`     | `(date: Date) => boolean`                                                                                                                                                                  | —              | Function to disable dates dynamically.                                                            |
| `mode`                | `popover` \| `inline`                                                                                                                                                                      | `"popover"`    | Controls the calendar's display style: as a popover or inline element.                            |
| `theme`               | `light` \| `dark`                                                                                                                                                                          | `"light"`      | Sets the calendar's color scheme to either light or dark mode.                                    |
| `initialView`         | `"day" \| "month" \| "year"`                                                                                                                                                               | `"day"`        | Determines which view is shown when the calendar first loads.                                     |
| `views`               | `"day" \| "month" \| "year"`                                                                                                                                                               | `"day"`        | Specifies which views users can switch between. Must include initialView.                         |
| `anchorEl`            | `HTMLElement \| null`                                                                                                                                                                      | `null`         | The DOM element that serves as the anchor point for positioning the calendar.                     |
| `position`            | `"top" \| "right" \| "bottom" \| "left" \| "start" \| "end" \| "top-right" \| "top-left" \| "top-start" \| "top-end" \| "bottom-right" \| "bottom-left" \| "bottom-start" \| "bottom-end"` | `"bottom"`     | Specifies the calendar's placement relative to the anchor element.                                |
| `locale`              | `string`                                                                                                                                                                                   | `"en"`         | Moment.js locale (e.g. `"ar"`, `"ar-sa"`, `"en-gb"`).                                             |
| `format`              | `string`                                                                                                                                                                                   | `"YYYY/MM/DD"` | Specifies the format pattern used to display and interpret dates.                                 |
| `calendar`            | `gregorian` \| `hijri`                                                                                                                                                                     | `"gregorian"`  | Specifies the calendar system used for date calculations and display.                             |
| `onClose`             | `() => void`                                                                                                                                                                               | —              | Callback invoked when the calendar is closed (e.g., clicking outside or selecting a date).        |
| `daysCalendarProps`   | [`DaysCalendarProps`](#days-calendar-props)                                                                                                                                                | —              | An object containing props that customize the rendering and behavior of the days calendar view.   |
| `monthsCalendarProps` | [`MonthsCalendarProps`](#months-calendar-props)                                                                                                                                            | —              | An object containing props that customize the rendering and behavior of the months calendar view. |
| `yearsCalendarProps`  | [`YearsCalendarProps`](#years-calendar-props)                                                                                                                                              | —              | An object containing props that customize the rendering and behavior of the years calendar view.  |

---

## Days Calendar Props

| Prop               | Type                                             | Default   | Description                                                                     |
| ------------------ | ------------------------------------------------ | --------- | ------------------------------------------------------------------------------- |
| `firstDayOfWeek`   | `0-6`                                            | `0` (Sun) | Sets the first day of the week.                                                 |
| `hideOutsideDays`  | `boolean`                                        | —         | Controls whether days outside the current month are shown in the calendar grid. |
| `showWeeksNumber`  | `boolean`                                        | —         | Determines whether to show the week number for each row in the calendar grid.   |
| `highlightDates`   | `(Date \| Moment)[]`                             | —         | A list of dates to be visually highlighted in the calendar.                     |
| `disabledDates`    | `(Date \| Moment)[]`                             | —         | Array of Date objects that should be disabled in the calendar.                  |
| `disabledMonths`   | `(Date \| Moment)[]`                             | —         | Array of objects specifying which months to disable.                            |
| `disabledYears`    | `(Date \| Moment)[]`                             | —         | Array of years to disable in the calendar.                                      |
| `weekends`         | `(Date \| Moment)[]`                             | —         | Controls the visibility, styling, or behavior of weekend days in the calendar.  |
| `disableWeekends`  | `boolean`                                        | —         | Disables selection of weekend days in the calendar.                             |
| `renderDay`        | `(date: Date) => ReactNode`                      | —         | A function that returns a custom element for each day cell in the calendar.     |
| `renderWeekNumber` | `(weekNumber: number \| undefined) => ReactNode` | —         | A function that returns a custom element for each week number in the calendar.  |
| `disabledDatesFn`  | `(date: Date) => boolean`                        | —         | Function to disable dates dynamically.                                          |
| `onSelect`         | `(date: Date) => void`                           | —         | Called when a user clicks a day; receives the clicked date as a Date object.    |

---

## Months Calendar Props

| Prop              | Type                        | Default | Description                                                                    |
| ----------------- | --------------------------- | ------- | ------------------------------------------------------------------------------ |
| `disabledMonths`  | `(Date \| Moment)[]`        | —       | Array of objects specifying which months to disable.                           |
| `disabledYears`   | `(Date \| Moment)[]`        | —       | Array of years to disable in the calendar.                                     |
| `renderMonth`     | `(date: Date) => ReactNode` | —       | A function that returns a custom element for each month cell in the calendar.  |
| `disabledDatesFn` | `(date: Date) => boolean`   | —       | Function to disable dates dynamically.                                         |
| `onSelect`        | `(date: Date) => void`      | —       | Called when a user clicks a month; receives the clicked date as a Date object. |

---

## Years Calendar Props

| Prop              | Type                        | Default | Description                                                                   |
| ----------------- | --------------------------- | ------- | ----------------------------------------------------------------------------- |
| `range`           | `number`                    | 16      | Specifies how many years should be shown in the year picker view.             |
| `disabledYears`   | `(Date \| Moment)[]`        | —       | Array of years to disable in the calendar.                                    |
| `renderYear`      | `(date: Date) => ReactNode` | —       | A function that returns a custom element for each year cell in the calendar.  |
| `disabledDatesFn` | `(date: Date) => boolean`   | —       | Function to disable dates dynamically.                                        |
| `onSelect`        | `(date: Date) => void`      | —       | Called when a user clicks a year; receives the clicked date as a Date object. |

---

## Field Props

| Prop            | Type                                          | Default        | Description                                                                             |
| --------------- | --------------------------------------------- | -------------- | --------------------------------------------------------------------------------------- |
| `value`         | `Date \| Moment \| null`                      | `null`         | The currently selected date.                                                            |
| `defaultValue`  | `Date \| Moment \| null`                      | `null`         | Uncontrolled selected date.                                                             |
| `format`        | `string`                                      | `"YYYY/MM/DD"` | Specifies the format pattern used to display and interpret dates.                       |
| `clearable`     | `boolean`                                     | `true`         | Enables a UI control to clear the selected date, resetting the input.                   |
| `showIcon`      | `boolean`                                     | `true`         | Toggles visibility of the calendar icon in the calendar input.                          |
| `renderIcon`    | `() => ReactNode`                             | —              | A function that returns a custom calendar icon element, replacing the default icon.     |
| `onChange`      | `(date: Date \|null) => void`                 | —              | Called when the selected date changes. Receives the new value.                          |
| `onInputChange` | `(date: Date \|null) => void`                 | —              | Called whenever the input value changes. Receives the raw string entered.               |
| `onOpenRequest` | `(e: HTMLElement \| boolean \| null) => void` | —              | Called when the calendar or popover requests to open. Useful for controlled components. |

---

## 🤝 Contributing

I welcome contributions to make this datepicker even better! Whether you're fixing bugs, adding features, improving documentation, or suggesting enhancements—your input matters.

### How to Contribute

1. Fork the repository
2. Create a new branch

` git checkout -b feature/your-feature-name`

3. Make your changes
4. Test your code
5. - Submit a pull request with a clear description of your changes

### Guidelines

- Follow the existing code style and structure
- Write clear, concise commit messages
- Include relevant tests for new features or bug fixes
- Keep PRs focused—one feature or fix per PR

If you're unsure where to start, check out the [issues](https://github.com/FadiKrdiyeh/fk6-react-datepicker/issues) tab for open tasks or feature requests.

---

## License

MIT © [Fadi Krdiyeh ↗️](https://github.com/FadiKrdiyeh). Licensed under MIT license, see [LICENSE](https://github.com/FadiKrdiyeh/fk6-react-datepicker/blob/main/LICENSE) for the full license.

Don't be shy to visit my [Portfolio](https://fadi-krdiyeh.netlify.app) 😇🤍

---
