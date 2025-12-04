import { authentication, createDirectus, rest } from '@directus/sdk'
import { useRequest } from 'ahooks'
import { localStorage } from './storage'

const directus = createDirectus('https://cms.aclisp.xyz')
    .with(rest())
    .with(authentication('json', { storage: localStorage('directus-pnpm-react-login') }))

// eslint-disable-next-line react-x/no-unnecessary-use-prefix
export function useDirectus() {
    return directus
}

export function useDirectusAuth(): [typeof directus, string | null | undefined, () => void] {
    const { data: token, refresh: refreshToken } = useRequest(async () => {
        return await directus.getToken()
    })
    return [directus, token, refreshToken]
}
