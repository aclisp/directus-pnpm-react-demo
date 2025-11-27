import type { AuthenticationData, AuthenticationStorage } from "@directus/sdk";

export const localStorage = (key: string) => {
    return {
        get: async () => {
            const item = window.localStorage.getItem(key)
            if (item == null) {
                return null
            } else {
                return JSON.parse(item)
            }
        },
        set: async (value: AuthenticationData | null) => {
            if (value == null) {
                window.localStorage.removeItem(key)
            } else {
                window.localStorage.setItem(key, JSON.stringify(value))
            }
        },
    } as AuthenticationStorage;
};
