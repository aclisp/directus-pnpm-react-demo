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
