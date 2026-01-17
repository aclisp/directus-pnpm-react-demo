import { expect, test } from 'vitest'
import { jwtDecode } from './jwt-decode'

test('jwtDecode', async () => {
    const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMzNDAxNTMwLThlMTctNDJlZS05NTllLTc5ZGM5NGQ0ZTBkNyIsInJvbGUiOiJhNTFmYmNjMS02ODYzLTQ5M2ItOWMzYi1kNzZhZjA1NzFmMjkiLCJhcHBfYWNjZXNzIjp0cnVlLCJhZG1pbl9hY2Nlc3MiOnRydWUsImlhdCI6MTc2ODYzMjgzNSwiZXhwIjoxNzY4NjMzNzM1LCJpc3MiOiJkaXJlY3R1cyJ9.K10NJ6SodvOUoXTcEapcx77kpzqMsggDZvj3setEKyQ'
    const obj = jwtDecode(jwt)
    expect(obj).toStrictEqual({
        id: '33401530-8e17-42ee-959e-79dc94d4e0d7',
        role: 'a51fbcc1-6863-493b-9c3b-d76af0571f29',
        app_access: true,
        admin_access: true,
        iat: 1768632835,
        exp: 1768633735,
        iss: 'directus',
    })
})
