import { isDirectusError } from '@directus/sdk'

function isError(value: unknown): value is Error {
    const isError
        = typeof value === 'object'
        // eslint-disable-next-line @stylistic/indent-binary-ops
        && value !== null
        && Array.isArray(value) === false
        && 'name' in value
        && 'message' in value

    return isError
}

export function directusError(e: unknown): string | undefined {
    if (e === null || e === undefined) {
        return undefined
    }
    if (typeof e === 'string') {
        return e
    }
    if (isDirectusError(e)) {
        return e.errors.map(e => e.message).join(' ')
    }
    if (isError(e)) {
        return `${e.name} ${e.message}`
    }
    return JSON.stringify(e)
}

export function directusErrorCode(e: unknown): string | undefined {
    if (e === null || e === undefined) {
        return undefined
    }
    if (typeof e === 'string') {
        return e
    }
    if (isDirectusError(e)) {
        return e.errors.map(e => e.extensions.code).join(' ')
    }
    if (isError(e)) {
        return e.name
    }
    return String(e)
}
