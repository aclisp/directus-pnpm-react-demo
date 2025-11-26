import { authentication, createDirectus, rest } from '@directus/sdk';

const directus = createDirectus('https://cms.aclisp.xyz')
    .with(rest({ credentials: 'include' }))
    .with(authentication('session', { credentials: 'include' }))

export function useDirectus() {
    return directus
}
