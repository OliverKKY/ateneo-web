export function toDatetimeLocalValue(date?: Date | string | null): string {
    if (!date) {
        return ''
    }

    const value = typeof date === 'string' ? new Date(date) : date

    if (Number.isNaN(value.getTime())) {
        return ''
    }

    const offset = value.getTimezoneOffset()
    const localDate = new Date(value.getTime() - offset * 60_000)

    return localDate.toISOString().slice(0, 16)
}
