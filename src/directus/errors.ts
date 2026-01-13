import { isDirectusError } from '@directus/sdk'

export function isError(value: unknown): value is Error {
    const isError
        = typeof value === 'object'
        // eslint-disable-next-line @stylistic/indent-binary-ops
        && value !== null
        && Array.isArray(value) === false
        && 'name' in value
        && 'message' in value

    return isError
}

/**
 * The JSON returned from directus extension endpoint
 */
export interface EndpointError {
    errors: {
        error?: string
        success?: boolean
        message?: string
    }
}

export function isEndpointError(value: unknown): value is EndpointError {
    const isEndpointError
        = typeof value === 'object'
        // eslint-disable-next-line @stylistic/indent-binary-ops
        && value !== null
        && Array.isArray(value) === false
        && 'errors' in value
        && (typeof value.errors === 'object' && value.errors !== null && Array.isArray(value.errors) === false)
        && (('error' in value.errors && Boolean(value.errors.error)) || ('success' in value.errors && Boolean(!value.errors.success)))

    return isEndpointError
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
    if (isEndpointError(e)) {
        return `${e.errors.error} ${e.errors.message ?? ''}`
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
    if (isEndpointError(e)) {
        return e.errors.error
    }
    if (isError(e)) {
        return e.name
    }
    return String(e)
}
