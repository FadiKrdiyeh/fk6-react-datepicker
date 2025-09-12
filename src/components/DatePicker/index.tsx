import React, { forwardRef, useRef, useState, type ComponentProps } from "react";

import { useHandleMinMaxDates } from "../../hooks/useHandleMinMaxDates.js";
import { MOMENT_MAX_SUPPORTED_DATE, MOMENT_MIN_SUPPORTED_DATE } from "../../utils/constants.js";
import { fixSupportedDate } from "../../utils/dateHelpers.js";
import { CalendarsEnum, GregorianFormatsEnum, HijriFormatsEnum, ThemesEnum } from "../../utils/enums.js";
import { Calendar, type CalendarProps } from "../Calendar/index.js";
import { DateField, type DateFieldProps } from "../DateField/index.js";
import { clsx } from "../../utils/stringHelpers.js";

import "../../scss/components/datepicker.scss";
import type { Moment } from "moment";

export interface DatePickerProps extends Omit<ComponentProps<'div'>, 'defaultValue' | 'onChange'> {
	value?: Date | Moment | null;              // controlled selected date
	defaultValue?: Date | Moment | null;       // uncontrolled
	open?: boolean;                   // controlled open state
	defaultOpen?: boolean;            // uncontrolled
	format?: string;                  // date format for input
	placeholder?: string;
	minDate?: Date | Moment;
	maxDate?: Date | Moment;
	locale?: string;
	disabled?: boolean;
	readOnly?: boolean;
	closeOnSelect?: boolean;          // default true
	name?: string;                    // for hidden input
	calendar?: `${CalendarsEnum}`;
	initialDate?: Date | Moment;
	theme?: `${ThemesEnum}`;
	calendarProps?: Partial<CalendarProps>;
	fieldProps?: Partial<DateFieldProps>;
	renderInput?: (props: DateFieldProps) => React.ReactNode;
	renderCalendar?: (props: CalendarProps) => React.ReactNode;
	onChange?: (date: Date | null) => void;
	onOpenChange?: (open: boolean) => void;
}

export const DatePicker: React.FC<DatePickerProps> = forwardRef(({
	value,
	defaultValue = null,
	open,
	defaultOpen = false,
	format,
	placeholder,
	minDate: _minDate,
	maxDate: _maxDate,
	locale,
	disabled = false,
	readOnly = false,
	closeOnSelect = true,
	name,
	calendar,
	initialDate,
	theme = "light",
	calendarProps,
	fieldProps,
	onChange,
	onOpenChange,
	renderInput,
	renderCalendar,
	...datepickerProps
}, ref) => {
	useHandleMinMaxDates(_minDate, _maxDate);
	const isControlledValue = value !== undefined;
	const isControlledOpen = open !== undefined;
	const minDate = fixSupportedDate(_minDate) ?? MOMENT_MIN_SUPPORTED_DATE.toDate();
	const maxDate = fixSupportedDate(_maxDate) ?? MOMENT_MAX_SUPPORTED_DATE.toDate();
	const isHijri = calendar === CalendarsEnum.Hijri;
	const formats = isHijri ? HijriFormatsEnum : GregorianFormatsEnum;
	const dateFormat = format ?? formats.Date;

	const [internalValue, setInternalValue] = useState<Date | Moment | null>(defaultValue);
	const [anchorEl, setAnchorEl] = useState<any>(null);

	const fieldRef = useRef<HTMLInputElement>(null);

	const selectedDate = isControlledValue ? value : internalValue;
	const isOpen = isControlledOpen ? open : !!anchorEl;

	// Handle open state
	const handleOpen = (state: boolean) => {
		if (!isControlledOpen) setAnchorEl(state ? fieldRef.current : null);
		onOpenChange?.(state);
	};

	const handleSelect = (date: Date, close?: boolean) => {
		if (!isControlledValue) setInternalValue(date);
		onChange?.(date);
		if (closeOnSelect && close) handleOpen(false);
		fieldRef.current?.focus();
	};

	const handleFieldOpenRequest = () => {
		if (!disabled && !readOnly)
			handleOpen(true);
	};

	// Render input
	const inputElement = renderInput ? (
		renderInput({
			value: selectedDate,
			onChange: (d: Date | null) => {
				if (!isControlledValue) setInternalValue(d);
				onChange?.(d);
			},
			onOpenRequest: handleFieldOpenRequest,
			ref: fieldRef,
			placeholder,
			format: dateFormat,
			disabled,
			readOnly,
		})
	) : (
		<DateField
			{...fieldProps}
			ref={fieldRef}
			value={selectedDate}
			placeholder={placeholder || ''}
			format={dateFormat}
			disabled={disabled}
			readOnly={readOnly}
			locale={locale}
			onOpenRequest={handleFieldOpenRequest}
			onChange={(d) => {
				if (!isControlledValue) setInternalValue(d);
				onChange?.(d);
			}}
		/>
	);

	// Render calendar
	const calendarElement = renderCalendar ? (
		renderCalendar({
			value: selectedDate,
			minDate,
			maxDate,
			locale,
			onSelect: handleSelect,
			...calendarProps,
		})
	) : (
		<Calendar
			{...calendarProps}
			dir={datepickerProps.dir}
			theme={theme}
			isControlled={isControlledOpen}
			open={isOpen}
			anchorEl={anchorEl}
			value={selectedDate}
			minDate={minDate}
			maxDate={maxDate}
			locale={locale}
			calendar={calendar}
			initialDate={initialDate}
			onSelect={handleSelect}
			onClose={() => handleOpen(false)}
		/>
	);

	return (
		<div
			{...datepickerProps}
			ref={ref}
			className={clsx({
				"fkdp-datepicker": true,
				[datepickerProps.className || '']: !!datepickerProps.className,
				"fkdp-datepicker__dark": theme === "dark",
			})}
		>
			{inputElement}

			{(isOpen || calendarProps?.mode === "inline") && calendarElement}

			{(name && selectedDate) && (
				<input type="hidden" name={name} value={selectedDate.toISOString()} />
			)}
		</div>
	);
});