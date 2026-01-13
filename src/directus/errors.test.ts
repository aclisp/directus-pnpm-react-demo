import { expect, test } from 'vitest'
import { isEndpointError } from './errors'

test('isEndpointError', () => {
    expect(isEndpointError({

    })).toBeFalsy()

    expect(isEndpointError({
        errors: {
            error: 123,
        },
    })).toBeTruthy()

    expect(isEndpointError({
        errors: {
            success: false,
        },
    })).toBeTruthy()

    expect(isEndpointError({
        message: 'abc',
    })).toBeFalsy()

    expect(isEndpointError({
        success: true,
    })).toBeFalsy()
})
