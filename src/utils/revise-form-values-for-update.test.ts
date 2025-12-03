import { expect, test } from 'vitest'
import { reviseFormValuesForUpdate } from './revise-form-values-for-update'

test('reviseFormValuesForUpdate', () => {
    expect(reviseFormValuesForUpdate({
        name: 'The New Product Name',
        description: 'A detailed product description.',
        status: 'Active',
        brand_id: {
            id: 45,
            name: 'Acme Brands Inc.',
        },
    })).toEqual({
        name: 'The New Product Name',
        description: 'A detailed product description.',
        status: 'Active',
        brand_id: 45,
    })
})

test('reviseFormValuesForUpdate null input', () => {
    expect(reviseFormValuesForUpdate({
        name: 'The New Product Name',
        description: 'A detailed product description.',
        status: 'Active',
        brand_id: null,
    })).toEqual({
        name: 'The New Product Name',
        description: 'A detailed product description.',
        status: 'Active',
        brand_id: null,
    })
})
