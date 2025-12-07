import type { Item2 } from '@/components/types'
import type { AssetsQuery } from '@directus/sdk'
import { useDirectus } from '.'

type AssetOptions = Extract<AssetsQuery, { key?: never }> & {
    token?: string | null
}

export function asset2(
    directus: ReturnType<typeof useDirectus>,
    file: string | Item2,
    options: AssetOptions = {},
) {
    let fileId: string
    if (typeof file === 'string') {
        fileId = file
    } else {
        fileId = String(file.id)
    }
    return asset(directus, fileId, options)
}

export function asset(
    directus: ReturnType<typeof useDirectus>,
    fileId: string | null | undefined,
    options: AssetOptions = {},
) {
    if (!fileId) {
        return undefined
    }

    if (!options.token) {
        return undefined
    }

    const assetURL = new URL(`/assets/${fileId}`, directus.url)
    const searchParams = assetURL.searchParams

    if (options.format) {
        searchParams.set('format', options.format)
    }
    if (options.width) {
        searchParams.set('width', String(options.width))
    }
    if (options.height) {
        searchParams.set('height', String(options.height))
    }
    if (options.quality) {
        searchParams.set('quality', String(options.quality))
    }
    if (options.fit) {
        searchParams.set('fit', options.fit)
    }
    if (options.token) {
        searchParams.set('access_token', options.token)
    }

    return assetURL.toString()
}
