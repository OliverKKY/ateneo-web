import test from 'node:test'
import assert from 'node:assert/strict'
import {
    formatCzechDate,
    formatCzechDateTime,
    toDatetimeLocalValue,
} from '@/lib/date'

test('toDatetimeLocalValue returns an empty string for invalid dates', () => {
    assert.equal(toDatetimeLocalValue('not-a-date'), '')
})

test('formatCzechDate returns a Czech date without time', () => {
    const result = formatCzechDate('2026-04-01T09:30:00.000Z')

    assert.match(result, /1\.\s*dubna/i)
})

test('formatCzechDateTime returns a Czech date with time', () => {
    const result = formatCzechDateTime('2026-04-01T09:30:00.000Z')

    assert.match(result, /1\.\s*dubna/i)
    assert.match(result, /09:30|10:30|11:30/)
})
