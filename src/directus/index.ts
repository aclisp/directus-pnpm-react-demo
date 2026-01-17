import { jwtDecode } from '@/utils/jwt-decode'
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

export function useDirectusAuth() {
    const { data: token, refresh: refreshToken } = useRequest(async () => {
        const token = await directus.getToken()
        // Because `directus.getToken()` never throws, It might return an expired token in case `refresh` failed.
        // In this case we have to extract expiring time from the token and perform a logout.
        if (token) {
            try {
                const expiresAt = jwtDecode(token).exp * 1000
                if (expiresAt < Date.now()) {
                    await directus.logout()
                    return null
                }
            } catch {
                // Do nothing
            }
        }
        return token
    })
    return { directus, token, refreshToken }
}
