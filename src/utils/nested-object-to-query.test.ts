import { expect, test } from 'vitest'
import { nestedObjectToQuery } from './nested-object-to-query'

test('nestedObjectToQuery', () => {
    const myData = {
        userId: 123,
        profile: {
            firstName: 'Jane',
            settings: {
                themeId: 5,
            },
        },
        active: true,
    }

    const params = nestedObjectToQuery(myData)
    expect(params.toString()).toEqual('userId=123&profile.firstName=Jane&profile.settings.themeId=5&active=true')
})

test('nestedObjectToQuery undefined value', () => {
    const myData = {
        a: 1,
        b: undefined,
    }

    const params = nestedObjectToQuery(myData)
    expect(params.toString()).toEqual('a=1')
})

test('nestedObjectToQuery undefined value only', () => {
    const myData = {
        b: undefined,
    }

    const params = nestedObjectToQuery(myData)
    expect(params.toString()).toEqual('')
})

test('nestedObjectToQuery array value', () => {
    const myData = {
        a: [1, 'a', 2],
    }

    const params = nestedObjectToQuery(myData)
    expect(params.toString()).toEqual('a=1%2Ca%2C2')
})

test('nestedObjectToQuery none', () => {
    const myData = {
    }

    const params = nestedObjectToQuery(myData)
    expect(params.toString()).toEqual('')
})
