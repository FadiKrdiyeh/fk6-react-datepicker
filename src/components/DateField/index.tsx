import moment, { type Moment } from 'moment-hijri';
import React, { forwardRef, useEffect, useRef, useState, type ComponentProps, type MouseEvent, type ReactNode } from 'react';

import { getLocalizedMomentDate } from '../../utils/dateHelpers.js';
import { GregorianFormatsEnum } from '../../utils/enums.js';
import { clsx } from '../../utils/stringHelpers.js';

import '../../scss/components/date-field.scss';

export interface DateFieldProps extends Omit<ComponentProps<'input'>, 'value' | 'onChange' | 'defaultValue'> {
    value?: Date | Moment | null;              // controlled value
    defaultValue?: Date | Moment | null;       // uncontrolled
    format?: string;
    clearable?: boolean;
    showIcon?: boolean;
    locale?: string | undefined;
    renderIcon?: () => ReactNode;
    onChange?: (date: Date | null) => void;
    onInputChange?: (raw: string) => void;
    onOpenRequest?: (e?: HTMLElement | boolean | null) => void;       // e.g. when user clicks icon or presses key
}

export const DateField = forwardRef<HTMLInputElement, DateFieldProps>(({
    value,
    defaultValue = null,
    format = GregorianFormatsEnum.Date,
    clearable = true,
    showIcon = true,
    locale,
    renderIcon,
    onChange,
    onInputChange,
    onOpenRequest,
    ...inputProps
}, ref) => {
    const isControlled = value !== undefined;
    const [internalDate, setInternalDate] = useState<Date | Moment | null>(defaultValue);
    const [inputValue, setInputValue] = useState<string>(
        (isControlled ? value : internalDate)
            ? getLocalizedMomentDate(isControlled ? value : internalDate, locale).format(format)
            : ""
    );

    const inputRef = useRef<HTMLInputElement>(null);

    // Expose ref if provided
    useEffect(() => {
        if (typeof ref === "function") {
            ref(inputRef.current);
        } else if (ref) {
            (ref as React.MutableRefObject<HTMLInputElement | null>).current =
                inputRef.current;
        }
    }, [ref]);

    // Sync input value when controlled prop changes
    useEffect(() => {
        if (isControlled) {
            setInputValue(value ? getLocalizedMomentDate(value, locale).format(format) : "");
        }
    }, [value, isControlled, format]);

    const commitValue = (raw: string) => {
        if (!raw.trim()) {
            if (isControlled) {
                onChange?.(null);
            } else {
                setInternalDate(null);
                onChange?.(null);
            }
            return;
        }

        const parsed = moment(raw, format, true).locale(locale ?? "en"); // strict parse
        if (parsed.isValid()) {
            const newDate = parsed.toDate();
            if (isControlled) {
                onChange?.(newDate);
            } else {
                setInternalDate(newDate);
                onChange?.(newDate);
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        setInputValue(raw);
        onInputChange?.(raw);
    };

    const handleBlur = () => {
        commitValue(inputValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            commitValue(inputValue);
        } else if (e.key === "ArrowDown" || e.key === " ") {
            e.preventDefault();
            onOpenRequest?.(inputRef.current);
        } else if (e.key === "Escape") {
            // reset to last valid value
            setInputValue(
                (isControlled ? value : internalDate)
                    ? getLocalizedMomentDate(isControlled ? value : internalDate, locale).format(format)
                    : ""
            );
        }
    };

    const handleClear = (e: MouseEvent) => {
        e.stopPropagation();
        setInputValue("");
        if (isControlled) {
            onChange?.(null);
        } else {
            setInternalDate(null);
            onChange?.(null);
        }
    };

    return (
        <div
            className={clsx({
                "fkdp-field": true,
                [inputProps.className || '']: !!inputProps.className,
                "fkdp-field--disabled": inputProps.disabled,
                "fkdp-field--readonly": inputProps.readOnly,
            })}
        >
            <input
                ref={inputRef}
                type="text"
                className="fkdp-field__input"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                onClick={(e) => {
                    if (!showIcon)
                        onOpenRequest?.(true);
                    inputProps.onClick?.(e);
                }}
                aria-haspopup="dialog"
                id="RDP_Field"
                {...inputProps}
                readOnly
            />

            {(clearable && inputValue && !inputProps.disabled && !inputProps.readOnly) && (
                <button
                    type="button"
                    className="fkdp-field__clear"
                    aria-label="Clear date"
                    onClick={handleClear}
                >
                    ×
                </button>
            )}

            {showIcon && (
                <button
                    type="button"
                    className="fkdp-field__icon"
                    aria-label="Open calendar"
                    disabled={inputProps.disabled}
                    onClick={() => onOpenRequest?.(inputRef.current)}
                >
                    {!!renderIcon ? renderIcon() : '📅'}
                </button>
            )}
        </div>
    )
});
