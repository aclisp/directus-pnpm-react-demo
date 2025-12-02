import { username } from '../directus/users'

export function UserRender({ user }: {
    /** The directus user object */
    user: Record<string, unknown>
}) {
    return (
        <div>{username(user)}</div>
    )
}
