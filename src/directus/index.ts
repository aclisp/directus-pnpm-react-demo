import { authentication, createDirectus, rest } from '@directus/sdk';
import { localStorage } from './storage';

const directus = createDirectus('https://cms.aclisp.xyz')
    .with(rest())
    .with(authentication('json', { storage: localStorage('directus-pnpm-react-login') }))

export function useDirectus() {
    return directus
}
