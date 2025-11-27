import { authentication, createDirectus, rest } from '@directus/sdk';
import { useRequest } from 'ahooks';
import { localStorage } from './storage';

const directus = createDirectus('https://cms.aclisp.xyz')
    .with(rest())
    .with(authentication('json', { storage: localStorage('directus-pnpm-react-login') }))

export function useDirectus() {
    return directus
}

export function useDirectusAuth(): [typeof directus, string | null | undefined] {
    const { data: token } = useRequest(async () => {
        return await directus.getToken()
    })
    return [directus, token]
}
