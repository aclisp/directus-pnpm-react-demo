/**
 * Converts an instance of URLSearchParams into a deeply nested JavaScript object.
 * Keys with dot notation (e.g., 'a.b.c') are converted into nested objects.
 * Values that are valid numbers are automatically converted to the number type if
 * and only if the key is end with `id`.
 *
 * @param params a URLSearchParams object.
 * @returns A nested object structure (e.g., { x: 1, a: { b: 2, c: 3 }, d: 4 }).
 */
export function queryToNestedObject(searchParams: URLSearchParams): Record<string, unknown> {
    const result: Record<string, unknown> = {}

    // Helper function to safely parse values to number or keep as string
    const parseValue = (value: string): string | number => {
        // Check if the string is a valid number (integer or float)
        if (value && !isNaN(Number(value))) {
            return Number(value)
        }
        return value
    }

    // Iterate over all key-value entries
    for (const [key, rawValue] of searchParams.entries()) {
        const path = key.split('.')

        let value: string | number = rawValue
        if (path[path.length - 1] === 'id') {
            value = parseValue(rawValue)
        }

        let currentLevel = result

        // Traverse the path, creating nested objects along the way
        for (let i = 0; i < path.length; i++) {
            const segment = path[i]

            // If it's the last segment, set the final value
            if (i === path.length - 1) {
                currentLevel[segment] = value
            } else {
                // If the segment doesn't exist or isn't an object, initialize it
                if (typeof currentLevel[segment] !== 'object' || currentLevel[segment] === undefined) {
                    // Check for potential conflicts: if an intermediate segment
                    // already has a non-object value (like a primitive),
                    // we initialize it as an object to continue nesting.
                    currentLevel[segment] = {}
                }
                // Move to the next level
                currentLevel = currentLevel[segment] as Record<string, unknown>
            }
        }
    }

    return result
}
