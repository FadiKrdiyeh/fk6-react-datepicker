import type { CSSProperties } from "react";

import { CalendarPositionsEnum } from "./enums.js";

// const clamp = (val: number, min: number, max: number, stayInViewport = true, direction: 'vertical' | 'horizontal') => {
const clamp = (val: number, min: number, max: number) => {
    // if (!stayInViewport)
        // return Math.min(Math.max(val, 0), direction === 'horizontal' ? (window.innerHeight + window.outerHeight + window.scrollY) : (window.innerWidth + window.outerWidth + window.scrollX));
        // return Math.max(Math.min(val, direction === 'horizontal' ? (window.innerHeight + window.outerHeight + window.scrollY) : (window.innerWidth + window.outerWidth + window.scrollX)), 0);

    return Math.min(Math.max(val, min), max);
}

export const computeCoords = (anchorEl: HTMLElement, calendarEl: HTMLElement, disablePortal?: boolean) => {
    if (!anchorEl)
        return undefined;

    const calendarHeight = calendarEl?.clientHeight || 0;
    const calendarWidth = calendarEl?.clientWidth || 0;
    const isRTL = (calendarEl.dir || document.dir || document.body.dir) === "rtl";

    const rect = anchorEl.getBoundingClientRect();
    const parentRect = anchorEl.parentElement?.getBoundingClientRect() ?? rect;

    const { scrollY, scrollX, innerHeight, innerWidth } = window;
    const calendarWidthIfRTL = (isRTL ? calendarWidth : 0);
    const calendarWidthIfNotRTL = (isRTL ? 0 : calendarWidth);

    if (disablePortal) {
        const verticalAvailable = innerHeight - rect.bottom - calendarHeight + anchorEl.clientHeight - 20;
        const horizontalAvailable = innerWidth - rect.right + calendarWidthIfRTL - 60;

        return ({
            // topPosition: clamp(-calendarHeight - 5, -parentRect.top, verticalAvailable, stayInViewport, 'horizontal'),
            // bottomPosition: clamp(anchorEl.clientHeight, -parentRect.top, verticalAvailable, stayInViewport, 'horizontal'),
            // middleXPosition: clamp((isRTL ? (calendarWidth / 2) : -(calendarWidth / 2)) + (anchorEl.clientWidth / 2), calendarWidthIfRTL - parentRect.left, horizontalAvailable, stayInViewport, 'vertical'),
            // middleYPosition: clamp(-(calendarHeight / 2) + (anchorEl.clientHeight / 2), -parentRect.top, verticalAvailable, stayInViewport, 'horizontal'),
            // leftPosition: clamp(isRTL ? 0 : -(calendarHeight + 20), calendarWidthIfRTL - parentRect.left, horizontalAvailable, stayInViewport, 'vertical'),
            // rightPosition: clamp((isRTL ? calendarWidth : 0) + anchorEl.clientWidth + 2, calendarWidthIfRTL + anchorEl.clientWidth - parentRect.right, innerWidth - rect.left - calendarWidthIfNotRTL - 10, stayInViewport, 'vertical'),
            // startPosition: clamp(isRTL ? (calendarHeight + anchorEl.clientWidth + 43) : -(calendarHeight + 40), calendarWidthIfRTL + anchorEl.clientWidth - parentRect.right, horizontalAvailable, stayInViewport, 'vertical'),
            // endPosition: clamp(isRTL ? 0 : (anchorEl.clientWidth + 2), calendarWidthIfRTL + anchorEl.clientWidth - parentRect.right, horizontalAvailable, stayInViewport, 'vertical'),
            topPosition: clamp(-calendarHeight - 5, -parentRect.top, verticalAvailable),
            bottomPosition: clamp(anchorEl.clientHeight, -parentRect.top, verticalAvailable),
            middleXPosition: clamp((isRTL ? (calendarWidth / 2) : -(calendarWidth / 2)) + (anchorEl.clientWidth / 2), calendarWidthIfRTL - parentRect.left, horizontalAvailable),
            middleYPosition: clamp(-(calendarHeight / 2) + (anchorEl.clientHeight / 2), -parentRect.top, verticalAvailable),
            leftPosition: clamp(isRTL ? 0 : -(calendarHeight + 20), calendarWidthIfRTL - parentRect.left, horizontalAvailable),
            rightPosition: clamp((isRTL ? calendarWidth : 0) + anchorEl.clientWidth + 2, calendarWidthIfRTL + anchorEl.clientWidth - parentRect.right, innerWidth - rect.left - calendarWidthIfNotRTL - 10),
            startPosition: clamp(isRTL ? (calendarHeight + anchorEl.clientWidth + 43) : -(calendarHeight + 40), calendarWidthIfRTL + anchorEl.clientWidth - parentRect.right, horizontalAvailable),
            endPosition: clamp(isRTL ? 0 : (anchorEl.clientWidth + 2), calendarWidthIfRTL + anchorEl.clientWidth - parentRect.right, horizontalAvailable),
        })
    }

    const anchorCoordinates = {
        left: rect.left + scrollX,
        right: rect.right + scrollX,
        top: rect.top + scrollY,
        bottom: rect.bottom,
        start: (isRTL ? rect.right : rect.left),
        end: (isRTL ? rect.left : rect.right),
    }

    const yEndEdgeWithoutCalendarHeight = innerHeight + scrollY - calendarHeight;
    const xRTLEndEdgeWithoutCalendarWidth = innerWidth + scrollX - calendarWidthIfNotRTL;
    const xRTLScrollWithCalendarWidth = scrollX + calendarWidthIfRTL;
    const xRTLScrollWithoutCalendarWidth = scrollX - (isRTL ? -calendarWidth : calendarWidth);

    return {
        topPosition: clamp(anchorCoordinates.top - calendarHeight, scrollY, yEndEdgeWithoutCalendarHeight),
        bottomPosition: clamp(anchorCoordinates.bottom + scrollY, scrollY, scrollY + innerHeight - calendarHeight - 20),
        middleXPosition: clamp(anchorCoordinates.left + calendarWidthIfRTL, scrollX + calendarWidthIfRTL, xRTLEndEdgeWithoutCalendarWidth),
        middleYPosition: clamp(anchorCoordinates.top - (calendarHeight / 2), scrollY, yEndEdgeWithoutCalendarHeight),
        leftPosition: clamp(anchorCoordinates.left - calendarWidthIfNotRTL, xRTLScrollWithCalendarWidth, xRTLEndEdgeWithoutCalendarWidth),
        rightPosition: clamp(anchorCoordinates.right + calendarWidthIfRTL, scrollX + calendarWidthIfRTL, xRTLEndEdgeWithoutCalendarWidth),
        startPosition: clamp(anchorCoordinates.start + xRTLScrollWithoutCalendarWidth, xRTLScrollWithCalendarWidth, xRTLEndEdgeWithoutCalendarWidth),
        endPosition: clamp(anchorCoordinates.end + scrollX, xRTLScrollWithCalendarWidth, xRTLEndEdgeWithoutCalendarWidth),
        // topPosition: clamp(anchorCoordinates.top - calendarHeight, scrollY, yEndEdgeWithoutCalendarHeight, stayInViewport, 'horizontal'),
        // bottomPosition: clamp(anchorCoordinates.bottom + scrollY, scrollY, scrollY + innerHeight - calendarHeight - 20, stayInViewport, 'horizontal'),
        // middleXPosition: clamp(anchorCoordinates.left + calendarWidthIfRTL, scrollX + calendarWidthIfRTL, xRTLEndEdgeWithoutCalendarWidth, stayInViewport, 'vertical'),
        // middleYPosition: clamp(anchorCoordinates.top - (calendarHeight / 2), scrollY, yEndEdgeWithoutCalendarHeight, stayInViewport, 'horizontal'),
        // leftPosition: clamp(anchorCoordinates.left - calendarWidthIfNotRTL, xRTLScrollWithCalendarWidth, xRTLEndEdgeWithoutCalendarWidth, stayInViewport, 'vertical'),
        // rightPosition: clamp(anchorCoordinates.right + calendarWidthIfRTL, scrollX + calendarWidthIfRTL, xRTLEndEdgeWithoutCalendarWidth, stayInViewport, 'vertical'),
        // startPosition: clamp(anchorCoordinates.start + xRTLScrollWithoutCalendarWidth, xRTLScrollWithCalendarWidth, xRTLEndEdgeWithoutCalendarWidth, stayInViewport, 'vertical'),
        // endPosition: clamp(anchorCoordinates.end + scrollX, xRTLScrollWithCalendarWidth, xRTLEndEdgeWithoutCalendarWidth, stayInViewport, 'vertical'),
        // topPosition: Math.min(Math.max(anchorCoordinates.top - calendarHeight, scrollY), yEndEdgeWithoutCalendarHeight),
        // bottomPosition: Math.max(Math.min(anchorCoordinates.bottom, innerHeight - calendarHeight) + scrollY, scrollY),
        // middleXPosition: Math.min(Math.max(anchorCoordinates.left, scrollX) + calendarWidthIfRTL, xRTLEndEdgeWithoutCalendarWidth),
        // middleYPosition: Math.min(Math.max(anchorCoordinates.top - (calendarHeight / 2), scrollY), yEndEdgeWithoutCalendarHeight),
        // leftPosition: Math.min(Math.max(anchorCoordinates.left - calendarWidthIfNotRTL, xRTLScrollWithCalendarWidth), xRTLEndEdgeWithoutCalendarWidth),
        // rightPosition: Math.min(Math.max(anchorCoordinates.right, scrollX) + calendarWidthIfRTL, xRTLEndEdgeWithoutCalendarWidth),
        // startPosition: Math.min(Math.max(anchorCoordinates.start + xRTLScrollWithoutCalendarWidth, xRTLScrollWithCalendarWidth), xRTLEndEdgeWithoutCalendarWidth),
        // endPosition: Math.max(Math.min(anchorCoordinates.end + scrollX, xRTLEndEdgeWithoutCalendarWidth), xRTLScrollWithCalendarWidth),
    }
}


