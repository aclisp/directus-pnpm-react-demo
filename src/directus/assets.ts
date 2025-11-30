import type { AssetsQuery } from '@directus/sdk'
import { useDirectus } from '.'

type AssetOptions = Extract<AssetsQuery, { key?: never }> & {
    token?: string
}

export function asset(
    directus: ReturnType<typeof useDirectus>,
    fileId: string,
    options: AssetOptions = {},
) {
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
