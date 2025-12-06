import { username } from '@/directus/users'

/**
 * Solely used by RelatedList for antd Table Column render.
 */
export function UserRender({ user }: {
    /** The directus user object */
    user: Record<string, unknown>
}) {
    return (
        <div>{username(user)}</div>
    )
}
