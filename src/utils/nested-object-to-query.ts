/**
 * Converts a deeply nested JavaScript object into a URLSearchParams instance.
 * Nested objects are converted into dot notation keys (e.g., { a: { b: 1 } } -> 'a.b=1').
 * @param obj The nested object to convert.
 * @param prefix Internal use for recursion to track the key path.
 * @param searchParams Internal use for recursion to accumulate results.
 * @returns A URLSearchParams object.
 */
export function nestedObjectToQuery(
    obj: Record<string, unknown>,
    prefix = '',
    searchParams: URLSearchParams = new URLSearchParams(),
): URLSearchParams {
    for (const [key, value] of Object.entries(obj)) {
        const newKey = prefix ? `${prefix}.${key}` : key

        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
            // Recurse into nested objects
            nestedObjectToQuery(value as Record<string, unknown>, newKey, searchParams)
        } else if (value !== undefined) {
            // Append primitive values (numbers, strings, booleans)
            // URLSearchParams handles string conversion automatically
            searchParams.append(newKey, String(value))
        }
    }

    return searchParams
}
