function coerceDate(date: Date | string): Date {
    return typeof date === 'string' ? new Date(date) : date
}

export function toDatetimeLocalValue(date?: Date | string | null): string {
    if (!date) {
        return ''
    }

    const value = coerceDate(date)

    if (Number.isNaN(value.getTime())) {
        return ''
    }

    const offset = value.getTimezoneOffset()
    const localDate = new Date(value.getTime() - offset * 60_000)

    return localDate.toISOString().slice(0, 16)
}

export function formatCzechDate(date: Date | string): string {
    return coerceDate(date).toLocaleDateString('cs-CZ', {
        day: 'numeric',
        month: 'long',
    })
}

export function formatCzechDateTime(date: Date | string): string {
    return coerceDate(date).toLocaleString('cs-CZ', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}
