export function isPositiveInteger(input?: string): boolean {
    const n = Math.floor(Number(input));
    return n !== Infinity && String(n) === input && n >= 0;
}

export function parseAndLimitNumber(input: undefined | string | string[] | qs.ParsedQs | qs.ParsedQs[], maxValue: number): number {
    return isPositiveInteger(input?.toString())
        ? Math.min(Number(input), maxValue)
        : maxValue;
}