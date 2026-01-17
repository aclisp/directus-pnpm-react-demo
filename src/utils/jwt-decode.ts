import { decodeBase64Url } from './base64url'

export function jwtDecode(token: string) {
    try {
        const p = token.split('.')[1]
        const d = decodeBase64Url(p)
        const s = new TextDecoder().decode(d)
        return JSON.parse(s)
    } catch (e) {
        throw new Error(`Invalid token specified: ${e}`)
    }
}
