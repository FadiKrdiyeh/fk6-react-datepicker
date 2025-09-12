export const clsx = (obj: ({ [key: string]: boolean | undefined | null })): string => {
    return Object.entries(obj).reduce((a, [key, value]) => a += (!!value && !a.includes(key)) ? `${key} ` : '', '').trim();
}