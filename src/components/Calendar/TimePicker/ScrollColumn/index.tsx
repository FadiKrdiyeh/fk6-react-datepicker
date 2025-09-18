import { useEffect, useRef, useState, type FC, type ReactNode } from "react";

import { clsx } from "../../../../utils/stringHelpers.js";
import moment from "moment-hijri";

const ITEM_HEIGHT = 30;
const ITEM_WIDTH = 30;
const VISIBLE_ROWS = 7;
const MIDDLE_INDEX = Math.floor(VISIBLE_ROWS / 2);
const CONTAINER_HEIGHT = ITEM_HEIGHT * VISIBLE_ROWS;

type ScrollColumnProps = {
    locale?: string | undefined;
    items: (number | string)[];
    disabledItems?: (number | string)[] | undefined;
    selected?: number | string | undefined;
    showScrollbars?: boolean | undefined;
    selectOnScrolling?: boolean | undefined;
    disableLocaleDigits?: boolean | undefined;
    renderItem?: ((renderedValue: string, item: number | string, options: { selected: boolean, disabled: boolean, onClick: () => void }) => ReactNode) | undefined
    onSelect: (val: any) => void;
};

export const ScrollColumn: FC<ScrollColumnProps> = ({
    locale,
    items,
    selected,
    disabledItems,
    showScrollbars,
    selectOnScrolling,
    disableLocaleDigits,
    renderItem,
    onSelect,
}) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<number | null>(null);
    const [isUserScrolling, setIsUserScrolling] = useState(false);

    const selectedValue = (selected !== undefined && !disabledItems?.includes(selected)) ? selected : undefined;

    // Scroll to selected when value changes
    useEffect(() => {
        if (isUserScrolling || !scrollRef.current || (!selectedValue && selectedValue !== 0)) return;
        const index = items.indexOf(selectedValue);
        if (index === -1) return;

        const targetScrollTop = index * ITEM_HEIGHT;
        scrollRef.current.scrollTo({
            top: targetScrollTop,
            behavior: "smooth",
        });
    }, [selectedValue, isUserScrolling, scrollRef.current]);

    // Handle snapping + select middle value
    const handleScroll = () => {
        if (!scrollRef.current || !selectOnScrolling) return;
        setIsUserScrolling(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
            if (!scrollRef.current) return;
            const scrollTop = scrollRef.current.scrollTop;
            const index = Math.round(scrollTop / ITEM_HEIGHT);

            const boundedIndex = Math.max(0, Math.min(items.length - 1, index));
            const value = items[boundedIndex];

            if (value !== selectedValue)
                onSelect((value !== undefined && !disabledItems?.includes(value)) ? value : undefined);

            setIsUserScrolling(false);
        }, 120);
    };

    const renderCell = (item: number | string) => {
        const isSelected = item === selectedValue;
        const isDisabled = !!disabledItems?.includes(item);

        const renderedItem = typeof item === 'number' ? (disableLocaleDigits ? String(item).padStart(2, "0") : moment.localeData(locale).postformat(String(item).padStart(2, "0"))) : item;

        return (
            !!renderItem ? renderItem(renderedItem, item, { selected: isSelected, disabled: isDisabled, onClick: () => onSelect(item) }) : (
                <button
                    key={item.toString()}
                    className={clsx({
                        "fkdp-calendar-time__item": true,
                        "fkdp-calendar-time__item--selected": isSelected,
                        "fkdp-calendar-time__item--disabled": isDisabled,
                    })}
                    disabled={disabledItems?.includes(item)}
                    style={{ height: ITEM_HEIGHT, width: typeof item === 'string' ? '100%' : undefined }}
                    onClick={() => onSelect(item)}
                >
                    {renderedItem}
                </button>
            )
        )
    }

    return (
        <div
            ref={scrollRef}
            className="fkdp-calendar-time__col"
            style={{
                height: CONTAINER_HEIGHT,
                minWidth: ITEM_WIDTH,
                scrollbarWidth: showScrollbars ? 'thin' : 'none',
            }}
            onScroll={selectOnScrolling ? handleScroll : undefined}
        >
            {/* Top padding */}
            <div style={{ height: ITEM_HEIGHT * MIDDLE_INDEX }} />

            {items.map((item) => renderCell(item))}

            {/* Bottom padding */}
            <div style={{ height: ITEM_HEIGHT * MIDDLE_INDEX }} />
        </div>
    );
}