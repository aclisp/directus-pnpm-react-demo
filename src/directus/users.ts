
export function username(user: Record<string, unknown> | undefined | null): string {
    let name = ''

    if (!user) {
        return name
    }

    const { first_name, last_name } = user
    if (first_name) {
        name += String(first_name)
    }
    if (last_name) {
        name += ' ' + String(last_name)
    }
    return name
}
