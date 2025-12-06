import type { Item } from '@/components/types'

/**
 * Clean up nested form data before sending it to Directus API.
 * It ensures that you only send the required foreign keys (the IDs) for related entities,
 * preventing the backend from attempting to re-create or unnecessarily update those related entities.
 *
 * @see https://directus.io/docs/guides/connect/relations#many-to-one
 */
export function reviseFormValuesForUpdate(data: Item): Item {
    const result: Item = {}
    for (const [key, value] of Object.entries(data)) {
        // Check if the value is a non-null object
        if (typeof value === 'object' && value !== null) {
            const nestedObject = value as { id?: unknown }
            // Check if the object structure contains an 'id' key
            if (Object.hasOwn(nestedObject, 'id')
                && nestedObject.id !== undefined
                && nestedObject.id !== null
                && nestedObject.id !== ''
            ) {
                result[key] = nestedObject.id
            }
        } else {
            result[key] = value
        }
    }
    return result
}