export const positionResolvers: Record<CalendarPositionsEnum, (coords: ReturnType<typeof computeCoords>) => CSSProperties> = {
    [CalendarPositionsEnum.Top]: (c) => ({ top: c?.topPosition, left: c?.middleXPosition }),
    [CalendarPositionsEnum.Bottom]: (c) => ({ top: c?.bottomPosition, left: c?.middleXPosition }),
    [CalendarPositionsEnum.Left]: (c) => ({ top: c?.middleYPosition, left: c?.leftPosition }),
    [CalendarPositionsEnum.Right]: (c) => ({ top: c?.middleYPosition, left: c?.rightPosition }),
    [CalendarPositionsEnum.Start]: (c) => ({ top: c?.middleYPosition, left: c?.startPosition }),
    [CalendarPositionsEnum.End]: (c) => ({ top: c?.middleYPosition, left: c?.endPosition }),
    [CalendarPositionsEnum.TopLeft]: (c) => ({ top: c?.topPosition, left: c?.leftPosition }),
    [CalendarPositionsEnum.TopRight]: (c) => ({ top: c?.topPosition, left: c?.rightPosition }),
    [CalendarPositionsEnum.TopStart]: (c) => ({ top: c?.topPosition, left: c?.startPosition }),
    [CalendarPositionsEnum.TopEnd]: (c) => ({ top: c?.topPosition, left: c?.endPosition }),
    [CalendarPositionsEnum.BottomLeft]: (c) => ({ top: c?.bottomPosition, left: c?.leftPosition }),
    [CalendarPositionsEnum.BottomRight]: (c) => ({ top: c?.bottomPosition, left: c?.rightPosition }),
    [CalendarPositionsEnum.BottomStart]: (c) => ({ top: c?.bottomPosition, left: c?.startPosition }),
    [CalendarPositionsEnum.BottomEnd]: (c) => ({ top: c?.bottomPosition, left: c?.endPosition }),
};
