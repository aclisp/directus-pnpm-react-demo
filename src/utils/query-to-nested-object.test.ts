import { expect, test } from 'vitest'
import { queryToNestedObject } from './query-to-nested-object'

test('queryToNestedObject', () => {
    const queryString = 'x=1&a.id=2&a.c=3&d=4&e.f.g=500&h=hello&i.j=true'
    const expected = {
        x: '1',
        a: {
            id: 2,
            c: '3',
        },
        d: '4',
        e: {
            f: {
                g: '500',
            },
        },
        h: 'hello',
        i: {
            j: 'true', // Note: 'true' as string, as only numeric values are auto-converted here
        },
    }
    const result = queryToNestedObject(new URLSearchParams(queryString))
    // This is the deep equality check in Vitest
    expect(result).toEqual(expected)
})

test('queryToNestedObject no input', () => {
    const result = queryToNestedObject(new URLSearchParams())
    expect(result).toEqual({})
})

test('queryToNestedObject keep order', () => {
    const queryString = 'e.g.f=5&x=1&a.c=3&d=4&e.f.g=500&i.j=true&h=hello&a.id=2'
    const expected = {
        e: {
            g: {
                f: '5',
            },
            f: {
                g: '500',
            },
        },
        x: '1',
        a: {
            c: '3',
            id: 2,
        },
        d: '4',
        i: {
            j: 'true', // Note: 'true' as string, as only numeric values are auto-converted here
        },
        h: 'hello',
    }
    const result = queryToNestedObject(new URLSearchParams(queryString))
    // Compare stringified value to ensure the order of properties
    expect(JSON.stringify(result)).toEqual(JSON.stringify(expected))
})
